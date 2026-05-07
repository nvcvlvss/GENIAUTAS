-- 1. Asegurar permisos básicos para los roles de Supabase
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to postgres, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
grant usage, select on all sequences in schema public to authenticated, anon;

-- 2. Corregir Políticas de Sessions (Docente)
drop policy if exists "Docentes pueden ver y editar sus propias sesiones" on public.sessions;
create policy "Docentes pueden gestionar sus propias sesiones"
  on public.sessions for all
  to authenticated
  using ( auth.uid() = teacher_id )
  with check ( auth.uid() = teacher_id );

-- 3. Corregir Políticas de Roadmap Tasks (Docente)
-- Para que el docente pueda insertar las tareas de su propia sesión
drop policy if exists "Roadmap tasks son visibles para todos" on public.roadmap_tasks;
create policy "Docentes pueden gestionar tareas de sus sesiones"
  on public.roadmap_tasks for all
  to authenticated
  using (
    exists (
      select 1 from public.sessions
      where id = roadmap_tasks.session_id
      and teacher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.sessions
      where id = roadmap_tasks.session_id
      and teacher_id = auth.uid()
    )
  );

create policy "Todos pueden ver las tareas"
  on public.roadmap_tasks for select
  using ( true );

-- 4. Corregir Políticas de Profiles
drop policy if exists "Docentes pueden gestionar sus perfiles" on public.profiles;
create policy "Docentes pueden gestionar su propio perfil"
  on public.profiles for all
  to authenticated
  using ( auth.uid() = id )
  with check ( auth.uid() = id );
