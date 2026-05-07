-- 1. Otorgar permisos de inserción y lectura al rol anónimo (estudiantes sin cuenta)
grant insert, select on table public.access_requests to anon;
grant insert, select on table public.student_sessions to anon;
grant insert, select on table public.messages to anon;
grant insert, select, update on table public.student_task_progress to anon;
grant insert on table public.alerts to anon;

-- 2. Asegurar que las secuencias sean usables por anon si existen (ID auto-incrementales)
grant usage, select on all sequences in schema public to anon;

-- 3. Reforzar Políticas RLS para Estudiantes
drop policy if exists "Estudiantes pueden crear solicitudes" on public.access_requests;
create policy "Estudiantes pueden crear solicitudes"
  on public.access_requests for insert
  to anon
  with check ( true );

drop policy if exists "Estudiantes pueden leer sus solicitudes" on public.access_requests;
create policy "Estudiantes pueden leer sus solicitudes"
  on public.access_requests for select
  to anon
  using ( true );

drop policy if exists "Estudiantes pueden crear sus sesiones" on public.student_sessions;
create policy "Estudiantes pueden crear sus sesiones"
  on public.student_sessions for insert
  to anon
  with check ( true );

drop policy if exists "Estudiantes pueden leer sesiones de alumnos" on public.student_sessions;
create policy "Estudiantes pueden leer sesiones de alumnos"
  on public.student_sessions for select
  to anon
  using ( true );
