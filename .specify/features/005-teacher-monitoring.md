# Feature Specification: Monitoreo de Chat (Docente)

**Feature Branch**: `005-teacher-monitoring`  
**Created**: 2026-05-05  
**Status**: Draft  
**Reference**: [MVP-SPEC](../MVP-SPEC.md), [Session Management](001-session-management.md), [Chatbot Interaction](003-chatbot-interaction.md)

## User Scenarios & Testing

### User Story 1 - Panel de Control de Sesión (Priority: P1)
**Description**: El docente visualiza un tablero general con todos los estudiantes conectados, su estado de progreso y alertas activas.
**Why this priority**: Es la base de la gestión del aula en tiempo real.
**Independent Test**: Abrir la vista docente y verificar que aparece una "tarjeta" por cada estudiante aprobado, mostrando su avatar y su porcentaje de progreso.

**Acceptance Scenarios**:
1. **Given** una sesión activa con 5 estudiantes, **When** el docente entra a la vista "En Vivo", **Then** el sistema muestra una cuadrícula con 5 tarjetas actualizadas.
2. **Given** el panel general, **When** un estudiante marca una tarea como completada, **Then** la barra de progreso en la tarjeta del docente se actualiza en menos de 2 segundos.

---

### User Story 2 - Supervisión de Conversación Individual (Priority: P1)
**Description**: El docente selecciona a un estudiante para leer su chat completo y entender el contexto de su interacción con la IA.
**Why this priority**: Permite la intervención pedagógica dirigida y la detección de dificultades.
**Independent Test**: Seleccionar a "Juan" en el panel y verificar que se carga su historial de chat y se actualiza en vivo cuando Juan envía un mensaje.

**Acceptance Scenarios**:
1. **Given** el panel de monitoreo, **When** el docente hace clic en "Ver Chat" de un estudiante, **Then** se despliega una vista lateral o modal con la conversación completa y el estado detallado del roadmap.
2. **Given** la vista de chat individual abierta, **When** el estudiante recibe una respuesta de la IA, **Then** el docente ve aparecer esa respuesta simultáneamente sin necesidad de refrescar.

---

### User Story 3 - Atención Prioritaria por Alertas (Priority: P1)
**Description**: El docente identifica rápidamente qué estudiantes han activado alertas de seguridad o pedagógicas para intervenir de inmediato.
**Why this priority**: Garantiza la seguridad y el cumplimiento de los objetivos de la sesión.
**Independent Test**: Simular una alerta de seguridad y verificar que la tarjeta del estudiante se resalta en rojo y muestra un acceso directo al chat conflictivo.

**Acceptance Scenarios**:
1. **Given** un mensaje bloqueado por seguridad, **When** ocurre el evento, **Then** el docente recibe una notificación visual (badge rojo) en el panel y puede ver el extracto del mensaje prohibido.
2. **Given** una alerta activa, **When** el docente hace clic en ella, **Then** el sistema lo lleva directamente al punto de la conversación donde se generó el riesgo.

---

## Requirements

### Functional Requirements
- **FR-MON-001**: El panel docente DEBE suscribirse a los canales de Supabase Realtime para: `Messages`, `StudentTaskProgress` y `Alerts`.
- **FR-MON-002**: El sistema DEBE mostrar una "Lista de Estudiantes" con: Nombre, Avatar, Último mensaje (fragmento), % de progreso y Estado (Online/Offline).
- **FR-MON-003**: El docente DEBE poder filtrar la lista de estudiantes por "Estado de Alerta" o "Progreso".
- **FR-MON-004**: La vista de chat individual DEBE diferenciar visualmente entre: Mensajes del Estudiante, Respuestas de la IA y Eventos del Sistema (ej: "Tarea 1 completada").
- **FR-MON-005**: El sistema DEBE permitir al docente ver el "Historial de Reflexiones" del estudiante (metacognición) junto al chat.
- **FR-MON-006**: El docente DEBE tener un botón de "Intervención Presencial" (opcional en MVP) que marque al estudiante como "Siendo atendido" para coordinar con otros adultos si fuera necesario.

### Diseño de la Interfaz (Dashboard)
- **Vista General**: Cards compactas con indicadores visuales rápidos (semáforo de progreso).
- **Vista Detalle**: Split screen o Modal grande; Chat a la izquierda, Roadmap/Reflexiones/Alertas a la derecha.
- **Seguridad**: Los mensajes sensibles/bloqueados se muestran al docente con un aviso de "Contenido Bloqueado para el Estudiante" pero visible para el profesor.

### Entities & Data
- **TeacherDashboardState**: Estado local/UI que maneja el estudiante seleccionado y filtros activos.
- **Alert**:
    - `id`, `student_session_id`, `type` (security, pedagogical, technical), `content_snapshot`, `is_resolved`.

## Success Criteria
- **SC-MON-001**: Latencia de actualización de mensajes en el panel docente < 1.5 segundos desde que se persiste en la DB.
- **SC-MON-002**: El docente puede alternar entre chats de diferentes estudiantes con un solo clic.

## Edge Cases
- **Muchos Mensajes Simultáneos**: 10 estudiantes chateando a la vez. *Resolución: Usar virtualización de listas en el panel docente para evitar degradación de performance en el navegador.*
- **Estudiante se desconecta**: El estudiante cierra la pestaña. *Resolución: La tarjeta del estudiante debe cambiar a estado "Desconectado" tras 30 segundos de inactividad de pulso (heartbeat).*
- **Revisión Post-Sesión**: El docente entra a una sesión `closed`. *Resolución: El panel debe funcionar en modo "Solo Lectura", permitiendo navegar por todos los chats e informes finales.*
