# Feature Specification: Interacción con Chatbot y Roadmap

**Feature Branch**: `003-chatbot-interaction`  
**Created**: 2026-05-05  
**Status**: Draft  
**Reference**: [MVP-SPEC](../MVP-SPEC.md)

## User Scenarios & Testing

### User Story 1 - Conversación Pedagógica Guiada (Priority: P1)
**Description**: El estudiante conversa con la IA, la cual responde siguiendo el enfoque pedagógico (Constructivista, Cognitivista o Neutro) definido por el docente.
**Why this priority**: Es el núcleo de la experiencia de aprendizaje.
**Independent Test**: Enviar un mensaje y recibir una respuesta que no dé la solución directa (si es modo constructivista) y mencione el objetivo de la sesión.

**Acceptance Scenarios**:
1. **Given** una sesión en modo "Constructivista", **When** el estudiante pide la respuesta a una tarea, **Then** la IA responde con una pregunta orientadora en lugar de la solución.
2. **Given** el inicio de la sesión, **When** el estudiante entra por primera vez, **Then** recibe un mensaje de bienvenida que explica el primer paso del roadmap.

---

### User Story 2 - Progreso en el Roadmap y Reflexión (Priority: P1)
**Description**: El estudiante marca tareas como completadas tras interactuar con el bot y realiza una breve reflexión sobre su avance.
**Why this priority**: Refuerza la metacognición y permite al docente ver el progreso real.
**Independent Test**: Marcar una tarea como "Hecho" y verificar que el sistema solicita una reflexión antes de habilitar la siguiente tarea.

**Acceptance Scenarios**:
1. **Given** una tarea pendiente, **When** el estudiante la marca como completada, **Then** se abre un modal de reflexión: "¿Qué fue lo más fácil/difícil?".
2. **Given** una secuencia de tareas, **When** el estudiante intenta marcar la tarea 3 sin completar la 2, **Then** el sistema le indica amigablemente que debe seguir el orden.

---

### User Story 3 - Seguridad y Moderación (Priority: P1)
**Description**: Todo mensaje entrante y saliente es filtrado para asegurar un entorno seguro para menores.
**Why this priority**: Requisito crítico de seguridad infantil.
**Independent Test**: Enviar una palabra prohibida y verificar que el mensaje no llega a la IA y se muestra un aviso de seguridad.

**Acceptance Scenarios**:
1. **Given** un input inapropiado del estudiante, **When** el filtro de moderación lo detecta, **Then** el mensaje se bloquea y se notifica al docente silenciosamente (alerta).
2. **Given** una respuesta de la IA que contiene contenido sensible (detectado por Safety Settings), **When** el sistema la recibe, **Then** se reemplaza por: "Lo siento, no puedo responder a eso. ¿Intentamos hablar de la actividad?".

---

## Requirements

### Functional Requirements
- **FR-CHAT-001**: El sistema DEBE inyectar un `System Prompt` dinámico basado en: Enfoque Pedagógico, Objetivo de la Sesión y Lista de Tareas.
- **FR-CHAT-002**: El sistema DEBE persistir cada turno de conversación (Student Message + AI Response) en la tabla `Messages`.
- **FR-CHAT-003**: El sistema DEBE implementar una capa de moderación (vía Gemini Safety Settings o API de moderación externa) para cada mensaje.
- **FR-CHAT-004**: El chatbot DEBE ser capaz de "resumir" el historial previo si se alcanza el límite de tokens de contexto.
- **FR-CHAT-005**: El Roadmap DEBE ser secuencial; la tarea `N+1` solo se habilita tras completar la tarea `N`.
- **FR-CHAT-006**: Al completar una tarea, el sistema DEBE registrar la reflexión del estudiante.
- **FR-CHAT-007**: Si el estado de la sesión cambia a `paused` o `closed`, el área de texto del chat DEBE inhabilitarse instantáneamente.

### Enfoques Pedagógicos (Prompts)
- **Constructivista**: No da respuestas. Usa el método socrático. Fomenta el "aprender haciendo".
- **Cognitivista**: Ayuda a estructurar el pensamiento. Sugiere pasos lógicos. Se enfoca en la organización de la información.
- **Neutro**: Responde de forma directa y amable, sin un sesgo pedagógico específico.

### Entities & Data
- **ChatMessage**:
    - `id`, `student_session_id`, `role` (user/assistant), `content`, `is_flagged`, `metadata`.
- **StudentTaskProgress**:
    - `student_session_id`, `task_id`, `status` (pending, completed), `reflection_text`, `completed_at`.

## Success Criteria
- **SC-CHAT-001**: La respuesta de la IA debe comenzar a recibirse (streaming o completa) en menos de 3 segundos en condiciones normales.
- **SC-CHAT-002**: El 100% de los mensajes bloqueados por seguridad generan un registro en la tabla de `Alerts`.

## Edge Cases
- **Interrupción de Red**: El estudiante envía un mensaje y se cae el internet. *Resolución: Mostrar mensaje de "Reconectando..." y permitir reintentar el envío una vez recuperada la conexión.*
- **IA "Alucinando"**: La IA se sale del tema pedagógico. *Resolución: El prompt del sistema debe incluir instrucciones estrictas de "mantenerse siempre dentro del objetivo de la sesión".*
- **Reflexiones Vacías**: El estudiante intenta enviar la reflexión en blanco. *Resolución: Requerir al menos 10 caracteres o una selección de "Emoji de sentimiento" para proceder.*
