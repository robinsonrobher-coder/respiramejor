/* Respira Mejor — site nav (mobile drawer + desktop inline)
 * Toggles .navbar__menu.is-open via burger button.
 * Closes on: ESC, link click, click outside, viewport >= 900px.
 * Honors prefers-reduced-motion (CSS handles animation removal).
 */
(function () {
  'use strict';
  var toggler = document.querySelector('.navbar__toggler');
  var menu = document.getElementById('navMenu');
  if (!toggler || !menu) return;

  var DESKTOP_MQ = window.matchMedia('(min-width: 900px)');

  function setOpen(open) {
    menu.classList.toggle('is-open', open);
    toggler.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggler.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    document.body.classList.toggle('nav-open', open);
  }

  function isOpen() {
    return menu.classList.contains('is-open');
  }

  toggler.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!isOpen());
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!isOpen()) return;
    if (menu.contains(e.target) || toggler.contains(e.target)) return;
    setOpen(false);
  });

  // Close on link click (mobile drawer)
  menu.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.tagName === 'A') setOpen(false);
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggler.focus();
    }
  });

  // Auto-close when switching to desktop
  function onMQ() {
    if (DESKTOP_MQ.matches && isOpen()) setOpen(false);
  }
  if (DESKTOP_MQ.addEventListener) DESKTOP_MQ.addEventListener('change', onMQ);
  else if (DESKTOP_MQ.addListener) DESKTOP_MQ.addListener(onMQ);
})();
