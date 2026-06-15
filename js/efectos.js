/* Respira Mejor — Efectos y animaciones (sobre el diseño actual, sin cambiarlo).
   1) Conteo animado de las cifras del hero
   2) Línea de respiración (firma flujo-volumen) que se traza al cargar
   3) Parallax muy ligero de esa firma al hacer scroll
   4) Aparición escalonada de las tarjetas de padecimientos
   Todo respeta prefers-reduced-motion y degrada con gracia si algo falla. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- 1) Conteo animado de las cifras del hero ---------- */
  (function countUp() {
    var stats = document.querySelector('.hero-stats');
    if (!stats) return;
    var nums = Array.prototype.map.call(stats.querySelectorAll('b'), function (b) {
      var node = b.childNodes[0];                 // nodo de texto con el número
      if (!node || node.nodeType !== 3) return null;
      var raw = node.nodeValue.trim();
      var target = parseFloat(raw);
      if (isNaN(target)) return null;
      return { node: node, target: target, dec: raw.indexOf('.') >= 0 ? 1 : 0, raw: raw };
    }).filter(Boolean);
    if (!nums.length) return;

    function run() {
      if (reduce) { nums.forEach(function (n) { n.node.nodeValue = n.raw; }); return; }
      var start = null, dur = 1500;
      function frame(t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);            // easeOutCubic
        nums.forEach(function (n) { n.node.nodeValue = (n.target * e).toFixed(n.dec); });
        if (p < 1) requestAnimationFrame(frame);
        else nums.forEach(function (n) { n.node.nodeValue = n.raw; });
      }
      // arranca desde 0 y anima
      nums.forEach(function (n) { n.node.nodeValue = (0).toFixed(n.dec); });
      requestAnimationFrame(frame);
    }

    if (!hasIO) { run(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); run(); } });
    }, { threshold: 0.4 });
    io.observe(stats);
  })();

  /* ---------- 2) + 3) Línea de respiración: trazo + parallax ---------- */
  (function breathLine() {
    var host = document.querySelector('.atmen-flow-bg');
    if (!host) return;
    var SVG = '<svg viewBox="0 0 600 400" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" '
      + 'style="position:absolute;right:0;bottom:0;width:90%;height:auto;overflow:visible">'
      + '<g fill="none" stroke="#06a77d" stroke-width="1" opacity="0.22">'
      + '<path d="M40 320 Q70 110 160 80 Q230 60 320 95 Q420 130 500 210 Q540 270 480 320 Q400 340 300 330 Q180 320 40 320 Z"/>'
      + '<path d="M60 310 Q90 150 180 120 Q250 105 330 135 Q410 165 480 230 Q510 270 460 310 Q380 325 290 320 Q170 315 60 310"/>'
      + '</g></svg>';
    host.style.background = 'none';
    host.innerHTML = SVG;
    var paths = host.querySelectorAll('path');

    if (reduce) return; // sin trazo ni parallax con motion reducido (queda dibujada)

    Array.prototype.forEach.call(paths, function (p, i) {
      var len;
      try { len = p.getTotalLength(); } catch (e) { return; }
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      if (p.animate) {
        p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
          { duration: 2200, delay: 300 + i * 260, easing: 'cubic-bezier(0.23,1,0.32,1)', fill: 'forwards' });
      } else { p.style.strokeDashoffset = 0; }
    });

    // Parallax muy ligero (sólo traslación vertical; la respiración usa opacidad en CSS)
    var ticking = false, factor = 0.07;
    function onScroll() {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY * factor, 60);
        host.style.transform = 'translate3d(0,' + y + 'px,0)';
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  /* ---------- 4) Aparición escalonada de las tarjetas de padecimientos ---------- */
  (function staggerCards() {
    if (reduce || !hasIO) return;
    var grid = document.querySelector('.dx-grid');
    if (!grid) return;
    var cards = grid.querySelectorAll('.dx-card');
    if (!cards.length) return;
    Array.prototype.forEach.call(cards, function (c) { c.style.opacity = '0'; c.style.transform = 'translateY(14px)'; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.disconnect();
        Array.prototype.forEach.call(cards, function (c, i) {
          if (c.animate) {
            c.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }],
              { duration: 520, delay: i * 60, easing: 'cubic-bezier(0.23,1,0.32,1)', fill: 'forwards' });
          } else { c.style.opacity = '1'; c.style.transform = 'none'; }
        });
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(grid);
  })();
})();
