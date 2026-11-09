// Adds subtle opening and closing motion while keeping native <details> accessibility.
(() => {
  const openKeyframes = [
    { opacity: 0, transform: 'translateY(-5px) scale(.98)' },
    { opacity: 1, transform: 'translateY(0) scale(1)' }
  ];
  const closeKeyframes = [...openKeyframes].reverse();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function close(details) {
    if (!details.open || details.dataset.closing === 'true') return;
    const panel = details.querySelector('[data-dropdown-panel]');
    if (reduceMotion || !panel || !panel.animate) { details.open = false; return; }
    details.dataset.closing = 'true';
    const animation = panel.animate(closeKeyframes, { duration: 130, easing: 'ease-in', fill: 'forwards' });
    animation.onfinish = () => {
      details.open = false;
      delete details.dataset.closing;
    };
  }

  function enable(details) {
    const summary = details.querySelector('summary');
    const panel = details.querySelector('[data-dropdown-panel]');
    if (!summary || !panel || details.dataset.motionEnabled) return;
    details.dataset.motionEnabled = 'true';

    summary.addEventListener('click', event => {
      if (details.open) {
        event.preventDefault();
        close(details);
      }
    });
    details.addEventListener('toggle', () => {
      if (details.open && !reduceMotion && panel.animate) panel.animate(openKeyframes, { duration: 150, easing: 'ease-out' });
    });
  }

  window.AnvayaDropdownMotion = { enable, close };
})();
