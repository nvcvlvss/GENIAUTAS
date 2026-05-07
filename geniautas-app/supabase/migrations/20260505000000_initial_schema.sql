-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLES

-- Profiles (Docentes)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  school_id text, -- Opcional, vinculación a un colegio base
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Schools (Colegios Piloto)
create table public.schools (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sessions (Actividades de Laboratorio)
create type session_status as enum ('draft', 'active', 'paused', 'closed');
create type agent_type as enum ('constructivista', 'cognitivista', 'neutro');

create table public.sessions (
  id uuid default uuid_generate_v4() primary key,
  teacher_id uuid references public.profiles(id) on delete cascade not null,
  school_id uuid references public.schools(id) not null,
  grade text not null, -- Curso (ej: "6to B")
  title text not null,
  pedagogical_objective text not null,
  agent_config agent_type not null default 'neutro',
  status session_status not null default 'draft',
  last_activity_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Roadmap Tasks (Tareas configuradas por sesión)
create table public.roadmap_tasks (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  title text not null,
  order_index int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Access Requests (Solicitudes de estudiantes en espera)
create type request_status as enum ('pending', 'approved', 'rejected');

create table public.access_requests (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  student_name text not null,
  student_last_name text not null,
  avatar_id text not null,
  status request_status not null default 'pending',
  proposed_student_session_id uuid, -- Para reingresos
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Student Sessions (Identidades activas dentro de una sesión)
create table public.student_sessions (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  full_name text not null,
  avatar_id text not null,
  student_index int default 1, -- Para desambiguar nombres iguales
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages (Chat)
create type message_role as enum ('user', 'assistant', 'system');

create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  student_session_id uuid references public.student_sessions(id) on delete cascade not null,
  role message_role not null,
  content text not null,
  is_flagged boolean default false,
  moderation_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Student Task Progress (Estado del roadmap por estudiante)
create table public.student_task_progress (
  id uuid default uuid_generate_v4() primary key,
  student_session_id uuid references public.student_sessions(id) on delete cascade not null,
  task_id uuid references public.roadmap_tasks(id) on delete cascade not null,
  is_completed boolean default false,
  reflection_text text,
  completed_at timestamp with time zone,
  unique(student_session_id, task_id)
);

-- Alerts (Seguridad y Pedagogía)
create type alert_type as enum ('security', 'pedagogical', 'technical');

create table public.alerts (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  student_session_id uuid references public.student_sessions(id) on delete cascade not null,
  type alert_type not null,
  content_snapshot text,
  is_resolved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PILOT DATA
insert into public.schools (name) values 
  ('Colegio Notre Dame'),
  ('Colegio San Viator'),
  ('Colegio Verbo Divino'),
  ('Instituto Nacional'),
  ('Liceo 1 Javiera Carrera');

-- 4. TRIGGERS
-- Crear perfil automáticamente al registrarse
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. RLS (ROW LEVEL SECURITY)

alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.roadmap_tasks enable row level security;
alter table public.access_requests enable row level security;
alter table public.student_sessions enable row level security;
alter table public.messages enable row level security;
alter table public.student_task_progress enable row level security;
alter table public.alerts enable row level security;

-- Policies para DOCENTES
create policy "Docentes pueden ver y editar sus propias sesiones"
  on public.sessions for all
  using ( auth.uid() = teacher_id );

create policy "Docentes pueden gestionar sus perfiles"
  on public.profiles for all
  using ( auth.uid() = id );

-- Policies para ESTUDIANTES (Seguridad Crítica)
-- Estudiantes pueden ver sesiones activas de su colegio/curso (sin auth)
create policy "Estudiantes pueden leer sesiones activas"
  on public.sessions for select
  using ( status = 'active' or status = 'paused' );

-- Estudiantes pueden crear solicitudes de acceso
create policy "Estudiantes pueden crear solicitudes"
  on public.access_requests for insert
  with check ( true );

-- Estudiantes pueden leer sus propias solicitudes (mediante ID en sessionStorage próximamente)
create policy "Estudiantes pueden leer sus solicitudes"
  on public.access_requests for select
  using ( true ); -- En producción se filtraría por ID de sesión y cliente

-- Mensajes: RLS por student_session_id (Aislamiento Total)
-- Nota: En el MVP, los estudiantes no tienen auth de Supabase. 
-- El aislamiento se manejará principalmente en la capa de aplicación 
-- y mediante políticas que filtren por ID de sesión estudiantil si fuera posible, 
-- o confiando en la opacidad de los UUIDs para el acceso público limitado.
