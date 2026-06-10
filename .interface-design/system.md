# Design System: GENIAUTAS

## Direction and Feel

* **Personality**: Misión de Aprendizaje Guiada (calma, concentración, control pedagógico y exploración segura).
* **Foundation**: Cosmic dark (Mission Night `#0B1220` y Orbit Navy `#14213A`).
* **Tone**: Tecnológico, amable y limpio, adecuado para estudiantes de primaria (10 a 12 años) y de alta densidad para control docente.
* **Accessibility**: Relación de contraste WCAG 2.1 AA (>= 4.5:1) garantizada en texto y targets táctiles de al menos `44x44px`.

## Depth Strategy

* **Borders-only**: Delimitación estructural mediante bordes suaves de baja opacidad (`rgba(199, 210, 227, 0.14)`), evitando sombras pesadas o fragmentación de color.
* **Surface Elevation**:
  * Base: Mission Night `#0B1220` (`--color-bg`).
  * Elevado: Orbit Navy `#14213A` (`--color-bg-elevated`).
  * Surface 1 (Tarjetas/Paneles): `#1B2A44` (`--color-surface-1`).
  * Surface 2 (Inputs/Cards secundarias): `#243552` (`--color-surface-2`).

## Spacing and Radius

* **Spacing base unit**: `8px` (`--sp-1` to `--sp-8`).
* **Border Radius**:
  * Controles/Inputs: `var(--radius-md)` (12px).
  * Tarjetas/Paneles: `var(--radius-lg)` (18px).
  * Botones CTA: `var(--radius-pill)` (9999px) o `var(--radius-xl)` (24px).

## Component Patterns

### Buttons
* **Primary**: Fondo `--color-primary` (`#33C7D8`), texto `#0B1220`, radius pill, glow primario suave.
* **Secondary**: Transparente, borde/texto cian, hover suave.
* **Warning**: Fondo `--color-warning` (`#F2A93B`), texto `#0B1220`.
* **Destructive**: Fondo `--color-danger` (`#F26B6B`), texto blanco.

### Inputs and Selects
* **Background**: `--color-surface-2` (ligeramente más oscuro, inset).
* **Focus**: Borde `--color-primary` + `var(--glow-primary-sm)`.
* **Select**: Arrow de SVG personalizado, sin estilos nativos del OS.

### Chat bubbles
* **Student/User**: Fondo `--color-primary`, texto `#0b1220`, tail top-right, font size `body` (16px).
* **Bot/Assistant**: Fondo `--color-bg-elevated`, texto `--color-text`, tail top-left, borde suave, font size `body` (16px).

### Roadmap and Step Labels
* **Progress Steps**: Indicación explícita paso a paso ("Paso X de Y: Nombre del Paso") en la interfaz estudiantil.
* **Roadmap Items**: Estados pendientes (gris), en curso (borde cian y glow), completados (dorado/progreso con check).

### StarBorder Decoration
* **Dashboard Frame**: Limitado a elementos con `data-role="dashboard-frame"` o CTAs principales.
* **Motion**: No animado por defecto. Fallback automático a transiciones CSS nativas si se detecta `prefers-reduced-motion` (`animations-disabled-fallback`).
