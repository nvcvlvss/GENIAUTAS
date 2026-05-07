# GENIAUTAS Design System

## Overview

GENIAUTAS es un sistema de diseño para un laboratorio virtual de aula donde docentes crean, lanzan, pausan y reanudan sesiones, mientras estudiantes ingresan sin cuenta formal para trabajar con un chatbot pedagógico dentro de una experiencia segura y supervisada.[file:717][file:710][file:711][file:713][file:716]

La dirección visual conserva la metáfora espacial del diseño de referencia, pero cambia el foco desde una experiencia de logros y recompensas hacia una de exploración guiada, confianza, claridad y control pedagógico.[file:728][file:717]

El sistema debe funcionar para dos contextos principales: una vista docente orientada a monitoreo y control en tiempo real, y una vista estudiante orientada a concentración, chat y avance paso a paso.[file:717][file:710][file:713]

La experiencia debe sentirse amigable para niñas y niños de 10 a 12 años, pero sin parecer un juego puro; GENIAUTAS es un laboratorio guiado, no una app de entretenimiento.[file:717][file:713]

---

## Design Goals

- **Exploración guiada**: la interfaz debe invitar a experimentar con prompts, pero siempre dentro de una estructura visible de objetivos, tareas y progreso.[file:717][file:713]
- **Control docente visible**: el producto debe comunicar que el profesor diseña la actividad, la supervisa y puede intervenir cuando sea necesario.[file:717][file:710][file:713][file:716]
- **Claridad para estudiantes**: la vista del alumno debe priorizar pocas decisiones, lenguaje simple y feedback inmediato.[file:711][file:713]
- **Seguridad silenciosa**: la moderación y las alertas deben proteger la experiencia sin exponer al estudiante a mensajes técnicos o amenazantes.[file:717][file:713]
- **Continuidad de sesión**: el sistema debe reflejar con claridad los estados borrador, activa, pausada y cerrada, y soportar reingreso con recuperación de historial y progreso.[file:717][file:710][file:716]

---

## Visual Direction

StarChart usa un lenguaje espacial oscuro, brillos de recompensa y una estética de aventura infantil.[file:728] GENIAUTAS toma esa base, pero reduce el carácter de premio constante y lo reemplaza por una atmósfera de misión de aprendizaje con más calma, más legibilidad y más foco en la mediación del docente.[file:728][file:717][file:713]

### Brand Keywords

- Guiado
- Seguro
- Claro
- Curioso
- Escolar
- Tecnológico
- Amable

### Experience Split

| Contexto | Prioridad visual | Tono | Densidad |
|---|---|---|---|
| Estudiante | Chat, roadmap, continuidad | Calmado y simple [file:713] | Baja [file:711][file:713] |
| Docente | Supervisión, alertas, cambios de estado | Directo y accionable [file:710][file:716] | Media [file:717][file:710] |

---

## Color System

La paleta mantiene la base oscura espacial del archivo de referencia, pero cambia el púrpura brillante dominante por un sistema más sobrio, con cian como acción principal y dorado como refuerzo de avance.[file:728][file:717][file:713]

### Core Palette

- **Mission Night** `#0B1220`: fondo principal de la app.
- **Orbit Navy** `#14213A`: headers, sidebar docente y paneles principales.
- **Surface 1** `#1B2A44`: tarjetas, paneles de chat y contenedores elevados.
- **Surface 2** `#243552`: inputs, tarjetas secundarias y listas laterales.
- **Surface 3** `#314666`: hover, estados activos suaves y overlays internos.
- **Aurora Cyan** `#33C7D8`: color primario de interacción, foco y CTA.
- **Mission Gold** `#F5C451`: hitos, tareas completadas y highlights de progreso.
- **Soft Lime** `#78D17C`: éxito y aprobaciones.
- **Signal Amber** `#F2A93B`: espera, pausa y advertencias suaves.
- **Alert Coral** `#F26B6B`: errores, bloqueos y acciones destructivas.
- **Info Blue** `#60A5FA`: tips, ayudas y estados informativos.
- **Text Primary** `#F5F7FB`: texto principal.
- **Text Secondary** `#C7D2E3`: labels y texto secundario.
- **Text Tertiary** `#93A4BF`: placeholders y metadatos.

