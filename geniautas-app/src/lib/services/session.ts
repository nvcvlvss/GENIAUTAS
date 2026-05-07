'use server';

import { createClient } from '@/lib/supabase/server';
import { AgentType, Session } from '@/types/database';

export async function createSession(formData: {
  title: string;
  grade: string;
  school_id: string;
  pedagogical_objective: string;
  agent_config: AgentType;
  tasks: string[];
}) {
  const supabase = await createClient();

  // 1. Get current user (Teacher)
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('AUTH_ERROR: Debe estar autenticado como docente.');
  }

  // 2. Insert Session
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      teacher_id: user.id,
      school_id: formData.school_id,
      grade: formData.grade,
      title: formData.title,
      pedagogical_objective: formData.pedagogical_objective,
      agent_config: formData.agent_config,
      status: 'draft'
    })
    .select()
    .single();

  if (sessionError) {
    if (sessionError.code === 'PGRST116') throw new Error('TABLE_NOT_FOUND: La tabla "sessions" no existe o no es accesible.');
    if (sessionError.message.includes('connection')) throw new Error('CONNECTION_ERROR: No se pudo conectar a Supabase.');
    throw new Error(`DB_ERROR: ${sessionError.message}`);
  }

  // 3. Insert Roadmap Tasks
  if (formData.tasks.length > 0) {
    const tasksToInsert = formData.tasks.map((task, index) => ({
      session_id: session.id,
      title: task,
      order_index: index
    }));

    const { error: tasksError } = await supabase
      .from('roadmap_tasks')
      .insert(tasksToInsert);

    if (tasksError) {
      throw new Error(`DB_ERROR_TASKS: ${tasksError.message}`);
    }
  }

  return session;
}

export async function getSchools() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('schools').select('*').order('name');
  
  if (error) {
    throw new Error(`FETCH_ERROR: ${error.message}`);
  }
  
  return data;
}

export async function getSessionById(sessionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, title, status, grade, school_id")
    .eq("id", sessionId)
    .single();

  if (error) {
    throw new Error(`FETCH_SESSION_ERROR: ${error.message}`);
  }

  return data;
}

export async function getSessions() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('sessions')
    .select('*, schools(name)')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`FETCH_SESSIONS_ERROR: ${error.message}`);
  }

  return data;
}

export async function updateSessionStatus(sessionId: string, status: SessionStatus) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('sessions')
    .update({ 
      status,
      last_activity_at: new Date().toISOString()
    })
    .eq('id', sessionId);

  if (error) {
    throw new Error(`UPDATE_STATUS_ERROR: ${error.message}`);
  }
}

export async function getAccessRequests(sessionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('access_requests')
    .select('*')
    .eq('session_id', sessionId)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`FETCH_REQUESTS_ERROR: ${error.message}`);
  return data;
}

export async function getStudentSessions(sessionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('student_sessions')
    .select(`
      *,
      student_task_progress(count)
    `)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`FETCH_STUDENT_SESSIONS_ERROR: ${error.message}`);
  
  // Flatten the progress count
  return data.map(s => ({
    ...s,
    completed_tasks_count: s.student_task_progress?.[0]?.count ?? 0
  }));
}

export async function getAlerts(sessionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('alerts')
    .select('*, student_sessions(full_name)')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`FETCH_ALERTS_ERROR: ${error.message}`);
  return data;
}

export async function approveAccessRequest(request: {
  id: string;
  session_id: string;
  student_name: string;
  student_last_name: string;
  avatar_id: string;
}) {
  const supabase = await createClient();

  // 1. Create Student Session
  const { data: studentSession, error: sessionError } = await supabase
    .from('student_sessions')
    .insert({
      session_id: request.session_id,
      full_name: `${request.student_name} ${request.student_last_name}`,
      avatar_id: request.avatar_id
    })
    .select()
    .single();

  if (sessionError) throw new Error(`CREATE_STUDENT_SESSION_ERROR: ${sessionError.message}`);

  // 2. Update Access Request
  const { error: updateError } = await supabase
    .from('access_requests')
    .update({ 
      status: 'approved',
      proposed_student_session_id: studentSession.id
    })
    .eq('id', request.id);

  if (updateError) throw new Error(`UPDATE_REQUEST_ERROR: ${updateError.message}`);

  return studentSession;
}

export async function rejectAccessRequest(requestId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('access_requests')
    .update({ status: 'rejected' })
    .eq('id', requestId);

  if (error) throw new Error(`REJECT_REQUEST_ERROR: ${error.message}`);
}
