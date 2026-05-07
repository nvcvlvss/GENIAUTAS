import styles from "./AlertCard.module.css";

export type AlertKind = "risk" | "moderation" | "session";

const TITLES: Record<AlertKind, string> = {
  risk: "Alerta de riesgo",
  moderation: "Moderación",
  session: "Sesión",
};

type AlertCardProps = {
  kind: AlertKind;
  title?: string;
  description: string;
  className?: string;
};

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function AlertCard({ kind, title, description, className }: AlertCardProps) {
  return (
    <article className={cx(styles.root, styles[kind], className)}>
      <div className={styles.type}>{TITLES[kind]}</div>
      <h3 className={styles.title}>{title ?? "Sin eventos recientes"}</h3>
      <p className={styles.body}>{description}</p>
    </article>
  );
}
