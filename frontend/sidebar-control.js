// Shared sidebar behavior: collapsible on desktop and a drawer on small screens.
(() => {
  const shell = document.querySelector('.app-shell');
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('.menu-button');
  if (!shell || !sidebar || !toggle) return;

  const desktop = window.matchMedia('(min-width: 761px)');
  const preferenceKey = 'personal-ai-sidebar-collapsed-v1';

  function applyViewportMode() {
    if (desktop.matches) {
      sidebar.classList.remove('open');
      let collapsed = false;
      try { collapsed = localStorage.getItem(preferenceKey) === 'true'; } catch { /* Use expanded by default. */ }
      shell.classList.toggle('sidebar-collapsed', collapsed);
      toggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
      toggle.setAttribute('aria-expanded', String(!collapsed));
    } else {
      shell.classList.remove('sidebar-collapsed');
      sidebar.classList.remove('open');
      toggle.setAttribute('aria-label', 'Open navigation');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  toggle.addEventListener('click', () => {
    if (desktop.matches) {
      const collapsed = shell.classList.toggle('sidebar-collapsed');
      toggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
      toggle.setAttribute('aria-expanded', String(!collapsed));
      try { localStorage.setItem(preferenceKey, String(collapsed)); } catch { /* It still works for this page. */ }
      return;
    }
    const open = sidebar.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });

  sidebar.querySelectorAll('.nav-link').forEach(link => {
    if (!link.hasAttribute('title')) link.title = link.textContent.trim();
    link.addEventListener('click', () => {
      if (!desktop.matches) {
        sidebar.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
      }
    });
  });

  desktop.addEventListener('change', applyViewportMode);
  applyViewportMode();
})();
