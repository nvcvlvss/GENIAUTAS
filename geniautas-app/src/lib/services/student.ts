'use server';

import { createClient } from '@/lib/supabase/server';

export async function getActiveSessionsBySchool(schoolId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('id, title, grade')
    .eq('school_id', schoolId)
    .in('status', ['active', 'paused'])
    .order('created_at', { ascending: false });

  if (error) throw new Error(`FETCH_ACTIVE_SESSIONS_ERROR: ${error.message}`);
  return data;
}

export async function submitAccessRequest(formData: {
  session_id: string;
  student_candidate_name: string;
  avatar_id: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('session_join_requests')
    .insert({
      session_id: formData.session_id,
      student_candidate_name: formData.student_candidate_name,
      avatar_id: formData.avatar_id,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw new Error(`SUBMIT_REQUEST_ERROR: ${error.message}`);
  return data;
}

export async function getStudentSession(studentSessionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('student_sessions')
    .select('*, sessions(*)')
    .eq('id', studentSessionId)
    .single();

  if (error) throw new Error(`FETCH_STUDENT_SESSION_ERROR: ${error.message}`);
  return data;
}

export async function getRoadmapTasks(sessionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('roadmap_tasks')
    .select('*')
    .eq('session_id', sessionId)
    .order('order_index', { ascending: true });

  if (error) throw new Error(`FETCH_ROADMAP_ERROR: ${error.message}`);
  return data;
}

export async function getChatHistory(studentSessionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('student_session_id', studentSessionId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`FETCH_HISTORY_ERROR: ${error.message}`);
  return data;
}

export async function updateTaskProgress(
  studentSessionId: string,
  taskId: string,
  reflection: string
) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('student_task_progress')
    .upsert({
      student_session_id: studentSessionId,
      task_id: taskId,
      is_completed: true,
      reflection_text: reflection,
      completed_at: new Date().toISOString()
    }, { onConflict: 'student_session_id,task_id' });

  if (error) throw new Error(`UPDATE_PROGRESS_ERROR: ${error.message}`);
}

export async function getStudentProgress(studentSessionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('student_task_progress')
    .select('task_id, is_completed')
    .eq('student_session_id', studentSessionId);

  if (error) throw new Error(`FETCH_PROGRESS_ERROR: ${error.message}`);
  return data;
}
