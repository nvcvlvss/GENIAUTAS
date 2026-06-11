# GENIAUTAS Design System: Sci-Fi HUD (Dark Soft UI Premium)
*Dirección Visual: Explorando el Universo de la IA a través de un Cockpit Aeroespacial*

Este documento define las especificaciones del sistema de diseño para **GENIAUTAS**, un laboratorio virtual de aula donde docentes crean y controlan sesiones en tiempo real, mientras estudiantes de 10 a 12 años ingresan sin registro formal para interactuar de forma segura y supervisada con un chatbot pedagógico.

La dirección visual se fundamenta en la metáfora de **"Exploración espacial guiada"**, convirtiendo el aprendizaje con IA en una aventura de descubrimiento científico dentro de un entorno inmersivo de consola táctica aeroespacial (cockpit).

---

## 1. Filosofía de Diseño y Metáfora Visual

### Metáfora: "El Cockpit del Geniauta"
* **Para el Estudiante**: La interfaz se asemeja al tablero de control (cockpit) de una nave exploradora. Cada tarea del roadmap es un sector espacial por mapear; el chatbot es el copiloto de IA de la misión, y el docente es el director de vuelo que supervisa y mantiene la comunicación desde el centro de control.
* **Para el Docente**: El panel representa una consola de telemetría y control de misión. Diseñado para ofrecer visibilidad instantánea, calma operativa y herramientas rápidas de mediación sin generar sobrecarga cognitiva ni estrés.

### Atributos Clave
* **Inmersión y Enfoque**: Fondos líquidos estelares profundos y texturas de instrumentación geométrica que favorecen la concentración y eliminan el deslumbramiento.
* **Control Pedagógico**: Estados de sesión (borrador, activa, pausada, cerrada) que actúan como semáforos de la misión.
* **Seguridad Silenciosa**: Filtros y alertas resguardan la convivencia digital en el aula sin alarmar al estudiante con tecnicismos.
* **Seriedad Táctica**: El diseño es tecnológico y moderno (pensado para nativos digitales de 10-12 años), pero evita caricaturas o mecánicas de juego competitivo que distraigan del fin didáctico.

---

## 2. Color System: Dark HUD

La paleta se aleja del negro plano y adopta un fondo estelar tridimensional con capas de mesh gradients, complementado por cristales oscuros translúcidos y brillos LED de alta visibilidad.

### Colores de Base y Superficies (Fondo y Estructura)
* **Space Deep (Fondo Base)**: `#020206` (Negro-azul profundo espacial).
* **Nebula Purple (Mesh Gradient)**: `rgba(139, 92, 246, 0.18)` (Púrpura estelar en focos radiales).
* **Orbital Cyan (Mesh Gradient)**: `rgba(56, 189, 248, 0.1)` (Cian de transmisión orbital).
* **Glass Panel Background**: `rgba(24, 25, 32, 0.65)` (Panel de vidrio oscuro traslúcido).
* **Border Slate (Bordes Estándar)**: `rgba(255, 255, 255, 0.04)` (Gris traslúcido para líneas de separación finas).
* **Border Active (Enfoque / Selección)**: `rgba(56, 189, 248, 0.3)` (Cian de activación).

### Colores Acento y Semánticos (Interactivos y Estados)
* **Nebula Cyan (Primario / Foco)**: `#38BDF8` (Cian brillante, color de acción principal y botones de avance).
* **Galaxy Gold (Logros / Progreso)**: `#F59E0B` (Dorado cálido, reservado para metas logradas e hitos).
* **Nova Lavender (Docente / Canales Privados)**: `#A78BFA` (Morado lavanda suave, identifica el chat privado y la telemetría docente).
* **Signal Emerald (Éxito / Activo)**: `#10B981` (Verde LED brillante para alumnos activos y aprobados).
* **Signal Amber (Pausa / Espera)**: `#F59E0B` (Naranja/Ámbar para advertencias de moderación y pausas de actividad).
* **Signal Coral (Riesgo / Alerta)**: `#EF4444` (Rojo fuego con resplandor para alertas de riesgo, solicitudes rechazadas y cierres).

---

## 3. Typography: Jerarquía de Misión

La tipografía unifica la cercanía infantil con la lectura fluida del chat y los paneles docentes.

* **Headline Font**: `Fredoka` (Google Fonts). De trazo redondeado y amigable, ideal para títulos principales, cabeceras y nombres de estudiantes.
* **Body Font**: `DM Sans` (Google Fonts). Geométrica y de excelente legibilidad en pantallas digitales, utilizada para textos largos, mensajes del chat e inputs.
* **Mono Font**: `Space Mono` (Google Fonts). Utilizada para códigos de sesión, contadores de progreso, identificadores de telemetría y logs.

### Escala de Texto
* **h1 (Títulos de Hito / Portada)**: Fredoka 36px bold, interlineado 1.2, tracking `-0.02em`.
* **h2 (Títulos de Panel Principal)**: Fredoka 28px bold, interlineado 1.25.
* **h3 (Títulos de Tarjeta / Formulario)**: Fredoka 22px semibold, interlineado 1.3.
* **h4 (Subtítulos / Secciones)**: Fredoka 18px semibold, interlineado 1.35.
* **body (Mensajes de Chat / Descripciones)**: DM Sans 16px regular, interlineado 1.55.
* **small (Labels de Input / Info Auxiliar)**: DM Sans 14px regular, interlineado 1.5.
* **tiny (Metadatos / Estados)**: DM Sans 12px medium, interlineado 1.4.
* **mono (Contadores / Códigos)**: Space Mono 13px regular, interlineado 1.6.

---

## 4. Componentes y Estilos Visuales

