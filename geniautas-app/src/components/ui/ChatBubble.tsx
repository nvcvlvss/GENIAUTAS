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
  
  // Detect direct messages from the teacher using system role with special prefix
  const isTeacher = variant === "system" && typeof children === "string" && children.startsWith("[DOCENTE]: ");
  
  // Clean prefix if it is a teacher message
  const cleanedChildren = isTeacher && typeof children === "string"
    ? children.substring("[DOCENTE]: ".length)
    : children;

  const rowClass = isStudent
    ? styles.rowStudent
    : isTeacher
      ? styles.rowTeacher
      : isBot
        ? styles.rowBot
        : styles.rowSystem;

  const bubbleClass = isStudent
    ? styles.student
    : isTeacher
      ? styles.teacher
      : isBot
        ? styles.bot
        : styles.system;

  const displayMeta = isTeacher ? "Docente" : meta;

  const content = typeof cleanedChildren === "string" ? (
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
        {cleanedChildren}
      </ReactMarkdown>
    </div>
  ) : (
    cleanedChildren
  );

  return (
    <div className={cx(styles.row, rowClass, className)}>
      <div className={cx(styles.bubble, bubbleClass)}>
        {displayMeta ? <div className={styles.meta}>{displayMeta}</div> : null}
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  );
}
