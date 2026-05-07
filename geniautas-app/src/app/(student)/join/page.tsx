"use client";

import { useState, useEffect } from "react";
import { School as SchoolIcon, BookOpen, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSchools } from "@/lib/services/session";
import {
  getActiveSessionsBySchool,
  submitAccessRequest,
} from "@/lib/services/student";
import type { School } from "@/types/database";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { AvatarPicker } from "@/components/student/AvatarPicker";
import { WaitState } from "@/components/student/WaitState";
import styles from "./page.module.css";

const AVATARS = [
  { id: "1", emoji: "🦊" },
  { id: "2", emoji: "🐨" },
  { id: "3", emoji: "🦁" },
  { id: "4", emoji: "🐯" },
  { id: "5", emoji: "🐼" },
  { id: "6", emoji: "🐙" },
];

const STEPS = ["Colegio", "Clase", "Identidad", "Espera"];

export default function JoinSessionPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [activeSessions, setActiveSessions] = useState<
    { id: string; title: string; grade: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("1");
  const [requestId, setRequestId] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (step === 4 && requestId) {
      const channel = supabase
        .channel(`request_${requestId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "access_requests",
            filter: `id=eq.${requestId}`,
          },
          (payload) => {
            if (payload.new.status === "approved") {
              sessionStorage.setItem(
                "geniautas_student_session",
                payload.new.proposed_student_session_id,
              );
              router.push(`/lab/${selectedSession}`);
            } else if (payload.new.status === "rejected") {
              setError(
                "Tu profesor no pudo aceptar el ingreso esta vez. Revisa tus datos o pide ayuda en el aula.",
              );
              setStep(3);
            }
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [step, requestId, router, selectedSession, supabase]);

  useEffect(() => {
    async function loadSchools() {
      try {
        const data = await getSchools();
        setSchools(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "No pudimos cargar los colegios. Intenta más tarde.",
        );
      } finally {
        setLoading(false);
      }
    }
    loadSchools();
  }, []);

  const handleSchoolSelect = async (id: string) => {
    setSelectedSchool(id);
    setLoading(true);
    setError(null);
    try {
      const sessions = await getActiveSessionsBySchool(id);
      setActiveSessions(sessions);
      setStep(2);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos cargar las clases activas.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const request = await submitAccessRequest({
        session_id: selectedSession,
        student_name: firstName,
        student_last_name: lastName,
        avatar_id: selectedAvatar,
      });
      setRequestId(request.id);
      setStep(4);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos enviar tu solicitud. Intenta otra vez.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && step === 1) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Cargando colegios…</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.stepper} aria-label="Pasos para unirte">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`${styles.step} ${
                step === i + 1 ? styles.stepActive : ""
              } ${step > i + 1 ? styles.stepDone : ""}`}
            >
              {i + 1}. {label}
            </div>
          ))}
        </div>

        <Card padding="default">
          <div className={styles.brand}>
            <div className={styles.mark} aria-hidden>
              G
            </div>
            <h1 className={styles.title}>¡Hola, Geniauta!</h1>
            <p className={styles.subtitle}>
              Únete a tu laboratorio guiado con IA, paso a paso.
            </p>
          </div>

          {error ? <div className={styles.alert}>{error}</div> : null}

          {step === 1 && (
            <div className={styles.carouselSection}>
              <h2 className={styles.sectionTitle}>Selecciona tu colegio</h2>
              <div className={styles.carousel}>
                {schools.map((school) => (
                  <div key={school.id} className={styles.carouselItem}>
                    <Card
                      interactive
                      padding="default"
                      onClick={() => handleSchoolSelect(school.id)}
                    >
                      <div className={styles.schoolCard}>
                        <div className={styles.schoolIconWrapper}>
                          <SchoolIcon size={32} color="var(--color-primary)" aria-hidden />
                        </div>
                        <p className={styles.sessionTitle}>{school.name}</p>
                        <p className={styles.sessionMeta}>Toca para entrar</p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
              <p className={styles.carouselHint}>Desliza para ver más colegios</p>
            </div>
          )}

          {step === 2 && (
            <div className={styles.list}>
              <button
                type="button"
                className={styles.back}
                onClick={() => setStep(1)}
              >
                ← Volver
              </button>
              <h2 className={styles.sectionTitle}>¿A qué clase te unes?</h2>
              {activeSessions.length === 0 ? (
                <p className={styles.empty}>
                  No hay clases activas en este colegio ahora. Espera a que tu
                  profesor inicie la actividad o revisa si elegiste el colegio
                  correcto.
                </p>
              ) : (
                activeSessions.map((session) => (
                  <Card
                    key={session.id}
                    interactive
                    padding="default"
                    onClick={() => {
                      setSelectedSession(session.id);
                      setStep(3);
                    }}
                  >
                    <div className={styles.sessionRow}>
                      <BookOpen size={28} color="var(--color-primary)" aria-hidden />
                      <div>
                        <p className={styles.sessionTitle}>{session.title}</p>
                        <p className={styles.sessionMeta}>Curso: {session.grade}</p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className={styles.form}>
              <button
                type="button"
                className={styles.back}
                onClick={() => setStep(2)}
              >
                ← Volver
              </button>
              <h2 className={styles.sectionTitle}>¡Casi listo! Identifícate</h2>

              <Input
                label="Nombre"
                placeholder="Ej: Diego"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
              />
              <Input
                label="Apellido"
                placeholder="Ej: Pérez"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                autoComplete="family-name"
              />

              <div className={styles.avatarBlock}>
                <span className={styles.avatarLabel}>Elige tu avatar</span>
                <AvatarPicker
                  options={AVATARS}
                  value={selectedAvatar}
                  onChange={setSelectedAvatar}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={submitting}
              >
                {!submitting ? <Send size={20} aria-hidden /> : null}
                <span>Entrar a clase</span>
              </Button>
            </form>
          )}

          {step === 4 && (
            <WaitState
              title="¡Solicitud enviada!"
              chip={<Chip status="pending" />}
              description={
                <>
                  Tu profesor debe aprobar tu ingreso.
                  <br />
                  <strong>
                    Quédate en esta pantalla: entrarás solo cuando te acepten.
                  </strong>
                </>
              }
            />
          )}
        </Card>
      </div>
    </div>
  );
}
