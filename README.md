# Respira Mejor

Sitio web profesional del **Dr. Robinson Emanuel Robles Hernández**, neumólogo investigador en CDMX. Adscrito a la Clínica de Tabaquismo y EPOC del INER y consulta privada en Médica Sur.

Sitio HTML estático construido siguiendo el playbook médico (versión 1.0, mayo 2026), servido desde GitHub Pages.

## Estado

**Fase 1 — primer release:** landing (`/`) y sobre el doctor (`/sobre-el-doctor/`) + aviso de privacidad LFPDPPP 2025 (draft) + 404. Las páginas de enfermedades, servicios, FAQ central y recursos se construyen en fases posteriores (módulos 16 del playbook).

## Desarrollo local

Sin build step. Para preview:

```bash
python -m http.server 8000
```

Abrir http://localhost:8000

## Deploy

Push a `main` → auto-deploy en GitHub Pages.

Dominio de producción: **respiramejorcdmx.mx**, servido por GitHub Pages con DNS y HTTPS gestionados en Cloudflare (dominio registrado en Akky, nameservers apuntando a Cloudflare). El archivo `CNAME` del repo fija el dominio personalizado.

## Activar pre-commit hook (anti-mojibake)

Una sola vez en cada clon del repo:

```bash
git config core.hooksPath .githooks
chmod +x .githooks/pre-commit
```

El hook rechaza commits con secuencias UTF-8 mal codificadas a Win-1252 (las que aparecen cuando un editor guarda como CP1252 un archivo que originalmente era UTF-8). Ver el patrón regex en `.githooks/pre-commit`.

## Estructura

```
/
├── index.html                          Landing
├── 404.html
├── sobre-el-doctor/index.html
├── aviso-de-privacidad/index.html      LFPDPPP 2025 / SABG (draft)
├── CNAME                                respiramejorcdmx.mx
├── .nojekyll
├── robots.txt                           Whitelist bots IA
├── sitemap.xml
├── llms.txt
├── manifest.webmanifest
├── css/
│   ├── tokens.css                       Design tokens (azul claro + verde)
│   └── site.css                         Componentes
├── js/
│   ├── reveal.js                        IntersectionObserver reveal-up
│   └── datalayer.js                     dataLayer stub (GTM pendiente)
├── images/                              Logos institucionales + portrait + OG
└── .githooks/
    └── pre-commit                        Anti-mojibake
```

## Convención de commits

```
<tipo>(<scope>): <imperativo, ≤50 chars>
```

Tipos: `feat` · `fix` · `seo` · `a11y` · `perf` · `legal` · `chore` · `docs`.
Scopes típicos: `(visible)` · `(invisible)` · `(home)` · `(sobre-el-doctor)` · `(legal)` · `(schema)` · `(tokens)`.

## Recursos externos referenciados

- Doctoralia: https://www.doctoralia.com.mx/robinson-robles/neumologo/ciudad-de-mexico
- Google Scholar: https://scholar.google.com/citations?user=r5pw7WwAAAAJ&hl=es
- ORCID: 0000-0003-3708-7368

## Compliance

- COFEPRIS Aviso de Publicidad Modalidad A: **emitido, folio 2609082002A00121** (declarado en `top-bar-legal` y footer compliance de todas las páginas).
- Cédula Profesional: 10431658
- Cédula de Especialidad en Neumología: 12440475
- Consejo Nacional de Neumología y Cirugía de Tórax: folio 1509, vigente hasta 2031.

## Pendientes ({{PARAM}}) bloqueantes para go-live

- [ ] Foto profesional ≥ 2000×2500 px (actualmente placeholder SVG).
- [x] Folio COFEPRIS emitido (2609082002A00121).
- [ ] Aviso de Privacidad firmado por el médico (texto draft listo).
- [ ] Año del título de Médico Cirujano y universidad (asumido UNAM).
- [x] Email de contacto operativo (`robinsonrobher@gmail.com`).
- [ ] Cal.com / agendamiento URL.
- [ ] Coordenadas GPS exactas Médica Sur Torre 1 (verificar 7 decimales).
- [ ] Confirmar teléfono oficial único.
- [ ] GTM ID + GA4 ID si se decide instalar tracking.
