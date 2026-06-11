"use client";

import { useState, useEffect } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { login, signUp } from "@/lib/services/auth";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import styles from "./AuthCard.module.css";

type AuthCardProps = {
  defaultTab?: "register" | "login";
};

export function AuthCard({ defaultTab = "register" }: AuthCardProps) {
  const [activeTab, setActiveTab] = useState<"register" | "login">(defaultTab);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync tab with URL if user uses back/forward browser buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/login") {
        setActiveTab("login");
      } else if (path === "/register") {
        setActiveTab("register");
      }
      setError(null);
      setSuccessMsg(null);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleTabChange = (tab: "register" | "login") => {
    setActiveTab(tab);
    setError(null);
    setSuccessMsg(null);
    window.history.pushState(null, "", tab === "register" ? "/register" : "/login");
  };

  async function handleRegisterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);

    if (result?.error) {
      if (result.error === "CUENTA_CREADA_CONFIRMAR_EMAIL") {
        setSuccessMsg(
          "¡Cuenta creada! Por favor, revisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión."
        );
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
  }

  async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className={styles.cardWrap}>
      <Card padding="default" className={styles.authCard}>
        <div className={styles.brand}>
          <h1 className={styles.title}>GENIAUTAS</h1>
          <p className={styles.subtitle}>
            {activeTab === "register"
              ? "Crea tu cuenta de docente"
              : "Panel para docentes"}
          </p>
        </div>

        {/* Tab Switcher Segmented Control */}
        <div className={styles.tabsContainer}>
          <div
            className={`${styles.tabSlider} ${
              activeTab === "register"
                ? styles.tabSliderRegister
                : styles.tabSliderLogin
            }`}
          />
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab === "register" ? styles.tabButtonActive : ""
            }`}
            onClick={() => handleTabChange("register")}
          >
            Crear Cuenta
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab === "login" ? styles.tabButtonActive : ""
            }`}
            onClick={() => handleTabChange("login")}
          >
            Iniciar Sesión
          </button>
        </div>

        {error ? <div className={styles.alertDanger}>{error}</div> : null}
        {successMsg ? (
          <div className={styles.alertSuccess}>{successMsg}</div>
        ) : null}

        {/* Animated Form container to prevent jumpiness */}
        <div className={styles.formContainer}>
          {activeTab === "register" ? (
            <form onSubmit={handleRegisterSubmit} className={styles.form}>
              <Input
                label="Nombre completo"
                name="fullName"
                type="text"
                placeholder="Ej: Prof. María García"
                required
                autoComplete="name"
                helperText="Tus alumnos verán este nombre para identificar que eres el profesor que supervisa el laboratorio."
              />
              <Input
                label="Correo electrónico"
                name="email"
                type="email"
                placeholder="profe@colegio.cl"
                required
                autoComplete="email"
                helperText="Se usará para enviarte resúmenes pedagógicos y alertas críticas de tus sesiones de clase."
              />
              <Input
                label="Contraseña"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                autoComplete="new-password"
                minLength={6}
                helperText="Crea una contraseña segura para resguardar la privacidad de las conversaciones de tus cursos."
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                loading={loading}
                className={styles.submitBtn}
              >
                {!loading ? <UserPlus size={18} aria-hidden /> : null}
                <span>Crear cuenta</span>
              </Button>
              <p className={styles.formNote}>
                Crear tu cuenta habilitará tu perfil docente, permitiéndote configurar objetivos pedagógicos, diseñar roadmaps de tareas y guiar sesiones de IA.
              </p>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className={styles.form}>
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
                className={styles.submitBtn}
              >
                {!loading ? <LogIn size={18} aria-hidden /> : null}
                <span>Iniciar sesión</span>
              </Button>
              <p className={styles.formNote}>
                Al iniciar sesión, accederás al panel para administrar laboratorios, lanzar sesiones y supervisar chats de tus alumnos en tiempo real.
              </p>
            </form>
          )}
        </div>

        <p className={styles.footer}>
          {activeTab === "register" ? (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => handleTabChange("login")}
                className={styles.link}
              >
                Inicia sesión aquí
              </button>
            </>
          ) : (
            <>
              ¿Aún no tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => handleTabChange("register")}
                className={styles.link}
              >
                Regístrate aquí
              </button>
            </>
          )}
        </p>
      </Card>
    </div>
  );
}
