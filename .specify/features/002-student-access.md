# Feature Specification: Acceso e Identidad del Estudiante

**Feature Branch**: `002-student-access`  
**Created**: 2026-05-05  
**Status**: Draft  
**Reference**: [MVP-SPEC](../MVP-SPEC.md)

## User Scenarios & Testing

### User Story 1 - Ingreso Simple y Espera (Priority: P1)
**Description**: El estudiante completa su perfil básico y queda en espera de que el docente valide su ingreso a la sesión activa.
**Why this priority**: Es la puerta de entrada para el estudiante.
**Independent Test**: Completar el formulario y verificar que el sistema muestra la pantalla de "Esperando aprobación" y crea una solicitud en la base de datos.

**Acceptance Scenarios**:
1. **Given** una sesión activa para "Colegio A - 6to B", **When** el estudiante ingresa sus datos y elige un avatar, **Then** el sistema lo redirige a la "Sala de Espera" y envía una notificación al docente.
2. **Given** una sesión que NO ha sido lanzada, **When** el estudiante intenta ingresar, **Then** el sistema muestra un mensaje amigable: "Tu profesor aún no ha iniciado la actividad. ¡Espera un momento!".

---

### User Story 2 - Aprobación y Vinculación (Priority: P1)
**Description**: El docente revisa la solicitud y concede acceso al estudiante, vinculándolo a un registro nuevo o existente.
**Why this priority**: Garantiza que solo estudiantes autorizados participen y mantiene la trazabilidad.
**Independent Test**: Aprobar una solicitud desde el panel docente y verificar que la pantalla del estudiante cambia automáticamente al chat.

**Acceptance Scenarios**:
1. **Given** una solicitud pendiente, **When** el docente presiona "Aprobar", **Then** el estudiante entra al laboratorio y se crea su registro de `StudentSession`.
2. **Given** un estudiante que se desconectó, **When** vuelve a ingresar con el mismo nombre/apellido, **Then** el docente ve una indicación de "Reingreso" y al aprobarlo, el estudiante recupera su chat previo.

---

### User Story 3 - Control de Capacidad y Errores (Priority: P2)
**Description**: El sistema informa al estudiante cuando no puede ingresar por límites técnicos o de configuración.
**Why this priority**: Evita frustración y asegura la estabilidad del MVP (límite de 10 estudiantes).
**Independent Test**: Intentar ingresar a una sesión que ya tiene 10 estudiantes activos.

**Acceptance Scenarios**:
1. **Given** una sesión con 10 estudiantes, **When** un 11vo estudiante intenta entrar, **Then** el sistema muestra un mensaje: "La sala está llena por ahora. Avisa a tu profesor".
2. **Given** el formulario de ingreso, **When** se dejan campos vacíos, **Then** los campos se resaltan con iconos y lenguaje simple para niños.

---

## Requirements

### Functional Requirements
- **FR-STU-001**: El formulario de ingreso DEBE solicitar: Nombre, Apellido, Colegio (selección), Curso (selección) y Avatar (selector visual).
- **FR-STU-002**: El sistema DEBE validar la existencia de una sesión `active` para el par (Colegio, Curso) antes de procesar el ingreso.
- **FR-STU-003**: El sistema DEBE crear una entidad `AccessRequest` en estado `pending` tras el envío del formulario.
- **FR-STU-004**: El sistema DEBE implementar un mecanismo de "Heartbeat" o suscripción Realtime en la Sala de Espera para detectar la aprobación docente.
- **FR-STU-005**: Al aprobar, el sistema DEBE vincular al estudiante a un `student_id` persistente dentro de esa sesión para mantener el historial.
- **FR-STU-006**: El sistema DEBE restringir la vista del estudiante mediante RLS (Row Level Security) para que solo vea sus propios `Messages` y `RoadmapTasks`.

### UX/UI para Niños (10-12 años)
- Lenguaje cercano y motivador ("¡Hola! Prepárate para conversar con tu asistente").
- Uso de Avatares coloridos y amigables.
- Evitar términos técnicos como "Autenticación", "UUID" o "Database Error".

### Entities & Data
- **StudentProfile**: Registro "ligero" (nombre, apellido, colegio, curso). No es una cuenta de usuario de Supabase Auth.
- **AccessRequest**:
    - `id`, `session_id`, `student_data` (jsonb), `status` (pending, approved, rejected), `created_at`.
- **StudentSession**: Vínculo real entre un estudiante aprobado y una sesión activa.

## Success Criteria
- **SC-STU-001**: El tiempo desde la aprobación docente hasta que el estudiante ve su chat es < 1.5 segundos.
- **SC-STU-002**: El 100% de los reingresos exitosos recuperan el historial completo de la sesión actual.

## Edge Cases
- **Ambigüedad de Nombre**: Dos estudiantes con el mismo nombre y apellido en el mismo curso. *Resolución: El docente debe resolverlo visualmente en el panel de aprobación (viendo el avatar o preguntando en el aula).*
- **Sesión Pausada durante el Ingreso**: Si el docente pausa la sesión mientras hay gente en espera. *Resolución: La sala de espera debe actualizar su mensaje a "Actividad en pausa".*
- **Rechazo de Acceso**: Si el docente rechaza la solicitud. *Resolución: El estudiante vuelve al formulario inicial con un mensaje: "El profesor no ha podido validar tu ingreso".*
