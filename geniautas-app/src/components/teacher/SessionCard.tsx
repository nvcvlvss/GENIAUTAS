"use client";

import { Pause, Play, Settings, Users, Square } from "lucide-react";
import type { SessionStatus } from "@/types/database";
import { Card } from "@/components/ui/Card";
import { Chip, type ChipStatus } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import styles from "./SessionCard.module.css";

export type SessionListItem = {
  id: string;
  title: string;
  grade: string;
  status: SessionStatus;
  agent_config: string;
  schools?: { name: string } | null;
};

const STATUS_TO_CHIP: Record<SessionStatus, ChipStatus> = {
  draft: "draft",
  active: "active",
  paused: "paused",
  closed: "closed",
};

const AGENT_LABEL: Record<string, string> = {
  neutro: "Neutro",
  constructivista: "Construbot",
  cognitivista: "Pensabot",
};

type SessionCardProps = {
  session: SessionListItem;
  updatingId: string | null;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onClose: (id: string) => void;
};

export function SessionCard({
  session,
  updatingId,
  onPause,
  onResume,
  onClose,
}: SessionCardProps) {
  const busy = updatingId === session.id;
  const agentLabel =
    AGENT_LABEL[session.agent_config] ?? session.agent_config;

  return (
    <Card padding="default" className={styles.root}>
      <div className={styles.left}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{session.title}</h3>
          <Chip status={STATUS_TO_CHIP[session.status]} />
        </div>
        <p className={styles.meta}>
          {session.schools?.name ?? "Colegio"} · {session.grade} · IA:{" "}
          {agentLabel}
        </p>
        <div className={styles.code} aria-label="ID de sesión">
          Sesión: {session.id}
        </div>
      </div>
      <div className={styles.actions}>
        <Button
          href={`/sessions/${session.id}/monitor`}
          variant="secondary"
          size="sm"
          title="Monitorear estudiantes"
          iconOnly
          aria-label="Monitorear estudiantes"
        >
          <Users size={18} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          title="Configuración"
          iconOnly
          disabled
          aria-label="Configuración (pronto)"
        >
          <Settings size={18} />
        </Button>
        {session.status === "active" ? (
          <Button
            type="button"
            variant="warning"
            size="sm"
            loading={busy}
            disabled={busy}
            onClick={() => onPause(session.id)}
            title="Pausar"
          >
            <Pause size={18} /> Pausar
          </Button>
        ) : session.status === "paused" || session.status === "draft" ? (
          <Button
            type="button"
            variant="primary"
            size="sm"
            loading={busy}
            disabled={busy || session.status === "closed"}
            onClick={() => onResume(session.id)}
            title="Lanzar o reanudar"
          >
            <Play size={18} />{" "}
            {session.status === "draft" ? "Lanzar" : "Reanudar"}
          </Button>
        ) : null}
        {session.status !== "closed" ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            loading={busy}
            disabled={busy}
            onClick={() => onClose(session.id)}
            title="Cerrar sesión"
          >
            <Square size={18} /> Cerrar
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
