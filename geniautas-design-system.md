# GENIAUTAS Design System: Dark Soft UI
*Dirección Visual: Explorando el Universo de la IA*

Este documento define las especificaciones del sistema de diseño para **GENIAUTAS**, un laboratorio virtual de aula donde docentes crean y controlan sesiones en tiempo real, mientras estudiantes de 10 a 12 años ingresan sin registro formal para interactuar de forma segura y supervisada con un chatbot pedagógico.

La dirección visual se fundamenta en la metáfora de **"Exploración espacial guiada"**, convirtiendo el aprendizaje con IA en una aventura de descubrimiento científico dentro de un entorno controlado, amigable y seguro.

---

## 1. Filosofía de Diseño y Metáfora Visual

### Metáfora: "El Cockpit del Geniauta"
* **Para el Estudiante**: La interfaz se asemeja al tablero de control (cockpit) de una nave exploradora. Cada tarea del roadmap es un sector espacial por mapear; el chatbot es el copiloto de IA de la misión, y el docente es el director de vuelo que supervisa y mantiene la comunicación desde el centro de control.
* **Para el Docente**: El panel representa una consola de telemetría y control de misión. Diseñado para ofrecer visibilidad instantánea, calma operativa y herramientas rápidas de mediación sin generar sobrecarga cognitiva ni estrés.

### Atributos Clave
* **Exploración Activa**: Fomenta la curiosidad, el diálogo y el ensayo y error con prompts estructurados.
* **Control Pedagógico**: Los estados de sesión (borrador, activa, pausada, cerrada) actúan como semáforos de misión.
* **Seguridad Silenciosa**: Filtros y alertas resguardan la convivencia digital en el aula sin alarmar al estudiante con tecnicismos.
* **Seriedad Amigable**: El diseño es tecnológico, inmersivo y moderno (pensado para nativos digitales de 10-12 años), pero evita caricaturas o mecánicas de juego competitivo que distraigan del fin didáctico.

---

## 2. Color System: Dark Soft UI

La paleta se aleja del negro absoluto (`#000000`) y de los colores saturados estridentes, adoptando tonos oscuros profundos pero suavizados (azules noche, grisáceos y pizarras) complementados por sutiles resplandores translúcidos y acentos semánticos de alta legibilidad.

### Colores de Base y Superficies (Fondo y Estructura)
* **Space Deep (Fondo Base)**: `#0F172A` (Azul noche oscuro, descansado para la vista).
* **Control Dark (Cabeceras y Barras)**: `#1E293B` (Gris pizarra azulado, brinda estructura).
* **Soft Panel (Tarjetas y Contenedores)**: `#1E293B` / `#334155` (Superficies elevadas con bordes suaves).
* **Border Slate (Bordes Estándar)**: `rgba(148, 163, 184, 0.12)` (Gris traslúcido para líneas de separación finas).
* **Border Active (Enfoque / Selección)**: `rgba(51, 199, 216, 0.4)` (Cian traslúcido).

### Colores Acento y Semánticos (Interactivos y Estados)
* **Nebula Cyan (Primario / Foco)**: `#38BDF8` (Cian brillante, color de acción principal y botones de avance).
* **Galaxy Gold (Logros / Progreso)**: `#F59E0B` (Dorado cálido, reservado para metas logradas e hitos).
* **Nova Lavender (Docente / Canales Privados)**: `#A78BFA` (Morado lavanda suave, identifica el chat privado y la telemetría docente).
* **Signal Emerald (Éxito / Aprobado)**: `#10B981` (Verde suave para accesos aprobados y estados en línea).
* **Signal Amber (Pausa / Espera)**: `#F59E0B` (Naranja/Ámbar para advertencias de moderación y pausas de actividad).
* **Signal Coral (Riesgo / Cierre)**: `#EF4444` (Rojo coral para alertas de riesgo, solicitudes rechazadas y cierres).

---

## 3. Typography: Jerarquía de Misión

La tipografía unifica la cercanía infantil con la lectura fluida del chat y los paneles docentes.