### Semantic Rules

- **Aurora Cyan** debe usarse para botones primarios, foco, selección y navegación activa.[file:711][file:710]
- **Mission Gold** debe reservarse para progreso y logro, para no diluir su valor visual.[file:728][file:713]
- **Alert Coral** debe usarse solo para errores reales, rechazos, revocaciones y cierres irreversibles.[file:711][file:716][file:713]
- La vista estudiante debe usar menos colores simultáneos que la vista docente, para no competir con el chat y el roadmap.[file:713]

---

## Typography

La tipografía del diseño original combina una headline amable con una sans legible.[file:728] Esa decisión sí encaja con GENIAUTAS, porque el producto necesita cercanía infantil sin sacrificar lectura continua en chat, formularios y paneles docentes.[file:717][file:711][file:713]

- **Headline Font**: Fredoka.
- **Body Font**: DM Sans.
- **Mono Font**: Space Mono.

### Type Scale

- **h1**: Fredoka 36px bold, 1.2 line height.
- **h2**: Fredoka 28px bold, 1.25 line height.
- **h3**: Fredoka 22px semibold, 1.3 line height.
- **h4**: Fredoka 18px semibold, 1.35 line height.
- **body**: DM Sans 16px regular, 1.55 line height.
- **small**: DM Sans 14px regular, 1.5 line height.
- **tiny**: DM Sans 12px medium, 1.4 line height.
- **mono**: Space Mono 13px regular, 1.6 line height.

### Usage Rules

- El contenido de chat del estudiante y del bot debe usar siempre `body`.[file:713]
- Los formularios de ingreso y creación de sesión deben usar labels en `small` semibold.[file:710][file:711]
- `mono` debe reservarse para timestamps, métricas y códigos de sesión.[file:717][file:710]
- El contenido principal de estudiante no debe bajar de 16px.[file:728][file:711][file:713]

---

## Spacing and Shape

Base unit: `8px`.[file:728]

- `sp-1`: 4px
- `sp-2`: 8px
- `sp-3`: 16px
- `sp-4`: 24px
- `sp-5`: 32px
- `sp-6`: 48px
- `sp-7`: 64px
- `sp-8`: 96px

### Border Radius

- `radius-sm`: 8px
- `radius-md`: 12px
- `radius-lg`: 18px
- `radius-xl`: 24px
- `radius-pill`: 9999px
- `radius-circle`: 50%

### Shape Rules

La interfaz debe sentirse redondeada y amigable, pero no inflada ni excesivamente juguetona.[file:728][file:717] Los radios grandes deben reservarse para paneles, tarjetas y botones principales, mientras inputs y badges mantienen una suavidad más contenida.[file:728][file:711]

---

## Elevation and Motion Cues

StarChart usa muchos glows como señal de recompensa.[file:728] En GENIAUTAS ese recurso debe moderarse para favorecer concentración y legibilidad, usando glow cian para acción, glow dorado para progreso y glow coral solo para error.[file:717][file:713]

### Elevation Tokens

- `shadow-space-sm`: `0 4px 12px rgba(0, 0, 0, 0.20)`
- `shadow-space-md`: `0 8px 24px rgba(0, 0, 0, 0.28)`
- `shadow-space-lg`: `0 16px 40px rgba(0, 0, 0, 0.34)`
- `glow-cyan-sm`: `0 0 0 3px rgba(51, 199, 216, 0.18), 0 0 16px rgba(51, 199, 216, 0.18)`
- `glow-cyan-md`: `0 0 0 3px rgba(51, 199, 216, 0.24), 0 0 24px rgba(51, 199, 216, 0.24)`
- `glow-gold-sm`: `0 0 16px rgba(245, 196, 81, 0.20)`
- `glow-gold-md`: `0 0 24px rgba(245, 196, 81, 0.28)`
- `glow-coral-sm`: `0 0 16px rgba(242, 107, 107, 0.22)`

