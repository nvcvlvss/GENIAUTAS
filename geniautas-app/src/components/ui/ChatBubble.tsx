import type { ReactNode } from "react";
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

  return (
    <div className={cx(styles.row, rowClass, className)}>
      <div className={cx(styles.bubble, styles[variant])}>
        {meta ? <div className={styles.meta}>{meta}</div> : null}
        {children}
      </div>
    </div>
  );
}
