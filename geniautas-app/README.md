# GENIAUTAS 🚀
> Laboratorio virtual de aula para el aprendizaje de Prompt Engineering.

GENIAUTAS es una plataforma educativa diseñada para que docentes de educación básica (10-12 años) puedan guiar a sus estudiantes en el descubrimiento de la Inteligencia Artificial mediante desafíos prácticos y reflexión metacognitiva.

## 🌟 Características Principales

### Para Docentes 👨‍🏫
- **Gestión de Sesiones:** Crea laboratorios personalizados con objetivos pedagógicos claros.
- **Configuración de Agentes:** Elige entre diferentes enfoques pedagógicos (Constructivista, Cognitivista o Neutro).
- **Monitoreo en Tiempo Real:** Supervisa las conversaciones de los estudiantes con la IA y su progreso en las tareas.
- **Sistema de Alertas:** Notificaciones instantáneas sobre riesgos de seguridad o bloqueos de moderación.

### Para Estudiantes 🧒
- **Acceso Simple:** Ingreso mediante código de sesión y nombre, sin necesidad de cuentas personales.
- **Chat Educativo:** Interacción con un asistente IA que guía sin dar las respuestas directas.
- **Roadmap Interactivo:** Visualización clara de las tareas y seguimiento de avance.
- **Módulo de Metacognición:** Espacio de reflexión tras completar cada tarea para consolidar el aprendizaje.

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje:** TypeScript
- **Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL + Realtime)
- **IA Engine:** [Google Gemini 1.5 Flash](https://ai.google.dev/)
- **Estilos:** CSS Modules (Diseño responsivo y visualmente atractivo)
- **Iconos:** Lucide React

## 🏗️ Arquitectura de IA

El sistema utiliza prompts especializados según el modelo pedagógico seleccionado:
- **Construbot (Constructivista):** Usa preguntas socráticas para fomentar el descubrimiento.
- **Pensabot (Cognitivista):** Ayuda a estructurar planes y dividir problemas complejos.
- **Neutro:** Proporciona apoyo directo y ejemplos claros.

## 🚀 Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/nvcvlvss/GENIAUTAS.git
   cd GENIAUTAS/geniautas-app
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Variables de entorno:**
   Crea un archivo `.env.local` con las siguientes claves:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
   GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key_de_gemini
   ```

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## 🔒 Seguridad y Privacidad

- **Moderación de IA:** Filtros de entrada para prevenir el uso de lenguaje inapropiado.
- **Políticas RLS:** Aislamiento de datos mediante Row Level Security en Supabase para proteger la privacidad de las sesiones estudiantiles.
- **Sin Datos Sensibles:** El sistema está diseñado para no almacenar información de identificación personal de los menores.

---
Desarrollado como parte del Proyecto PE para el Taller de Título 2025.
