const PREFS_KEY = 'personal-assistant-preferences-v1';
const PROFILE_KEY = 'personal-assistant-profile-v1';
const notice = document.querySelector('#settingsNotice');
function announce(message) {
  notice.textContent = message;
  notice.classList.add('visible');
  window.clearTimeout(announce.timer);
  announce.timer = window.setTimeout(() => notice.classList.remove('visible'), 3200);
}
function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
const preferences = readJson(PREFS_KEY, { taskReminders: true, productUpdates: false });
document.querySelectorAll('[data-preference]').forEach(toggle => {
  const key = toggle.dataset.preference;
  toggle.checked = Boolean(preferences[key]);
  toggle.addEventListener('change', () => {
    preferences[key] = toggle.checked;
    localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
    announce('Preference saved on this device.');
  });
});
const profileForm = document.querySelector('#profileForm');
const profile = readJson(PROFILE_KEY, {});
document.querySelector('#profileName').value = profile.name ?? '';
document.querySelector('#profileEmail').value = profile.email ?? '';
if (profile.name || profile.email) document.querySelector('#profileStatus').textContent = 'Profile saved on this device.';
profileForm.addEventListener('submit', event => {
  event.preventDefault();
  const savedProfile = {
    name: document.querySelector('#profileName').value.trim(),
    email: document.querySelector('#profileEmail').value.trim()
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(savedProfile));
  document.querySelector('#profileStatus').textContent = 'Profile saved on this device.';
  announce('Profile saved as local JSON in this browser.');
});
document.querySelector('#clearTasks').addEventListener('click', () => {
  if (!window.confirm('Delete all tasks saved by this prototype in this browser?')) return;
  localStorage.removeItem('personal-assistant-tasks-v1');
  localStorage.removeItem('personal-assistant-tasks-v2');
  announce('Saved tasks cleared.');
});
document.querySelector('#endDemoSession').addEventListener('click', () => {
  try {
    sessionStorage.removeItem('personal-ai-demo-authenticated');
    sessionStorage.removeItem('personal-ai-demo-entry');
  } catch { /* Continue to the welcome page even if storage is unavailable. */ }
  window.location.href = 'landing.html';
});
