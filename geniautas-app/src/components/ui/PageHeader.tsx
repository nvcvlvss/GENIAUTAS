import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  mark?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function PageHeader({
  title,
  subtitle,
  mark = "G",
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cx(styles.root, className)}>
      <div className={styles.brand}>
        <div className={styles.mark}>{mark}</div>
        <div className={styles.text}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}
