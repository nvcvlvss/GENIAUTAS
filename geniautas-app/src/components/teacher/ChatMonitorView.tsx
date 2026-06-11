"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getChatHistory } from "@/lib/services/student";
import { ChatView } from "@/components/student/ChatView";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { Avatar } from "@/components/ui/Avatar";
import { Loader2 } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [studentTyping, setStudentTyping] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    setStudentTyping(false);
    setBotTyping(false);
    
    async function loadHistory() {
      setLoading(true);
      try {
        const history = await getChatHistory(studentSessionId);
        setMessages(history);
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
          setMessages((current) => [...current, payload.new]);
          if (payload.new.role === "user") {
            setStudentTyping(false);
          } else if (payload.new.role === "assistant") {
            setBotTyping(false);
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

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader2 className={styles.spin} size={32} />
        <p>Cargando conversación de {studentName}…</p>
      </div>
    );
  }

  const emoji = AVATAR_EMOJI[student?.avatar_id] ?? "👤";
  const completedCount = student?.completed_tasks_count || 0;
  const progressPercent = Math.min(100, Math.max(0, (completedCount / (totalTasks || 1)) * 100));

  return (
    <div className={styles.root}>
      {/* Dispositivo de Simulación (Tablet) con borde de color Aurora Cyan destacado */}
      <div className={styles.deviceFrame} data-role="dashboard-frame">
        {/* Encabezado con metadatos del estudiante */}
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
  );
}
