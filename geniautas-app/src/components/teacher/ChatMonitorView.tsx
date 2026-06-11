"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getChatHistory } from "@/lib/services/student";
import { ChatView } from "@/components/student/ChatView";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { Avatar } from "@/components/ui/Avatar";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import styles from "./ChatMonitorView.module.css";

const AVATAR_EMOJI: Record<string, string> = {
  "1": "🦊",
  "2": "🐨",
  "3": "🦁",
  "4": "🐯",
  "5": "🐼",
  "6": "🐙",
};

const AGENT_CHAT_NAMES: Record<string, string> = {
  constructivista: "Pensabot",
  cognitivista: "Construbot",
  neutro: "Asistente",
};

type ChatMonitorViewProps = {
  studentSessionId: string;
  studentName: string;
  student: any;
  totalTasks: number;
  agentConfig: string;
};

export function ChatMonitorView({
  studentSessionId,
  studentName,
  student,
  totalTasks,
  agentConfig,
}: ChatMonitorViewProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [directMessages, setDirectMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentTyping, setStudentTyping] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  
  const [directDMInput, setDirectDMInput] = useState("");
  const [sendingDirectDM, setSendingDirectDM] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const directScrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const handleSendDirectDM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directDMInput.trim() || sendingDirectDM) return;

    setSendingDirectDM(true);
    try {
      const { error } = await supabase.from("messages").insert({
        student_session_id: studentSessionId,
        role: "system",
        content: `[DM_DOCENTE]: ${directDMInput}`,
      });
      if (error) throw error;
      setDirectDMInput("");
    } catch (err) {
      console.error("Error al enviar DM del docente:", err);
      alert("No se pudo enviar el mensaje directo.");
    } finally {
      setSendingDirectDM(false);
    }
  };

  useEffect(() => {
    setStudentTyping(false);
    setBotTyping(false);
    
    async function loadHistory() {
      setLoading(true);
      try {
        const history = await getChatHistory(studentSessionId);
        
        // Filter messages
        const aiHistory = (history || []).filter((m: any) => !m.content.startsWith("[DM_"));
        const dmHistory = (history || []).filter((m: any) => m.content.startsWith("[DM_"));

        setMessages(aiHistory);
        setDirectMessages(dmHistory);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    void loadHistory();

    const channel = supabase
      .channel(`chat_${studentSessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `student_session_id=eq.${studentSessionId}`,
        },
        (payload) => {
          const newMsg = payload.new;
          if (newMsg.content.startsWith("[DM_")) {
            setDirectMessages((current) => {
              if (current.some((m) => m.id === newMsg.id)) return current;
              return [...current, newMsg];
            });
          } else {
            setMessages((current) => {
              if (current.some((m) => m.id === newMsg.id)) return current;
              return [...current, newMsg];
            });
            if (newMsg.role === "user") {
              setStudentTyping(false);
            } else if (newMsg.role === "assistant") {
              setBotTyping(false);
            }
          }
        }
      )
      .on("broadcast", { event: "typing" }, (payload: any) => {
        const { sender, isTyping } = payload.payload;
        if (sender === "student") {
          setStudentTyping(isTyping);
        } else if (sender === "bot") {
          setBotTyping(isTyping);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentSessionId, supabase]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, studentTyping, botTyping]);

  useEffect(() => {
    if (directScrollRef.current) {
      directScrollRef.current.scrollTo({
        top: directScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [directMessages]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader2 className={styles.spin} size={32} />
        <span>Cargando conversación del estudiante…</span>
      </div>
    );
  }

  const emoji = AVATAR_EMOJI[student?.avatar_id] ?? "👤";
  const completedCount = student?.completed_tasks_count ?? 0;
  const progressPercent = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className={styles.monitorLayout}>
      {/* Columna Tablet Mockup (Chat con IA) */}
      <div className={styles.mockupFrameColumn}>
        <div className={styles.deviceFrame}>
          {/* Header de telemetría de la tablet */}
          <div className={styles.deviceHeader}>
            <div className={styles.studentInfo}>
              <Avatar size={48} emoji={emoji} className={styles.avatar} />
              <div className={styles.metaTexts}>
                <div className={styles.nameRow}>
                  <span className={styles.studentName}>{studentName}</span>
                  <span className={styles.statusIndicator}>
                    <span className={`${styles.statusDot} ${student?.is_active ? styles.online : styles.offline}`} />
                    {student?.is_active ? "En línea" : "Desconectado"}
                  </span>
                </div>
                <div className={styles.progressRow}>
                  <span className={styles.progressText}>
                    Progreso: {completedCount} / {totalTasks} tareas
                  </span>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.headerLabel}>
              <span className={styles.badge}>Pantalla del Estudiante</span>
            </div>
          </div>

          {/* Vista del chat espejo */}
          <div className={styles.chatArea} ref={scrollRef}>
            <ChatView>
              {messages.length === 0 ? (
                <p className={styles.empty}>No hay mensajes en esta conversación todavía.</p>
              ) : (
                messages.map((m, i) => (
                  <ChatBubble
                    key={m.id || i}
                    variant={m.role === "assistant" ? "bot" : m.role}
                    meta={m.role === "assistant" ? (AGENT_CHAT_NAMES[agentConfig] ?? "Asistente") : "Tú"}
                  >
                    {m.content}
                  </ChatBubble>
                ))
              )}

              {/* Alumno escribiendo en tiempo real */}
              {studentTyping && (
                <ChatBubble variant="student" meta="Tú">
                  <div className={styles.thinking}>
                    <Loader2 className={styles.spinThinking} size={16} />
                    <span>Escribiendo mensaje...</span>
                  </div>
                </ChatBubble>
              )}

              {/* IA generando respuesta en tiempo real */}
              {botTyping && (
                <ChatBubble variant="bot" meta={AGENT_CHAT_NAMES[agentConfig] ?? "Asistente"}>
                  <div className={styles.thinking}>
                    <Loader2 className={styles.spinThinking} size={16} />
                    <span>{AGENT_CHAT_NAMES[agentConfig] ?? "Asistente"} está analizando...</span>
                  </div>
                </ChatBubble>
              )}
            </ChatView>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Chat Directo Docente-Estudiante */}
      <div className={styles.directChatColumn}>
        <div className={styles.directChatHeader}>
          <span>💬 Chat Directo con Alumno</span>
        </div>
        <div className={styles.directChatMessages} ref={directScrollRef}>
          {directMessages.length === 0 ? (
            <p className={styles.emptyDirectChat}>
              No hay mensajes directos con el estudiante aún. ¡Comienza la conversación!
            </p>
          ) : (
            directMessages.map((m: any, i: number) => (
              <ChatBubble
                key={m.id || i}
                variant={m.content.startsWith("[DM_DOCENTE]: ") ? "system" : "student"}
                meta={m.content.startsWith("[DM_DOCENTE]: ") ? "Docente" : studentName}
              >
                {m.content}
              </ChatBubble>
            ))
          )}
        </div>
        <form onSubmit={handleSendDirectDM} className={styles.directDMInputArea}>
          <div className="flex-1">
            <Input
              type="text"
              value={directDMInput}
              onChange={(e) => setDirectDMInput(e.target.value)}
              placeholder="Mensaje directo al estudiante..."
              disabled={sendingDirectDM}
            />
          </div>
          <Button
            type="submit"
            disabled={sendingDirectDM || !directDMInput.trim()}
            loading={sendingDirectDM}
            className={styles.directDMSendBtn}
            title="Enviar mensaje directo"
          >
            <Send size={14} />
          </Button>
        </form>
      </div>
    </div>
  );
}
