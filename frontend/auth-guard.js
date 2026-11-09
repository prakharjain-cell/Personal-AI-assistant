// Preview-only navigation gate. This is not authentication or a security boundary.
(() => {
  const protectedPages = new Set([
    'dashboard.html', 'vault.html', 'ask.html',
    'integrations.html', 'tasks.html', 'settings.html'
  ]);
  const currentPage = window.location.pathname.split('/').pop().toLowerCase();
  if (!protectedPages.has(currentPage)) return;

  let hasDemoSession = false;
  try { hasDemoSession = sessionStorage.getItem('personal-ai-demo-authenticated') === 'true'; }
  catch { /* Storage may be disabled; send the visitor to the preview sign-in. */ }

  if (!hasDemoSession) {
    const next = encodeURIComponent(currentPage + window.location.hash);
    window.location.replace(`signin.html?mode=login&next=${next}`);
  }
})();
