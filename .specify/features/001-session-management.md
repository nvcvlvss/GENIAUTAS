# Feature Specification: Gestión de Sesiones (Docente)

**Feature Branch**: `001-session-management-teacher`  
**Created**: 2026-05-05  
**Status**: Draft  
**Reference**: [MVP-SPEC](../MVP-SPEC.md)

## User Scenarios & Testing

### User Story 1 - Creación y Configuración (Priority: P1)
**Description**: El docente crea una sesión pedagógica definiendo los parámetros necesarios (título, curso, objetivo, tareas, tipo de agente).
**Why this priority**: Es el prerrequisito para iniciar cualquier actividad.
**Independent Test**: Crear una sesión y verificar que aparece en el listado del docente con estado `draft`.

**Acceptance Scenarios**:
1. **Given** un docente autenticado, **When** completa el formulario con datos válidos, **Then** se crea un registro en estado `draft` asociado a su ID y al establecimiento.
2. **Given** una sesión en `draft`, **When** el docente intenta guardarla sin tareas o sin objetivo, **Then** el sistema muestra un error de validación y no permite guardar.

---

### User Story 2 - Validación y Lanzamiento (Priority: P1)
**Description**: El docente activa la sesión para permitir el ingreso de estudiantes, validando que no haya conflictos.
**Why this priority**: Habilita la interacción en tiempo real en el aula.
**Independent Test**: Lanzar una sesión y verificar que el estado cambia a `active` y se vuelve visible para estudiantes de ese curso.

**Acceptance Scenarios**:
1. **Given** una sesión `draft` completa, **When** el docente presiona "Lanzar", **Then** el sistema valida que no exista otra sesión `active` para el mismo Colegio + Curso.
2. **Given** una validación exitosa, **When** el estado cambia a `active`, **Then** los estudiantes en la "sala de espera" reciben una señal (vía Realtime) para iniciar el ingreso.

---

### User Story 3 - Pausa y Persistencia (Priority: P1)
**Description**: El docente interrumpe la sesión temporalmente, asegurando que el progreso no se pierda.
**Why this priority**: Fundamental para la gestión del tiempo escolar y la continuidad pedagógica.
**Independent Test**: Pausar una sesión activa y verificar que los estudiantes ya no pueden enviar mensajes pero su historial sigue guardado.

**Acceptance Scenarios**:
1. **Given** una sesión `active`, **When** el docente presiona "Pausar", **Then** el estado cambia a `paused` y se bloquea el input de los estudiantes.
2. **Given** una sesión `paused`, **When** el docente presiona "Reanudar", **Then** la sesión vuelve a `active` con todo el historial y progreso del roadmap intacto.

---

## Requirements

### Functional Requirements
- **FR-SESS-001**: El docente DEBE poder guardar una sesión incompleta como `draft` (borrador).
- **FR-SESS-002**: El sistema DEBE validar que los campos `título`, `curso`, `agente`, `objetivo` y al menos una `tarea` estén completos antes de permitir el lanzamiento.
- **FR-SESS-003**: El sistema DEBE garantizar la unicidad de sesiones activas: `Unique(colegio_id, curso_id)` para el estado `active`.
- **FR-SESS-004**: Al lanzar la sesión, el sistema DEBE notificar a los clientes conectados (estudiantes) mediante un evento de broadcast.
- **FR-SESS-005**: Al pausar, el sistema DEBE persistir el estado actual del roadmap de cada estudiante conectado.
- **FR-SESS-006**: Solo el docente propietario (UID en la sesión) puede modificar su estado.

### Session State Machine
- `draft`: Editable, no visible para estudiantes.
- `active`: Estudiantes pueden entrar y chatear. No editable (solo tareas marcables).
- `paused`: Estudiantes ven el historial pero no pueden enviar mensajes.
- `closed`: Sesión finalizada, solo lectura para revisión histórica.

### Entities & Data
- **Session**:
  - `id` (uuid)
  - `teacher_id` (uuid, fk profiles)
  - `school_id` (text/uuid)
  - `grade` (text)
  - `title` (text)
  - `pedagogical_objective` (text)
  - `agent_type` (enum: constructivista, cognitivista, neutro)
  - `status` (enum: draft, active, paused, closed)
  - `config_tasks` (jsonb array): Lista de tareas base.

## Success Criteria
- **SC-SESS-001**: El cambio de estado de la sesión (Launch/Pause) se refleja en menos de 1 segundo en el panel docente.
- **SC-SESS-002**: Ningún estudiante puede enviar mensajes si la sesión no está en estado `active`.
- **SC-SESS-003**: El docente puede ver el listado de sus sesiones previas y su estado actual.

## Edge Cases
- **Lanzamiento Duplicado**: ¿Qué pasa si el docente intenta lanzar la sesión "A" cuando la sesión "B" del mismo curso sigue activa? *Resolución: Bloquear lanzamiento y sugerir cerrar la anterior.*
- **Pérdida de Conexión**: Si el docente se desconecta mientras la sesión es `active`, esta debe permanecer `active` hasta que expire o se cierre manualmente (timeout de sesión).
- **Edición en Caliente**: ¿Puede el docente editar el objetivo mientras la sesión está activa? *Resolución: No, debe pausar para editar configuración estructural para evitar inconsistencias en el prompt de la IA.*
