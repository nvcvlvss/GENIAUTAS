import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./ChatBubble.module.css";

export type ChatBubbleVariant = "student" | "user" | "bot" | "assistant" | "system";

type ChatBubbleProps = {
  variant: ChatBubbleVariant;
  children: ReactNode;
  meta?: string;
  className?: string;
};

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function ChatBubble({ variant, children, meta, className }: ChatBubbleProps) {
  const isStudent = variant === "student" || variant === "user";
  const isBot = variant === "bot" || variant === "assistant";

  const rowClass = isStudent
    ? styles.rowStudent
    : isBot
      ? styles.rowBot
      : styles.rowSystem;

  const bubbleClass = isStudent
    ? styles.student
    : isBot
      ? styles.bot
      : styles.system;

  const content = typeof children === "string" ? (
    <div className={styles.markdown}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => (
            <img 
              src={src} 
              alt={alt || "Imagen generada por IA"} 
              className={styles.media}
              loading="lazy"
            />
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          )
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  ) : (
    children
  );

  return (
    <div className={cx(styles.row, rowClass, className)}>
      <div className={cx(styles.bubble, bubbleClass)}>
        {meta ? <div className={styles.meta}>{meta}</div> : null}
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  );
}
