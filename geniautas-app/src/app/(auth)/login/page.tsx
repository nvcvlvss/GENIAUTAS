"use client";

import { AuthCard } from "@/components/auth/AuthCard";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <AuthCard defaultTab="login" />
    </div>
  );
}

