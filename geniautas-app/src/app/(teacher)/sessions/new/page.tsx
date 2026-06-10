"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save } from "lucide-react";
import { createSession, getSchools } from "@/lib/services/session";
import type { Database } from "@/types/database";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

type School = Database["public"]["Tables"]["schools"]["Row"];
type AgentType = Database["public"]["Enums"]["agent_type"];

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
        setSchools(data || []);
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
        grade: grade as any,
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
                {(schools || []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Curso"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
              >
                <option value="">Selecciona un curso</option>
                <option value="4_basico_a">4° Básico A</option>
                <option value="4_basico_b">4° Básico B</option>
                <option value="4_basico_c">4° Básico C</option>
                <option value="5_basico_a">5° Básico A</option>
                <option value="5_basico_b">5° Básico B</option>
                <option value="5_basico_c">5° Básico C</option>
                <option value="6_basico_a">6° Básico A</option>
                <option value="6_basico_b">6° Básico B</option>
                <option value="6_basico_c">6° Básico C</option>
              </Select>
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
              helperText="Define la meta pedagógica. El copiloto IA de aula usará este objetivo para guiar a los alumnos en el tema correcto."
            />
            <Select
              label="Estilo de guía de la IA"
              value={agentConfig}
              onChange={(e) => setAgentConfig(e.target.value as AgentType)}
              helperText="Determina la personalidad y el enfoque pedagógico que adoptará el chatbot al interactuar con tus estudiantes."
            >
              <option value="neutro">
                Asistente general neutro (responde directo y apoya técnicamente sin forzar la reflexión)
              </option>
              <option value="constructivista">
                Pensabot (Socrático y Reflexivo: guiará usando preguntas reflexivas de baja fricción para que el estudiante descubra la solución por sí mismo)
              </option>
              <option value="cognitivista">
                Construbot (Pragmático y Orientado a la Acción: guiará al alumno paso a paso para estructurar un plan práctico con metas concretas)
              </option>
            </Select>
          </div>
        </Card>

        <Card padding="default">
          <h2 className={styles.sectionTitle}>3. Roadmap de tareas</h2>
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "16px", lineHeight: "1.4" }}>
            Agrega las tareas que tus estudiantes deberán resolver en esta actividad. Ellos las podrán ver como un listado de cosas que deben hacer y deberán completarlas una por una, paso a paso, para completar tu actividad.
          </p>
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
