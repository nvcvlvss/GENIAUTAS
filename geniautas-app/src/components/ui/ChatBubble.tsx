import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./ChatBubble.module.css";

export type ChatBubbleVariant = "student" | "bot" | "system";

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
  const rowClass =
    variant === "student"
      ? styles.rowStudent
      : variant === "bot"
        ? styles.rowBot
        : styles.rowSystem;

  const content = typeof children === "string" ? (
    <div className={styles.markdown}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
    </div>
  ) : (
    children
  );

  return (
    <div className={cx(styles.row, rowClass, className)}>
      <div className={cx(styles.bubble, styles[variant])}>
        {meta ? <div className={styles.meta}>{meta}</div> : null}
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  );
}
