# 🚀 GENIAUTAS - Proyecto de Título

**Diseño e implementación de un recurso pedagógico para enseñar Prompt Engineering a niños en educación básica.**

Este repositorio centraliza el proyecto de titulación de **Nicolás Aránguiz Fritz** (1S2026) para la carrera de Ingeniería en Diseño de Productos de la Universidad Técnica Federico Santa María.

---

## 🎯 Propósito del Proyecto
GENIAUTAS es un laboratorio virtual diseñado para que estudiantes de **10 a 12 años** aprendan y practiquen *Prompt Engineering* mediante interacciones guiadas con chatbots pedagógicos supervisados por un docente.

El sistema aborda la **"Amnesia de Agencia"** y busca reducir la fricción operativa en el aula, permitiendo que la IA sea un andamiaje para el pensamiento crítico y no solo un generador de respuestas.

---

## 📂 Estructura del Repositorio

| Carpeta / Archivo | Descripción |
| :--- | :--- |
| `geniautas-app/` | **MVP Core:** Aplicación Next.js + Supabase. |
| `.specify/` | **Spec-Kit:** Especificaciones formales del desarrollo (Spec-Driven Dev). |
| `.cursor/plans/` | **Plan de Vuelo:** Bitácora de implementación generada por el Copilot. |
| `Paper-prototype/` | Prototipos de baja fidelidad y registros del taller inicial. |
| `GENIAUTAS-DESIGN.md` | **Design System:** Identidad visual (Misión Espacial), colores y tipografía. |
| `AGENTS.md` | Definición de los System Prompts (Pensabot, Construbot, Encuestabot). |

---

## 🛠️ Stack Tecnológico (MVP)
- **Frontend:** Next.js 15+ (App Router).
- **Backend/Auth:** Supabase.
- **IA Model:** Gemini 3.1 Pro (vía API).
- **Metodología:** Spec-Driven Development + Doble Diamante.

---

## 🎓 Metodología de Investigación
El proyecto articula la **Investigación-Acción Educativa** con el diseño de productos, permitiendo que los hallazgos empíricos del taller "¡IA en mi Colegio!" informen directamente la arquitectura del software.

---

## ⚡ Quick Start (Dev Mode)
1. Navega a la aplicación: `cd geniautas-app`
2. Instala dependencias: `npm install`
3. Configura tu `.env.local` con las llaves de Supabase y Gemini.
4. Inicia el laboratorio: `npm run dev`
