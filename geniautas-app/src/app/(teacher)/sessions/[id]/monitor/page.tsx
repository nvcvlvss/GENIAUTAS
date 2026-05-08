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
import { GRADE_LABELS } from "@/lib/constants";
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
  const [requests, setRequests] = useState<AccessRequestRow[]>([]);
  const [students, setStudents] = useState<StudentSessionRow[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionTitle, setSessionTitle] = useState("Sesión");
  const [sessionGrade, setSessionGrade] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("draft");
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
        setTotalTasks(tasksData.length);
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
                ? { ...s, completed_tasks_count: (s.completed_tasks_count || 0) + 1 }
                : s,
            ),
          );
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

  const topBar = (
    <div className={styles.topLeft}>
      <Link href="/sessions" className={styles.back}>
        ← Volver a sesiones
      </Link>
      <h1 className={styles.topTitle}>{sessionTitle}</h1>
      <Chip status={STATUS_CHIP[sessionStatus]} />
    </div>
  );

  const sidebar = (
    <div>
      <div className={styles.subsection}>
        <h2 className={styles.queueTitle}>
          Estudiantes en clase ({students.length})
        </h2>
        {students.length === 0 ? (
          <EmptyState
            title="Aún no hay estudiantes"
            description="Los alumnos aparecerán aquí una vez que apruebes su ingreso."
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
      <div>
        <h2 className={styles.queueTitle}>
          Solicitudes pendientes ({requests.length})
        </h2>
        {requests.length === 0 ? (
          <EmptyState
            title="Sin solicitudes"
            description="Cuando un estudiante pida ingreso, aparecerá aquí al instante."
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
    </div>
  );

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const main = (
    <div className={styles.main}>
      {notice ? <div className={styles.notice}>{notice}</div> : null}
      <div className={styles.mainBody}>
        {selectedStudentId && selectedStudent ? (
          <ChatMonitorView
            studentSessionId={selectedStudentId}
            studentName={selectedStudent.full_name}
          />
        ) : (
          <EmptyState
            title="Selecciona un estudiante"
            description="Elige un alumno en la lista para revisar su conversación con el agente en tiempo real."
          />
        )}
      </div>
    </div>
  );

  const aside = (
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

  return (
    <TeacherShell
      topBar={topBar}
      sidebar={sidebar}
      main={main}
      aside={aside}
    />
  );
}
