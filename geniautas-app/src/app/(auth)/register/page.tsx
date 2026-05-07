"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { signUp } from "@/lib/services/auth";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);

    if (result?.error) {
      if (result.error === "CUENTA_CREADA_CONFIRMAR_EMAIL") {
        setError("¡Cuenta creada! Por favor, revisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión.");
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.cardWrap}>
        <Card padding="default">
          <div className={styles.brand}>
            <h1 className={styles.title}>GENIAUTAS</h1>
            <p className={styles.subtitle}>Crea tu cuenta de docente</p>
          </div>

          {error ? <div className={styles.alert}>{error}</div> : null}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Nombre completo"
              name="fullName"
              type="text"
              placeholder="Ej: Prof. María García"
              required
              autoComplete="name"
            />
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
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
              minLength={6}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
            >
              {!loading ? <UserPlus size={20} aria-hidden /> : null}
              <span>Crear cuenta</span>
            </Button>
          </form>

          <p className={styles.footer}>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className={styles.link}>
              Inicia sesión aquí
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
