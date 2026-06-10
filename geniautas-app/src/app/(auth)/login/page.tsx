"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { login } from "@/lib/services/auth";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.cardWrap}>
        <Card padding="default">
          <div className={styles.brand}>
            <h1 className={styles.title}>GENIAUTAS</h1>
            <p className={styles.subtitle}>Panel para docentes</p>
          </div>

          {error ? <div className={styles.alert}>{error}</div> : null}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="profe@colegio.cl"
              required
              autoComplete="email"
              helperText="Se usará para iniciar sesión y asociar las actividades del aula con tu perfil."
            />
            <Input
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              helperText="Permite asegurar el acceso restringido a las respuestas y datos de tus estudiantes."
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
            >
              <LogIn size={20} aria-hidden />
              <span>Iniciar sesión</span>
            </Button>
            <p style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginTop: "8px", textAlign: "center", lineHeight: "1.4" }}>
              Al iniciar sesión, accederás al panel para administrar laboratorios, lanzar sesiones y supervisar chats de tus alumnos en tiempo real.
            </p>
          </form>

          <p className={styles.footer}>
            ¿Aún no tienes cuenta?{" "}
            <Link href="/register" className={styles.link}>
              Regístrate aquí
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
