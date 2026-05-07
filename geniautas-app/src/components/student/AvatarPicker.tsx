"use client";

import { Avatar } from "@/components/ui/Avatar";
import styles from "./AvatarPicker.module.css";

export type AvatarOption = { id: string; emoji: string };

type AvatarPickerProps = {
  options: AvatarOption[];
  value: string;
  onChange: (id: string) => void;
};

export function AvatarPicker({ options, value, onChange }: AvatarPickerProps) {
  return (
    <div className={styles.grid} role="listbox" aria-label="Elige tu avatar">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={styles.btn}
          aria-pressed={value === opt.id}
          onClick={() => onChange(opt.id)}
        >
          <Avatar size={64} emoji={opt.emoji} selected={value === opt.id} />
        </button>
      ))}
    </div>
  );
}
