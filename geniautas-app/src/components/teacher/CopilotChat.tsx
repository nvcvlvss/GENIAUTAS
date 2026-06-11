"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Loader2, Bot, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./CopilotChat.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CopilotChatProps {
  sessionId: string;
}

export function CopilotChat({ sessionId }: CopilotChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "¡Hola, Docente! Soy tu copiloto pedagógico en tiempo real (Aydante). Estoy conectado con los datos del aula y las alertas de Supabase. Puedo informarte sobre el avance de los alumnos, explicarte alertas activas y sugerirte preguntas de mediación socrática para tus estudiantes. ¿En qué te puedo asistir hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, sending]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || sending) return;

    setError(null);
    const userMsg: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMsg];
    
    setMessages(updatedMessages);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Error al comunicarse con el copiloto");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (err: any) {
      console.error(err);
      setError(
        "No se pudo obtener respuesta del copiloto. Revisa tu conexión de red o API."
      );
    } finally {
      setSending(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSend(promptText);
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatHeader}>
        <div className={styles.headerTitle}>
          <Bot className={styles.copilotIcon} size={20} />
          <span>Aydante Copiloto</span>
          <Sparkles className={styles.sparkleIcon} size={14} />
        </div>
        <p className={styles.headerSubtitle}>
          Asistente pedagógico en tiempo real para optimizar la mediación en el aula.
        </p>
      </div>

      <div className={styles.chatArea} ref={scrollRef}>
        <div className={styles.messagesList}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.messageWrapper} ${
                msg.role === "user" ? styles.teacherWrapper : styles.copilotWrapper
              }`}
            >
              <div
                className={`${styles.messageBubble} ${
                  msg.role === "user" ? styles.teacherBubble : styles.copilotBubble
                }`}
              >
                <div className={styles.roleLabel}>
                  {msg.role === "user" ? "Tú (Docente)" : "Copiloto Aydante"}
                </div>
                <div className={styles.messageContent}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      )
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {sending && (
            <div className={`${styles.messageWrapper} ${styles.copilotWrapper}`}>
              <div className={`${styles.messageBubble} ${styles.copilotBubble}`}>
                <div className={styles.roleLabel}>Copiloto Aydante</div>
                <div className={styles.loadingState}>
                  <Loader2 className={styles.spin} size={16} />
                  <span>Analizando estado de la sesión y redactando respuesta...</span>
                </div>
              </div>
            </div>
          )}

          {error && <div className={styles.errorAlert}>{error}</div>}
        </div>
      </div>

      <div className={styles.suggestionsContainer}>
        <span className={styles.suggestionsLabel}>Preguntas rápidas de aula:</span>
        <div className={styles.suggestionsList}>
          <button
            type="button"
            className={styles.suggestionBtn}
            onClick={() =>
              handleQuickPrompt("¿Cómo va el avance general de las tareas en el aula?")
            }
            disabled={sending}
          >
            <HelpCircle size={12} />
            <span>¿Cómo va el avance general?</span>
          </button>
          <button
            type="button"
            className={styles.suggestionBtn}
            onClick={() =>
              handleQuickPrompt("¿Hay alguna alerta de moderación activa y cómo puedo mediarla?")
            }
            disabled={sending}
          >
            <HelpCircle size={12} />
            <span>¿Alertas activas y mediación?</span>
          </button>
          <button
            type="button"
            className={styles.suggestionBtn}
            onClick={() =>
              handleQuickPrompt("Dame una sugerencia práctica para motivar a los estudiantes estancados.")
            }
            disabled={sending}
          >
            <HelpCircle size={12} />
            <span>Motivar alumnos estancados</span>
          </button>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className={styles.inputArea}
      >
        <div className={styles.inputWrapper}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregúntale a Aydante sobre el avance de algún alumno, alertas o consejos..."
            disabled={sending}
            required
            autoComplete="off"
            className={styles.chatInput}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={sending || !input.trim()}
          className={styles.sendButton}
        >
          {sending ? (
            <Loader2 className={styles.spin} size={18} />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </form>
    </div>
  );
}
