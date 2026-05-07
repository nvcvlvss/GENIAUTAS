# Feature Specification: Reanudación de Sesión (Docente y Estudiante)

**Feature Branch**: `004-session-resume`  
**Created**: 2026-05-05  
**Status**: Draft  
**Reference**: [MVP-SPEC](../MVP-SPEC.md), [Session Management](001-session-management.md), [Student Access](002-student-access.md)

## User Scenarios & Testing

### User Story 1 - Docente: Reanudación de Actividad (Priority: P1)
**Description**: El docente retoma una sesión pausada para continuar la clase en otro momento, recuperando todo el contexto de supervisión.
**Why this priority**: Es vital para la logística escolar (clases que duran más de un bloque).
**Independent Test**: Cambiar el estado de una sesión de `paused` a `active` y verificar que el panel de monitoreo carga los chats previos de los estudiantes que ya habían participado.

**Acceptance Scenarios**:
1. **Given** una sesión en estado `paused`, **When** el docente presiona "Reanudar", **Then** el sistema valida que no haya otra sesión `active` para ese (Colegio, Curso) y cambia el estado a `active`.
2. **Given** la reanudación exitosa, **When** se abre el panel de monitoreo, **Then** el docente ve la lista de estudiantes "históricos" con sus respectivos progresos en el roadmap.

---

### User Story 2 - Estudiante: Reingreso y Recuperación de Historial (Priority: P1)
**Description**: El estudiante vuelve a entrar a una sesión reanudada y recupera su chat y progreso previo tras ser validado.
**Why this priority**: Evita la frustración de perder el trabajo realizado y mantiene la secuencia pedagógica.
**Independent Test**: Ingresar con el mismo nombre a una sesión reanudada y verificar que, tras la aprobación, aparece el historial de mensajes anteriores.

**Acceptance Scenarios**:
1. **Given** una sesión reanudada, **When** un estudiante ingresa con los mismos datos previos (Nombre, Apellido, Avatar), **Then** el sistema detecta la coincidencia y genera una solicitud de "Reingreso" para el docente.
2. **Given** una coincidencia aprobada por el docente, **When** el estudiante accede al laboratorio, **Then** visualiza sus mensajes anteriores y el estado de sus tareas tal como las dejó.

---

### User Story 3 - Docente: Resolución de Ambigüedades (Priority: P2)
**Description**: El docente gestiona casos donde la identidad del estudiante no es clara o requiere corrección.
**Why this priority**: Garantiza la integridad de los datos y evita que un estudiante acceda al chat de otro.
**Independent Test**: Rechazar un vínculo de identidad y verificar que el estudiante vuelve a la pantalla de ingreso.

**Acceptance Scenarios**:
1. **Given** una solicitud de reingreso donde hay dudas, **When** el docente rechaza el vínculo propuesto, **Then** el sistema ofrece la opción de "Tratar como estudiante nuevo" o "Rechazar acceso".
2. **Given** un vínculo realizado por error, **When** el docente selecciona "Revocar Vínculo", **Then** el estudiante es desconectado y devuelto al formulario de ingreso.

---

## Requirements

### Functional Requirements
- **FR-RES-001**: El sistema DEBE permitir reanudar únicamente sesiones en estado `paused`.
- **FR-RES-002**: El sistema DEBE aplicar la misma regla de unicidad de sesiones activas que en el lanzamiento inicial.
- **FR-RES-003**: La lógica de "Identity Matching" DEBE buscar coincidencias exactas de (Nombre + Apellido) dentro de la misma `session_id`.
- **FR-RES-004**: El sistema DEBE presentar al docente las solicitudes de reingreso distinguiendo entre "Estudiante Nuevo" y "Posible Reingreso" (con indicación de progreso previo).
- **FR-RES-005**: Al aprobar un reingreso, el sistema DEBE re-vincular el `auth_token` temporal del estudiante con el `student_session_id` existente.
- **FR-RES-006**: El sistema DEBE cargar el historial de mensajes (`Messages`) y progreso de tareas (`StudentTaskProgress`) al renderizar la vista del estudiante reingresado.
- **FR-RES-007**: El docente DEBE poder revocar un vínculo de estudiante en cualquier momento de la sesión activa.

### Lógica de Coincidencia de Identidad (Matching)
1.  **Filtro Primario**: Misma `session_id`.
2.  **Filtro Secundario**: Nombre y Apellido idénticos (case-insensitive, trim).
3.  **Filtro Terciario (Opcional)**: Mismo Avatar seleccionado.
4.  **Resultado**: 
    - Coincidencia Alta: Se sugiere vínculo al docente.
    - Sin coincidencia: Se trata como estudiante nuevo.
    - Ambigüedad (ej: dos "Juan Pérez"): El docente debe decidir manualmente.

### Entities & Data
- **StudentSession**: Actúa como el ancla de la persistencia entre pausas. Contiene el estado acumulado.
- **AccessRequest**: Se extiende con un campo `proposed_student_session_id` para manejar los reingresos.

## Success Criteria
- **SC-RES-001**: El 100% del historial conversacional se preserva y es legible tras la reanudación.
- **SC-RES-002**: El docente puede reanudar una sesión en menos de 5 segundos (incluyendo carga de historial resumido).

## Edge Cases
- **Cambio de Dispositivo**: El estudiante reingresa desde una tablet distinta. *Resolución: La lógica de nombre/apellido/colegio/curso debe ser suficiente para que el sistema lo reconozca y el docente lo apruebe.*
- **Sesión Expirada**: El docente intenta reanudar una sesión de hace 6 meses. *Resolución: El sistema debe permitirlo siempre que el estado sea `paused`, aunque puede advertir sobre el costo de tokens de contexto si el historial es muy largo.*
- **Nombre Similar pero no igual**: "Nico" vs "Nicolas". *Resolución: El sistema lo tratará como nuevo, pero el docente puede "Forzar Vínculo" manualmente si reconoce al estudiante.*
