import type { ReactNode } from "react";
import styles from "./Chip.module.css";

export type ChipStatus =
  | "draft"
  | "active"
  | "paused"
  | "closed"
  | "pending"
  | "approved"
  | "rejected";

const LABELS: Record<ChipStatus, string> = {
  draft: "Borrador",
  active: "Activa",
  paused: "Pausada",
  closed: "Cerrada",
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
};

type ChipProps = {
  status: ChipStatus;
  children?: ReactNode;
  className?: string;
};

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Chip({ status, children, className }: ChipProps) {
  return (
    <span className={cx(styles.root, styles[status], className)}>
      {children ?? LABELS[status]}
    </span>
  );
}
