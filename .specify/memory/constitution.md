# CONSTITUCIÓN DEL PROYECTO GENIAUTAS

## PROPÓSITO
GENIAUTAS es una aplicación web educativa tipo laboratorio virtual para el aula. Su propósito es permitir que docentes y estudiantes de 10 a 12 años aprendan y practiquen prompt engineering mediante interacciones guiadas con chatbots de IA en sesiones pedagógicas controladas. El sistema debe apoyar el aprendizaje, la reflexión y la supervisión docente, manteniendo una experiencia simple, segura y de bajo costo para un MVP nivel universitario.

## ALCANCE
El alcance del MVP incluye:
- Creación y gestión de sesiones por parte del docente.
- Ingreso de estudiantes sin cuenta mediante nombre, apellido, colegio, curso y avatar.
- Interacción individual de cada estudiante con un chatbot pedagógico.
- Roadmap o lista de tareas visible para el estudiante.
- Monitoreo docente en tiempo real.
- Alertas de riesgo.
- Persistencia de sesiones para pausar y reanudar.
- Revisión posterior de chats e historial resumido.

El MVP no debe expandirse fuera de este alcance sin una nueva especificación formal. Quedan fuera del alcance inicial funciones como múltiples docentes por sesión, arquitecturas complejas, analíticas avanzadas no definidas, personalización abierta de agentes pedagógicos por parte del docente y cualquier funcionalidad que incremente significativamente el costo, la complejidad técnica o el riesgo de seguridad.

## PRINCIPIOS PEDAGÓGICOS
- El sistema debe promover alfabetización en prompt engineering en estudiantes de enseñanza básica mediante interacción guiada, reflexión y práctica progresiva.
- El chatbot no debe reemplazar el rol pedagógico del docente sino actuar como apoyo estructurado dentro de una experiencia diseñada y supervisada por una persona adulta responsable.
- Los agentes pedagógicos del sistema serán de tres tipos predefinidos: constructivista, cognitivista y neutro.
- **Constructivista:** Debe favorecer preguntas, reflexión y pensamiento crítico sin resolver directamente el problema.
- **Cognitivista:** Debe apoyar la planificación y estructuración de soluciones.
- **Neutro:** Debe ofrecer una interacción general sin sesgo pedagógico fuerte.
- El progreso del estudiante debe representarse mediante un roadmap secuencial de tareas u objetivos.
- El roadmap debe reforzar la metacognición, permitiendo que el estudiante confirme avances y reflexione sobre lo que hizo bien y lo que le costó más.
- El sistema debe privilegiar aprendizaje guiado, claridad, progresión paso a paso y validación secuencial de tareas.
- La experiencia del estudiante debe ser simple, clara y centrada en una única interacción principal: conversar con su chatbot y avanzar en su actividad.
- El estudiante solo puede ver su propio chat, su identidad visible y su propio roadmap.
- La experiencia del docente debe privilegiar control, supervisión y capacidad de revisión.
- El docente debe poder crear sesiones, definir objetivo y tareas, lanzar, pausar, reanudar y cerrar actividades, monitorear chats en tiempo real, recibir alertas, revisar historiales y reutilizar configuraciones previas.
- Cada sesión del MVP tendrá un máximo de 10 estudiantes y un máximo de 1 docente responsable.
- Las sesiones deben poder pausarse y reanudarse conservando configuración, historial y estado del roadmap.
- La persistencia debe estar orientada a continuidad pedagógica y trazabilidad mínima viable.

## PRINCIPIOS DE SEGURIDAD
- La seguridad infantil es un requisito estructural del proyecto y no una mejora opcional. Toda decisión funcional o técnica debe priorizar protección del estudiante, reducción de riesgo conversacional y supervisión docente.
- Moderación en dos capas:
    - **Capa de Entrada (Estudiante):** Lista de palabras prohibidas personalizada (lenguaje ofensivo, odio, violencia, autodaño, drogas).
    - **Capa de Salida (IA):** Safety Settings nativos de Gemini calibrados para filtrar contenido riesgoso.
- Si se detecta contenido riesgoso, el sistema debe proteger al estudiante, generar una alerta al docente y evitar mostrar contenido dañino.
- El estudiante no debe ver alertas internas del sistema. El docente sí debe poder ver el tipo de alerta y un extracto breve (máximo 100 caracteres) del contenido involucrado, con opción de ver el mensaje completo tras confirmación.
- Datos almacenados: Mínimo necesario. No se deben almacenar datos sensibles innecesarios.

## PRINCIPIOS TÉCNICOS
- **Stack Base:** Next.js (frontend/backend), Supabase (Postgres & Realtime), Gemini (IA), Vercel (Despliegue).
- **Modelo IA:** Gemini 1.5 Flash (priorizando velocidad y costo para el MVP).
- **Idioma:** Exclusivamente español (prompts, UI, respuestas).
- **Ciclo de Vida:** Cierre automático de sesión tras 4 horas de inactividad.
- Arquitectura simple y mantenible, compatible con bajo presupuesto.
- Priorizar soluciones simples antes que arquitecturas avanzadas.
- Evitar microservicios, infraestructuras distribuidas y capas innecesarias mientras el MVP no lo exija.
- Persistencia: Configuración de sesión, historial resumido, estado del roadmap y registro de alertas.
- Funcionalidades construidas considerando límites de costo, uso y contexto del modelo.
- Historial resumido periódicamente para reducir consumo de ventana de contexto.

## REGLAS DE TRABAJO
- Enfoque de **Spec-Driven Development**.
- Toda funcionalidad nueva debe comenzar con una especificación clara antes de escribir código.
- La constitución y el documento madre de especificaciones son la fuente de verdad.
- Desarrollo por vertical slices pequeños y verificables.
- Salida de asistentes de IA tratada como borrador revisable, no como fuente de verdad.
- Ninguna IA debe inventar funcionalidades, relajar restricciones de seguridad o modificar el alcance sin validación explita.
- Prioridad: Coherencia, seguridad, simplicidad y trazabilidad.
