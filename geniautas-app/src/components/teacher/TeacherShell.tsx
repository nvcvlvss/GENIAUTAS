import type { ReactNode } from "react";
import styles from "./TeacherShell.module.css";

type TeacherShellProps = {
  topBar?: ReactNode;
  sidebar: ReactNode;
  sidebarTitle?: string;
  main: ReactNode;
  aside: ReactNode;
  asideTitle?: string;
  hideSidebarOnMobile?: boolean;
  hideAsideOnMobile?: boolean;
};

export function TeacherShell({
  topBar,
  sidebar,
  sidebarTitle = "Estudiantes y solicitudes",
  main,
  aside,
  asideTitle = "Alertas y acciones",
  hideSidebarOnMobile = false,
  hideAsideOnMobile = false,
}: TeacherShellProps) {
  return (
    <div className={styles.root}>
      {topBar ? <div className={styles.topBar}>{topBar}</div> : null}
      <aside className={`${styles.sidebar} ${hideSidebarOnMobile ? styles.hideSidebarOnMobile : ""}`}>
        <div className={styles.panelHeader}>{sidebarTitle}</div>
        <div className={styles.panelBody}>{sidebar}</div>
      </aside>
      <section className={styles.main}>{main}</section>
      <aside className={`${styles.aside} ${hideAsideOnMobile ? styles.hideAsideOnMobile : ""}`}>
        <div className={styles.panelHeader}>{asideTitle}</div>
        <div className={styles.panelBody}>{aside}</div>
      </aside>
    </div>
  );
}
