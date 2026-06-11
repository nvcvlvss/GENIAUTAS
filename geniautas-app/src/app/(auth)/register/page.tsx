"use client";

import { AuthCard } from "@/components/auth/AuthCard";
import styles from "./page.module.css";

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <AuthCard defaultTab="register" />
    </div>
  );
}

