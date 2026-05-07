"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save } from "lucide-react";
import { createSession, getSchools } from "@/lib/services/session";
import type { School, AgentType } from "@/types/database";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

export default function NewSessionPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [grade, setGrade] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [objective, setObjective] = useState("");
  const [agentConfig, setAgentConfig] = useState<AgentType>("neutro");
  const [tasks, setTasks] = useState<string[]>([""]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getSchools();
        setSchools(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al cargar colegios.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const addTask = () => setTasks([...tasks, ""]);
  const updateTask = (index: number, value: string) => {
    const next = [...tasks];
    next[index] = value;
    setTasks(next);
  };
  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await createSession({
        title,
        grade,
        school_id: schoolId,
        pedagogical_objective: objective,
        agent_config: agentConfig,
        tasks: tasks.filter((t) => t.trim() !== ""),
      });
      router.push("/sessions");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo crear la sesión.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Cargando configuración…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Nueva sesión de laboratorio"
        subtitle="Define la actividad, el agente y el camino de tareas para tus estudiantes."
      />

      {error ? <div className={styles.alert}>{error}</div> : null}

      <form onSubmit={handleSubmit} className={styles.stack}>
        <Card padding="default">
          <h2 className={styles.sectionTitle}>1. Información básica</h2>
          <div className={styles.stack}>
            <Input
              label="Título de la actividad"
              placeholder="Ej: Introducción a prompts"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className={styles.row}>
              <Select
                label="Colegio"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                required
              >
                <option value="">Selecciona un colegio</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
              <Input
                label="Curso"
                placeholder="Ej: 6° B"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        <Card padding="default">
          <h2 className={styles.sectionTitle}>2. Configuración pedagógica</h2>
          <div className={styles.stack}>
            <Textarea
              label="Objetivo de aprendizaje"
              placeholder="¿Qué quieres que exploren o practiquen?"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              required
            />
            <Select
              label="Tipo de agente IA"
              value={agentConfig}
              onChange={(e) => setAgentConfig(e.target.value as AgentType)}
            >
              <option value="neutro">Neutro (asistente general)</option>
              <option value="constructivista">
                Construbot (socrático, no da respuestas directas)
              </option>
              <option value="cognitivista">Pensabot (estructura y pasos)</option>
            </Select>
          </div>
        </Card>

        <Card padding="default">
          <h2 className={styles.sectionTitle}>3. Roadmap de tareas</h2>
          <div className={styles.stack}>
            {tasks.map((task, index) => (
              <div key={index} className={styles.taskRow}>
                <Input
                  label={index === 0 ? "Tareas" : undefined}
                  placeholder={`Tarea ${index + 1}`}
                  value={task}
                  onChange={(e) => updateTask(index, e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  iconOnly
                  title="Eliminar tarea"
                  onClick={() => removeTask(index)}
                  disabled={tasks.length <= 1}
                  aria-label="Eliminar tarea"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={addTask}>
              <Plus size={18} aria-hidden />
              Agregar tarea
            </Button>
          </div>
        </Card>

        <Button type="submit" variant="primary" size="lg" loading={saving} fullWidth>
          <Save size={20} aria-hidden />
          Crear sesión
        </Button>
      </form>
    </div>
  );
}
