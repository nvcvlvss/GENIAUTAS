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
  let isStudent = variant === "student" || variant === "user";
  let isBot = variant === "bot" || variant === "assistant";
  let isTeacher = false;
  
  let cleanedChildren = children;
  
  if (typeof children === "string") {
    if (children.startsWith("[DM_DOCENTE]: ")) {
      isTeacher = true;
      isStudent = false;
      isBot = false;
      cleanedChildren = children.substring("[DM_DOCENTE]: ".length);
    } else if (children.startsWith("[DM_ESTUDIANTE]: ")) {
      isStudent = true;
      isBot = false;
      isTeacher = false;
      cleanedChildren = children.substring("[DM_ESTUDIANTE]: ".length);
    } else if (children.startsWith("[DOCENTE]: ")) {
      isTeacher = true;
      isStudent = false;
      isBot = false;
      cleanedChildren = children.substring("[DOCENTE]: ".length);
    }
  }

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

  const displayMeta = isTeacher ? "Docente" : (isStudent && variant === "student" && !meta ? "Tú" : meta);

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
