# Implementation Plan: MVP GENIAUTAS

**Branch**: `main` | **Date**: 2026-05-05 | **Spec**: [.specify/MVP-SPEC.md](.specify/MVP-SPEC.md)

## Summary
Este plan define la arquitectura técnica y la secuencia de construcción para el MVP de GENIAUTAS. Se prioriza una estructura de **Next.js (App Router)** con **Supabase** para persistencia y eventos en tiempo real, integrando **Google Gemini** como motor de IA pedagógica. La seguridad infantil se garantiza mediante RLS y una capa de moderación en el backend.

## Technical Context

**Language/Version**: TypeScript / Node.js 20+  
**Primary Dependencies**: 
- Next.js 14 (App Router)
- Supabase (supabase-js, ssr)
- Google Generative AI SDK (`@google/generative-ai`)
- Lucide React (Iconografía)
- CSS Modules (Estilizado Vanilla)
**Storage**: PostgreSQL (Supabase)  
**Testing**: Vitest (Unit/Integration), Playwright (E2E)  
**Target Platform**: Web (Desktop/Tablet optimizado)
**Project Type**: Fullstack Web Application (SaaS Educativo)  
**Performance Goals**: Latencia Realtime < 2s, Respuesta IA < 3s (stream inicial)  
**Constraints**: 
- Presupuesto bajo (Free Tier friendly)
- Sin cuentas para estudiantes (SessionStorage para reconexión rápida, reenlace vía docente para el resto).
- RLS estricto.
- Modelo: Gemini 1.5 Flash.
- Timeout de sesión: 4 horas de inactividad.
- Moderación: Lista negra de palabras (entrada) + Safety Settings (salida).

## Constitution Check

- **Seguridad**: ✅ RLS + Moderación en dos capas.
- **Simplicidad**: ✅ Stack monolítico (Next.js), sin microservicios.
- **Bajo Costo**: ✅ Gemini 1.5 Flash + Supabase Free Tier.
- **Privacidad**: ✅ SessionStorage para tokens temporales, sin persistencia invasiva.

