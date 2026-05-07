# MVP Specification: GENIAUTAS - Laboratorio de Prompt Engineering

**Created**: 2026-05-05  
**Status**: Draft  
**Reference**: [Constitution](memory/constitution.md)

## User Scenarios & Testing

### User Story 1 - Docente: Configuración y Lanzamiento (Priority: P1)
**Description**: El docente prepara el entorno de aprendizaje definiendo objetivos, tareas y el enfoque pedagógico de la IA.
**Why this priority**: Es el punto de partida necesario para cualquier actividad en el aula.
**Independent Test**: Se puede verificar creando una sesión en la base de datos y confirmando que aparece como "Activa" para los estudiantes.

**Acceptance Scenarios**:
1. **Given** un docente autenticado, **When** completa el formulario de nueva sesión (objetivo, roadmap, tipo de agente), **Then** la sesión se guarda y se genera un código de acceso/link.
2. **Given** una sesión configurada, **When** el docente presiona "Lanzar", **Then** el estado de la sesión cambia a 'activa' y permite el ingreso de estudiantes.

---

### User Story 2 - Estudiante: Acceso e Identificación (Priority: P1)
**Description**: El estudiante se une a la sesión sin necesidad de crear una cuenta, proporcionando datos mínimos para ser identificado por el docente.
**Why this priority**: Permite el despliegue rápido en el aula sin fricción de registro.
**Independent Test**: Se puede verificar ingresando con un nombre y viendo que el docente lo visualiza en su panel de monitoreo.

**Acceptance Scenarios**:
1. **Given** una sesión activa, **When** el estudiante ingresa su nombre, apellido, colegio y curso, **Then** accede a la interfaz de chat personalizada.
2. **Given** un estudiante que reingresa tras una desconexión, **When** usa los mismos datos, **Then** recupera su historial de chat y progreso.

---

### User Story 3 - Estudiante: Interacción Pedagógica y Roadmap (Priority: P1)
**Description**: El estudiante conversa con la IA para resolver el desafío propuesto, siguiendo una secuencia de tareas visibles.
**Why this priority**: Es la funcionalidad núcleo de aprendizaje del proyecto.
**Independent Test**: Enviar un mensaje y recibir respuesta del agente Gemini con el estilo pedagógico seleccionado.

**Acceptance Scenarios**:
1. **Given** la interfaz de chat, **When** el estudiante envía un mensaje, **Then** el chatbot responde según el enfoque (Constructivista, Cognitivista o Neutro).
2. **Given** el roadmap de tareas, **When** el estudiante marca una tarea como "Completada", **Then** el estado de progreso se actualiza localmente y en el panel del docente.

---

### User Story 4 - Docente: Monitoreo en Tiempo Real (Priority: P2)
**Description**: El docente supervisa el avance de todos los estudiantes desde un panel centralizado.
**Why this priority**: Permite la gestión del aula y la intervención docente oportuna.
**Independent Test**: Abrir dos ventanas (docente y estudiante) y ver cómo el mensaje del estudiante aparece en el panel del docente vía Supabase Realtime.

**Acceptance Scenarios**:
1. **Given** el panel de monitoreo, **When** un estudiante envía un mensaje o marca una tarea, **Then** el docente ve la actualización instantáneamente.
2. **Given** la lista de estudiantes, **When** el docente hace clic en uno, **Then** se despliega el historial completo de la conversación de ese estudiante.

---

### User Story 5 - Seguridad: Moderación y Alertas (Priority: P1)
**Description**: El sistema protege al estudiante de contenido inadecuado y alerta al docente sobre comportamientos riesgosos.
**Why this priority**: Requisito estructural de seguridad infantil definido en la constitución.
**Independent Test**: Simular un mensaje prohibido y verificar que el estudiante recibe un mensaje de bloqueo/redirección y el docente recibe una notificación.

**Acceptance Scenarios**:
1. **Given** un mensaje del estudiante, **Before** enviarlo a Gemini, **When** el filtro de seguridad detecta contenido prohibido, **Then** el mensaje no se envía y se genera una alerta.
2. **Given** una respuesta de Gemini, **Before** mostrarla al estudiante, **When** los safety settings detectan riesgo, **Then** se muestra un mensaje predefinido de "respuesta no disponible".

---

## Requirements

### Functional Requirements
- **FR-001**: El sistema DEBE permitir al docente autenticarse (vía Supabase Auth).
- **FR-002**: El sistema DEBE permitir la creación de sesiones con: Título, Objetivo, Tipo de Agente (Constructivista, Cognitivista, Neutro) y Lista de Tareas (Roadmap).
- **FR-003**: El sistema DEBE permitir el ingreso de estudiantes sin cuenta mediante formulario de identificación.
- **FR-004**: El sistema DEBE integrar la API de Google Gemini para las respuestas de la IA.
- **FR-005**: El sistema DEBE aplicar prompts de sistema (System Instructions) específicos para cada tipo de agente.
- **FR-006**: El sistema DEBE usar Supabase Realtime para actualizar el panel de monitoreo docente.
- **FR-007**: El sistema DEBE permitir al docente pausar, reanudar y cerrar sesiones.
- **FR-008**: El sistema DEBE persistir el historial de chats y el estado del roadmap en Postgres.
- **FR-009**: El sistema DEBE resumir el historial del chat cuando exceda un límite de tokens para mantener la eficiencia del contexto.
- **FR-010**: El sistema DEBE implementar una capa de validación de seguridad (moderación) para inputs y outputs.

### Key Entities
- **User (Docente)**: Usuario autenticado responsable de las sesiones.
- **Session**: Entidad principal que agrupa una actividad, su configuración y sus participantes.
- **Student**: Identidad temporal dentro de una sesión (sin cuenta global).
- **ChatMessage**: Registro de interacción (emisor, contenido, timestamp, flag de seguridad).
- **RoadmapTask**: Tarea individual dentro de una sesión y su estado de cumplimiento por estudiante.
- **Alert**: Registro de evento de seguridad detectado.

## Success Criteria

### Measurable Outcomes
- **SC-001**: El docente puede lanzar una sesión configurada en menos de 1 minuto.
- **SC-002**: El panel de monitoreo refleja mensajes de estudiantes con una latencia < 2 segundos (vía Realtime).
- **SC-003**: El 100% de los mensajes que violen las políticas de seguridad son bloqueados o alertados.
- **SC-004**: Los estudiantes pueden reanudar su sesión y ver su historial previo tras refrescar el navegador.

## Assumptions
- Los docentes tienen acceso a una cuenta institucional o personal permitida.
- Los estudiantes cuentan con dispositivos con conexión a internet estable en el aula.
- El uso de la API de Gemini se mantiene dentro de los límites del nivel gratuito o presupuesto asignado para el MVP.
- El despliegue inicial es en entorno web (desktop/tablet optimizado).
