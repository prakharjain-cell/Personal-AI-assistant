const authForm = document.querySelector('#authForm');
const password = document.querySelector('#authPassword');
const nameInput = document.querySelector('#authName');
const message = document.querySelector('#authMessage');
let authMode = 'login';
function setMode(mode) {
  authMode = mode;
  const signingUp = mode === 'signup';
  document.querySelectorAll('.auth-tab').forEach(tab => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('.signup-only').forEach(element => { element.hidden = !signingUp; });
  document.querySelectorAll('.login-only').forEach(element => { element.hidden = signingUp; });
  nameInput.required = signingUp;
  document.querySelector('#authTitle').textContent = signingUp ? 'Create your account' : 'Log in to your account';
  document.querySelector('#authSubtitle').textContent = signingUp ? 'Start building your personal workspace.' : 'Continue to your personal workspace.';
  document.querySelector('#authSubmit').textContent = signingUp ? 'Create account' : 'Log in';
  password.autocomplete = signingUp ? 'new-password' : 'current-password';
  message.textContent = 'Preview only: authentication is not connected. Passwords are never saved here.';
}
document.querySelectorAll('.auth-tab').forEach(tab => tab.addEventListener('click', () => setMode(tab.dataset.mode)));
document.querySelector('#togglePassword').addEventListener('click', event => {
  const showing = password.type === 'text';
  password.type = showing ? 'password' : 'text';
  event.currentTarget.textContent = showing ? 'Show' : 'Hide';
  event.currentTarget.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
});
document.querySelector('#forgotPassword').addEventListener('click', () => {
  message.textContent = 'Password reset becomes available after account authentication is connected.';
  message.classList.add('auth-message-info');
});
authForm.addEventListener('submit', event => {
  event.preventDefault();
  message.textContent = authMode === 'signup'
    ? 'Sign-up preview only. No account was created and your password was not saved or sent. Opening the workspace preview…'
    : 'Login preview only. Your credentials are not checked, saved, or sent. Opening the workspace preview…';
  message.classList.add('auth-message-info');
  password.value = '';
  const submitButton = document.querySelector('#authSubmit');
  submitButton.disabled = true;
  const allowedDestinations = new Set(['dashboard.html', 'vault.html', 'ask.html', 'integrations.html', 'tasks.html', 'settings.html']);
  const next = new URLSearchParams(window.location.search).get('next');
  const destination = allowedDestinations.has(next) ? next : 'dashboard.html';
  try {
    sessionStorage.setItem('personal-ai-demo-authenticated', 'true');
    sessionStorage.setItem('personal-ai-demo-entry', 'true');
  } catch { /* This remains a navigation demo if session storage is unavailable. */ }
  document.body.classList.add('auth-leaving');
  window.setTimeout(() => { window.location.href = destination; }, 260);
});
const requestedMode = new URLSearchParams(window.location.search).get('mode');
setMode(requestedMode === 'signup' ? 'signup' : 'login');
