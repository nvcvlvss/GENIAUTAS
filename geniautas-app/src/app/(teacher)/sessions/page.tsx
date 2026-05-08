"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { getSessions, updateSessionStatus } from "@/lib/services/session";
import type { Database } from "@/types/database";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SessionCard, type SessionListItem } from "@/components/teacher/SessionCard";
import styles from "./page.module.css";

type SessionStatus = Database["public"]["Enums"]["session_status"];

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function loadSessions() {
    try {
      const data = await getSessions();
      setSessions((data ?? []) as SessionListItem[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las sesiones.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadSessions();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const handleStatusChange = async (sessionId: string, newStatus: SessionStatus) => {
    setUpdatingId(sessionId);
    setActionError(null);
    try {
      await updateSessionStatus(sessionId, newStatus);
      await loadSessions();
    } catch (err: unknown) {
      setActionError(
        `No se pudo actualizar la sesión: ${err instanceof Error ? err.message : "error desconocido"}`,
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Cargando sesiones…</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Mis sesiones de laboratorio"
        subtitle="Crea, lanza, pausa y monitorea actividades con tu clase."
        actions={
          <Button href="/sessions/new" variant="primary" size="md">
            <Plus size={20} aria-hidden />
            Nueva sesión
          </Button>
        }
      />

      {error ? <div className={styles.alert}>{error}</div> : null}
      {actionError ? <div className={styles.alert}>{actionError}</div> : null}

      {(sessions || []).length === 0 ? (
        <EmptyState
          title="Aún no tienes sesiones"
          description="Crea tu primera sesión para que tus estudiantes puedan unirse con un flujo guiado y seguro."
          action={
            <Button href="/sessions/new" variant="secondary" size="md">
              Crear primera sesión
            </Button>
          }
        />
      ) : (
        <div className={styles.list}>
          {(sessions || []).map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              updatingId={updatingId}
              onPause={(id) => handleStatusChange(id, "paused")}
              onResume={(id) => handleStatusChange(id, "active")}
              onClose={(id) => handleStatusChange(id, "closed")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