* **Headline Font**: `Fredoka` (Google Fonts). De trazo redondeado y amigable, ideal para títulos principales, cabeceras y nombres de estudiantes.
* **Body Font**: `DM Sans` (Google Fonts). Geométrica y de excelente legibilidad en pantallas digitales, utilizada para textos largos, mensajes del chat e inputs.
* **Mono Font**: `Space Mono` (Google Fonts). Utilizada con moderación para códigos de sesión, contadores de progreso y metadatos de telemetría.

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

### Tarjetas (Cards)
* **Estilo Soft UI**: Fondo `#1E293B`, bordes finos de `1px solid rgba(148, 163, 184, 0.12)`.
* **Efecto Hover Interactivo**: Desplazamiento sutil de `translateY(-2px)` y cambio de borde a `rgba(148, 163, 184, 0.25)` con sombra difusa de baja opacidad (`0.08`).

### Campos de Entrada (Inputs)
* Fondo `#0F172A` (integrado al fondo base), bordes `1px solid rgba(148, 163, 184, 0.2)`, radio de borde `8px` (`rounded-lg`), texto `#F8FAFC`.
* **Focus State**: Borde cambia a Nebula Cyan (`#38BDF8`) y se proyecta un halo difuso azul traslúcido.

### Burbujas de Chat (Chat View)
* **Estudiante**: Mensaje alineado a la derecha. Fondo `var(--color-primary)` (`#38BDF8`), texto oscuro `#0F172A`.
* **Bot Pedagógico**: Mensaje alineado a la izquierda. Fondo `#1E293B`, borde `#334155`, texto claro `#F8FAFC`.
* **Docente (Chat Directo)**: Fondo lavanda claro `#F4F0FA`, borde `#E0D5ED`, texto oscuro `#111111` (en la vista del alumno) o burbujas destacadas sobre el panel blanco para asegurar el contraste.
* **Mensajes de Sistema**: Centrados, sin burbuja prominente. Texto `#94A3B8`, borde fino si es de advertencia.

### Roadmap de Tareas (Roadmap)
* Cada tarea se representa como una estación espacial conectada por un vector lineal.
* **Pendiente**: Icono con borde gris, texto secundario.
* **Actual / En Curso**: Indicador circular cian con animación de pulso sutil (`ping` de baja frecuencia).
* **Completado**: Circulo en Galaxy Gold (`#F59E0B`) con un check mark, denotando el logro del hito.

---

## 5. Patrones de Diseño de Pantalla (Layout)

### Vista del Estudiante (Foco y Exploración)
* **Diseño Limpio**: Layout libre de elementos de configuración o barras de navegación secundarias.
* **Estructura de Dos Columnas (Desktop)**:
  * **Columna Izquierda (Compacta)**: Chat directo con el docente (lavanda) para soporte inmediato en caso de dudas o bloqueos.
  * **Columna Central (Amplia)**: Chat interactivo con el chatbot e indicador superior de la tarea actual.
  * **Columna Derecha**: El Roadmap con el progreso de las tareas requeridas.
* **Layout Móvil**: Adaptado para colapsar la columna de chat docente y el roadmap en pestañas inferiores flotantes, permitiendo que el área de chat de la IA sea el foco principal.

### Vista del Docente (Mando y Control)
* **Estructura de Tres Columnas (Escritorio)**:
  * **Columna Izquierda (Lista de Estudiantes)**: Lista compacta con avatares, estados de conexión (En línea / Desconectado) e indicador numérico de progreso (ej. 2/5 tareas).
  * **Columna Central (Modo Espejo)**: Monitoreo pasivo en tiempo real de la pantalla del estudiante seleccionado, visualizando la conversación exacta que sostiene con el bot.
  * **Columna Derecha (Chat de Ayuda y Control)**: Panel de Chat Directo para hablar directamente con el estudiante y el Copiloto de IA para solicitar asistencia pedagógica y recomendaciones ante incidentes.

---

## 6. Variables CSS Recomendadas (globals.css)

```css
:root {
  /* Dark Soft UI Color Palette */
  --color-bg: #0F172A;
  --color-bg-elevated: #1E293B;
  --color-surface-1: #1E293B;
  --color-surface-2: #334155;
  --color-surface-3: #475569;
  
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
  
  --color-border: rgba(148, 163, 184, 0.12);
  --color-border-strong: rgba(148, 163, 184, 0.25);
  --color-overlay: rgba(15, 23, 42, 0.75);

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
