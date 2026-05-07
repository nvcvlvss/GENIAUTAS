import type { ReactNode } from "react";
import styles from "./StudentShell.module.css";

type StudentShellProps = {
  header: ReactNode;
  main: ReactNode;
  aside: ReactNode;
  footer: ReactNode;
};

export function StudentShell({ header, main, aside, footer }: StudentShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>{header}</header>
      <main className={styles.main}>{main}</main>
      <aside className={styles.aside}>{aside}</aside>
      <footer className={styles.footer}>{footer}</footer>
    </div>
  );
}
