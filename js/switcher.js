// Atmen — Padecimientos: explorador de chips + panel único (progressive enhancement).
// Sin JS: degrada al acordeón nativo <details>. Con JS: chips (scroll horizontal en
// móvil, wrap en desktop) + un solo panel visible. Robusto y compacto.
(function () {
  function enhance(root) {
    const items = Array.from(root.querySelectorAll('.sw-item'));
    if (items.length < 2) return;

    const tablist = document.createElement('div');
    tablist.className = 'cond-tabs';
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-label', 'Padecimientos que trato');

    const panels = document.createElement('div');
    panels.className = 'cond-panels';

    const tabs = [];
    const pans = [];

    items.forEach((it, i) => {
      const numEl = it.querySelector('.sw-num');
      const nameEl = it.querySelector('.sw-name');
      const detail = it.querySelector('.sw-detail');
      if (!nameEl || !detail) return;
      const num = numEl ? numEl.textContent.trim() : String(i + 1);
      const name = nameEl.textContent.trim();

      const tabId = 'cond-tab-' + i;
      const panId = 'cond-pan-' + i;

      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'cond-tab';
      tab.id = tabId;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panId);
      tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      tab.tabIndex = i === 0 ? 0 : -1;
      tab.innerHTML = '<span class="cond-tab__n">' + num + '</span><span>' + name + '</span>';

      const pan = document.createElement('div');
      pan.className = 'cond-panel';
      pan.id = panId;
      pan.setAttribute('role', 'tabpanel');
      pan.setAttribute('aria-labelledby', tabId);
      pan.hidden = i !== 0;
      pan.appendChild(detail); // mueve el nodo de detalle existente

      tab.addEventListener('click', () => activate(i));
      tablist.appendChild(tab);
      panels.appendChild(pan);
      tabs.push(tab);
      pans.push(pan);
    });

    function activate(i) {
      tabs.forEach((t, k) => {
        const on = k === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        pans[k].hidden = !on;
      });
      // centra el chip activo en móvil
      tabs[i].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }

    tablist.addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let n = i;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = tabs.length - 1;
      else return;
      e.preventDefault();
      activate(n);
      tabs[n].focus();
    });

    root.innerHTML = '';
    root.appendChild(tablist);
    root.appendChild(panels);
    root.classList.add('is-enhanced');
  }

  document.querySelectorAll('[data-switcher]').forEach(enhance);
})();

// FAQ single-open (acordeón landing)
(function () {
  const list = document.querySelector('[data-faq]');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('.faq-item'));
  items.forEach((it) => it.addEventListener('toggle', () => {
    if (it.open) items.forEach((o) => { if (o !== it && o.open) o.open = false; });
  }));
})();
