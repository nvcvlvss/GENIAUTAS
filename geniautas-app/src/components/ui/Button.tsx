"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import styles from "./Button.module.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "success"
  | "warning"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  className?: string;
  children?: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, "className" | "children"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function classNames(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    fullWidth,
    iconOnly,
    className,
    children,
  } = props;

  const rootClass = classNames(
    styles.root,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    iconOnly && styles.iconOnly,
    className,
  );

  const content = loading ? (
    <>
      <Loader2 className="animate-spin" size={size === "sm" ? 16 : 20} aria-hidden />
      {iconOnly ? null : children}
    </>
  ) : (
    children
  );

  if ("href" in props && props.href) {
    const {
      href,
      variant: _v,
      size: _s,
      loading: _l,
      fullWidth: _f,
      iconOnly: _i,
      className: _c,
      children: _ch,
      ...rest
    } = props;
    return (
      <Link href={href} className={rootClass} {...rest}>
        {content}
      </Link>
    );
  }

  const {
    type = "button",
    disabled,
    variant: _v,
    size: _s,
    loading: _l,
    fullWidth: _f,
    iconOnly: _i,
    className: _c,
    children: _ch,
    ...rest
  } = props as ButtonAsButton;

  return (
    <button
      type={type}
      className={rootClass}
      disabled={disabled || loading}
      {...rest}
    >
      {content}
    </button>
  );
}
