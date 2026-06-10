"use client";

import { Avatar } from "@/components/ui/Avatar";
import styles from "./StudentSessionItem.module.css";

const AVATAR_EMOJI: Record<string, string> = {
  "1": "🦊",
  "2": "🐨",
  "3": "🦁",
  "4": "🐯",
  "5": "🐼",
  "6": "🐙",
};

export type StudentSessionRow = {
  id: string;
  full_name: string;
  avatar_id: string;
  is_active: boolean;
  completed_tasks_count?: number;
};

type StudentSessionItemProps = {
  student: StudentSessionRow;
  totalTasks?: number;
  isSelected?: boolean;
  onClick: () => void;
};

export function StudentSessionItem({
  student,
  totalTasks = 0,
  isSelected = false,
  onClick,
}: StudentSessionItemProps) {
  const emoji = AVATAR_EMOJI[student.avatar_id] ?? "👤";

  return (
    <div 
      className={`${styles.root} ${isSelected ? styles.selected : ""} ${!student.is_active ? styles.inactive : ""}`}
      onClick={onClick}
    >
      <Avatar size={48} emoji={emoji} label={`Avatar de ${student.full_name}`} />
      <div className={styles.info}>
        <div className={styles.name}>{student.full_name}</div>
        <div className={styles.status}>
          {student.is_active ? (
            <span className={styles.online}>En línea</span>
          ) : (
            <span className={styles.offline}>Desconectado</span>
          )}
          {totalTasks > 0 && (
            <span className={styles.progress}>
              {" "}· {student.completed_tasks_count ?? 0}/{totalTasks} tareas
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