### Botones (Controls)
* **Primary (Nebula Cyan)**: Fondo `#38BDF8`, texto oscuro `#0F172A`, sin bordes duros. En hover aplica una pequeña escala (`scale-[1.02]`) y un brillo difuso suave.
* **Secondary (Outline)**: Fondo transparente, borde `1px solid rgba(56, 189, 248, 0.3)`, texto `#38BDF8`. En hover adquiere un fondo cian muy claro con baja opacidad.
* **Destructive**: Fondo `#EF4444`, texto blanco. Reservado para cierres y rechazos.
* **Radios**: Crisp pero suave: `rounded-lg` (`8px`) para todos los botones principales de interacción. Se evitan botones en píldora (`rounded-full`) para interfaces estructurales.

### Vidrio HUD (Glassmorphism de alta densidad)
* **Especificación `.panel-hud-glass`**:
  * Fondo: `rgba(24, 25, 32, 0.65)`
  * Desenfoque de Fondo: `backdrop-filter: blur(20px)`
  * Borde: `1.5px solid rgba(255, 255, 255, 0.04)`
  * Sombra Interna: `inset 0 1px 1px rgba(255, 255, 255, 0.03)`
  * Sombra Externa: `0 8px 32px rgba(0, 0, 0, 0.4)`
* **Corner Brackets (`.hud-corners`)**: Elemento de diseño que pinta soportes de mira telescópica cian en las esquinas de los sensores tácticos en la vista del docente.

### Textura de Instrumentación (`.dotted-grid`)
* **Especificación**: Micro-cuadrícula geométrica uniforme de puntos (`rgba(255, 255, 255, 0.02)`) con un tamaño de celda de `20px * 20px`, colocada sobre el degradado radial de fondo.

### Campos de Entrada (Inputs)
* Fondo `rgba(4, 4, 9, 0.5)` (integrado al fondo base), bordes `1px solid rgba(255, 255, 255, 0.06)`, radio de borde `8px` (`rounded-lg`), texto `#F8FAFC`.
* **Focus State**: Borde cambia a Nebula Cyan (`#38BDF8`) y se proyecta un halo difuso azul traslúcido.

### Burbujas de Chat (Chat View)
* **Estudiante**: Mensaje alineado a la derecha. Fondo `var(--color-primary)` (`#38BDF8`), texto oscuro `#0F172A`.
* **Bot Pedagógico**: Mensaje alineado a la izquierda. Fondo `#1E293B`, borde `#334155`, texto claro `#F8FAFC`.
* **Docente (Chat Directo)**: Burbujas destacadas sobre el panel con contraste óptimo (mínimo 4.5:1).
* **Mensajes de Sistema**: Centrados, sin burbuja prominente. Texto `#94A3B8`, borde fino si es de advertencia.

---

## 5. Patrones de Diseño de Pantalla (Layout)

### Bloqueo de Altura (Locked Viewport)
* La aplicación se comporta como un software nativo. La cabecera superior y la barra de entrada de texto están bloqueadas (`flex-none`), mientras que el historial de chat e instrumentación lateral cuentan con un scroll vertical interno independiente (`overflow-y-auto`).

### Vista del Estudiante (Foco y Exploración)
* **Diseño Limpio**: Layout libre de elementos de configuración o barras de navegación secundarias.
* **Estructura de Dos Columnas (Desktop)**:
  * **Columna Izquierda (Compacta)**: Chat directo con el docente (lavanda) para soporte inmediato en caso de dudas o bloqueos.
  * **Columna Central (Amplia)**: Chat interactivo con el chatbot e indicador superior de la tarea actual.
  * **Columna Derecha**: El Roadmap con el progreso de las tareas requeridas.

### Vista del Docente (Mando y Control)
* **Estructura de Tres Columnas (Escritorio)**:
  * **Columna Izquierda (Lista de Estudiantes)**: Lista compacta con avatares, estados de conexión (En línea / Desconectado) e indicador numérico de progreso (ej. 2/5 tareas).
  * **Columna Central (Modo Espejo)**: Monitoreo pasivo en tiempo real de la pantalla del estudiante seleccionado, visualizando la conversación exacta que sostiene con el bot.
  * **Columna Derecha (Chat de Ayuda y Control)**: Panel de Chat Directo para hablar directamente con el estudiante y el Copiloto de IA para solicitar asistencia pedagógica y recomendaciones ante incidentes.

---

## 6. Variables CSS Recomendadas (globals.css)

```css
:root {
  /* Dark HUD Color Palette */
  --color-bg: #020206;
  --color-bg-elevated: rgba(24, 25, 32, 0.65);
  --color-surface-1: rgba(10, 12, 22, 0.45);
  --color-surface-2: rgba(255, 255, 255, 0.04);
  --color-surface-3: rgba(255, 255, 255, 0.08);
  
  --color-primary: #38BDF8;
  --color-primary-strong: #0EA5E9;
  --color-progress: #F59E0B;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-info: #3B82F6;
  
  --color-text: #F8FAFC;
  --color-text-secondary: #CBD5E1;
  --color-text-tertiary: #94A3B8;
  
  --color-border: rgba(255, 255, 255, 0.04);
  --color-border-strong: rgba(255, 255, 255, 0.08);
  --color-overlay: rgba(4, 4, 9, 0.85);

  /* Typography */
  --font-heading: 'Fredoka', system-ui, sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'Space Mono', ui-monospace, monospace;

  /* Border Radii */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 9999px;

  /* Soft Shadows and Glows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.15);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.25);
  --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.35);
  
  --glow-primary-sm: 0 0 0 3px rgba(56, 189, 248, 0.15);
  --glow-primary-md: 0 0 12px rgba(56, 189, 248, 0.2);
  --glow-progress-sm: 0 0 12px rgba(245, 158, 11, 0.15);
}
```
