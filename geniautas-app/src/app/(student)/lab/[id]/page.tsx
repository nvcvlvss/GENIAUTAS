"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Loader2, LogOut, Send } from "lucide-react";
import { StudentShell } from "@/components/student/StudentShell";
import { ChatView } from "@/components/student/ChatView";
import { Roadmap } from "@/components/student/Roadmap";
import type { RoadmapTaskView } from "@/components/student/Roadmap";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  getStudentSession, 
  getRoadmapTasks, 
  getChatHistory,
  getStudentProgress,
  updateTaskProgress
} from "@/lib/services/student";
import { ReflectionModal } from "@/components/student/ReflectionModal";
import styles from "./page.module.css";

export default function StudentLabPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [studentSession, setStudentSession] = useState<any>(null);
  const [tasks, setTasks] = useState<RoadmapTaskView[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showReflection, setShowReflection] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [reflectionBusy, setReflectionBusy] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const refreshRoadmap = async (tasksData: any[], studentSessionId: string) => {
    try {
      const progress = await getStudentProgress(studentSessionId);
      const completedIds = new Set(progress.map(p => p.task_id));
      
      let foundCurrent = false;
      const updatedTasks = tasksData.map((t: any) => {
        let state: any = "pending";
        if (completedIds.has(t.id)) {
          state = "done";
        } else if (!foundCurrent) {
          state = "current";
          foundCurrent = true;
        }
        return { id: t.id, title: t.title, state };
      });
      
      setTasks(updatedTasks);
    } catch (err) {
      console.error("Error refreshing roadmap:", err);
    }
  };

  useEffect(() => {
    async function init() {
      const studentSessionId = sessionStorage.getItem("geniautas_student_session");
      if (!studentSessionId) {
        router.push("/join");
        return;
      }

      try {
        const [sessionData, tasksData, historyData] = await Promise.all([
          getStudentSession(studentSessionId),
          getRoadmapTasks(sessionId),
          getChatHistory(studentSessionId)
        ]);

        setStudentSession(sessionData);
        await refreshRoadmap(tasksData, studentSessionId);
        setMessages(historyData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [sessionId, router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || sending || studentSession?.sessions?.status !== "active") return;

    const userMsg = { role: "user", content: inputValue, id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          studentSessionId: studentSession.id,
          sessionId: sessionId
        })
      });

      const data = await res.json();
      if (data.error) {
        if (data.error === "MODERATION_BLOCKED") {
          setMessages(prev => [...prev, { 
            role: "system", 
            content: `Tu mensaje fue bloqueado por seguridad (palabra detectada: ${data.word}). Por favor, usa un lenguaje adecuado para el aula.` 
          }]);
        } else if (data.error === "SESSION_NOT_ACTIVE") {
          setMessages(prev => [...prev, { 
            role: "system", 
            content: "La sesión está pausada. No puedes enviar mensajes ahora." 
          }]);
        } else {
          throw new Error(data.error);
        }
      } else {
        setMessages(prev => [...prev, data]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "system", content: "Error al enviar mensaje. Revisa tu conexión." }]);
    } finally {
      setSending(false);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    setCompletingTaskId(taskId);
    setShowReflection(true);
  };

  const handleConfirmReflection = async (text: string) => {
    if (!completingTaskId || !studentSession) return;
    setReflectionBusy(true);
    try {
      await updateTaskProgress(studentSession.id, completingTaskId, text);
      
      const tasksData = await getRoadmapTasks(sessionId);
      await refreshRoadmap(tasksData, studentSession.id);
      
      setMessages(prev => [...prev, { 
        role: "system", 
        content: `¡Genial! Has completado la tarea. Tu reflexión: "${text}"` 
      }]);
      
      setShowReflection(false);
      setCompletingTaskId(null);
    } catch (err: any) {
      alert("No se pudo guardar el progreso: " + err.message);
    } finally {
      setReflectionBusy(false);
    }
  };

  const handleExit = () => {
    if (confirm("¿Estás seguro de que quieres salir de la clase?")) {
      sessionStorage.removeItem("geniautas_student_session");
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader2 className={styles.spin} size={40} color="var(--color-primary)" aria-hidden />
        <p>Entrando al laboratorio…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loading}>
        <p>Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  const header = (
    <>
      <div className={styles.headerLeft}>
        <div className={styles.mark} aria-hidden>
          G
        </div>
        <div className={styles.headings}>
          <h1 className={styles.labTitle}>{studentSession.full_name}</h1>
          <p className={styles.sessionHint}>{studentSession.sessions.title}</p>
        </div>
      </div>
      <div className={styles.headerRight}>
        <Chip status={studentSession.sessions.status}>
          {studentSession.sessions.status === "active" ? "En curso" : "Pausada"}
        </Chip>
        <Button type="button" variant="ghost" size="sm" onClick={handleExit}>
          <LogOut size={18} aria-hidden />
          Salir
        </Button>
      </div>
    </>
  );

  const main = (
    <div className={styles.chatScroll} ref={scrollRef}>
      <ChatView>
        {messages.length === 0 && (
          <ChatBubble variant="bot" meta="Agente pedagógico">
            <p className={styles.welcomeMessage}>
              ¡Hola! Soy tu asistente para este laboratorio. {studentSession.sessions.pedagogical_objective}
              <br /><br />
              ¿En qué puedo ayudarte para comenzar con la primera tarea?
            </p>
          </ChatBubble>
        )}
        {messages.map((m: any, i: number) => (
          <ChatBubble 
            key={m.id || i} 
            variant={m.role === "assistant" ? "bot" : m.role}
            meta={m.role === "assistant" ? "Agente" : undefined}
          >
            {m.content}
          </ChatBubble>
        ))}
        {sending && (
          <ChatBubble variant="bot" meta="Agente">
            <Loader2 className={styles.spin} size={16} />
          </ChatBubble>
        )}
      </ChatView>
    </div>
  );

  const activeTask = tasks.find(t => t.id === completingTaskId);

  const aside = (
    <Roadmap 
      title="Mi camino" 
      tasks={tasks} 
      onCompleteTask={handleCompleteTask} 
    />
  );

  const footer = (
    <form className={styles.footerRow} onSubmit={handleSend}>
      <div className={styles.inputGrow}>
        <Input
          name="message"
          placeholder={studentSession.sessions.status === "active" ? "Escribe tu mensaje aquí…" : "Sesión pausada"}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={sending || studentSession.sessions.status !== "active"}
          aria-label="Mensaje"
          autoComplete="off"
        />
      </div>
      <Button 
        type="submit" 
        variant="primary" 
        size="md" 
        disabled={!inputValue.trim() || sending || studentSession.sessions.status !== "active"}
        loading={sending}
      >
        <Send size={18} aria-hidden />
        Enviar
      </Button>
    </form>
  );

  return (
    <>
      <StudentShell header={header} main={main} aside={aside} footer={footer} />
      {showReflection && activeTask && (
        <ReflectionModal
          taskTitle={activeTask.title}
          submitting={reflectionBusy}
          onConfirm={handleConfirmReflection}
          onCancel={() => setShowReflection(false)}
        />
      )}
    </>
  );
}