### Motion Rules

- Las animaciones deben ayudar a entender estados de espera, aprobación, pausa y avance.[file:711][file:713][file:716]
- El mayor momento de refuerzo visual debe ocurrir al completar una tarea o al ingresar correctamente a la actividad, no en cada interacción menor.[file:728][file:713]
- Las alertas docentes no deben parpadear ni producir ansiedad visual.[file:717][file:713]

---

## CSS Tokens

Estos tokens están listos para usarse en Next.js con CSS Modules, Tailwind extendido o un archivo global como `app/globals.css`.[file:717]

```css
:root {
  /* Colors */
  --color-bg: #0B1220;
  --color-bg-elevated: #14213A;
  --color-surface-1: #1B2A44;
  --color-surface-2: #243552;
  --color-surface-3: #314666;
  --color-primary: #33C7D8;
  --color-primary-strong: #1FB4C7;
  --color-progress: #F5C451;
  --color-success: #78D17C;
  --color-warning: #F2A93B;
  --color-danger: #F26B6B;
  --color-info: #60A5FA;
  --color-text: #F5F7FB;
  --color-text-secondary: #C7D2E3;
  --color-text-tertiary: #93A4BF;
  --color-border: rgba(199, 210, 227, 0.14);
  --color-border-strong: rgba(199, 210, 227, 0.24);
  --color-overlay: rgba(11, 18, 32, 0.72);

  /* Typography */
  --font-heading: 'Fredoka', system-ui, sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'Space Mono', ui-monospace, monospace;

  --text-h1: 36px;
  --text-h2: 28px;
  --text-h3: 22px;
  --text-h4: 18px;
  --text-body: 16px;
  --text-small: 14px;
  --text-tiny: 12px;
  --text-mono: 13px;

  --line-h1: 1.2;
  --line-h2: 1.25;
  --line-h3: 1.3;
  --line-h4: 1.35;
  --line-body: 1.55;
  --line-small: 1.5;
  --line-tiny: 1.4;

  /* Spacing */
  --sp-1: 4px;
  --sp-2: 8px;
  --sp-3: 16px;
  --sp-4: 24px;
  --sp-5: 32px;
  --sp-6: 48px;
  --sp-7: 64px;
  --sp-8: 96px;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --radius-pill: 9999px;

  /* Shadow and glow */
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.20);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.28);
  --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.34);
  --glow-primary-sm: 0 0 0 3px rgba(51, 199, 216, 0.18), 0 0 16px rgba(51, 199, 216, 0.18);
  --glow-primary-md: 0 0 0 3px rgba(51, 199, 216, 0.24), 0 0 24px rgba(51, 199, 216, 0.24);
  --glow-progress-sm: 0 0 16px rgba(245, 196, 81, 0.20);
  --glow-progress-md: 0 0 24px rgba(245, 196, 81, 0.28);
  --glow-danger-sm: 0 0 16px rgba(242, 107, 107, 0.22);

  /* Layout */
  --container-student: 980px;
  --container-teacher: 1440px;
  --panel-sidebar: 320px;
  --panel-aside: 360px;
  --chat-max-width: 760px;

  /* Transitions */
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
  --transition-fast: 140ms var(--ease-standard);
  --transition-base: 220ms var(--ease-standard);
  --transition-slow: 320ms var(--ease-standard);
}
```

### Suggested Global Base

```css
html, body {
  margin: 0;
  padding: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: var(--line-body);
}

* {
  box-sizing: border-box;
}

button, input, textarea, select {
  font: inherit;
}

body {
  min-height: 100vh;
}
```

---

## Components

### Buttons

Los botones deben diferenciar con claridad acciones docentes, avance estudiantil y acciones críticas como rechazar, revocar o cerrar sesión.[file:710][file:711][file:716]

