"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Star } from "lucide-react";
import styles from "./ReflectionModal.module.css";

type ReflectionModalProps = {
  taskTitle: string;
  onConfirm: (text: string) => void;
  onCancel: () => void;
  submitting?: boolean;
};

export function ReflectionModal({
  taskTitle,
  onConfirm,
  onCancel,
  submitting = false,
}: ReflectionModalProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 5) {
      onConfirm(text);
    }
  };

  return (
    <div className={styles.overlay}>
      <Card className={styles.modal} padding="default">
        <div className={styles.iconWrapper}>
          <Star className={styles.icon} size={48} />
        </div>
        <h2 className={styles.title}>¡Tarea completada!</h2>
        <p className={styles.subtitle}>
          Has terminado: <strong>{taskTitle}</strong>
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <Textarea
            label="¿Qué es lo más importante que aprendiste en esta tarea?"
            placeholder="Escribe aquí tu reflexión..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={4}
            disabled={submitting}
          />
          <p className={styles.hint}>Tu profesor podrá leer esto para ayudarte mejor.</p>
          
          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
              Volver
            </Button>
            <Button type="submit" variant="primary" disabled={text.trim().length < 5 || submitting} loading={submitting}>
              Guardar y continuar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
