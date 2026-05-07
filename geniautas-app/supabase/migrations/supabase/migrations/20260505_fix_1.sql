-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS (Usamos bloques DO para evitar errores si ya existen)
do $$ 
begin
    if not exists (select 1 from pg_type where typname = 'session_status') then
        create type session_status as enum ('draft', 'active', 'paused', 'closed');
    end if;
    if not exists (select 1 from pg_type where typname = 'agent_type') then
        create type agent_type as enum ('constructivista', 'cognitivista', 'neutro');
    end if;
    if not exists (select 1 from pg_type where typname = 'request_status') then
        create type request_status as enum ('pending', 'approved', 'rejected');
    end if;
    if not exists (select 1 from pg_type where typname = 'message_role') then
        create type message_role as enum ('user', 'assistant', 'system');
    end if;
    if not exists (select 1 from pg_type where typname = 'alert_type') then
        create type alert_type as enum ('security', 'pedagogical', 'technical');
    end if;
end $$;

-- 3. TABLES (Con IF NOT EXISTS para evitar el error 42P07)

-- Profiles (Docentes)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  school_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Schools (Colegios Piloto)
create table if not exists public.schools (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sessions (Actividades de Laboratorio)
create table if not exists public.sessions (
  id uuid default uuid_generate_v4() primary key,
  teacher_id uuid references public.profiles(id) on delete cascade not null,
  school_id uuid references public.schools(id) not null,
  grade text not null,
  title text not null,
  pedagogical_objective text not null,
  agent_config agent_type not null default 'neutro',
  status session_status not null default 'draft',
  last_activity_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Roadmap Tasks
create table if not exists public.roadmap_tasks (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  title text not null,
  order_index int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Access Requests
create table if not exists public.access_requests (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  student_name text not null,
  student_last_name text not null,
  avatar_id text not null,
  status request_status not null default 'pending',
  proposed_student_session_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Student Sessions[cite: 1]
create table if not exists public.student_sessions (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  full_name text not null,
  avatar_id text not null,
  student_index int default 1,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages (Chat)[cite: 1]
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  student_session_id uuid references public.student_sessions(id) on delete cascade not null,
  role message_role not null,
  content text not null,
  is_flagged boolean default false,
  moderation_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Student Task Progress[cite: 1]
create table if not exists public.student_task_progress (
  id uuid default uuid_generate_v4() primary key,
  student_session_id uuid references public.student_sessions(id) on delete cascade not null,
  task_id uuid references public.roadmap_tasks(id) on delete cascade not null,
  is_completed boolean default false,
  reflection_text text,
  completed_at timestamp with time zone,
  unique(student_session_id, task_id)
);

-- Alerts[cite: 1]
create table if not exists public.alerts (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  student_session_id uuid references public.student_sessions(id) on delete cascade not null,
  type alert_type not null,
  content_snapshot text,
  is_resolved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PILOT DATA (Evitamos duplicados con ON CONFLICT)
insert into public.schools (name) values 
  ('Colegio Notre Dame'),
  ('Colegio San Viator'),
  ('Colegio Verbo Divino'),
  ('Instituto Nacional'),
  ('Liceo 1 Javiera Carrera')
on conflict (name) do nothing;

-- 5. TRIGGERS & FUNCTIONS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Borramos el trigger si existe para recrearlo limpiamente
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. RLS (Habilitar y recrear políticas)
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.roadmap_tasks enable row level security;
alter table public.access_requests enable row level security;
alter table public.student_sessions enable row level security;
alter table public.messages enable row level security;
alter table public.student_task_progress enable row level security;
alter table public.alerts enable row level security;

-- Limpieza de políticas previas para evitar errores de "already exists"
do $$ 
begin
    drop policy if exists "Docentes pueden ver y editar sus propias sesiones" on public.sessions;
    drop policy if exists "Docentes pueden gestionar sus perfiles" on public.profiles;
    drop policy if exists "Estudiantes pueden leer sesiones activas" on public.sessions;
    drop policy if exists "Estudiantes pueden crear solicitudes" on public.access_requests;
    drop policy if exists "Estudiantes pueden leer sus solicitudes" on public.access_requests;
    drop policy if exists "Cualquiera puede ver la lista de colegios" on public.schools;
end $$;

-- Creación de políticas
create policy "Docentes pueden ver y editar sus propias sesiones"
  on public.sessions for all using ( auth.uid() = teacher_id );

create policy "Docentes pueden gestionar sus perfiles"
  on public.profiles for all using ( auth.uid() = id );

create policy "Estudiantes pueden leer sesiones activas"
  on public.sessions for select using ( status = 'active' or status = 'paused' );

create policy "Estudiantes pueden crear solicitudes"
  on public.access_requests for insert with check ( true );

create policy "Estudiantes pueden leer sus solicitudes"
  on public.access_requests for select using ( true );

create policy "Cualquiera puede ver la lista de colegios"
  on public.schools for select using ( true );