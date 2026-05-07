import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.inner}>
        <h1 className={styles.logo}>GENIAUTAS</h1>
        <p className={styles.tagline}>
          Un laboratorio guiado para que tu clase explore IA con seguridad.
        </p>
        <div className={styles.actions}>
          <Button href="/join" variant="primary" size="lg" fullWidth>
            Soy estudiante →
          </Button>
          <Button href="/login" variant="secondary" size="lg" fullWidth>
            Soy docente →
          </Button>
        </div>
        <p className={styles.note}>
          Tu profesor diseña la actividad, la supervisa y te acompaña en el camino.
        </p>
      </div>
    </div>
  );
}
