import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./WaitState.module.css";

type WaitStateProps = {
  emoji?: string;
  title: string;
  description: ReactNode;
  chip?: ReactNode;
};

export function WaitState({
  emoji = "🚀",
  title,
  description,
  chip,
}: WaitStateProps) {
  return (
    <div className={styles.root}>
      <div className={styles.emoji} aria-hidden>
        {emoji}
      </div>
      {chip}
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.text}>{description}</div>
      <div className={styles.spinner}>
        <Loader2 className={styles.spinning} size={28} aria-label="Cargando" />
      </div>
    </div>
  );
}