## Identificación y Reconocimiento
- **Estudiantes**: Sin cuentas permanentes.
- **Reconexión Rápida**: `sessionStorage` guarda un token temporal para refrescos de página en la misma pestaña.
- **Reingreso**: Flujo de aprobación docente tras detectar coincidencia de (Nombre + Colegio + Curso).
- **Ambigüedad**: Diferenciación visual por Avatar e índice numérico interno (ej: Diego #2).

## Gestión de Datos
- **Escuelas y Cursos**: Selección vía dropdowns precargados para asegurar consistencia de datos.
- **Idioma**: 100% Español.

## System Prompts & Agentes Pedagógicos

Los prompts se almacenarán en `src/lib/ai/prompts.ts` y se inyectarán dinámicamente según la configuración de la sesión.

### 1. Construbot (Enfoque Constructivista)
- **Misión**: Ser un guía socrático.
- **Reglas**: 
    - NUNCA entregar la respuesta directa al problema.
    - Responder siempre con una pregunta que invite a la reflexión o un pequeño desafío.
    - Validar el proceso del estudiante antes que el resultado.
    - "Aprender haciendo": Sugerir experimentos o cambios en el prompt del estudiante.

### 2. Pensabot (Enfoque Cognitivista)
- **Misión**: Apoyar la estructuración y planificación.
- **Reglas**:
    - Ayudar al estudiante a dividir un problema complejo en pasos más simples.
    - Fomentar la creación de una "hoja de ruta" mental para la solución.
    - Explicar el "por qué" técnico de las cosas cuando el estudiante lo pregunte.
    - Enfocarse en la lógica y la organización de la información.

### 3. Neutro (Enfoque General)
- **Misión**: Ser un asistente útil, claro y directo.
- **Reglas**:
    - Responder de forma concisa y amable a las dudas del estudiante.
    - Proporcionar ejemplos directos si se solicitan.
    - Mantener un tono profesional pero cercano, adecuado para niños.
    - No aplicar una estrategia pedagógica de "pregunta por respuesta" obligatoria.

## Project Structure

```text
src/
├── app/                    # Next.js App Router (Pages & Layouts)
│   ├── (auth)/             # Login/Registro Docente
│   ├── (teacher)/          # Panel de Control, Sesiones, Monitoreo
│   ├── (student)/          # Ingreso, Sala de Espera, Laboratorio
│   └── api/                # Endpoints (Gemini Proxy, Webhooks)
├── components/             # Componentes Reutilizables
│   ├── ui/                 # Componentes base (Botones, Inputs)
│   ├── teacher/            # Componentes específicos del Docente
│   └── student/            # Componentes específicos del Docente
├── lib/                    # Lógica compartida, hooks, utilidades
│   ├── supabase/           # Cliente de base de datos
│   ├── ai/                 # Configuración de Agentes Gemini y Prompts
│   └── utils/              # Validaciones y formateo
├── styles/                 # CSS Modules Globales y variables
└── types/                  # Definiciones de TypeScript
supabase/
└── migrations/             # Esquemas de base de datos y políticas RLS
```

## Data Model (Phase 1)

### Tables
1. **profiles**: Perfiles de docentes (vinculados a `auth.users`).
2. **sessions**: Configuraciones de laboratorio (teacher_id, title, agent_type, objective, status).
3. **roadmap_tasks**: Definición de tareas de una sesión.
4. **access_requests**: Solicitudes de ingreso de estudiantes.
5. **student_sessions**: Identidades vinculadas a una sesión activa (student_name, avatar, session_id).
6. **messages**: Historial de chat (student_session_id, role, content, is_flagged).
7. **student_task_progress**: Estado de tareas por estudiante.
8. **alerts**: Registro de eventos de seguridad.

## Roadmap de Implementación (Slices)

### Slice 1: Infraestructura y Auth (Docente)
- Setup de proyecto Next.js + Supabase.
- Implementación de Auth para Docentes.
- Diseño base con CSS Modules.

### Slice 2: Gestión de Sesiones (CRUD + Estados)
- Creación de sesiones y definición de Roadmap.
- Máquina de estados (Draft -> Active -> Paused -> Closed).
- Generación de links de acceso para estudiantes.

### Slice 3: Acceso Estudiante y Sala de Espera
- Formulario de ingreso (sin cuenta).
- Lógica de `access_requests` y aprobación docente en tiempo real.
- Pantalla de espera interactiva.

### Slice 4: Laboratorio y Chat con IA
- Integración de Gemini con Prompts Pedagógicos (Construbot, Pensabot, Neutro).
- Interfaz de chat del estudiante con Streaming.
- Capa de moderación básica.

### Slice 5: Monitoreo y Roadmap en Vivo
- Panel docente con suscripción Realtime a mensajes y progreso.
- Marcado de tareas y modal de reflexión metacognitiva.
- Persistencia total para reanudación.

## Success Criteria
- **SC-TECH-001**: El sistema soporta 10 estudiantes concurrentes en una sesión sin pérdida de mensajes.
- **SC-TECH-002**: Las políticas RLS bloquean cualquier intento de un estudiante de leer chats de otros.
- **SC-TECH-003**: La IA respeta el rol pedagógico asignado en el 95% de las interacciones.

## Database Migration Log

### 2026-05-05: 000001_idempotent_schema_fixes
- **Cambio**: Transición a esquema idempotente (`IF NOT EXISTS`, `DO` blocks).
- **Motivo**: Permitir ejecuciones repetidas sin errores y facilitar la colaboración con agentes externos (Supabase AI).
- **Correcciones**: 
    - Se añadió la política RLS para permitir lectura pública de la tabla `schools` (necesaria para el formulario de sesiones).
    - Se implementó `ON CONFLICT` en la carga de datos iniciales.
    - Se normalizó el manejo de triggers y funciones (`CREATE OR REPLACE`).
