import type { ComponentProps } from "react";
import styles from "./Input.module.css";

type InputFieldProps = {
  label?: string;
  helperText?: string;
  errorText?: string;
  id?: string;
} & ComponentProps<"input">;

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Input({
  label,
  helperText,
  errorText,
  id,
  className,
  "aria-invalid": ariaInvalid,
  ...rest
}: InputFieldProps) {
  const inputId = id ?? rest.name ?? undefined;
  const invalid = ariaInvalid === true || Boolean(errorText);

  return (
    <div className={styles.field}>
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cx(styles.control, className)}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      {errorText ? (
        <span className={styles.error} role="alert">
          {errorText}
        </span>
      ) : helperText ? (
        <span className={styles.helper}>{helperText}</span>
      ) : null}
    </div>
  );
}

type TextareaProps = {
  label?: string;
  helperText?: string;
  errorText?: string;
  id?: string;
} & ComponentProps<"textarea">;

export function Textarea({
  label,
  helperText,
  errorText,
  id,
  className,
  "aria-invalid": ariaInvalid,
  ...rest
}: TextareaProps) {
  const inputId = id ?? rest.name ?? undefined;
  const invalid = ariaInvalid === true || Boolean(errorText);

  return (
    <div className={styles.field}>
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <textarea
        id={inputId}
        className={cx(styles.control, styles.textarea, className)}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      {errorText ? (
        <span className={styles.error} role="alert">
          {errorText}
        </span>
      ) : helperText ? (
        <span className={styles.helper}>{helperText}</span>
      ) : null}
    </div>
  );
}

type SelectProps = {
  label?: string;
  helperText?: string;
  errorText?: string;
  id?: string;
} & ComponentProps<"select">;

export function Select({
  label,
  helperText,
  errorText,
  id,
  className,
  "aria-invalid": ariaInvalid,
  children,
  ...rest
}: SelectProps) {
  const inputId = id ?? rest.name ?? undefined;
  const invalid = ariaInvalid === true || Boolean(errorText);

  return (
    <div className={styles.field}>
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <select
        id={inputId}
        className={cx(styles.control, styles.select, className)}
        aria-invalid={invalid || undefined}
        {...rest}
      >
        {children}
      </select>
      {errorText ? (
        <span className={styles.error} role="alert">
          {errorText}
        </span>
      ) : helperText ? (
        <span className={styles.helper}>{helperText}</span>
      ) : null}
    </div>
  );
}