#### Variants

- **Primary**: fondo `--color-primary`, texto `--color-bg`, radius pill, glow primario en hover.
- **Secondary**: transparente, borde cian, texto cian, fondo suave cian en hover.
- **Ghost**: transparente, texto secundario, hover sobre `--color-surface-2`.
- **Success**: fondo `--color-success`, texto `--color-bg`.
- **Warning**: fondo `--color-warning`, texto `--color-bg`.
- **Destructive**: fondo `--color-danger`, texto blanco.

#### Sizing

- **sm**: 36px high, `14px` text, `10px 14px` padding.
- **md**: 44px high, `16px` text, `12px 18px` padding.
- **lg**: 52px high, `16px` text, `14px 24px` padding.

#### Product Mapping

- `Primary`: crear sesión, lanzar actividad, reanudar sesión, entrar, continuar.[file:710][file:711][file:716]
- `Success`: aprobar ingreso o validar enlace de identidad.[file:711][file:716]
- `Warning`: pausar, reintentar o dejar en espera.[file:710][file:713]
- `Destructive`: cerrar sesión, rechazar, desvincular, eliminar.[file:716][file:717]

### Cards

- **Session Card**: panel resumen de actividad, curso, agente y estado.[file:710][file:717]
- **Student Card**: participante en sidebar docente, con nombre, avatar y estado.[file:713]
- **Alert Card**: evento de moderación o riesgo visible solo al docente.[file:717][file:713]
- **Approval Card**: solicitud de ingreso o reingreso pendiente.[file:711][file:716]
- **Roadmap Card**: progreso por tareas del estudiante.[file:713]

#### Card Spec

```css
.card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.card--interactive:hover {
  border-color: var(--color-border-strong);
  transform: translateY(-1px);
  transition: border-color var(--transition-base), transform var(--transition-base);
}
```

### Inputs

El ingreso a sesión y la creación docente dependen de formularios simples, así que los inputs deben priorizar legibilidad, foco y validación clara.[file:710][file:711]

```css
.input {
  width: 100%;
  min-height: 44px;
  padding: 12px 16px;
  color: var(--color-text);
  background: var(--color-surface-2);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color var(--transition-base), box-shadow var(--transition-base), background var(--transition-base);
}

.input:hover {
  border-color: rgba(51, 199, 216, 0.24);
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: var(--glow-primary-sm);
}

.input[aria-invalid="true"] {
  border-color: var(--color-danger);
  box-shadow: var(--glow-danger-sm);
}
```

### Status Chips

GENIAUTAS necesita chips de estado claros porque trabaja con estados de sesión, solicitudes y progreso.[file:717][file:710][file:711][file:716]

| Estado | Fondo | Texto | Uso |
|---|---|---|---|
| Borrador | `rgba(96, 165, 250, 0.16)` | `#60A5FA` | Sesión configurada no lanzada [file:710][file:717] |
| Activa | `rgba(51, 199, 216, 0.18)` | `#33C7D8` | Sesión corriendo [file:710][file:713] |
| Pausada | `rgba(242, 169, 59, 0.18)` | `#F2A93B` | Actividad detenida temporalmente [file:713][file:716] |
| Cerrada | `rgba(147, 164, 191, 0.18)` | `#C7D2E3` | Sesión finalizada [file:717] |
| Pendiente | `rgba(245, 196, 81, 0.18)` | `#F5C451` | Solicitud esperando docente [file:711][file:716] |
| Aprobada | `rgba(120, 209, 124, 0.18)` | `#78D17C` | Acceso validado [file:711][file:716] |
| Rechazada | `rgba(242, 107, 107, 0.18)` | `#F26B6B` | Acceso denegado [file:711][file:716] |

### Chat

El chat es el centro de la experiencia estudiante, y también el objeto principal de monitoreo docente.[file:713][file:717]

#### Message Types

