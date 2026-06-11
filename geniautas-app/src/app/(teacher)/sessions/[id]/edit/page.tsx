"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { getSchools, getSessionById, getRoadmapTasks, updateSession } from "@/lib/services/session";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import styles from "../../new/page.module.css"; // Reuse new session styles

type School = Database["public"]["Tables"]["schools"]["Row"];
type AgentType = Database["public"]["Enums"]["agent_type"];

export default function EditSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;
  const supabase = createClient();

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
        const schoolsData = await getSchools();
        setSchools(schoolsData || []);

        const sessionData = await getSessionById(sessionId);
        setTitle(sessionData.title);
        setGrade(sessionData.grade);
        setSchoolId(sessionData.school_id);
        setAgentConfig(sessionData.agent_config as AgentType);

        // Fetch pedagogical objective
        const { data: fullSession } = await supabase
          .from("sessions")
          .select("pedagogical_objective")
          .eq("id", sessionId)
          .single();

        if (fullSession) {
          setObjective(fullSession.pedagogical_objective);
        }

        // Fetch tasks
        const tasksData = await getRoadmapTasks(sessionId);
        if (tasksData && tasksData.length > 0) {
          setTasks(tasksData.map((t) => t.title));
        } else {
          setTasks([""]);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al cargar la sesión.");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [sessionId, supabase]);

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
      await updateSession(sessionId, {
        title,
        grade,
        school_id: schoolId,
        pedagogical_objective: objective,
        agent_config: agentConfig,
        tasks: tasks.filter((t) => t.trim() !== ""),
      });
      router.push("/sessions");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar la sesión.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Cargando datos de la sesión…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Editar sesión de laboratorio"
        subtitle="Modifica la actividad, el agente y el camino de tareas para tus estudiantes."
        actions={
          <Button href="/sessions" variant="ghost" size="md">
            <ArrowLeft size={20} aria-hidden />
            Volver
          </Button>
        }
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
              helperText="Define la meta pedagógica. El copiloto IA de aula usará este objetivo para guiar a los alumnos."
            />
            <Select
              label="Estilo de guía de la IA"
              value={agentConfig}
              onChange={(e) => setAgentConfig(e.target.value as AgentType)}
              helperText="Determina la personalidad y el enfoque pedagógico que adoptará el chatbot."
            >
              <option value="neutro">
                Asistente general neutro (responde directo y apoya técnicamente)
              </option>
              <option value="constructivista">
                Pensabot (Socrático y Reflexivo: guía haciendo preguntas)
              </option>
              <option value="cognitivista">
                Construbot (Pragmático: guía paso a paso con metas concretas)
              </option>
            </Select>
          </div>
        </Card>

        <Card padding="default">
          <h2 className={styles.sectionTitle}>3. Roadmap de tareas</h2>
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "16px", lineHeight: "1.4" }}>
            Agrega las tareas que tus estudiantes deberán resolver. Las verán como un listado y las completarán una por una.
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
          Guardar cambios
        </Button>
      </form>
    </div>
  );
}
