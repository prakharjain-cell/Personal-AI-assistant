const STORAGE_KEY = 'personal-assistant-tasks-v2';
// Clear the prototype's seeded task list at the user's request.
try {
  if (!localStorage.getItem('personal-assistant-reset-empty-v1')) {
    localStorage.removeItem('personal-assistant-tasks-v1');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem('personal-assistant-reset-empty-v1', 'done');
  }
} catch { /* Ignore unavailable storage. */ }
const list = document.querySelector('#taskList');
const dialog = document.querySelector('#taskEditor');
const form = document.querySelector('#taskForm');
const titleInput = document.querySelector('#taskTitle');
const dateInput = document.querySelector('#taskDueDate');
const priorityInput = document.querySelector('#taskPriority');
const searchInput = document.querySelector('#taskSearch');
const toast = document.querySelector('#taskToast');
let filter = 'all';
let editingId = null;
let toastTimer;
const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const addDays = count => { const date = new Date(); date.setDate(date.getDate() + count); return dateKey(date); };
const dateLabel = value => {
  if (!value) return 'No due date';
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = dateKey(new Date());
  if (value === today) return 'Today';
  if (value === addDays(1)) return 'Tomorrow';
  return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};
const makeId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch { /* Start with an empty list if storage is unavailable or malformed. */ }
  return [];
}
let tasks = loadTasks();
function saveTasks() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
  catch { showToast('Browser storage is unavailable. Changes may not persist.'); }
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}
function render() {
  const today = dateKey(new Date());
  document.querySelector('#dueTodayCount').textContent = tasks.filter(task => !task.done && task.dueDate === today).length;
  document.querySelector('#upcomingCount').textContent = tasks.filter(task => !task.done && task.dueDate > today).length;
  document.querySelector('#completedCount').textContent = tasks.filter(task => task.done).length;
  const query = searchInput.value.trim().toLowerCase();
  const shown = tasks.filter(task => {
    const statusMatch = filter === 'all' || (filter === 'open' && !task.done) || (filter === 'done' && task.done);
    return statusMatch && task.title.toLowerCase().includes(query);
  }).sort((a, b) => (a.done - b.done) || (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
  list.replaceChildren();
  shown.forEach(task => {
    const row = document.createElement('article'); row.className = `full-task-row${task.done ? ' completed' : ''}`;
    const check = document.createElement('button'); check.className = 'full-task-check'; check.setAttribute('aria-label', task.done ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`); check.textContent = task.done ? '✓' : '';
    check.addEventListener('click', () => { task.done = !task.done; saveTasks(); render(); });
    const info = document.createElement('div'); info.className = 'full-task-info';
    const name = document.createElement('b'); name.textContent = task.title;
    const meta = document.createElement('small'); meta.textContent = task.dueDate ? `Due ${dateLabel(task.dueDate)}` : 'No due date';
    info.append(name, meta);
    const priority = document.createElement('span'); priority.className = `priority-tag ${task.priority === 'high' ? 'priority-high' : ''}`; priority.textContent = task.priority === 'high' ? 'High priority' : 'Normal';
    if (task.dueDate && task.dueDate < today && !task.done) { const overdue = document.createElement('span'); overdue.className = 'overdue-tag'; overdue.textContent = 'Overdue'; row.append(check, info, overdue, priority); }
    else row.append(check, info, priority);
    const actions = document.createElement('div'); actions.className = 'full-task-actions';
    const edit = document.createElement('button'); edit.textContent = 'Edit'; edit.setAttribute('aria-label', `Edit ${task.title}`); edit.addEventListener('click', () => openEditor(task));
    const remove = document.createElement('button'); remove.textContent = 'Delete'; remove.setAttribute('aria-label', `Delete ${task.title}`); remove.addEventListener('click', () => { tasks = tasks.filter(item => item.id !== task.id); saveTasks(); render(); showToast('Task deleted.'); });
    actions.append(edit, remove); row.append(actions); list.append(row);
  });
  document.querySelector('#taskEmpty').hidden = shown.length > 0;
  document.querySelector('#taskCountLabel').textContent = `${shown.length} ${shown.length === 1 ? 'task' : 'tasks'} shown · Changes save in this browser.`;
}
function openEditor(task = null) {
  editingId = task?.id ?? null;
  document.querySelector('#taskDialogTitle').textContent = task ? 'Edit task' : 'Create a task';
  titleInput.value = task?.title ?? '';
  dateInput.value = task?.dueDate ?? '';
  priorityInput.value = task?.priority ?? 'normal';
  dialog.showModal();
  titleInput.focus();
}
function closeEditor() { dialog.close(); form.reset(); editingId = null; }
document.querySelector('#openTaskForm').addEventListener('click', () => openEditor());
document.querySelector('#closeTaskForm').addEventListener('click', closeEditor);
document.querySelector('#cancelTask').addEventListener('click', closeEditor);
form.addEventListener('submit', event => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;
  const wasEditing = Boolean(editingId);
  if (editingId) {
    const task = tasks.find(item => item.id === editingId);
    Object.assign(task, { title, dueDate: dateInput.value, priority: priorityInput.value });
  } else {
    tasks.push({ id: makeId(), title, dueDate: dateInput.value, priority: priorityInput.value, done: false });
  }
  saveTasks(); closeEditor(); render(); showToast(wasEditing ? 'Task updated.' : 'Task added.');
});
document.querySelectorAll('.task-filter').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.task-filter.active').classList.remove('active'); button.classList.add('active'); filter = button.dataset.filter; render();
}));
searchInput.addEventListener('input', render);
document.querySelector('.menu-button').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
render();
