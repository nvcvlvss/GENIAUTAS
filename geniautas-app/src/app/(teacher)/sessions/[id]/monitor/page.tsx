"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  getAccessRequests,
  getStudentSessions,
  getAlerts,
  getRoadmapTasks,
  approveAccessRequest,
  rejectAccessRequest,
  getSessionById,
  updateSessionStatus,
} from "@/lib/services/session";
import type { Database, SessionStatus } from "@/types/database";
import { TeacherShell } from "@/components/teacher/TeacherShell";
import { ApprovalQueueItem } from "@/components/teacher/ApprovalQueueItem";
import {
  StudentSessionItem,
  type StudentSessionRow,
} from "@/components/teacher/StudentSessionItem";
import { ChatMonitorView } from "@/components/teacher/ChatMonitorView";
import { AlertCard } from "@/components/teacher/AlertCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Chip, type ChipStatus } from "@/components/ui/Chip";
import { Card } from "@/components/ui/Card";
import { GRADE_LABELS } from "@/lib/constants";
import { CopilotChat } from "@/components/teacher/CopilotChat";
import styles from "./page.module.css";

const STATUS_CHIP: Record<SessionStatus, ChipStatus> = {
  draft: "draft",
  active: "active",
  paused: "paused",
  closed: "closed",
};

type AccessRequestRow = Database["public"]["Tables"]["session_join_requests"]["Row"];

