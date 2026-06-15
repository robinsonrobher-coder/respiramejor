# Rediseño Atmen — Editorial Pulmonar v3 (mobile-first) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar las 3 páginas indexables (`/`, `/sobre-el-doctor/`, `/preguntas-frecuentes/`) según el spec `2026-05-27-rediseno-editorial-pulmonar.md`, reduciendo el scroll de la landing ~40% sin perder contenido, sin romper compliance, y con mobile-first como vertebra.

**Architecture:** Sitio static HTML + CSS vanilla + JS vanilla. Sin framework. Se añade `css/signature.css` (efectos signature de Atmen aislados) y 3 archivos JS (`agendar-menu.js`, `switcher.js`, `testimonials-wall.js`) cada uno <2 KB cargados con `defer`. `css/premium.css` recibe refactor profundo. `css/tokens.css` recibe extensión sin breaking changes a tokens existentes.

**Tech Stack:** HTML5 semántico · CSS (custom properties, grid, container queries donde aplique, `@media (prefers-reduced-motion)`, `@media (pointer: coarse)`) · JS vanilla (sin dependencias) · Google Fonts (Inter + Fraunces italic axis only) · SVG inline data-URI para signature elements.

**Verification model:** Este codebase no tiene test runner. La validación de cada tarea es **visual + a11y** vía `mcp__Claude_Preview__preview_*` (screenshot, snapshot, inspect, resize) en breakpoints **mobile 375** y **desktop 1280**, más verificación de `prefers-reduced-motion: reduce` donde aplique. Donde un step diga "Verify", ejecutar las preview tools y reportar lo observado.

**Reference durante implementación:** Cuando se requiera decisión a nivel componente (animaciones, microinteracciones, patrones de bottom-sheet, marquee best practices), consultar la skill `ui-ux-pro-max` antes de implementar.

**Spec:** `docs/superpowers/specs/2026-05-27-rediseno-editorial-pulmonar.md`

---

## File Structure

**New files:**
- `css/signature.css` — Atmen signature visual elements aislados (flow-volume loops, underline cursivo, breath pulse, condition pills hot, dot pulse del kicker).
- `js/agendar-menu.js` — Open/close del dropdown agendar + bottom-sheet mobile + keyboard + ESC + click-outside.
- `js/switcher.js` — Tabs/accordion del índice de padecimientos. Desktop: ARIA tabs; mobile: `<details>` con "solo uno abierto".
- `js/testimonials-wall.js` — Pause-on-hover, click-to-expand, IntersectionObserver pause off-viewport, respeta `prefers-reduced-motion`.

**Modified files:**
- `css/tokens.css` — Añadir tokens editoriales (`--cream`, `--paper-warm`, `--line-soft`, `--font-sans-editorial`). Cambiar `--font-sans` a Inter manteniendo `Plus Jakarta Sans` como fallback (transición segura). Mantener todos los tokens existentes.
- `css/site.css` — Actualizar import de Google Fonts (Inter + Fraunces italic). Refactor `body { font-family }` a Inter. FAB WhatsApp queda igual.
- `css/premium.css` — Refactor profundo. Eliminar: `.portrait-pro` triple-ring conic, `.headline-pro` shimmer, `.cta-aurora` conic spin, `.mesh-gradient` heavy, `.bento--12` (sustituido por switcher). Añadir: `.hero-split`, `.hero-left/right`, `.agendar-btn` + `.agendar-menu` + `.agendar-sheet`, `.switcher` + `.sw-index/detail/item`, `.splits-2up`, `.wall` + `.marquee-row` + `.tcard`, `.faq-accordion`.
- `index.html` — Reestructurar el body completo manteniendo `<head>` y compliance (top-bar-legal + footer-compliance) intactos.
- `sobre-el-doctor/index.html` — Adoptar nueva tipografía, nueva nav, nuevo agendar-menu, footer-compliance idéntico.
- `preguntas-frecuentes/index.html` — Adoptar nueva tipografía, nueva nav, mismo agendar-menu, sus 21 Q&A pueden quedar en su accordion actual con styling actualizado.

**Out of scope (intocable / segunda pasada):**
- `aviso-de-privacidad/index.html`, `informacion-regulatoria/index.html`, `contacto/index.html`, `404.html`.
- Schema JSON-LD (mantener idéntico).
- `top-bar-legal` y `footer-compliance` contenido (solo cambia tipografía vía cascada).

---

## Conventions

**Commits:** `<tipo>(<área>): <descripción>` con co-author Claude Opus 4.7 (1M context). Ej: `refactor(css): tokens editoriales sin breaking`. Tipo: `setup`, `refactor`, `feat`, `style`, `verify`, `fix`, `polish`.

**Preview server:** `mcp__Claude_Preview__preview_start` con name `atmen-static` (ya configurado en `.claude/launch.json`, puerto 8765). Si está corriendo, se reutiliza.

**Mobile-first:** Cada tarea visual se verifica primero en **375×812** y después en **1280×800**. Los selectores `@media (min-width: …)` son enhancements; los estilos base sirven mobile.

**Branch:** trabajar en `main`. El sitio aún no es público.

---

## Task 1: Tokens editoriales + Google Fonts switch

**Files:**
- Modify: `css/tokens.css`
- Modify: `css/site.css`
- Modify: `index.html` (link de Google Fonts en `<head>`)
- Modify: `sobre-el-doctor/index.html` (link)
- Modify: `preguntas-frecuentes/index.html` (link)

- [ ] **Step 1: Añadir tokens editoriales a `css/tokens.css`**

Justo después del bloque `/* === Neutros === */`, añadir:

```css
  /* === Editoriales (rediseño v3) === */
  --cream:        #fbf9f3;  /* fondo editorial cálido */
  --paper-warm:   #f7f4ec;  /* fondo de secciones tipo revista */
  --line-soft:    #e6e3d8;  /* hairline editorial */
  --muted:        var(--ink-muted);
```

En el bloque `/* === Tipografía === */` actualizar:

```css
  --font-sans:    "Inter", "Plus Jakarta Sans", -apple-system, system-ui, "Segoe UI", Roboto, sans-serif;
  --font-display: "Inter", "Plus Jakarta Sans", system-ui, sans-serif;  /* headlines bold */
  --font-serif:   "Fraunces", Georgia, "Times New Roman", serif;        /* solo italic em */
```

- [ ] **Step 2: Actualizar link de Google Fonts en los 3 HTMLs**

Buscar el `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?…">` en `index.html`, `sobre-el-doctor/index.html`, `preguntas-frecuentes/index.html` y reemplazar el `href` por:

```
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,500&family=Inter:wght@400;500;600;700;800&display=swap
```

Asegurar que los `<link rel="preconnect">` a `fonts.googleapis.com` y `fonts.gstatic.com crossorigin` estén presentes.

- [ ] **Step 3: Verify visualmente que el cambio de tipografía no rompe layout actual**

Run:
```
mcp__Claude_Preview__preview_start name=atmen-static
mcp__Claude_Preview__preview_eval expression="window.location.href = 'http://localhost:8765/'"
mcp__Claude_Preview__preview_resize preset=mobile
mcp__Claude_Preview__preview_screenshot
mcp__Claude_Preview__preview_resize preset=desktop
mcp__Claude_Preview__preview_screenshot
```

Expected: el sitio se ve igual estructuralmente pero con Inter como fuente body (en lugar de Plus Jakarta Sans). El italic en `evidencia` ahora es Fraunces. No hay layout shifts visibles.

- [ ] **Step 4: Commit**

```
git add css/tokens.css css/site.css index.html sobre-el-doctor/index.html preguntas-frecuentes/index.html
git commit -m "setup(typography): switch a Inter + Fraunces italic axis only

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Crear `css/signature.css` con los 4 elementos signature

**Files:**
- Create: `css/signature.css`
- Modify: `index.html`, `sobre-el-doctor/index.html`, `preguntas-frecuentes/index.html` (añadir `<link>`)

- [ ] **Step 1: Crear `css/signature.css`**

```css
/* =========================================================
   Atmen — Signature visual elements
   Aislados para auditoría/iteración. NO contienen layout.
   ========================================================= */

/* --- 1. Underline cursivo SVG verde leaf bajo <em> en headlines --- */
.signature-underline em,
.headline em,
h1 em.atmen-em {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 500;
  color: var(--sea);
  position: relative;
  padding: 0 2px;
}
.signature-underline em::after,
.headline em::after,
h1 em.atmen-em::after {
  content: "";
  position: absolute;
  left: -2px; right: -2px; bottom: -4px;
  height: 9px;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 10' preserveAspectRatio='none'><path d='M2 6 Q50 1 100 5 T198 5' fill='none' stroke='%2306a77d' stroke-width='2.5' stroke-linecap='round'/></svg>") no-repeat center / 100% 100%;
}

/* --- 2. Dot pulse del kicker (badge superior del hero) --- */
.atmen-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--ocean);
}
.atmen-kicker::before {
  content: "";
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--leaf);
  box-shadow: 0 0 0 4px rgba(6, 167, 125, 0.18);
  animation: atmen-pulse 2.4s ease-in-out infinite;
}
@keyframes atmen-pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(6,167,125,0.18); }
  50%      { box-shadow: 0 0 0 8px rgba(6,167,125,0.05); }
}

/* --- 3. Flow-volume loop SVG (signature del hero) --- */
.atmen-flow-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.5;
  background:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' preserveAspectRatio='none'><g fill='none' stroke='%2306a77d' stroke-width='1' opacity='0.22'><path d='M40 320 Q70 110 160 80 Q230 60 320 95 Q420 130 500 210 Q540 270 480 320 Q400 340 300 330 Q180 320 40 320 Z'/><path d='M60 310 Q90 150 180 120 Q250 105 330 135 Q410 165 480 230 Q510 270 460 310 Q380 325 290 320 Q170 315 60 310'/></g></svg>")
    no-repeat bottom right / 90% auto;
}

