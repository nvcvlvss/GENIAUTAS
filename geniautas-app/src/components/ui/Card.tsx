import type {
  ComponentProps,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";
import styles from "./Card.module.css";

type CardProps = {
  children: ReactNode;
  interactive?: boolean;
  padding?: "default" | "none";
  className?: string;
} & Omit<ComponentProps<"div">, "className" | "children">;

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Card({
  children,
  interactive,
  padding = "default",
  className,
  role,
  tabIndex,
  onClick,
  onKeyDown,
  ...rest
}: CardProps) {
  const isClickable = Boolean(onClick);
  const showInteractiveStyles = Boolean(interactive || isClickable);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isClickable && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick?.(e as unknown as MouseEvent<HTMLDivElement>);
    }
    onKeyDown?.(e);
  };

  return (
    <div
      className={cx(
        styles.root,
        padding === "default" && styles.paddingDefault,
        padding === "none" && styles.paddingNone,
        showInteractiveStyles && styles.interactive,
        className,
      )}
      role={isClickable ? role ?? "button" : role}
      tabIndex={isClickable ? tabIndex ?? 0 : tabIndex}
      onClick={onClick}
      onKeyDown={isClickable ? handleKeyDown : onKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
}
