-- 1. Roadmap Tasks: Lectura pública para estudiantes en sesiones activas
create policy "Roadmap tasks son visibles para todos"
  on public.roadmap_tasks for select
  using ( true );

-- 2. Student Sessions: Crear (para aprobación) y leer (para el lab)
create policy "Estudiantes pueden crear sus sesiones"
  on public.student_sessions for insert
  with check ( true );

create policy "Estudiantes pueden leer sesiones de alumnos"
  on public.student_sessions for select
  using ( true );

-- 3. Messages: Insertar y leer (basado en UUID de sesión de alumno)
create policy "Estudiantes pueden insertar mensajes"
  on public.messages for insert
  with check ( true );

create policy "Estudiantes pueden leer mensajes"
  on public.messages for select
  using ( true );

-- 4. Student Task Progress: Insertar y leer avance
create policy "Estudiantes pueden gestionar su progreso"
  on public.student_task_progress for all
  using ( true );

-- 5. Alerts: Estudiantes pueden insertar alertas (vía API chat)
create policy "Estudiantes pueden generar alertas"
  on public.alerts for insert
  with check ( true );

-- 6. Docentes: Acceso total a todo lo relacionado con sus sesiones
-- Nota: En una versión más avanzada, esto se filtraría por teacher_id.
-- Para el MVP escolar, simplificamos el acceso del docente autenticado.
create policy "Docentes pueden leer todo"
  on public.student_sessions for select
  using ( auth.role() = 'authenticated' );

create policy "Docentes pueden leer mensajes de sus alumnos"
  on public.messages for select
  using ( auth.role() = 'authenticated' );

create policy "Docentes pueden leer progreso"
  on public.student_task_progress for select
  using ( auth.role() = 'authenticated' );

create policy "Docentes pueden ver alertas"
  on public.alerts for select
  using ( auth.role() = 'authenticated' );
