"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getChatHistory } from "@/lib/services/student";
import { ChatView } from "@/components/student/ChatView";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { Loader2 } from "lucide-react";
import styles from "./ChatMonitorView.module.css";

type ChatMonitorViewProps = {
  studentSessionId: string;
  studentName: string;
};

export function ChatMonitorView({ studentSessionId, studentName }: ChatMonitorViewProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentSessionId, supabase]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader2 className={styles.spin} size={32} />
        <p>Cargando conversación de {studentName}…</p>
      </div>
    );
  }

  return (
    <div className={styles.root} ref={scrollRef}>
      <div className={styles.header}>
        Monitoreando a: <strong>{studentName}</strong>
      </div>
      <ChatView>
        {messages.length === 0 ? (
          <p className={styles.empty}>No hay mensajes en esta conversación todavía.</p>
        ) : (
          messages.map((m) => (
            <ChatBubble
              key={m.id}
              variant={m.role === "assistant" ? "bot" : m.role}
              meta={m.role === "assistant" ? "Agente" : studentName}
            >
              {m.content}
            </ChatBubble>
          ))
        )}
      </ChatView>
    </div>
  );
}