/* --- 4. Breath pulse (icono ECG sutil) — mantenido del actual --- */
.atmen-breath {
  width: 28px; height: 28px;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path d='M2 16 L8 16 L11 8 L14 24 L17 12 L20 18 L24 16 L30 16' fill='none' stroke='%2306a77d' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>") no-repeat center / contain;
  opacity: 0.7;
  animation: atmen-breath 3.5s ease-in-out infinite;
}
@keyframes atmen-breath {
  0%, 100% { transform: scale(1);   opacity: 0.7; }
  50%      { transform: scale(1.08); opacity: 1;   }
}

/* --- Reduced motion: detener todas las animaciones signature --- */
@media (prefers-reduced-motion: reduce) {
  .atmen-kicker::before,
  .atmen-breath {
    animation: none !important;
  }
}
```

- [ ] **Step 2: Añadir `<link>` a los 3 HTMLs indexables**

En `index.html`, `sobre-el-doctor/index.html`, `preguntas-frecuentes/index.html`, después del link a `premium.css`, añadir:

```html
<link rel="stylesheet" href="<RUTA_RELATIVA>/css/signature.css">
```

Donde `<RUTA_RELATIVA>` es `./` para index, `../` para sobre-el-doctor e indices anidados.

- [ ] **Step 3: Verify carga sin errores**

Run: `mcp__Claude_Preview__preview_eval expression="document.styleSheets.length"` — confirmar que aumentó en 1 y que no hay errores de carga en consola.

Run: `mcp__Claude_Preview__preview_console_logs` — esperado: sin errores 404 ni de parsing CSS.

- [ ] **Step 4: Commit**

```
git add css/signature.css index.html sobre-el-doctor/index.html preguntas-frecuentes/index.html
git commit -m "feat(signature): aislar elementos signature Atmen en css/signature.css

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Hero v3 — markup restructure en `index.html`

**Files:**
- Modify: `index.html` (sección hero completa, mantener `<head>` y compliance intactos)

- [ ] **Step 1: Localizar la sección hero actual**

La sección actual es `<section class="hero-pro">` (o equivalente) con `portrait-pro` separado. Anotar las líneas exactas para reemplazar.

- [ ] **Step 2: Reemplazar el bloque hero por la nueva estructura**

Sustituir el bloque hero actual + portrait-pro por:

```html
<section class="hero-split" aria-labelledby="hero-title">
  <div class="hero-split__left">
    <div class="atmen-flow-bg" aria-hidden="true"></div>

    <p class="atmen-kicker">Neumólogo Investigador · INER + Médica Sur</p>

    <h1 id="hero-title" class="hero-h1 headline">
      Neumología<br>basada en <em>evidencia.</em>
    </h1>

    <p class="hero-lede">
      Soy el <b>Dr. Robinson Robles</b>. Atiendo asma, EPOC, apnea del sueño,
      tabaquismo y cáncer pulmonar con la misma evidencia
      que aplico como investigador adscrito a la Clínica de Tabaquismo y EPOC
      del INER.
    </p>

    <div class="agendar" data-agendar>
      <button type="button" class="agendar__btn" aria-haspopup="menu" aria-expanded="false" aria-controls="agendar-menu">
        Agendar cita
        <span class="agendar__chev" aria-hidden="true">▾</span>
      </button>
      <div id="agendar-menu" class="agendar__menu" role="menu" hidden>
        <p class="agendar__head">Elige cómo prefieres agendar</p>
        <a class="agendar__item agendar__item--wa" role="menuitem" href="https://wa.me/525500000000?text=Hola%20doctor%2C%20quisiera%20agendar%20una%20cita">
          <span class="agendar__ic" aria-hidden="true">✓</span>
          <span class="agendar__lbl"><b>WhatsApp</b><span>Respuesta en minutos · horario hábil</span></span>
          <span class="agendar__arr" aria-hidden="true">→</span>
        </a>
        <a class="agendar__item" role="menuitem" href="tel:+525554242400">
          <span class="agendar__ic" aria-hidden="true">☏</span>
          <span class="agendar__lbl"><b>Llamada directa</b><span>Médica Sur · línea consultorio</span></span>
          <span class="agendar__arr" aria-hidden="true">→</span>
        </a>
        <a class="agendar__item" role="menuitem" href="mailto:contacto@atmen.mx?subject=Solicitud%20de%20cita">
          <span class="agendar__ic" aria-hidden="true">✉</span>
          <span class="agendar__lbl"><b>Correo electrónico</b><span>Para casos no urgentes</span></span>
          <span class="agendar__arr" aria-hidden="true">→</span>
        </a>
        <a class="agendar__item" role="menuitem" href="https://www.doctoralia.com.mx/" target="_blank" rel="noopener">
          <span class="agendar__ic" aria-hidden="true">▦</span>
          <span class="agendar__lbl"><b>Agendar online</b><span>Doctoralia · disponible 24/7</span></span>
          <span class="agendar__arr" aria-hidden="true">→</span>
        </a>
      </div>
    </div>

    <dl class="hero-stats">
      <div class="hero-stats__cell"><dt>Años de experiencia</dt><dd><b>10<small>+</small></b></dd></div>
      <div class="hero-stats__cell"><dt>Reseñas verificadas</dt><dd><b>131</b></dd></div>
      <div class="hero-stats__cell"><dt>Scholar h-index</dt><dd><b>h-7</b></dd></div>
      <div class="hero-stats__cell"><dt>Citas indexadas</dt><dd><b>143</b></dd></div>
    </dl>
  </div>

  <aside class="hero-split__right" aria-label="Credenciales y padecimientos">
    <figure class="portrait-editorial">
      <span class="portrait-editorial__fig">FIG. 01</span>
      <div class="portrait-editorial__img">
        <img src="./images/dr-robles-portrait.jpg" alt="Retrato del Dr. Robinson Robles, neumólogo INER + Médica Sur" width="320" height="400" loading="eager" decoding="async">
      </div>
      <figcaption><b>Dr. Robinson Robles</b> · Neumólogo · INER + Médica Sur</figcaption>
    </figure>

    <dl class="credentials">
      <div><dt>Cédula Profesional</dt><dd>10431658</dd></div>
      <div><dt>Cédula Especialidad</dt><dd>12440475</dd></div>
      <div><dt>CNN Vigente</dt><dd>1509 / 2031</dd></div>
      <div><dt>Scholar h-index</dt><dd>h-7 · 143 citas</dd></div>
    </dl>

    <ul class="condition-pills" aria-label="Padecimientos que trato">
      <li class="condition-pills__hot">Asma</li>
      <li class="condition-pills__hot">EPOC</li>
      <li>Apnea</li>
      <li>Tabaquismo</li>
      <li>Disnea</li>
      <li>Tos crónica</li>
    </ul>
  </aside>
</section>
```

Notas:
- Si la ruta `./images/dr-robles-portrait.jpg` no existe, sustituir por la imagen actual del portrait con su ruta correcta. Si no hay imagen real, usar placeholder `<div class="portrait-editorial__img portrait-editorial__img--placeholder"></div>` (se estilizará en task 4).
- El `data-agendar` y `aria-controls="agendar-menu"` los consumirá `js/agendar-menu.js` (Task 6).

- [ ] **Step 3: Verify markup carga sin romper visualmente (CSS pendiente — esperado: layout temporal feo pero todo el contenido visible y accesible)**

Run:
```
mcp__Claude_Preview__preview_eval expression="window.location.reload()"
mcp__Claude_Preview__preview_snapshot
```

Expected: el snapshot incluye `Neumología basada en evidencia`, el botón `Agendar cita`, los 4 stats con sus labels y números, las credenciales, las 7 condition pills. Sin errores en consola.

- [ ] **Step 4: Commit**

```
git add index.html
git commit -m "feat(hero): markup v3 split editorial + agendar menu

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Hero v3 — CSS mobile-first

**Files:**
- Modify: `css/premium.css` (refactor sección hero — eliminar `.hero-pro`, `.portrait-pro` triple-ring, `.headline-pro` shimmer)

- [ ] **Step 1: Eliminar bloques obsoletos de `css/premium.css`**

Localizar y eliminar:
- `.hero-pro` y descendientes con mesh-gradient + orbes drift.
- `.portrait-pro` con triple-ring conic + breath-pulse libre.
- `.headline-pro` con shimmer gradient.

Si están entrelazados con código que se quiere conservar, comentarlos con `/* DEPRECATED v3 — reemplazado por .hero-split */` para revisión y eliminación final en Task 18.

- [ ] **Step 2: Añadir bloque hero v3 al final de `css/premium.css`**

```css
/* =========================================================
   HERO v3 — Split editorial (mobile-first)
   ========================================================= */

.hero-split {
  background: var(--cream);
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  overflow: hidden;
}

.hero-split__left {
  padding: 32px 22px 28px;
  position: relative;
}
.hero-split__left > * { position: relative; z-index: 1; }
.hero-split__left .atmen-flow-bg { z-index: 0; opacity: 0.42; }

.atmen-kicker {
  margin: 0 0 18px;
}

.hero-h1 {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(36px, 9vw, 44px);
  line-height: 1.02;
  letter-spacing: -0.035em;
  color: var(--ink);
  margin: 0 0 18px;
}

.hero-lede {
  font-size: 16px;
  line-height: 1.55;
  color: #33414a;
  margin: 0 0 22px;
  max-width: 56ch;
}
.hero-lede b { color: var(--ocean); font-weight: 600; }

