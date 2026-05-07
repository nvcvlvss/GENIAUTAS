import { Check } from "lucide-react";
import { Button } from "./Button";
import styles from "./RoadmapItem.module.css";

export type RoadmapItemState = "pending" | "current" | "done" | "blocked";

type RoadmapItemProps = {
  title: string;
  state: RoadmapItemState;
  onComplete?: () => void;
  className?: string;
};

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function RoadmapItem({ title, state, onComplete, className }: RoadmapItemProps) {
  return (
    <div className={cx(styles.root, styles[state], className)}>
      <div className={styles.marker} aria-hidden>
        {state === "done" && <Check size={14} color="var(--color-bg)" />}
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        {state === "current" && onComplete && (
          <div className={styles.actions}>
            <Button variant="secondary" size="sm" onClick={onComplete}>
              Listo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
