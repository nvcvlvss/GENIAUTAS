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
            />
            <Input
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
            >
              {!loading ? <LogIn size={20} aria-hidden /> : null}
              <span>Iniciar sesión</span>
            </Button>
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