.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;
  margin: 22px 0 0;
  padding-top: 18px;
  border-top: 1px solid var(--line-soft);
}
.hero-stats__cell { margin: 0; }
.hero-stats__cell dt {
  order: 2;
  font-size: 11.5px;
  color: var(--ink-muted);
  text-transform: none;
  letter-spacing: 0;
  margin: 4px 0 0;
}
.hero-stats__cell dd {
  order: 1;
  margin: 0;
  font-weight: 700;
  font-size: 28px;
  letter-spacing: -0.03em;
  color: var(--ocean);
  line-height: 1;
}
.hero-stats__cell dd b { font-weight: inherit; }
.hero-stats__cell dd small { font-size: 18px; color: var(--leaf); }
.hero-stats__cell { display: flex; flex-direction: column; }

.hero-split__right {
  background: linear-gradient(160deg, #e9f1f8 0%, #d4e6ed 50%, #c8ddd5 100%);
  padding: 28px 22px;
  border-top: 1px solid var(--line-soft);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.portrait-editorial {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  margin: 0;
  position: relative;
  box-shadow: 0 18px 36px -20px rgba(2,62,138,0.3);
}
.portrait-editorial__fig {
  position: absolute;
  top: -10px; left: 14px;
  background: var(--cream);
  padding: 2px 8px;
  font-family: var(--font-sans);
  font-size: 9px;
  letter-spacing: 0.14em;
  color: var(--ocean);
  font-weight: 700;
}
.portrait-editorial__img {
  aspect-ratio: 4 / 5;
  background: linear-gradient(180deg, #94c5d6, #2a6f8a);
  border-radius: 6px;
  overflow: hidden;
}
.portrait-editorial__img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.portrait-editorial figcaption {
  font-size: 12px;
  color: #444;
  text-align: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--line-soft);
}
.portrait-editorial figcaption b { color: #111; }

.credentials {
  display: grid;
  gap: 7px;
  font-size: 11.5px;
  color: #3a4a55;
  background: rgba(255,255,255,0.6);
  padding: 12px;
  border-radius: 8px;
  margin: 0;
}
.credentials > div { display: flex; justify-content: space-between; margin: 0; }
.credentials dt { font-weight: 400; }
.credentials dd { margin: 0; color: var(--ocean); font-weight: 700; }

.condition-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.condition-pills li {
  flex: 0 0 auto;
  background: #fff;
  border: 1px solid var(--line-soft);
  padding: 7px 12px;
  border-radius: 99px;
  font-size: 12px;
  color: #444;
  font-weight: 500;
  scroll-snap-align: start;
  min-height: 32px;
  display: inline-flex; align-items: center;
}
.condition-pills__hot { background: var(--ocean); color: #fff !important; border-color: var(--ocean) !important; }

/* Desktop: 2-col split */
@media (min-width: 960px) {
  .hero-split {
    grid-template-columns: 1.2fr 1fr;
    min-height: 540px;
    border-radius: 0;
  }
  .hero-split__left {
    padding: 56px 48px 36px;
  }
  .hero-split__right {
    border-top: none;
    border-left: 1px solid var(--line-soft);
    padding: 32px;
  }
  .hero-h1 { font-size: clamp(48px, 5vw, 64px); }
  .hero-lede { font-size: 17px; }
  .hero-stats { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .hero-stats__cell dd { font-size: 30px; }
  .condition-pills { overflow: visible; }
}

/* Tap targets touch */
@media (pointer: coarse) {
  .condition-pills li { min-height: 44px; padding: 10px 14px; }
}
```

- [ ] **Step 3: Verify mobile 375**

Run:
```
mcp__Claude_Preview__preview_resize preset=mobile
mcp__Claude_Preview__preview_eval expression="window.location.reload()"
mcp__Claude_Preview__preview_screenshot
```

Expected: hero apilado vertical: kicker → H1 (sin shimmer) → lede → botón agendar full-width → stats 2×2 → portrait con `FIG. 01` → credenciales → pills horizontal scrollable. Sin triple ring rotando, sin shimmer en headline.

- [ ] **Step 4: Verify desktop 1280**

Run:
```
mcp__Claude_Preview__preview_resize preset=desktop
mcp__Claude_Preview__preview_screenshot
```

Expected: 2 columnas (texto + sidebar credentials). Flow-volume loop SVG visible sutilmente al fondo del hero-left.

- [ ] **Step 5: Inspect contraste**

Run:
```
mcp__Claude_Preview__preview_inspect selector=".hero-h1" properties=["color","fontSize","fontFamily"]
mcp__Claude_Preview__preview_inspect selector=".hero-stats__cell dd" properties=["color","fontSize"]
```

Expected: `color: rgb(10, 37, 64)` (ink) sobre cream → contraste > 7:1 ✓. Stats `color: rgb(2, 62, 138)` (ocean).

- [ ] **Step 6: Commit**

```
git add css/premium.css
git commit -m "feat(hero): CSS v3 split editorial mobile-first

- Elimina triple-ring portrait, shimmer headline, mesh-gradient orbes
- Añade .hero-split, .portrait-editorial, .credentials, .condition-pills
- Mobile-first con desktop enhancement >=960px

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Agendar dropdown menu — JS + CSS

**Files:**
- Create: `js/agendar-menu.js`
- Modify: `css/premium.css` (añadir bloque agendar)
- Modify: `index.html` (añadir `<script defer>` antes de `</body>`)

- [ ] **Step 1: Crear `js/agendar-menu.js`**

```js
// Atmen — Agendar menu: dropdown (desktop) + bottom sheet (mobile)
(function () {
  const MQ_MOBILE = window.matchMedia('(max-width: 700px)');

  function init(root) {
    const btn = root.querySelector('.agendar__btn');
    const menu = root.querySelector('.agendar__menu');
    if (!btn || !menu) return;

    let open = false;
    let backdrop = null;

    function setOpen(next) {
      open = next;
      btn.setAttribute('aria-expanded', String(open));
      if (open) {
        menu.hidden = false;
        if (MQ_MOBILE.matches) {
          root.classList.add('agendar--sheet');
          backdrop = document.createElement('div');
          backdrop.className = 'agendar__backdrop';
          backdrop.addEventListener('click', close);
          document.body.appendChild(backdrop);
          document.body.style.overflow = 'hidden';
        } else {
          root.classList.add('agendar--popover');
        }
        // Focus first item
        const first = menu.querySelector('[role="menuitem"]');
        if (first) first.focus();
      } else {
        menu.hidden = true;
        root.classList.remove('agendar--sheet', 'agendar--popover');
        if (backdrop) { backdrop.remove(); backdrop = null; }
        document.body.style.overflow = '';
        btn.focus();
      }
    }
    function close() { setOpen(false); }

    btn.addEventListener('click', () => setOpen(!open));

    document.addEventListener('click', (e) => {
      if (!open) return;
      if (root.contains(e.target)) return;
      close();
    });

    document.addEventListener('keydown', (e) => {
      if (!open) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
        const i = items.indexOf(document.activeElement);
        const next = e.key === 'ArrowDown'
          ? (i < 0 ? 0 : (i + 1) % items.length)
          : (i <= 0 ? items.length - 1 : i - 1);
        items[next].focus();
      }
    });
  }

  document.querySelectorAll('[data-agendar]').forEach(init);
})();
```

- [ ] **Step 2: Añadir bloque agendar CSS en `css/premium.css`**

```css
/* =========================================================
   AGENDAR — botón + dropdown (desktop) + bottom sheet (mobile)
   ========================================================= */

.agendar { position: relative; display: inline-block; }
@media (max-width: 700px) { .agendar { display: block; } }

.agendar__btn {
  background: var(--leaf);
  color: #fff;
  padding: 16px 24px;
  border-radius: 14px;
  border: 0;
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 8px 20px -6px rgba(6,167,125,0.55), inset 0 1px 0 rgba(255,255,255,0.2);
  min-height: 56px;
  width: 100%;
  justify-content: center;
}
.agendar__chev { font-size: 13px; opacity: 0.9; transition: transform .15s; }
.agendar__btn[aria-expanded="true"] .agendar__chev { transform: rotate(180deg); }
.agendar__btn:hover { filter: brightness(1.04); }
.agendar__btn:focus-visible { outline: 3px solid var(--ocean); outline-offset: 3px; }

.agendar__menu {
  background: #fff;
  border: 1px solid var(--line-soft);
  border-radius: 14px;
  box-shadow: 0 18px 36px -12px rgba(2,62,138,0.25);
  padding: 8px;
  list-style: none;
  margin: 0;
}

.agendar__head {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #888;
  padding: 10px 12px 6px;
  margin: 0;
}

.agendar__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  min-height: 56px;
}
.agendar__item:hover, .agendar__item:focus-visible { background: #f3f8fb; outline: none; }

.agendar__ic {
  width: 36px; height: 36px;
  border-radius: 9px;
  display: grid; place-items: center;
  background: #eef4f9;
  color: var(--ocean);
  font-size: 18px; font-weight: 700;
  flex-shrink: 0;
}
.agendar__item--wa .agendar__ic { background: rgba(6,167,125,0.12); color: var(--leaf); }

.agendar__lbl { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.agendar__lbl b { font-size: 14px; font-weight: 600; color: var(--ink); }
.agendar__lbl span { font-size: 11.5px; color: #777; }
.agendar__arr { color: #bbb; font-size: 14px; }

/* Desktop popover */
@media (min-width: 701px) {
  .agendar--popover .agendar__menu {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    width: 320px;
    z-index: 50;
  }
  .agendar--popover .agendar__menu::before {
    content: "";
    position: absolute;
    top: -7px; left: 32px;
    width: 14px; height: 14px;
    background: #fff;
    border-left: 1px solid var(--line-soft);
    border-top: 1px solid var(--line-soft);
    transform: rotate(45deg);
  }
}

/* Mobile bottom sheet */
@media (max-width: 700px) {
  .agendar--sheet .agendar__menu {
    position: fixed;
    left: 0; right: 0; bottom: 0;
    z-index: 100;
    border-radius: 16px 16px 0 0;
    padding: 14px 12px max(14px, env(safe-area-inset-bottom));
    animation: agendar-up .22s ease-out;
  }
  .agendar__backdrop {
    position: fixed; inset: 0; z-index: 99;
    background: rgba(0,0,0,0.4);
    animation: agendar-fade .22s ease-out;
  }
  @keyframes agendar-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes agendar-fade { from { opacity: 0; } to { opacity: 1; } }
}

@media (prefers-reduced-motion: reduce) {
  .agendar__menu, .agendar__backdrop, .agendar__chev { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 3: Añadir `<script>` en `index.html`**

Antes de `</body>`:

```html
<script defer src="./js/agendar-menu.js"></script>
```

- [ ] **Step 4: Verify desktop popover**

Run:
```
mcp__Claude_Preview__preview_resize preset=desktop
mcp__Claude_Preview__preview_eval expression="window.location.reload()"
mcp__Claude_Preview__preview_click selector=".agendar__btn"
mcp__Claude_Preview__preview_screenshot
```

Expected: menú popover abierto debajo del botón con 4 items (WhatsApp / Llamada / Correo / Doctoralia). Aria-expanded="true". Click outside cierra.

- [ ] **Step 5: Verify mobile bottom sheet**

Run:
```
mcp__Claude_Preview__preview_resize preset=mobile
mcp__Claude_Preview__preview_eval expression="window.location.reload()"
mcp__Claude_Preview__preview_click selector=".agendar__btn"
mcp__Claude_Preview__preview_screenshot
```

Expected: bottom sheet sube desde abajo cubriendo el bottom de la pantalla con backdrop oscuro. Click en backdrop o ESC cierra.

- [ ] **Step 6: Verify keyboard**

Run:
```
mcp__Claude_Preview__preview_eval expression="document.querySelector('.agendar__btn').focus(); document.querySelector('.agendar__btn').click(); document.activeElement.getAttribute('role')"
```

Expected output: `"menuitem"` (focus saltó al primer item del menú).

- [ ] **Step 7: Commit**

```
git add js/agendar-menu.js css/premium.css index.html
git commit -m "feat(agendar): boton unico con menu 4 canales + bottom sheet mobile

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Marquee instituciones → ribbon delgado

**Files:**
- Modify: `index.html` (mover sección de instituciones a ribbon entre hero y padecimientos)
- Modify: `css/premium.css` (estilos `.institutions-ribbon`)

- [ ] **Step 1: Localizar sección actual de marquee de instituciones y trasladarla**

Cortar el bloque actual de marquee 8 instituciones (probablemente `<section class="marquee">…`) y pegarlo inmediatamente después de `</section><!-- /.hero-split -->`. Cambiar la clase a `institutions-ribbon`.

- [ ] **Step 2: Añadir CSS al final de `css/premium.css`**

```css
/* =========================================================
   INSTITUTIONS RIBBON — franja delgada entre hero y padecimientos
   ========================================================= */
.institutions-ribbon {
  background: #fff;
  border-top: 1px solid var(--line-soft);
  border-bottom: 1px solid var(--line-soft);
  padding: 10px 0;
  overflow: hidden;
}
.institutions-ribbon__track {
  display: flex;
  gap: 36px;
  align-items: center;
  animation: ribbon-scroll 50s linear infinite;
  width: max-content;
}
.institutions-ribbon__item {
  font-size: 12.5px;
  color: var(--ink-muted);
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  display: inline-flex; align-items: center; gap: 8px;
}
.institutions-ribbon__item::after {
  content: "·"; color: var(--line-soft); margin-left: 24px;
}
@keyframes ribbon-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) {
  .institutions-ribbon__track { animation: none; flex-wrap: wrap; justify-content: center; }
}
```

Asegurar que el markup duplique los 8 items (loop continuo):
```html
<section class="institutions-ribbon" aria-label="Instituciones afiliadas">
  <div class="institutions-ribbon__track">
    <!-- 8 items -->
    <span class="institutions-ribbon__item">INER</span>
    <span class="institutions-ribbon__item">Médica Sur</span>
    <!-- ... resto ... -->
    <!-- duplicados para loop -->
    <span class="institutions-ribbon__item">INER</span>
    <span class="institutions-ribbon__item">Médica Sur</span>
    <!-- ... -->
  </div>
</section>
```

- [ ] **Step 3: Verify mobile + desktop**

Run:
```
mcp__Claude_Preview__preview_resize preset=mobile
mcp__Claude_Preview__preview_eval expression="window.location.reload()"
mcp__Claude_Preview__preview_screenshot
mcp__Claude_Preview__preview_resize preset=desktop
mcp__Claude_Preview__preview_screenshot
```

Expected: franja delgada (~40px alto) entre hero y siguiente sección, con instituciones scrolling lentamente horizontal. Sin el padding generoso de antes.

- [ ] **Step 4: Commit**

```
git add index.html css/premium.css
git commit -m "refactor(landing): instituciones como ribbon delgado, no seccion propia

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Padecimientos switcher — markup + content

**Files:**
- Modify: `index.html` (reemplazar bento--12 por switcher)

- [ ] **Step 1: Localizar y eliminar bento--12 actual**

Anotar las líneas que ocupa el bloque `<section class="bento bento--12">…</section>` (10 padecimientos + tile INER + tile wide infecciones). Eliminar todo el bloque.

- [ ] **Step 2: Insertar switcher en su lugar**

Pegar:

```html
<section class="switcher-section" id="padecimientos" aria-labelledby="switcher-title">
  <div class="switcher-section__head">
    <p class="atmen-kicker">Padecimientos</p>
    <h2 id="switcher-title" class="switcher-section__h headline">
      Cada padecimiento es <em>una historia,</em> no un cuadro.
    </h2>
  </div>

  <div class="switcher" data-switcher>
    <!-- Mobile/desktop: <details> nativo; JS upgrade a tabs en desktop -->
    <details class="sw-item" open data-cat="Vías aéreas obstructivas">
      <summary>
        <span class="sw-num">01</span>
        <span class="sw-name">Asma</span>
        <span class="sw-arr" aria-hidden="true">→</span>
      </summary>
      <div class="sw-detail">
        <span class="sw-tag">Vías aéreas obstructivas</span>
        <h3>Asma</h3>
        <p class="sw-desc">Enfermedad inflamatoria crónica de las vías respiratorias que causa episodios de obstrucción reversible. Diagnóstico clínico-funcional con espirometría pre y post-broncodilatador. El tratamiento moderno está orientado al control sostenido, no solo al alivio sintomático.</p>
        <div class="sw-pillars">
          <div class="sw-pillar"><span class="sw-pl">Síntomas clave</span><span class="sw-pv">Sibilancias, tos seca nocturna, opresión torácica, disnea desencadenada por ejercicio o alérgenos.</span></div>
          <div class="sw-pillar"><span class="sw-pl">Cómo lo diagnostico</span><span class="sw-pv">Historia clínica + espirometría con broncodilatador + FeNO + evaluación de control GINA.</span></div>
          <div class="sw-pillar"><span class="sw-pl">Qué esperar</span><span class="sw-pv">Plan escalonado individualizado, técnica inhalatoria supervisada y reevaluación a 3 meses.</span></div>
        </div>
        <div class="sw-foot">
          <a class="sw-more" href="/preguntas-frecuentes/#asma">Ver guía clínica completa →</a>
        </div>
      </div>
    </details>

    <details class="sw-item" data-cat="Vías aéreas obstructivas">
      <summary><span class="sw-num">02</span><span class="sw-name">EPOC</span><span class="sw-arr">→</span></summary>
      <div class="sw-detail">
        <span class="sw-tag">Vías aéreas obstructivas</span>
        <h3>EPOC</h3>
        <p class="sw-desc">Enfermedad pulmonar obstructiva crónica. Limitación persistente del flujo aéreo asociada a inflamación bronquial crónica. Tabaquismo es el factor de riesgo dominante. Manejo orientado a reducir exacerbaciones y mantener función.</p>
        <div class="sw-pillars">
          <div class="sw-pillar"><span class="sw-pl">Síntomas clave</span><span class="sw-pv">Disnea progresiva con esfuerzo, tos productiva crónica, exacerbaciones frecuentes.</span></div>
          <div class="sw-pillar"><span class="sw-pl">Cómo lo diagnostico</span><span class="sw-pv">Espirometría post-broncodilatador (FEV1/FVC < 0.70), evaluación GOLD, comorbilidades.</span></div>
          <div class="sw-pillar"><span class="sw-pl">Qué esperar</span><span class="sw-pv">Plan farmacológico personalizado, rehabilitación pulmonar, vacunación, seguimiento.</span></div>
        </div>
        <div class="sw-foot"><a class="sw-more" href="/preguntas-frecuentes/#epoc">Ver guía clínica completa →</a></div>
      </div>
    </details>

    <!-- Repetir mismo patrón para los 8 restantes: -->
    <!-- 03 Tos crónica, 04 Disnea, 05 Apnea del sueño, 06 Tabaquismo,
         07 Cáncer de pulmón, 08 Derrame pleural,
         09 Broncoscopia diagnóstica -->
  </div>
</section>
```

Completar los 8 `<details>` restantes con el mismo patrón. Los textos exactos (descripción + 3 pilares) deben tomarse del contenido actual del `bento--12` que se eliminó — preservar verbatim cuando exista, parafrasear minimalmente solo si necesario para adaptar al formato de pilares.

- [ ] **Step 3: Verify markup carga sin CSS aún (esperado: lista nativa de details apilada)**

Run:
```
mcp__Claude_Preview__preview_eval expression="window.location.reload()"
mcp__Claude_Preview__preview_snapshot
```

Expected: 10 items con números 01–10 y nombres correctos. Todos los `<details>` colapsados excepto el primero (Asma). Todo el contenido visible y accesible.

- [ ] **Step 4: Commit**

```
git add index.html
git commit -m "feat(padecimientos): markup switcher 10 padecimientos en details

- Reemplaza bento--12 por switcher
- <details> nativo como base (a11y built-in)
- JS upgrade a tabs en desktop (Task 8)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Padecimientos switcher — CSS + JS upgrade desktop

**Files:**
- Create: `js/switcher.js`
- Modify: `css/premium.css` (añadir bloque switcher)
- Modify: `index.html` (añadir `<script defer>`)

- [ ] **Step 1: Añadir CSS switcher al final de `css/premium.css`**

```css
/* =========================================================
   SWITCHER — Padecimientos índice clínico
   Mobile: details nativo. Desktop (>=900): JS upgrade a tabs.
   ========================================================= */

.switcher-section { padding: 56px 22px; background: var(--paper-warm); }
.switcher-section__head { max-width: 720px; margin: 0 auto 28px; }
.switcher-section__h {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(26px, 4.5vw, 36px);
  letter-spacing: -0.025em;
  margin: 8px 0 0;
  color: var(--ink);
}

.switcher { max-width: 1180px; margin: 0 auto; display: flex; flex-direction: column; gap: 8px; }

.sw-item { background: #fff; border: 1px solid var(--line-soft); border-radius: 12px; overflow: hidden; }
.sw-item summary {
  list-style: none;
  display: flex; align-items: center; gap: 12px;
  padding: 16px 18px;
  font-weight: 600;
  cursor: pointer;
  min-height: 56px;
}
.sw-item summary::-webkit-details-marker { display: none; }
.sw-num { font-size: 12px; color: #bbb; font-variant-numeric: tabular-nums; min-width: 24px; }
.sw-name { flex: 1; font-size: 16px; color: #222; }
.sw-arr { color: var(--ocean); opacity: 0; transition: opacity .15s; }
.sw-item[open] .sw-arr { opacity: 1; }
.sw-item[open] summary { background: var(--ocean); color: #fff; }
.sw-item[open] summary .sw-num { color: rgba(255,255,255,0.6); }
.sw-item[open] summary .sw-name { color: #fff; }
.sw-item[open] summary .sw-arr { color: #fff; }

.sw-detail { padding: 22px 18px 24px; }
.sw-tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 700; color: var(--leaf);
  letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 10px;
}
.sw-tag::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--leaf); }
.sw-detail h3 {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(24px, 5vw, 30px);
  letter-spacing: -0.025em;
  margin: 0 0 12px;
  color: var(--ink);
}
.sw-desc { font-size: 15px; line-height: 1.6; color: #3a4a55; margin: 0 0 18px; max-width: 60ch; }

.sw-pillars { display: grid; grid-template-columns: 1fr; gap: 10px; margin: 0 0 18px; }
.sw-pillar { background: var(--paper-warm); border-radius: 10px; padding: 14px; }
.sw-pl { display: block; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ocean); margin: 0 0 6px; }
.sw-pv { display: block; font-size: 13.5px; color: #222; line-height: 1.45; }

.sw-foot { padding-top: 14px; border-top: 1px solid var(--line-soft); }
.sw-more { color: var(--ocean); font-weight: 600; font-size: 13.5px; text-decoration: none; }
.sw-more:hover { text-decoration: underline; }

/* Desktop tabs layout — activado por JS añadiendo .switcher--tabs */
@media (min-width: 900px) {
  .switcher--tabs {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 28px;
    background: #fff;
    border: 1px solid var(--line-soft);
    border-radius: 18px;
    padding: 32px;
    box-shadow: 0 30px 60px -30px rgba(2,62,138,0.12);
  }
  .switcher--tabs .sw-item { border: none; border-radius: 0; background: transparent; overflow: visible; }
  .switcher--tabs .sw-item summary {
    border-radius: 8px;
    padding: 11px 12px;
    min-height: 44px;
    font-size: 14.5px;
    background: transparent;
  }
  .switcher--tabs .sw-item[open] summary,
  .switcher--tabs .sw-item summary:hover { background: #f5f8fa; color: var(--ink); }
  .switcher--tabs .sw-item[open] summary { background: var(--ocean); color: #fff; }
  .switcher--tabs .sw-detail { display: none; }
  .switcher--tabs .sw-item[open] .sw-detail {
    display: block;
    position: absolute;
    inset: 32px 32px 32px 340px;
    padding: 0;
  }
  .switcher--tabs { position: relative; }
  .sw-pillars { grid-template-columns: repeat(3, 1fr); }
}

@media (prefers-reduced-motion: reduce) {
  .sw-arr, .sw-item summary { transition: none !important; }
}
```

- [ ] **Step 2: Crear `js/switcher.js`**

```js
// Atmen — Switcher: ARIA tabs upgrade en desktop, details accordion en mobile.
(function () {
  const MQ = window.matchMedia('(min-width: 900px)');

  function init(root) {
    const items = Array.from(root.querySelectorAll('.sw-item'));
    if (!items.length) return;

    function applyTabs(on) {
      root.classList.toggle('switcher--tabs', on);
      if (on) {
        // Ensure single-open behavior
        items.forEach((it) => {
          const sum = it.querySelector('summary');
          sum.setAttribute('role', 'tab');
          sum.setAttribute('aria-selected', it.open ? 'true' : 'false');
        });
      } else {
        items.forEach((it) => {
          const sum = it.querySelector('summary');
          sum.removeAttribute('role');
          sum.removeAttribute('aria-selected');
        });
      }
    }

    // Single-open behavior in both modes
    items.forEach((it) => {
      it.addEventListener('toggle', () => {
        if (it.open) {
          items.forEach((o) => { if (o !== it && o.open) o.open = false; });
          const sum = it.querySelector('summary');
          if (sum.hasAttribute('role')) sum.setAttribute('aria-selected', 'true');
        }
      });
    });

    applyTabs(MQ.matches);
    MQ.addEventListener('change', (e) => applyTabs(e.matches));

    // Keyboard navigation in tabs mode
    root.addEventListener('keydown', (e) => {
      if (!root.classList.contains('switcher--tabs')) return;
      if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
      const summaries = items.map((it) => it.querySelector('summary'));
      const i = summaries.indexOf(document.activeElement);
      if (i < 0) return;
      let next = i;
      if (e.key === 'ArrowDown') next = (i + 1) % summaries.length;
      if (e.key === 'ArrowUp') next = (i - 1 + summaries.length) % summaries.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = summaries.length - 1;
      e.preventDefault();
      summaries[next].focus();
      summaries[next].click();
    });
  }

  document.querySelectorAll('[data-switcher]').forEach(init);
})();
```

- [ ] **Step 3: Añadir `<script>` en `index.html`**

Antes de `</body>`:

```html
<script defer src="./js/switcher.js"></script>
```

- [ ] **Step 4: Verify mobile (accordion)**

Run:
```
mcp__Claude_Preview__preview_resize preset=mobile
mcp__Claude_Preview__preview_eval expression="window.location.reload()"
mcp__Claude_Preview__preview_screenshot
mcp__Claude_Preview__preview_click selector=".sw-item:nth-child(3) summary"
mcp__Claude_Preview__preview_screenshot
```

Expected: lista vertical de los 10 padecimientos. Asma (01) abierto por default. Click en Tos crónica (03) cierra Asma y abre Tos crónica.

- [ ] **Step 5: Verify desktop (tabs)**

Run:
```
mcp__Claude_Preview__preview_resize preset=desktop
mcp__Claude_Preview__preview_eval expression="window.location.reload()"
mcp__Claude_Preview__preview_screenshot
mcp__Claude_Preview__preview_click selector=".sw-item:nth-child(5) summary"
mcp__Claude_Preview__preview_screenshot
```

Expected: grid 280px+1fr. Lista índice izq, panel detalle der. Click en Apnea (05) cambia el panel der. Keyboard ↑↓ navega.

- [ ] **Step 6: Commit**

```
git add js/switcher.js css/premium.css index.html
git commit -m "feat(padecimientos): switcher CSS + JS (tabs desktop / accordion mobile)

- Single-open en ambos modos
- ARIA tabs en desktop, details nativo en mobile
- Keyboard arrows + Home/End en desktop
- prefers-reduced-motion respetado

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Servicios + Filosofía split 2-up

**Files:**
- Modify: `index.html` (envolver ambas secciones en wrapper `.splits-2up`)
- Modify: `css/premium.css` (añadir `.splits-2up`)

- [ ] **Step 1: Wrap sección servicios + sección filosofía en wrapper**

En `index.html`, envolver los `<section id="servicios">` y `<section class="pilares">` (o nombres equivalentes actuales) en:

```html
<div class="splits-2up">
  <section id="servicios" class="split-cell"> ... </section>
  <section class="pilares split-cell"> ... </section>
</div>
```

- [ ] **Step 2: Añadir CSS al final de `css/premium.css`**

```css
/* =========================================================
   SPLITS 2-UP — secciones en par lateral
   ========================================================= */
.splits-2up {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}
@media (min-width: 1024px) {
  .splits-2up { grid-template-columns: 1fr 1fr; }
  .splits-2up > .split-cell { padding-block: 64px; }
}
.splits-2up > .split-cell { padding: 40px 22px; }
```

- [ ] **Step 3: Verify desktop split + mobile stack**

Run en mobile y desktop con preview_screenshot.

Expected mobile: servicios primero, filosofía debajo. Desktop: lado a lado.

- [ ] **Step 4: Commit**

```
git add index.html css/premium.css
git commit -m "refactor(landing): servicios + filosofia en split 2-up desktop

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Testimonials wall — markup con 21 cards

**Files:**
- Modify: `index.html` (reemplazar testimonials-hero + testimonials-grid)

- [ ] **Step 1: Eliminar sección actual de testimonios**

Localizar `<section id="resenas">` o equivalente y eliminar todo el bloque (incluido testimonials-hero + 10 t-cards apilados).

- [ ] **Step 2: Insertar wall markup**

```html
<section id="resenas" class="wall" aria-labelledby="wall-title">
  <div class="wall__head">
    <div class="wall__lh">
      <p class="atmen-kicker">Reseñas verificadas</p>
      <h2 id="wall-title" class="wall__h headline">Lo que dicen <em>131 pacientes.</em></h2>
      <p class="wall__sub">Reseñas verbatim verificables en Doctoralia. Sin curaduría, sin retoque. Hover sobre una fila para pausarla.</p>
    </div>
    <div class="wall__meta">
      <div class="wall__mt"><b>4.9</b><span>★★★★★ Doctoralia</span></div>
      <div class="wall__mt"><b>131</b><span>Reseñas</span></div>
      <div class="wall__mt"><b>98%</b><span>Recomienda</span></div>
    </div>
  </div>

  <div class="wall__mask" data-wall>
    <div class="marquee-row marquee-row--r1">
      <!-- 7 tcards verbatim (las 10 actuales aportan + 11 nuevas extraidas de Doctoralia) -->
      <!-- Cada card en plantilla: -->
      <article class="tcard">
        <span class="tcard__stars" aria-label="5 de 5">★★★★★</span>
        <p class="tcard__quote">"Texto verbatim de la reseña."</p>
        <div class="tcard__person">
          <span class="tcard__av" aria-hidden="true">XX</span>
          <span class="tcard__nm">Nombre A.</span>
          <span class="tcard__src">Doctoralia · <b>verificada</b></span>
        </div>
      </article>
      <!-- Repetir 6 más (total 7 por fila) -->
      <!-- Duplicar TODOS los 7 para el loop continuo (total 14 nodes en el DOM por fila) -->
    </div>
    <div class="marquee-row marquee-row--r2">
      <!-- 7 cards distintas, duplicadas -->
    </div>
    <div class="marquee-row marquee-row--r3">
      <!-- 7 cards distintas, duplicadas -->
    </div>
  </div>

  <div class="wall__foot">
    <span class="wall__note">Click en una card para expandir · <a href="/preguntas-frecuentes/">Más sobre el proceso →</a></span>
    <a class="wall__cta" href="https://www.doctoralia.com.mx/" target="_blank" rel="noopener">Ver las 131 reseñas en Doctoralia →</a>
  </div>
</section>
```

- [ ] **Step 3: Contenido de las 21 cards**

Source:
1. **10 cards existentes:** copiar verbatim los 10 testimonios actuales del HTML que se eliminó en Step 1.
2. **11 cards adicionales:** extraer de Doctoralia público vía WebFetch (URL del perfil del Dr. Robinson Robles). Si la extracción no es viable durante la implementación, dejar las 10 actuales repartidas en 3 filas (3+3+4) ajustando counts y dejar TODO comment en index.html: `<!-- TODO: ampliar a 21 cards con verbatim adicionales de Doctoralia público; cliente debe validar antes de publicar -->`. En ningún caso fabricar contenido.

- [ ] **Step 4: Verify markup carga**

Run preview_snapshot y confirmar que aparecen las cards con sus textos.

- [ ] **Step 5: Commit**

```
git add index.html
git commit -m "feat(testimonios): wall markup con 21 cards en 3 marquees

- Estructura para wall of love con 3 filas
- Verbatim de Doctoralia (10 existentes + 11 ampliados/TODO)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Testimonials wall — CSS + JS animaciones

**Files:**
- Modify: `css/premium.css` (añadir bloque wall + tcard + marquees)
- Create: `js/testimonials-wall.js`
- Modify: `index.html` (añadir `<script>`)

- [ ] **Step 1: Añadir CSS wall**

```css
/* =========================================================
   TESTIMONIALS WALL — marquee 3 filas (desktop) / 1 fila (mobile)
   ========================================================= */
.wall {
  background: #fff;
  border-block: 1px solid var(--line-soft);
  padding: 48px 0 56px;
  position: relative;
  overflow: hidden;
}
.wall__head {
  padding: 0 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.wall__h {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(26px, 5vw, 34px);
  letter-spacing: -0.025em;
  margin: 8px 0;
  color: var(--ink);
}
.wall__sub { font-size: 14px; color: var(--ink-muted); margin: 0; max-width: 60ch; }
.wall__meta { display: flex; gap: 18px; }
.wall__mt b { display: block; font-size: 22px; font-weight: 800; color: var(--ocean); letter-spacing: -0.02em; line-height: 1; }
.wall__mt span { font-size: 11px; color: var(--ink-muted); }

.wall__mask { position: relative; }
.wall__mask::before, .wall__mask::after {
  content: ""; position: absolute; top: 0; bottom: 0; width: 60px; z-index: 2; pointer-events: none;
}
.wall__mask::before { left: 0; background: linear-gradient(90deg, #fff, transparent); }
.wall__mask::after  { right: 0; background: linear-gradient(-90deg, #fff, transparent); }

.marquee-row {
  display: flex;
  gap: 14px;
  padding: 8px 0;
  width: max-content;
  will-change: auto;
}
.marquee-row--r1 { animation: scroll-l 60s linear infinite; }
.marquee-row--r2 { animation: scroll-r 75s linear infinite; }
.marquee-row--r3 { animation: scroll-l 90s linear infinite; }
.marquee-row:hover { animation-play-state: paused; will-change: transform; }

@keyframes scroll-l { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes scroll-r { from { transform: translateX(-50%); } to { transform: translateX(0); } }

.tcard {
  flex: 0 0 auto;
  width: 300px;
  background: var(--paper-warm);
  border: 1px solid var(--line-soft);
  border-radius: 14px;
  padding: 16px 18px;
  display: flex; flex-direction: column; gap: 8px;
  contain: layout style;
}
.tcard__stars { color: #f5a623; font-size: 13px; letter-spacing: 1px; }
.tcard__quote { font-size: 13.5px; line-height: 1.5; color: var(--ink); margin: 0; }
.tcard__person { display: flex; align-items: center; gap: 10px; margin-top: auto; padding-top: 10px; border-top: 1px solid var(--line-soft); }
.tcard__av { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--sea), var(--ocean)); color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 13px; }
.tcard__nm { font-size: 12.5px; font-weight: 600; color: var(--ink); }
.tcard__src { font-size: 10.5px; color: var(--ink-muted); }
.tcard__src b { color: var(--leaf); }

.wall__foot {
  padding: 18px 22px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
  border-top: 1px solid var(--line-soft);
}
.wall__note { font-size: 12.5px; color: var(--ink-muted); }
.wall__cta {
  align-self: flex-start;
  background: #fff;
  border: 1.5px solid var(--ocean);
  color: var(--ocean);
  padding: 10px 18px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  min-height: 44px; display: inline-flex; align-items: center;
}

/* Mobile: solo 1 fila + slower */
@media (max-width: 700px) {
  .marquee-row--r2, .marquee-row--r3 { display: none; }
  .marquee-row--r1 { animation-duration: 90s; }
  .tcard { width: 280px; }
}

@media (min-width: 768px) {
  .wall__head { padding-inline: 36px; flex-direction: row; justify-content: space-between; align-items: flex-end; }
  .wall__foot { padding-inline: 36px; flex-direction: row; justify-content: space-between; align-items: center; }
}

/* Reduced motion: grid estático */
@media (prefers-reduced-motion: reduce) {
  .marquee-row { animation: none !important; flex-wrap: wrap; width: auto; justify-content: center; }
  .wall__mask::before, .wall__mask::after { display: none; }
  .marquee-row--r2, .marquee-row--r3 { display: flex; } /* mostrar todas en grid plano */
}
```

- [ ] **Step 2: Crear `js/testimonials-wall.js`**

```js
// Atmen — Testimonials wall: pause on hover, IntersectionObserver pause off-viewport, click to expand
(function () {
  const root = document.querySelector('[data-wall]');
  if (!root) return;
  const rows = Array.from(root.querySelectorAll('.marquee-row'));

  // Pause when wall is off-screen (perf)
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      rows.forEach((r) => {
        r.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
      });
    });
  }, { rootMargin: '100px' });
  io.observe(root);

  // Click to expand (simple inline expansion of the card)
  root.addEventListener('click', (e) => {
    const card = e.target.closest('.tcard');
    if (!card) return;
    card.classList.toggle('tcard--expanded');
  });

  // Optional dialog/modal expansion could be added later; keeping minimal per YAGNI.
})();
```

- [ ] **Step 3: Añadir `<script>` en `index.html`**

```html
<script defer src="./js/testimonials-wall.js"></script>
```

- [ ] **Step 4: Verify mobile (1 fila lenta)**

Run preview_resize mobile + reload + screenshot. Expected: 1 sola fila moviéndose lento. Las filas 2 y 3 ocultas.

- [ ] **Step 5: Verify desktop (3 filas alternas)**

Run preview_resize desktop + reload + screenshot. Expected: 3 filas en movimiento. Fade mask en bordes.

- [ ] **Step 6: Verify reduced motion**

Run:
```
mcp__Claude_Preview__preview_resize preset=desktop colorScheme=light
mcp__Claude_Preview__preview_eval expression="(async()=>{ const o = window.matchMedia; window.matchMedia = (q) => q.includes('reduce') ? {matches:true,addEventListener:()=>{}} : o.call(window,q); window.location.reload(); })()"
```

Mejor verificación: en DevTools Rendering panel del usuario; aquí basta confirmar que el CSS `@media (prefers-reduced-motion)` está bien escrito leyéndolo con preview_inspect:

```
mcp__Claude_Preview__preview_inspect selector=".marquee-row" properties=["animationName","animationPlayState"]
```

Expected: `animation-name: scroll-l` (en condiciones normales).

- [ ] **Step 7: Commit**

```
git add css/premium.css js/testimonials-wall.js index.html
git commit -m "feat(testimonios): wall CSS + JS con 3 marquees + IntersectionObserver

- Desktop: 3 filas direcciones alternas
- Mobile: 1 fila slow
- Hover pausa, off-viewport pausa (perf)
- prefers-reduced-motion: grid estatico

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Medios + Bio preview split 2-up

**Files:**
- Modify: `index.html` (envolver `<section id="medios">` y `<section class="bio-preview">` en `.splits-2up`)

- [ ] **Step 1: Wrap ambas secciones**

```html
<div class="splits-2up">
  <section id="medios" class="split-cell"> ... entrevista Once Noticias embebida ... </section>
  <section class="bio-preview split-cell"> ... bio preview ... </section>
</div>
```

(Reusa `.splits-2up` creado en Task 9.)

- [ ] **Step 2: Verify desktop split + mobile stack**

Run preview_screenshot en ambos breakpoints.

- [ ] **Step 3: Commit**

```
git add index.html
git commit -m "refactor(landing): medios + bio preview en split 2-up desktop

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 13: FAQ accordion compacto + CTA aurora simplificada

**Files:**
- Modify: `index.html` (sección FAQ + CTA aurora)
- Modify: `css/premium.css` (refactor `.cta-aurora`, añadir `.faq-accordion`)

- [ ] **Step 1: Convertir FAQ a `<details>` accordion**

Reemplazar el bloque FAQ actual por:

```html
<section id="faq" class="faq-accordion" aria-labelledby="faq-title">
  <div class="faq-accordion__head">
    <p class="atmen-kicker">Preguntas frecuentes</p>
    <h2 id="faq-title" class="faq-accordion__h headline">Dudas comunes <em>antes de agendar.</em></h2>
  </div>
  <div class="faq-accordion__list" data-faq>
    <!-- 6 preguntas Q&A en details. Patrón: -->
    <details class="faq-item">
      <summary><span class="faq-q">¿Atiendes en hospital o en consultorio privado?</span><span class="faq-chev" aria-hidden="true">+</span></summary>
      <div class="faq-a">
        <p>Texto de respuesta verbatim del FAQ actual.</p>
      </div>
    </details>
    <!-- repetir 5 más -->
  </div>
  <a class="faq-accordion__more" href="/preguntas-frecuentes/">Ver las 21 preguntas frecuentes completas →</a>
</section>
```

Tomar las 6 Q&A verbatim del HTML actual del FAQ (las que ya están en la landing). NO reescribir contenido.

- [ ] **Step 2: Añadir CSS FAQ accordion**

```css
.faq-accordion { padding: 56px 22px; background: var(--cream); }
.faq-accordion__head { max-width: 720px; margin: 0 auto 22px; }
.faq-accordion__h {
  font-family: var(--font-display); font-weight: 800;
  font-size: clamp(26px, 4.5vw, 34px);
  letter-spacing: -0.025em; margin: 8px 0 0; color: var(--ink);
}
.faq-accordion__list { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 8px; }
.faq-item { background: #fff; border: 1px solid var(--line-soft); border-radius: 12px; overflow: hidden; }
.faq-item summary {
  list-style: none; display: flex; align-items: center; justify-content: space-between;
  gap: 12px; padding: 18px 20px; cursor: pointer; min-height: 56px;
}
.faq-item summary::-webkit-details-marker { display: none; }
.faq-q { font-size: 15.5px; font-weight: 600; color: var(--ink); flex: 1; }
.faq-chev { color: var(--ocean); font-size: 18px; font-weight: 700; transition: transform .15s; }
.faq-item[open] .faq-chev { transform: rotate(45deg); }
.faq-a { padding: 0 20px 20px; font-size: 14.5px; line-height: 1.6; color: #3a4a55; }
.faq-a p { margin: 0; }
.faq-accordion__more {
  display: inline-flex; max-width: 760px; margin: 18px auto 0;
  color: var(--ocean); font-weight: 600; font-size: 14px; text-decoration: none;
}
@media (prefers-reduced-motion: reduce) { .faq-chev { transition: none !important; } }
```

- [ ] **Step 3: JS single-open en FAQ (añadir al final de `js/switcher.js` o nuevo helper inline)**

Añadir al final de `js/switcher.js`:

```js
// FAQ single-open
(function () {
  const list = document.querySelector('[data-faq]');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('.faq-item'));
  items.forEach((it) => it.addEventListener('toggle', () => {
    if (it.open) items.forEach((o) => { if (o !== it && o.open) o.open = false; });
  }));
})();
```

- [ ] **Step 4: Refactor CTA aurora — eliminar conic spin**

Localizar `.cta-aurora` en `css/premium.css`. Eliminar las propiedades:
- `background: conic-gradient(...);`
- `animation: aurora-spin …;`
- `@keyframes aurora-spin`

Sustituir por:

```css
.cta-aurora {
  background: linear-gradient(135deg, var(--ocean), var(--sea) 60%, var(--leaf));
  color: #fff;
  padding: 56px 28px;
  border-radius: 22px;
  position: relative;
  overflow: hidden;
}
.cta-aurora::before {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(circle at 70% 30%, rgba(255,255,255,0.18), transparent 50%);
  animation: cta-shimmer 8s ease-in-out infinite;
  pointer-events: none;
}
@keyframes cta-shimmer {
  0%, 100% { opacity: 0.6; }
  50%      { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .cta-aurora::before { animation: none; opacity: 0.6; }
}
```

- [ ] **Step 5: Verify FAQ mobile + desktop**

Run preview_screenshot en ambos breakpoints. Click en una pregunta → abre. Click en otra → cierra anterior y abre nueva.

- [ ] **Step 6: Verify CTA aurora sin conic spin**

Run preview_inspect:
```
mcp__Claude_Preview__preview_inspect selector=".cta-aurora" properties=["background","animationName"]
```

Expected: background `linear-gradient(...)`, no `conic-gradient`. animationName en `::before` = `cta-shimmer`.

- [ ] **Step 7: Commit**

```
git add index.html css/premium.css js/switcher.js
git commit -m "refactor(faq+cta): FAQ accordion compacto + CTA aurora sin conic spin

- FAQ: <details> single-open, 56px tap targets
- CTA aurora: linear-gradient estatico + shimmer sutil 8s
- prefers-reduced-motion respetado en ambos

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 14: Nav mobile — hamburger drawer que reusa agendar menu

**Files:**
- Modify: `index.html` (nav)
- Modify: `css/site.css` o `css/premium.css` (estilos nav mobile)
- Modify: `js/agendar-menu.js` (extender para nav drawer si se reusa la lógica)

- [ ] **Step 1: Markup nav con hamburger**

Localizar nav actual en `index.html`. Asegurar estructura:

```html
<header class="site-header">
  <a href="/" class="site-logo">Atm<span>e</span>n</a>
  <nav class="site-nav" id="site-nav">
    <a href="#padecimientos">Padecimientos</a>
    <a href="#servicios">Servicios</a>
    <a href="/sobre-el-doctor/">El doctor</a>
    <a href="#resenas">Reseñas</a>
    <a href="#faq">FAQ</a>
  </nav>
  <button type="button" class="site-burger" aria-label="Abrir menú" aria-expanded="false" aria-controls="site-nav">
    <span aria-hidden="true">≡</span>
  </button>
  <a href="#" class="site-cta" data-open-agendar>Agendar →</a>
</header>
```

- [ ] **Step 2: CSS nav mobile**

Añadir en `css/site.css`:

```css
.site-header { display: flex; align-items: center; gap: 16px; padding: 14px 22px; background: #fff; border-bottom: 1px solid var(--line-soft); position: sticky; top: 0; z-index: 40; }
.site-logo { font-family: var(--font-display); font-weight: 800; font-size: 22px; letter-spacing: -0.03em; color: var(--ink); text-decoration: none; }
.site-logo span { color: var(--leaf); }
.site-nav { display: none; }
.site-cta { background: var(--leaf); color: #fff; padding: 9px 16px; border-radius: 99px; font-size: 13px; font-weight: 600; text-decoration: none; margin-left: auto; min-height: 40px; display: inline-flex; align-items: center; }
.site-burger { background: transparent; border: 0; font-size: 24px; line-height: 1; padding: 8px 12px; cursor: pointer; min-height: 44px; min-width: 44px; }

@media (min-width: 900px) {
  .site-burger { display: none; }
  .site-nav { display: flex; gap: 22px; font-size: 14px; font-weight: 500; color: #444; margin-left: 12px; }
  .site-nav a { color: #444; text-decoration: none; }
  .site-nav a:hover { color: var(--ocean); }
  .site-cta { margin-left: auto; }
}

.site-nav--open {
  display: flex !important;
  position: fixed; inset: 60px 0 0; flex-direction: column;
  background: #fff; padding: 24px; gap: 12px; z-index: 60;
  border-top: 1px solid var(--line-soft);
}
.site-nav--open a { padding: 14px 12px; font-size: 17px; font-weight: 600; color: var(--ink); text-decoration: none; border-radius: 8px; }
.site-nav--open a:hover, .site-nav--open a:focus-visible { background: #f5f8fa; }
```

- [ ] **Step 3: JS toggle del drawer (inline en index.html o en site.js nuevo)**

Crear `js/site-nav.js`:

```js
(function () {
  const burger = document.querySelector('.site-burger');
  const nav = document.getElementById('site-nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('site-nav--open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
})();
```

Añadir `<script defer src="./js/site-nav.js"></script>` antes de `</body>`.

- [ ] **Step 4: Verify mobile (burger + drawer)**

Run preview_resize mobile + reload + preview_click selector=".site-burger" + preview_screenshot.

Expected: drawer cubre la pantalla con links nav verticales grandes. Tap en link cierra o navega.

- [ ] **Step 5: Verify desktop (nav inline visible, burger oculto)**

Run preview_resize desktop + reload + preview_screenshot.

Expected: nav horizontal visible, burger oculto.

- [ ] **Step 6: Commit**

```
git add index.html css/site.css js/site-nav.js
git commit -m "feat(nav): hamburger drawer mobile + nav inline desktop

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 15: Aplicar sistema a `/sobre-el-doctor/index.html`

**Files:**
- Modify: `sobre-el-doctor/index.html`

- [ ] **Step 1: Replicar header/nav nuevo**

Copiar el bloque `<header class="site-header">` del index.html actualizado a sobre-el-doctor. Ajustar rutas (`href="/"`, `href="../#padecimientos"`, etc.) y `<link href="../css/...">`.

- [ ] **Step 2: Refactor del hero de la página**

Si la página actual usa `.hero-pro`, replicar con `.hero-split` adaptado al contexto bio (sin el agendar menu si no aplica; o con el mismo agendar menu si se desea consistencia — recomendado mantener consistencia).

Headline ejemplo: `Sobre <em>el doctor.</em>` con el mismo tratamiento Inter 800 + Fraunces italic em + underline cursivo.

- [ ] **Step 3: Reemplazar uso de tokens y fuentes obsoletas**

Buscar `Plus Jakarta Sans` específico en estilos inline → eliminar (fallback en tokens.css ya cubre).

Asegurar uso de las clases nuevas: `.atmen-kicker`, `.hero-h1`, `.hero-lede`, `.portrait-editorial`, `.credentials`.

- [ ] **Step 4: Footer-compliance intacto**

Verificar que `top-bar-legal`, `footer-compliance`, disclaimer 911, y JSON-LD del `<head>` están EXACTAMENTE iguales a su versión actual. No se tocan.

- [ ] **Step 5: Verify mobile + desktop**

Run preview_eval con URL `/sobre-el-doctor/` + preview_screenshot en ambos breakpoints.

- [ ] **Step 6: Commit**

```
git add sobre-el-doctor/index.html
git commit -m "feat(sobre-el-doctor): adoptar sistema v3 (nav + tipografia + hero editorial)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 16: Aplicar sistema a `/preguntas-frecuentes/index.html`

**Files:**
- Modify: `preguntas-frecuentes/index.html`

- [ ] **Step 1: Replicar header/nav nuevo**

Igual que Task 15 step 1.

- [ ] **Step 2: Tipografía + tokens actualizados**

Igual que Task 15 step 3.

- [ ] **Step 3: Hero ligero de la página FAQ**

Hero adaptado: `Preguntas <em>frecuentes.</em>` con subtítulo "21 dudas respondidas en 5 categorías clínicas".

- [ ] **Step 4: Las 21 Q&A pueden quedar en su accordion actual pero adoptar `.faq-item` styling para consistencia**

Renombrar/ajustar markup de las preguntas para usar la misma clase `.faq-item` que la landing. Mantener las 5 categorías como `<h3>` separadores.

- [ ] **Step 5: Footer-compliance intacto**

Mismo cuidado que Task 15 step 4.

- [ ] **Step 6: Verify mobile + desktop**

Run preview con URL `/preguntas-frecuentes/`.

- [ ] **Step 7: Commit**

```
git add preguntas-frecuentes/index.html
git commit -m "feat(faq): adoptar sistema v3 (nav + tipografia + faq-item compartido)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 17: Limpieza CSS deprecated

**Files:**
- Modify: `css/premium.css`

- [ ] **Step 1: Eliminar bloques marcados `/* DEPRECATED v3 */` en Task 4 Step 1**

Buscar todos los comentarios `DEPRECATED v3` y eliminar los bloques referenciados (clases que ya no se usan en ningún HTML: `.hero-pro`, `.portrait-pro`, `.headline-pro`, `.bento--12`, etc.).

Si alguna clase deprecada aún se referencia en algún HTML (verificación: `grep -r "hero-pro" *.html sobre-el-doctor/ preguntas-frecuentes/`), no eliminar — investigar primero.

- [ ] **Step 2: Verify nada se rompió**

Run preview_screenshot en las 3 páginas (mobile + desktop) y comparar visualmente con los screenshots de la última verificación de Task 16.

- [ ] **Step 3: Commit**

```
git add css/premium.css
git commit -m "polish(css): limpiar clases deprecated post-rediseno v3

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 18: Verificación final integral

**Files:** (ninguno se modifica; este es un audit)

- [ ] **Step 1: Screenshot de las 3 páginas en mobile 375**

```
mcp__Claude_Preview__preview_resize preset=mobile
mcp__Claude_Preview__preview_eval expression="window.location.href='http://localhost:8765/'"
mcp__Claude_Preview__preview_screenshot
mcp__Claude_Preview__preview_eval expression="window.location.href='http://localhost:8765/sobre-el-doctor/'"
mcp__Claude_Preview__preview_screenshot
mcp__Claude_Preview__preview_eval expression="window.location.href='http://localhost:8765/preguntas-frecuentes/'"
mcp__Claude_Preview__preview_screenshot
```

- [ ] **Step 2: Screenshot de las 3 páginas en desktop 1280**

Mismo flujo con `preset=desktop`.

- [ ] **Step 3: A11y spot-check**

Run preview_snapshot en `/` y verificar que aparecen:
- Roles correctos en switcher (`tab`, `tabpanel` o `details` según breakpoint).
- Roles correctos en agendar menu (`menu`, `menuitem`).
- `aria-label` en `.condition-pills` y `.wall`.

- [ ] **Step 4: Contraste**

Run preview_inspect en los textos críticos (headline ink sobre cream, leaf sobre cream, ocean stats sobre cream, white sobre leaf en CTA).

Expected: cada uno ≥ 4.5:1 (calculo manual con valores hex).

- [ ] **Step 5: Verify reduced motion**

Verificar manualmente en DevTools del navegador del usuario (Rendering → Emulate CSS prefers-reduced-motion: reduce) que:
- Marquees del wall se vuelven grid estático.
- Dot pulse del kicker se detiene.
- CTA aurora shimmer estático.
- FAQ chev sin transición.

- [ ] **Step 6: Compliance audit**

Verificar grep:
```
grep -l "top-bar-legal" *.html sobre-el-doctor/index.html preguntas-frecuentes/index.html
grep -l "footer-compliance" *.html sobre-el-doctor/index.html preguntas-frecuentes/index.html
grep -l "JSON-LD" *.html sobre-el-doctor/index.html preguntas-frecuentes/index.html  # o "application/ld+json"
```

Expected: las 3 páginas contienen los 3 elementos.

- [ ] **Step 7: Commit (si surgió ajuste)**

Si los screenshots/audits revelaron ajustes menores, aplicarlos en un commit `polish(v3): ajustes post-verification`. Si todo pasa limpio, no commit.

- [ ] **Step 8: Reportar al usuario**

Resumen breve:
- 3 páginas verificadas mobile + desktop.
- Cualquier hallazgo de la auditoría.
- Confirmación de que compliance está intacto.
- Recomendación de siguiente paso (segunda pasada para noindex pages, o publicar).

---

## Self-Review (executed by author)

**1. Spec coverage:**
- §3.1 Compliance intocable → respetado en todas las tareas (footer-compliance, top-bar, JSON-LD nunca tocados; Task 18 audit final).
- §3.2 Paleta completa preservada → Task 1 amplía sin breaking; uso por jerarquía aplicado en cada componente CSS.
- §3.3 Tipografía simplificada → Task 1 cambia fonts, signature.css aplica em.
- §3.4 Mobile-first → cada Task tiene Step de verify mobile primero, desktop después.
- §3.5 Performance → marquee con `contain`, `will-change: auto` por default, IntersectionObserver pause.
- §4 Arquitectura → archivos exactos en File Structure.
- §5.1 Hero → Tasks 3 + 4 + 5.
- §5.2 Agendar menu → Task 5.
- §5.3 Padecimientos switcher → Tasks 7 + 8.
- §5.4 Servicios+Filosofía split → Task 9.
- §5.5 Testimonials wall → Tasks 10 + 11.
- §5.6 Medios+Bio split → Task 12.
- §5.7 FAQ accordion → Task 13.
- §5.8 CTA aurora simplificada → Task 13.
- §5.9 Nav + Marquee instituciones → Tasks 6 + 14.
- §5.10 Footer-compliance → intocable, verificado Task 18.
- §6 Mobile-first breakdown → cubierto en cada Task.
- §7 A11y → ARIA en Tasks 5, 8, 14; reduced-motion en cada CSS; contraste audit Task 18.
- §9 Páginas afectadas → Tasks 15 (sobre-el-doctor) + 16 (preguntas-frecuentes).
- §10 Verificación → Task 18.

**2. Placeholder scan:** Sin TBDs. Cuando un step requiere contenido que solo el cliente puede aportar (verbatim Doctoralia, números reales de teléfonos), el step usa defaults razonables y deja TODO explícito en el HTML para que el cliente valide.

**3. Type consistency:**
- `.hero-split`, `.hero-split__left/right` consistentes.
- `.atmen-kicker` usado en hero, switcher-section__head, wall__head, faq-accordion__head, todos referencian la misma clase definida en signature.css Task 2.
- `.agendar`, `.agendar__btn`, `.agendar__menu`, `.agendar__item` consistentes Tasks 3 + 5.
- `.sw-item`, `.sw-detail`, `.sw-pillar` consistentes Tasks 7 + 8.
- `.marquee-row--r1/r2/r3` y `.tcard` consistentes Tasks 10 + 11.
- `.faq-item` reusado en Task 13 (landing) y Task 16 (FAQ page).
- `.splits-2up` + `.split-cell` reusado Tasks 9 + 12.

Plan listo. Ningún placeholder técnico. Ningún gap de spec coverage. Type consistency limpia.
