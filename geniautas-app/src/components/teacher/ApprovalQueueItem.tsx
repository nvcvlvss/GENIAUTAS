"use client";

import { UserCheck, UserX } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { SessionJoinRequest } from "@/types/database";
import styles from "./ApprovalQueueItem.module.css";

const AVATAR_EMOJI: Record<string, string> = {
  "1": "🦊",
  "2": "🐨",
  "3": "🦁",
  "4": "🐯",
  "5": "🐼",
  "6": "🐙",
};

export type AccessRequestRow = SessionJoinRequest;

type ApprovalQueueItemProps = {
  request: AccessRequestRow;
  courseLabel?: string;
  pendingAction?: "approve" | "reject" | null;
  onApprove: () => void;
  onReject: () => void;
};

export function ApprovalQueueItem({
  request,
  courseLabel,
  pendingAction = null,
  onApprove,
  onReject,
}: ApprovalQueueItemProps) {
  const busy = pendingAction !== null;
  const emoji = AVATAR_EMOJI[request.avatar_id || ""] ?? "👤";
  const time = new Date(request.created_at).toLocaleTimeString();

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <Avatar size={48} emoji={emoji} label={`Avatar de ${request.student_candidate_name}`} />
        <div>
          <div className={styles.name}>
            {request.student_candidate_name}
          </div>
          <div className={styles.meta}>
            {courseLabel ? <span>{courseLabel} · </span> : null}
            <span className={styles.time}>Solicitado a las {time}</span>
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={busy}
          loading={pendingAction === "reject"}
          onClick={onReject}
        >
          <UserX size={18} /> Rechazar
        </Button>
        <Button
          type="button"
          variant="success"
          size="sm"
          disabled={busy}
          loading={pendingAction === "approve"}
          onClick={onApprove}
        >
          <UserCheck size={18} /> Aprobar
        </Button>
      </div>
    </div>
  );
}