- **Student message**: alineado a la derecha, `Surface 2`, texto primario.
- **Bot message**: alineado a la izquierda, `Orbit Navy`, texto primario, indicador sutil del agente.[file:717][file:689][file:690]
- **System message**: franja informativa o warning para espera, pausa, reconexión o continuidad.[file:711][file:713]
- **Teacher-only signal**: no aparece en la UI estudiantil; se expresa como alerta externa o badge en el panel docente.[file:717][file:713]

#### Chat Spec

```css
.chatBubble {
  max-width: min(78%, 680px);
  padding: 14px 16px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.chatBubble--student {
  background: var(--color-surface-2);
  color: var(--color-text);
}

.chatBubble--bot {
  background: var(--color-bg-elevated);
  color: var(--color-text);
}

.chatBubble--system {
  background: rgba(96, 165, 250, 0.12);
  color: var(--color-text-secondary);
  border: 1px solid rgba(96, 165, 250, 0.18);
}
```

### Roadmap

Cada estudiante debe ver su avance y sus tareas, y el docente también debe poder interpretarlos y eventualmente revertir o corregir estados.[file:717][file:713]

#### Roadmap States

- **Pending**: icono lineal, texto secundario.
- **Current**: borde o glow cian, texto principal.
- **Completed**: dorado o verde suave, check visible.[file:713]
- **Blocked**: opacidad reducida.

#### Roadmap Spec

```css
.roadmapItem {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 12px;
  align-items: start;
}

.roadmapItem--current .roadmapMarker {
  background: var(--color-primary);
  box-shadow: var(--glow-primary-sm);
}

.roadmapItem--done .roadmapMarker {
  background: var(--color-progress);
  box-shadow: var(--glow-progress-sm);
}
```

### Avatars and Identity Linking

El ingreso y reingreso estudiantil usan nombre, colegio, curso y avatar como identidad ligera, por lo que el avatar no es decorativo; cumple una función de reconocimiento dentro del flujo.[file:711][file:716]

- Avatar en listas: `48px`.
- Avatar en selector: `64px`.
- Avatar en confirmación de identidad: `56px`.
- Estado seleccionado: borde cian + glow suave.

### Approval Queue

GENIAUTAS requiere una cola de aprobación para solicitudes nuevas y reingresos.[file:711][file:716] Cada ítem debe mostrar nombre, avatar, curso, coincidencia sugerida si existe y acciones rápidas: aprobar, rechazar, crear nuevo o vincular manualmente.[file:711][file:716]

### Alerts

Las alertas deben existir como componente exclusivo para la vista docente, porque el sistema registra riesgos de lenguaje o contenidos sensibles sin exponer esa lógica al estudiante.[file:717][file:713]

#### Alert Types

- **Risk Alert**: lenguaje inapropiado, violencia, autodaño u otras categorías de riesgo.[file:717]
- **Moderation Alert**: contenido bloqueado o salida reemplazada.[file:713][file:717]
- **Session Alert**: error técnico, cupo lleno, problema de realtime o pérdida de continuidad.[file:711][file:713][file:716]

---

## Layout Patterns

### Student Shell

La vista estudiante debe concentrarse en identidad, chat, roadmap y campo de entrada.[file:711][file:713]

```txt
Header compacto
Chat principal
Roadmap visible
Input fijo abajo
```

#### Rules

- Muy pocas acciones secundarias.[file:713]
- El roadmap puede ir al costado en desktop y debajo del chat en mobile.[file:713]
- El estado de sesión debe permanecer visible cuando la actividad esté activa, pausada o en espera.[file:711][file:713]

### Teacher Shell

La vista docente necesita trabajar como centro de control en vivo.[file:717][file:710][file:713][file:716]

```txt
Sidebar izquierda: estudiantes + solicitudes
Centro: chat monitoreado
Panel derecho: alertas + progreso + acciones de sesión
```

#### Rules

- El cambio entre estudiantes debe ser rápido.[file:713]
- Las acciones críticas deben estar siempre visibles: pausar, reanudar, cerrar, aprobar.[file:710][file:716]
- La UI debe soportar monitoreo sin sobresaturar la pantalla.[file:717][file:713]

