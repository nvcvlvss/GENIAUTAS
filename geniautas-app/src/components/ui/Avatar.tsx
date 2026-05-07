import type { ReactNode } from "react";
import styles from "./Avatar.module.css";

export type AvatarSize = 48 | 56 | 64;

type AvatarProps = {
  size?: AvatarSize;
  selected?: boolean;
  emoji?: string;
  label?: string;
  className?: string;
  children?: ReactNode;
};

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Avatar({
  size = 48,
  selected,
  emoji,
  label,
  className,
  children,
}: AvatarProps) {
  const sizeClass =
    size === 48 ? styles.s48 : size === 56 ? styles.s56 : styles.s64;

  const content =
    children ??
    (emoji ? (
      <span className={styles.emoji} aria-hidden>
        {emoji}
      </span>
    ) : label ? (
      <span aria-hidden>{label.slice(0, 2).toUpperCase()}</span>
    ) : null);

  return (
    <span
      className={cx(styles.root, sizeClass, selected && styles.selected, className)}
      role="img"
      aria-label={label}
    >
      {content}
    </span>
  );
}
