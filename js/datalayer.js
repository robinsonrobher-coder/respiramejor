/* Respira Mejor — capa de dataLayer para GTM (contenedor GTM-M7STX283, ya instalado).
 * Empuja al dataLayer en cada interacción clave; GTM escucha estos eventos,
 * crea los tags de GA4 y desde GA4 se importan como conversiones a Google Ads.
 *
 * Eventos GENÉRICOS (para análisis):
 *   cta_click    → cta_type ∈ {whatsapp, calcom, phone, email}
 *   faq_open     → cta_type = accordion
 *   scroll_depth → cta_type = scroll, cta_label ∈ {25,50,75,100}
 *   agenda_modal_open → source = data-cta del disparador (en agendar-modal.js)
 *
 * Eventos SEMÁNTICOS (mapeo 1:1 con las acciones de conversión de Google Ads,
 * ver docs/campana-google-ads-dr-robinson.md §5). Úsalos como disparadores en GTM:
 *   agendar_cita    → clic a Cal.com   (Book appointment · PRIMARIA)
 *   clic_whatsapp   → clic a WhatsApp  (Contact · PRIMARIA)
 *   llamada         → clic a tel:      (Contact/Phone · SECUNDARIA)
 *   contacto_email  → clic a mailto:   (Contact · SECUNDARIA)
 *
 * NOTA: el clic a Cal.com mide la INTENCIÓN de reserva (abre Cal.com en otra
 * pestaña), no la reserva confirmada. Para contar reservas reales, activa el
 * seguimiento de conversiones dentro de Cal.com (GA4/redirección de gracias).
 */
(function () {
  window.dataLayer = window.dataLayer || [];

  function pageSlug() {
    var p = location.pathname;
    if (p === '/' || p === '') return 'home';
    return p.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  }

  // Reenvía a GA4 (gtag) si el tag está cargado; si no, solo deja el evento en dataLayer.
  // GA4 ahora se gestiona vía GTM (contenedor GTM-M7STX283).
  // Sin envío directo a gtag para evitar doble conteo; GTM escucha estos eventos del dataLayer.
  function ga(name, params) { /* no-op: gestionado por GTM */ }

  // Mapeo de tipo de CTA → evento semántico para Google Ads (1:1 con el doc de campaña).
  var SEMANTIC_EVENT = {
    whatsapp: 'clic_whatsapp',
    calcom: 'agendar_cita',
    phone: 'llamada',
    email: 'contacto_email'
  };

  function pushCta(type, label) {
    var lbl = (label || '').substring(0, 60).trim();
    var slug = pageSlug();
    // Evento genérico (análisis).
    window.dataLayer.push({
      event: 'cta_click',
      cta_type: type,
      cta_label: lbl,
      cta_page: slug
    });
    // Evento semántico (conversión Ads): nombre estable, fácil de disparar en GTM.
    var semantic = SEMANTIC_EVENT[type];
    if (semantic) {
      window.dataLayer.push({
        event: semantic,
        cta_type: type,
        cta_label: lbl,
        cta_page: slug
      });
    }
    ga('cta_click', { cta_type: type, cta_label: lbl, cta_page: slug });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var txt = (a.innerText || a.getAttribute('aria-label') || '').trim();

    if (/wa\.me|api\.whatsapp|chat\.whatsapp/.test(href)) {
      pushCta('whatsapp', txt);
    } else if (/cal\.com/.test(href)) {
      pushCta('calcom', txt);
    } else if (/^tel:/.test(href)) {
      pushCta('phone', txt);
    } else if (/^mailto:/.test(href)) {
      pushCta('email', txt);
    }
  }, { passive: true });

  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (d.tagName !== 'DETAILS' || !d.open) return;
    var summaryEl = d.querySelector('summary');
    var summaryText = summaryEl ? summaryEl.innerText.trim() : '';
    window.dataLayer.push({
      event: 'faq_open',
      cta_type: 'accordion',
      cta_label: summaryText.substring(0, 80),
      cta_page: pageSlug()
    });
    ga('faq_open', { cta_type: 'accordion', cta_label: summaryText.substring(0, 80), cta_page: pageSlug() });
  }, true);

  var marks = [25, 50, 75, 100];
  var fired = {};
  var ticking = false;
  function checkScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (max <= 0) { ticking = false; return; }
    var scrolled = (h.scrollTop / max) * 100;
    marks.forEach(function (m) {
      if (scrolled >= m && !fired[m]) {
        fired[m] = true;
        window.dataLayer.push({
          event: 'scroll_depth',
          cta_type: 'scroll',
          cta_label: String(m),
          cta_page: pageSlug()
        });
        ga('scroll_depth', { cta_type: 'scroll', cta_label: String(m), cta_page: pageSlug() });
      }
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(checkScroll); ticking = true; }
  }, { passive: true });
})();