---

## State Design

### Session States

Los estados principales del sistema son `borrador`, `activa`, `pausada`, `cerrada` y `eliminado`.[file:717] En la UI operativa diaria deben destacarse sobre todo borrador, activa, pausada y cerrada, ya que determinan si el estudiante puede entrar, continuar o reingresar.[file:710][file:711][file:713][file:716]

### Join and Rejoin States

Los flujos de ingreso y reingreso requieren estados claros como `pendiente`, `aprobada`, `rechazada`, `created_new_student` o `revoked` a nivel lógico.[file:717] La interfaz visible puede simplificarlos a **pendiente**, **aprobado**, **rechazado** y **volver a intentar**, manteniendo la complejidad técnica en backend.[file:711][file:716]

### Error and Empty States

- **No session active**: “Esperando que tu profesor inicie la actividad”.[file:711]
- **Session paused**: “La actividad fue pausada por tu profesor”.[file:713]
- **Session full**: mensaje breve y tranquilizador, con instrucción de esperar o avisar al profesor.[file:711]
- **Model failed**: “Hubo un problema al responder. Intenta nuevamente”.[file:713]
- **Pending approval**: pantalla de espera con feedback visual amable.[file:711][file:716]

---

## Recommended Next.js Mapping

Este sistema puede implementarse de forma limpia en Next.js con una división por dominio de interfaz, consistente con el MVP planteado para frontend unificado y backend liviano dentro del mismo proyecto.[file:717]

```txt
app/
  globals.css
  (teacher)/
    dashboard/
    session/[id]/
  (student)/
    join/
    wait/
    lab/[sessionId]/
components/
  ui/
    Button.tsx
    Card.tsx
    Input.tsx
    Chip.tsx
    Modal.tsx
  teacher/
    SessionCard.tsx
    StudentList.tsx
    ApprovalQueue.tsx
    AlertPanel.tsx
  student/
    ChatView.tsx
    Roadmap.tsx
    AvatarPicker.tsx
    WaitState.tsx
```

### Suggested Token Usage

- `globals.css`: variables, resets, semantic utility classes.
- `components/ui`: primitives reutilizables.
- `teacher/*`: patrones de control y monitoreo.[file:710][file:716]
- `student/*`: patrones de ingreso, espera y actividad.[file:711][file:713]

---

## Do's and Don'ts

1. **Do** usar la metáfora espacial como misión de aprendizaje, no como videojuego competitivo.[file:728][file:717]
2. **Do** mantener visible el rol del docente como guía, supervisor y mediador.[file:717][file:710][file:713]
3. **Do** reservar el dorado para progreso y logro.[file:728][file:713]
4. **Do** usar microcopy corto y concreto para estudiantes de 10 a 12 años.[file:711][file:713]
5. **Do** tratar aprobación, reingreso y recuperación de historial como flujos centrales del producto.[file:711][file:716]
6. **Don't** saturar la interfaz con púrpuras, neones o glow excesivo.[file:728][file:717]
7. **Don't** mostrar al estudiante mensajes técnicos de moderación o backend.[file:717][file:713]
8. **Don't** esconder el roadmap o el estado de sesión durante la actividad.[file:713]
9. **Don't** diseñar formularios largos o densos para estudiantes.[file:711]
10. **Don't** tratar la vista docente y la estudiantil como la misma pantalla con distintos colores.[file:717][file:710][file:713]

---

## Final Direction

GENIAUTAS debe verse como una misión de aprendizaje guiada: oscura pero amable, tecnológica pero escolar, lúdica pero segura, y siempre centrada en la relación entre estudiante, docente y chatbot pedagógico.[file:717][file:710][file:711][file:713][file:716]

El resultado buscado no es una interfaz “gamificada” en exceso, sino un laboratorio claro, memorable y operativo para el aula real.[file:728][file:717]
