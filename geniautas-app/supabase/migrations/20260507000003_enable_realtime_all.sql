-- Habilitar Realtime para las tablas clave del MVP
begin;
  -- Eliminar si ya existe (para evitar errores)
  drop publication if exists supabase_realtime;
  
  -- Crear la publicación para todas las tablas necesarias
  create publication supabase_realtime for table 
    public.session_join_requests, 
    public.student_sessions, 
    public.messages, 
    public.student_task_progress,
    public.alerts;
commit;

-- Nota: Si la publicación 'supabase_realtime' ya es gestionada por Supabase, 
-- puede que necesites simplemente añadir las tablas:
-- alter publication supabase_realtime add table public.session_join_requests;
-- alter publication supabase_realtime add table public.student_sessions;
-- alter publication supabase_realtime add table public.messages;
-- alter publication supabase_realtime add table public.student_task_progress;
-- alter publication supabase_realtime add table public.alerts;
