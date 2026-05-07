# Tasks: MVP GENIAUTAS

**Input**: Design documents from `.specify/MVP-SPEC.md` and `.specify/PLAN.md`
**Status**: Draft

## Phase 0: Infrastructure & Prep (Guía Inicial)

- [ ] T000 Create Supabase Project and obtain API Keys
- [ ] T001 Create Google AI Studio API Key (Gemini)
- [ ] T002 Setup Vercel project for deployment (optional for dev)

## Phase 1: Setup (Infraestructura Inicial)

- [x] T003 Initialize Next.js project with App Router and TypeScript in `geniautas-app/`
- [x] T004 [P] Install primary dependencies (`@supabase/supabase-js`, `@supabase/ssr`, `@google/generative-ai`, `lucide-react`)
- [x] T005 [P] Configure global variables in `geniautas-app/src/app/globals.css`
- [x] T006 Setup environment variables template (`geniautas-app/.env.local.example`)
- [x] T007 [P] Create `geniautas-app/src/lib/ai/moderation.ts` with custom word list

## Phase 2: Foundational (Base de Datos y Auth)

**⚠️ CRITICAL**: Estas tareas son requisitos para todas las historias de usuario.

- [x] T008 Initialize Supabase project and database schema migrations (Migration SQL created)
- [x] T009 [US1] Create `profiles` table and trigger for Auth linking
- [x] T010 Create `schools` table with pre-loaded data for pilot
- [x] T011 Create `sessions` and `roadmap_tasks` tables (include `last_activity_at`)
- [x] T012 Create `access_requests` and `student_sessions` tables
- [x] T013 Create `messages`, `student_task_progress` and `alerts` tables
- [x] T014 Configure strict RLS policies for student data isolation
- [x] T015 [P] Implement `geniautas-app/src/lib/supabase/client.ts` and `geniautas-app/src/lib/supabase/server.ts`
- [x] T016 [P] Create `geniautas-app/src/lib/ai/prompts.ts` with Construbot, Pensabot, and Neutro definitions in Spanish


**Checkpoint**: Infraestructura base lista para implementar flujos.

---

## Phase 3: User Story 1 - Gestión de Sesiones (P1) 🎯 MVP

**Goal**: Permitir al docente crear, lanzar y pausar sesiones.

### Implementation

- [ ] T013 [US1] Create session creation form in `geniautas-app/src/app/(teacher)/sessions/new/page.tsx`
- [ ] T014 [US1] Implement session state machine logic in `geniautas-app/src/lib/services/session.ts`
- [ ] T015 [US1] Create session list and detail view for teacher in `geniautas-app/src/app/(teacher)/sessions/page.tsx`
- [ ] T016 [US1] Add "Launch" and "Pause" actions with database updates

---

## Phase 4: User Story 2 - Acceso Estudiante y Sala de Espera (P1) 🎯 MVP

**Goal**: Permitir el ingreso de estudiantes sin cuenta y la aprobación docente.

### Implementation

- [ ] T017 [US2] Create student landing and entry form in `geniautas-app/src/app/(student)/join/page.tsx`
- [ ] T018 [US2] Implement `access_requests` logic and "Waiting Room" UI
- [ ] T019 [US2] Create Teacher Approval Dashboard with Realtime subscriptions
- [ ] T020 [US2] Implement identity matching logic for student re-entry

---

## Phase 5: User Story 3 - Interacción Chatbot y Roadmap (P1) 🎯 MVP

**Goal**: Chat individual seguro y guiado por el Roadmap.

### Implementation

- [ ] T021 [US3] Setup Gemini API proxy in `geniautas-app/src/app/api/chat/route.ts`
- [ ] T022 [US3] Implement pedagogical prompt injection logic
- [ ] T023 [US3] Create Student Lab UI in `geniautas-app/src/app/(student)/lab/[id]/page.tsx`
- [ ] T024 [US3] Implement Roadmap Task component and Metacognitive Reflection modal
- [ ] T025 [US3] Add basic input/output moderation layer

---

## Phase 6: User Story 4 - Monitoreo Docente en Tiempo Real (P1) 🎯 MVP

**Goal**: Supervisión en vivo de chats y progreso.

### Implementation

- [ ] T026 [US4] Create Teacher Live Monitor dashboard in `geniautas-app/src/app/(teacher)/sessions/[id]/monitor/page.tsx`
- [ ] T027 [US4] Implement Realtime message streaming to teacher view
- [ ] T028 [US4] Add alert notification system for security flags

---

## Phase 7: Polish & Validation

- [ ] T029 Review and harden RLS policies for all tables
- [ ] T030 [P] Conduct end-to-end testing of a full session (Teacher Create -> Student Join -> Chat -> Teacher Pause -> Re-entry)
- [ ] T031 Optimize Gemini context window management (history summarization)
- [ ] T032 UI/UX Polish for 10-12 year old children

---

## Dependencies & Execution Order

1. **Setup & Foundational (Phase 1 & 2)**: Debe completarse primero.
2. **User Stories (Phase 3, 4, 5)**: Pueden avanzar en paralelo tras Phase 2, pero se recomienda el orden numérico para asegurar el flujo lógico.
3. **Monitoreo (Phase 6)**: Depende de que el chat y el acceso funcionen (Phases 4 & 5).
4. **Validation (Phase 7)**: Finalización del MVP.