export default function SessionMonitorPage() {
  const params = useParams();
  const sessionId = params.id as string;
  
  // Pestañas: access (Control de acceso), monitor (Monitoreo y alertas), copilot (IA Copiloto)
  const [activeTab, setActiveTab] = useState<"access" | "monitor" | "copilot">("access");

  const [requests, setRequests] = useState<AccessRequestRow[]>([]);
  const [students, setStudents] = useState<StudentSessionRow[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionTitle, setSessionTitle] = useState("Sesión");
  const [sessionGrade, setSessionGrade] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("draft");
  const [pedagogicalObjective, setPedagogicalObjective] = useState("");
  const [agentConfig, setAgentConfig] = useState<string>("neutro");
  const [statusBusy, setStatusBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState<{
    id: string;
    action: "approve" | "reject";
  } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function init() {
      try {
        const [reqData, studentData, alertData, session, tasksData] = await Promise.all([
          getAccessRequests(sessionId),
          getStudentSessions(sessionId),
          getAlerts(sessionId),
          getSessionById(sessionId),
          getRoadmapTasks(sessionId),
        ]);
        setRequests(reqData as AccessRequestRow[]);
        setStudents(studentData as StudentSessionRow[]);
        setAlerts(alertData ?? []);
        setSessionTitle(session.title ?? "Sesión");
        setSessionGrade(session.grade ?? null);
        setSessionStatus((session.status as SessionStatus) ?? "draft");
        setAgentConfig(session.agent_config ?? "neutro");
        setTotalTasks(tasksData.length);

        // Consultar objetivo pedagógico completo
        const { data: fullSession } = await supabase
          .from("sessions")
          .select("pedagogical_objective")
          .eq("id", sessionId)
          .single();

        if (fullSession) {
          setPedagogicalObjective(fullSession.pedagogical_objective);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    void init();

    const requestChannel = supabase
      .channel("session_join_requests_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "session_join_requests",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setRequests((current) => [
            ...current,
            payload.new as AccessRequestRow,
          ]);
        },
      )
      .subscribe();

    const studentChannel = supabase
      .channel("student_sessions_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "student_sessions",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload: any) => {
          setStudents((current) => [
            ...current,
            { 
              ...payload.new, 
              is_active: payload.new.is_active ?? true,
              completed_tasks_count: 0 
            } as StudentSessionRow,
          ]);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "student_sessions",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload: any) => {
          setStudents((current) =>
            current.map((s) =>
              s.id === payload.new.id
                ? { ...s, ...payload.new, is_active: payload.new.is_active ?? s.is_active }
                : s,
            ),
          );
        },
      )
      .subscribe();

    const alertChannel = supabase
      .channel("alerts_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "alerts",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setAlerts((current) => [payload.new, ...current]);
        },
      )
      .subscribe();

    const progressChannel = supabase
      .channel("progress_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "student_task_progress",
        },
        (payload) => {
          setStudents((current) =>
            current.map((s) =>
              s.id === payload.new.student_session_id
                ? { 
                    ...s, 
                    completed_tasks_count: (s.completed_tasks_count || 0) + 1 
                  }
                : s,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "student_task_progress",
        },
        (payload) => {
          if (payload.new.is_completed === false) {
             setStudents((current) =>
              current.map((s) =>
                s.id === payload.new.student_session_id
                  ? { 
                      ...s, 
                      completed_tasks_count: Math.max(0, (s.completed_tasks_count || 0) - 1) 
                    }
                  : s,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(requestChannel);
      supabase.removeChannel(studentChannel);
      supabase.removeChannel(alertChannel);
      supabase.removeChannel(progressChannel);
    };
  }, [sessionId, supabase]);

  const handleApprove = async (request: AccessRequestRow) => {
    setPending({ id: request.id, action: "approve" });
    setNotice(null);
    try {
      await approveAccessRequest({
        id: request.id,
        session_id: request.session_id,
        student_candidate_name: request.student_candidate_name,
        avatar_id: request.avatar_id || undefined
      });
      setRequests((current) => current.filter((r) => r.id !== request.id));
    } catch (err: unknown) {
      setNotice(
        `No se pudo aprobar la solicitud: ${err instanceof Error ? err.message : "error desconocido"}`,
      );
    } finally {
      setPending(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setPending({ id: requestId, action: "reject" });
    setNotice(null);
    try {
      await rejectAccessRequest(requestId);
      setRequests((current) => current.filter((r) => r.id !== requestId));
    } catch (err: unknown) {
      setNotice(
        `No se pudo rechazar la solicitud: ${err instanceof Error ? err.message : "error desconocido"}`,
      );
    } finally {
      setPending(null);
    }
  };

  const changeSessionStatus = async (next: SessionStatus) => {
    setStatusBusy(true);
    setNotice(null);
    try {
      await updateSessionStatus(sessionId, next);
      setSessionStatus(next);
    } catch (err: unknown) {
      setNotice(
        `No se pudo actualizar la sesión: ${err instanceof Error ? err.message : "error desconocido"}`,
      );
    } finally {
      setStatusBusy(false);
    }
  };

  if (loading) {
    return <div className={styles.pageLoading}>Cargando monitor…</div>;
  }

  // 1. Cabecera superior unificada con selectores de pestañas
  const topBar = (
    <div className={`${styles.topLeft} w-full flex justify-between items-center flex-wrap gap-4`}>
      <div className="flex items-center gap-3">
        <Link href="/sessions" className={styles.back}>
          ← Volver
        </Link>
        <h1 className={styles.topTitle}>{sessionTitle}</h1>
        <Chip status={STATUS_CHIP[sessionStatus]} />
      </div>

      {/* Navegación por pestañas */}
      <div className="flex gap-1 bg-[#0F172A] p-1 rounded-md border border-[rgba(148, 163, 184, 0.12)]">
        <button
          type="button"
          onClick={() => setActiveTab("access")}
          className={`px-4 py-2 rounded-sm text-[13px] font-semibold cursor-pointer border-none transition-all duration-150 ${
            activeTab === "access"
              ? "bg-[#38BDF8] text-[#0F172A] shadow-sm"
              : "bg-transparent text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155]/50"
          }`}
        >
          Control de Acceso
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("monitor")}
          className={`px-4 py-2 rounded-sm text-[13px] font-semibold cursor-pointer border-none transition-all duration-150 ${
            activeTab === "monitor"
              ? "bg-[#38BDF8] text-[#0F172A] shadow-sm"
              : "bg-transparent text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155]/50"
          }`}
        >
          Monitoreo y Alertas
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("copilot")}
          className={`px-4 py-2 rounded-sm text-[13px] font-semibold cursor-pointer border-none transition-all duration-150 ${
            activeTab === "copilot"
              ? "bg-[#38BDF8] text-[#0F172A] shadow-sm"
              : "bg-transparent text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155]/50"
          }`}
        >
          IA Copiloto de Sesión
        </button>
      </div>
    </div>
  );

  // 2. Definición dinámica de los paneles según la pestaña seleccionada
  let sidebar: React.ReactNode;
  let main: React.ReactNode;
  let aside: React.ReactNode;
  let sidebarTitle = "Estudiantes y solicitudes";
  let asideTitle = "Alertas y acciones";

  if (activeTab === "access") {
    // === PESTAÑA 1: CONTROL DE ACCESO ===
    sidebarTitle = "Sala de Espera (Estudiantes)";
    sidebar = (
      <div>
        <h2 className={styles.queueTitle}>
          Solicitudes de ingreso ({requests.length})
        </h2>
        {requests.length === 0 ? (
          <EmptyState
            title="Sala de espera vacía"
            description="Cuando un estudiante intente unirse, aparecerá aquí su solicitud para que la apruebes."
          />
        ) : (
          <div className={styles.queue}>
            {requests.map((request) => (
              <ApprovalQueueItem
                key={request.id}
                request={request}
                courseLabel={sessionGrade ? (GRADE_LABELS[sessionGrade] || sessionGrade) : undefined}
                pendingAction={
                  pending?.id === request.id ? pending.action : null
                }
                onApprove={() => handleApprove(request)}
                onReject={() => handleReject(request.id)}
              />
            ))}
          </div>
        )}
      </div>
    );

    main = (
      <div className={styles.main}>
        {notice ? <div className={styles.notice}>{notice}</div> : null}
        <div className={styles.mainBody}>
          <Card padding="default">
            <h2 className="font-heading text-xl font-bold mb-2 text-[var(--color-primary)]">
              Control de Acceso y Estudiantes Admitidos
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
              Utiliza la columna izquierda para aceptar o rechazar solicitudes de ingreso. A continuación se listan los estudiantes que ya han sido aprobados y forman parte de la sesión:
            </p>

            <h3 className="text-[15px] font-semibold mb-4 text-[var(--color-text)]">
              Alumnos en la sesión ({students.length}/10 concurrentes)
            </h3>

            {students.length === 0 ? (
              <EmptyState
                title="Sin alumnos en clase todavía"
                description="Ningún estudiante ha ingresado aún. Revisa las solicitudes en la sala de espera."
              />
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
                {students.map((student) => {
                  const isOnline = student.is_active;
                  return (
                    <Card key={student.id} padding="default" className="border border-[var(--color-border)] flex items-center gap-3 bg-[var(--color-surface-1)]">
                      <span className="text-2xl">👤</span>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm truncate">
                          {student.full_name}
                        </div>
                        <div className={`text-xs ${isOnline ? "text-[var(--color-success)]" : "text-[var(--color-text-tertiary)]"}`}>
                          {isOnline ? "En línea" : "Desconectado"} · {student.completed_tasks_count || 0}/{totalTasks} tareas
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    );

    asideTitle = "Configuración y Actividad";
    aside = (
      <div className={styles.asideStack}>
        <Card padding="default" className="border border-[var(--color-border)] bg-[var(--color-surface-1)]">
          <h3 className="text-sm font-bold text-[var(--color-primary)] mb-2">
            Consecuencias de Estado
          </h3>
          
          <div className="flex flex-col gap-3">
            {sessionStatus === "active" && (
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed m-0">
                🟢 **Activa**: Los estudiantes admitidos pueden ingresar a su laboratorio y chatear con la IA para resolver su roadmap de tareas.
              </p>
            )}
            {sessionStatus === "paused" && (
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed m-0">
                🟡 **Pausada**: Los chats de los estudiantes quedan inhabilitados. No pueden enviar nuevos mensajes hasta que reanudes la sesión.
              </p>
            )}
            {sessionStatus === "closed" && (
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed m-0">
                🔴 **Cerrada**: La clase ha terminado. Los estudiantes ya no interactúan y el Route Handler inyectará `/finalizar` para emitir el reporte socrático final de la IA.
              </p>
            )}
            {sessionStatus === "draft" && (
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed m-0">
                ⚪ **Borrador**: La actividad está configurada pero aún no se ha abierto al ingreso de los alumnos en sus dispositivos.
              </p>
            )}
          </div>
        </Card>

        <div>
          <p className={styles.sessionMeta}>Acciones de sesión</p>
          <div className={styles.sessionActions}>
            {sessionStatus === "active" ? (
              <Button
                type="button"
                variant="warning"
                size="sm"
                fullWidth
                disabled={statusBusy}
                loading={statusBusy}
                onClick={() => changeSessionStatus("paused")}
              >
                Pausar actividad
              </Button>
            ) : sessionStatus !== "closed" ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                fullWidth
                disabled={statusBusy}
                loading={statusBusy}
                onClick={() => changeSessionStatus("active")}
              >
                {sessionStatus === "draft" ? "Lanzar actividad" : "Reanudar actividad"}
              </Button>
            ) : null}
            {sessionStatus !== "closed" ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                fullWidth
                disabled={statusBusy}
                loading={statusBusy}
                onClick={() => changeSessionStatus("closed")}
              >
                Cerrar sesión
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    );

  } else if (activeTab === "monitor") {
    // === PESTAÑA 2: MONITOREO Y ALERTAS (Modo Espejo) ===
    sidebarTitle = "Estudiantes";
    sidebar = (
      <div>
        <h2 className={styles.queueTitle}>
          Alumnos en clase ({students.length})
        </h2>
        {students.length === 0 ? (
          <EmptyState
            title="Aún no hay estudiantes"
            description="Los alumnos aprobados aparecerán aquí para monitorear su avance."
          />
        ) : (
          <div className={styles.queue}>
            {students.map((student) => (
              <StudentSessionItem
                key={student.id}
                student={student}
                totalTasks={totalTasks}
                isSelected={selectedStudentId === student.id}
                onClick={() => setSelectedStudentId(student.id)}
              />
            ))}
          </div>
        )}
      </div>
    );

    const selectedStudent = students.find((s) => s.id === selectedStudentId);

    main = (
      <div className={styles.main}>
        {notice ? <div className={styles.notice}>{notice}</div> : null}
        
        {/* Selector de alumnos para pantallas móviles */}
        <div className={styles.mobileStudentSelector}>
          <label className={styles.mobileSelectorLabel}>
            Monitorear alumno en tiempo real:
          </label>
          <select
            value={selectedStudentId || ""}
            onChange={(e) => setSelectedStudentId(e.target.value || null)}
            className={styles.mobileSelectControl}
          >
            <option value="">Selecciona un alumno...</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name} ({s.is_active ? "En línea" : "Desconectado"})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.mainBody}>
          {selectedStudentId && selectedStudent ? (
            <ChatMonitorView
              studentSessionId={selectedStudentId}
              studentName={selectedStudent.full_name}
              student={selectedStudent}
              totalTasks={totalTasks}
              agentConfig={agentConfig}
            />
          ) : (
            <EmptyState
              title="Selecciona un estudiante"
              description="Haz clic sobre un alumno en la barra lateral o selecciónalo desde el menú desplegable superior para ver su chat con el bot en modo espejo. Esta vista es de lectura exclusiva para evitar interrupciones."
            />
          )}
        </div>
      </div>
    );

    asideTitle = "Alertas de Moderación";
    aside = (
      <div className={styles.asideStack}>
        {alerts.length === 0 ? (
          <>
            <AlertCard
              kind="risk"
              title="Sin alertas de riesgo"
              description="Aquí aparecerán avisos si el sistema detecta lenguaje o contenidos sensibles."
            />
            <AlertCard
              kind="moderation"
              title="Moderación estable"
              description="Te avisaremos si un mensaje fue bloqueado o reemplazado por el motor de seguridad."
            />
          </>
        ) : (
          alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              kind={
                alert.type === "security"
                  ? "risk"
                  : alert.type === "technical"
                    ? "session"
                    : "moderation"
              }
              title={alert.student_sessions?.full_name ?? "Sistema"}
              description={alert.content_snapshot}
            />
          ))
        )}
      </div>
    );

  } else {
    // === PESTAÑA 3: IA COPILOTO DE SESIÓN ===
    sidebarTitle = "Resumen de Sesión";
    sidebar = (
      <div className="flex flex-col gap-4">
        <Card padding="default" className="bg-[var(--color-bg)] border border-[var(--color-border)]">
          <h3 className="text-sm font-bold text-[var(--color-primary)] mb-2">
            Objetivo de Aprendizaje
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed m-0">
            {pedagogicalObjective || "Sin objetivo pedagógico configurado."}
          </p>
        </Card>
        
        <Card padding="default" className="bg-[var(--color-bg)] border border-[var(--color-border)]">
          <h3 className="text-sm font-bold text-[var(--color-primary)] mb-2">
            Métricas Actuales
          </h3>
          <div className="text-xs flex flex-col gap-[6px]">
            <div>👥 Estudiantes aprobados: <strong>{students.length}</strong></div>
            <div>🟢 Conectados ahora: <strong>{students.filter(s => s.is_active).length}</strong></div>
            <div>⚠️ Alertas sin resolver: <strong>{alerts.filter(a => !a.is_resolved).length}</strong></div>
          </div>
        </Card>
      </div>
    );

    main = (
      <div className={`${styles.main} h-full`}>
        <div className={`${styles.mainBody} h-full p-0`}>
          <CopilotChat sessionId={sessionId} />
        </div>
      </div>
    );

    asideTitle = "Consejos del Copiloto";
    aside = (
      <div className="flex flex-col gap-3">
        <AlertCard
          kind="moderation"
          title="¿Cómo interactuar?"
          description="Escribe tus dudas técnicas de uso, o pídele que interprete el avance de tus estudiantes para aconsejarte."
        />
        <AlertCard
          kind="risk"
          title="Mediación de Alertas"
          description="Si ves alertas de alumnos activos, pídele recomendaciones: '¿Cómo puedo asistir a [Nombre]?' para obtener una sugerencia práctica de mediación."
        />
      </div>
    );
  }

  return (
    <TeacherShell
      topBar={topBar}
      sidebar={sidebar}
      sidebarTitle={sidebarTitle}
      main={main}
      aside={aside}
      asideTitle={asideTitle}
      hideSidebarOnMobile={activeTab === "monitor" || activeTab === "copilot"}
      hideAsideOnMobile={activeTab === "monitor" || activeTab === "copilot"}
    />
  );
}
