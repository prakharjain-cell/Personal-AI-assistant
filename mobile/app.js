const toast = document.querySelector('#toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// Search filters the sample vault locally, so the interaction works without a backend.
const searchInput = document.querySelector('#searchInput');
function filterDocuments() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll('.document-row').forEach(row => {
    const matches = row.dataset.name.toLowerCase().includes(query);
    row.hidden = !matches;
    if (matches) visible++;
  });
  document.querySelector('#emptyState').hidden = visible > 0;
}
searchInput.addEventListener('input', filterDocuments);
document.querySelector('#searchButton').addEventListener('click', () => {
  filterDocuments();
  showToast(searchInput.value.trim() ? 'Showing matching documents in your vault.' : 'Type a name to search your vault.');
});
document.querySelectorAll('.suggestion').forEach(button => button.addEventListener('click', () => {
  searchInput.value = button.textContent.replace(/[“”]/g, '');
  searchInput.focus();
  filterDocuments();
}));

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
  if (files.length) showToast(`${files.length} file${files.length === 1 ? '' : 's'} added to recent documents.`);
  filterDocuments();
}
fileInput.addEventListener('change', () => { addFiles(fileInput.files); fileInput.value = ''; });

const taskDialog = document.querySelector('#taskDialog');
function openTaskDialog() { document.querySelector('#taskDate').value = new Date().toISOString().slice(0, 10); taskDialog.showModal(); }
document.querySelector('#addTask').addEventListener('click', openTaskDialog);
document.querySelectorAll('[data-action="task"]').forEach(button => button.addEventListener('click', openTaskDialog));
document.querySelector('#saveTask').addEventListener('click', event => {
  const title = document.querySelector('#taskTitle');
  if (!title.value.trim()) { event.preventDefault(); title.focus(); return; }
  const item = document.createElement('div'); item.className = 'task-item';
  const indicator = document.createElement('span'); indicator.className = 'task-indicator later';
  const info = document.createElement('div'); const task = document.createElement('b'); task.textContent = title.value.trim();
  const date = document.createElement('small'); date.textContent = document.querySelector('#taskDate').value || 'No due date'; info.append(task, date);
  const check = document.createElement('button'); check.className = 'check-task'; check.setAttribute('aria-label', `Mark ${title.value.trim()} complete`);
  item.append(indicator, info, check); document.querySelector('.tasks-panel').insertBefore(item, document.querySelector('.all-tasks'));
  setTimeout(() => { title.value = ''; showToast('Task added to your list.'); }, 0);
});

// Event delegation keeps completion toggles working for newly created tasks.
document.querySelector('.tasks-panel').addEventListener('click', event => {
  if (event.target.closest('.check-task')) event.target.closest('.task-item').classList.toggle('done');
});
document.querySelectorAll('[data-action="upload"]').forEach(button => button.addEventListener('click', () => fileInput.click()));
document.querySelectorAll('[data-action="find"]').forEach(button => button.addEventListener('click', () => { searchInput.focus(); searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); }));
document.querySelectorAll('[data-action="ask"]').forEach(button => button.addEventListener('click', () => { searchInput.focus(); searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); showToast('Ask a question about the documents in your vault.'); }));
document.querySelector('#tipAsk').addEventListener('click', () => { searchInput.focus(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
document.querySelectorAll('#viewAll,#mobileViewAll').forEach(button => button.addEventListener('click', () => { searchInput.value = ''; filterDocuments(); showToast('Showing all documents in your vault.'); }));
document.querySelector('#allTasks').addEventListener('click', () => showToast('You’re viewing the tasks coming up this week.'));
document.querySelector('#overviewButton').addEventListener('click', () => showToast('Your personal workspace is ready.'));
document.querySelector('.menu-button').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
  document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'));
  link.classList.add('active');
  if (window.innerWidth <= 760) document.querySelector('.sidebar').classList.remove('open');
  if (link.getAttribute('href') !== '#home') showToast(`${link.textContent.trim()} is ready for the next build step.`);
}));
