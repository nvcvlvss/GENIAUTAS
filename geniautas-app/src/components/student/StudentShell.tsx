import type { ReactNode } from "react";
import styles from "./StudentShell.module.css";

type StudentShellProps = {
  header: ReactNode;
  main: ReactNode;
  aside: ReactNode;
  footer: ReactNode;
  asideOpen?: boolean;
  onAsideClose?: () => void;
};

export function StudentShell({
  header,
  main,
  aside,
  footer,
  asideOpen = false,
  onAsideClose,
}: StudentShellProps) {
  return (
    <div className={styles.shell} data-role="dashboard-frame">
      <header className={styles.header}>{header}</header>
      <main className={styles.main}>{main}</main>
      
      {/* Backdrop para cerrar el drawer en móviles al hacer clic fuera */}
      {asideOpen && (
        <div className={styles.backdrop} onClick={onAsideClose} aria-hidden="true" />
      )}
      
      <aside className={`${styles.aside} ${asideOpen ? styles.open : ""}`}>{aside}</aside>
      <footer className={styles.footer}>{footer}</footer>
    </div>
  );
}
