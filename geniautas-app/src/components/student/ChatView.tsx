import type { ReactNode } from "react";
import styles from "./ChatView.module.css";

type ChatViewProps = {
  children: ReactNode;
};

export function ChatView({ children }: ChatViewProps) {
  return (
    <div className={styles.root}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}
