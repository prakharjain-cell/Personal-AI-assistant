const toast = document.querySelector('#toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// The upload picker is ready to use; selected files appear in the recent list.
const fileInput = document.querySelector('#fileInput');
function addFiles(files) {
  [...files].forEach(file => {
    const row = document.createElement('article');
    row.className = 'document-row';
    row.dataset.name = `${file.name} Uploaded document`;
    const icon = document.createElement('span');
    icon.className = `file-icon ${file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image-file'}`;
    icon.textContent = file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : '▧';
    const name = document.createElement('div');
    name.className = 'file-name';
    const title = document.createElement('b'); title.textContent = file.name;
    const subtitle = document.createElement('small'); subtitle.textContent = 'Uploaded just now';
    name.append(title, subtitle);
    const category = document.createElement('span'); category.className = 'category'; category.textContent = 'New';
    const size = document.createElement('span'); size.className = 'file-size'; size.textContent = file.size < 1024 * 1024 ? `${Math.max(1, Math.round(file.size / 1024))} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`;
    const date = document.createElement('span'); date.className = 'file-date'; date.textContent = 'Today';
    const more = document.createElement('button'); more.className = 'more-button'; more.textContent = '···'; more.setAttribute('aria-label', `More options for ${file.name}`);
    row.append(icon, name, category, size, date, more);
    document.querySelector('#documentList').prepend(row);
  });
  if (files.length) {
    document.querySelector('#emptyState').hidden = true;
    showToast(`${files.length} file${files.length === 1 ? '' : 's'} added to recent documents.`);
  }
}
fileInput.addEventListener('change', () => { addFiles(fileInput.files); fileInput.value = ''; });

// The Tasks screen owns the saved task list so tasks remain available after refresh.
document.querySelector('.tasks-panel').addEventListener('click', event => {
  if (event.target.closest('.check-task')) event.target.closest('.task-item').classList.toggle('done');
});
document.querySelectorAll('[data-action="upload"]').forEach(button => button.addEventListener('click', () => fileInput.click()));
document.querySelector('#emptyUpload').addEventListener('click', () => fileInput.click());
document.querySelectorAll('[data-action="find"]').forEach(button => button.addEventListener('click', () => { window.location.href = 'vault.html'; }));
document.querySelectorAll('[data-action="ask"]').forEach(button => button.addEventListener('click', () => { window.location.href = 'ask.html'; }));
document.querySelectorAll('[data-action="task"]').forEach(button => button.addEventListener('click', () => { window.location.href = 'tasks.html'; }));
document.querySelector('#addTask').addEventListener('click', () => { window.location.href = 'tasks.html'; });
document.querySelector('#tipAsk').addEventListener('click', () => { window.location.href = 'ask.html'; });
document.querySelectorAll('#viewAll,#mobileViewAll').forEach(button => button.addEventListener('click', () => { window.location.href = 'vault.html'; }));
document.querySelector('#overviewButton').addEventListener('click', () => showToast('Your personal workspace is ready.'));
document.querySelector('.menu-button').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
  document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'));
  link.classList.add('active');
  if (window.innerWidth <= 760) document.querySelector('.sidebar').classList.remove('open');
  if (link.getAttribute('href') !== '#home') showToast(`${link.textContent.trim()} is ready for the next build step.`);
}));

try {
  if (sessionStorage.getItem('personal-ai-demo-entry') === 'true') {
    sessionStorage.removeItem('personal-ai-demo-entry');
    showToast('Demo mode: no account was authenticated.');
  }
} catch { /* The dashboard remains usable if session storage is unavailable. */ }
