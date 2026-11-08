const search = document.querySelector('#vaultSearch');
let rows = [...document.querySelectorAll('.vault-row')];
const emptyState = document.querySelector('#vaultEmpty');
const countLabel = document.querySelector('#resultsCount');
const toast = document.querySelector('#vaultToast');
let activeCategory = 'all';
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
function updateList() {
  const query = search.value.trim().toLowerCase();
  let count = 0;
  rows.forEach(row => {
    const matches = (activeCategory === 'all' || row.dataset.category === activeCategory) && row.dataset.name.includes(query);
    row.hidden = !matches;
    if (matches) count++;
  });
  emptyState.hidden = count > 0;
  emptyState.textContent = rows.length === 0
    ? 'Your vault is empty. Add a document to get started.'
    : 'No documents match those filters.';
  countLabel.textContent = `Showing ${count} document${count === 1 ? '' : 's'}`;
  document.querySelector('#documentCount').textContent = `${rows.length} file${rows.length === 1 ? '' : 's'}`;
  document.querySelector('#allFilterCount').textContent = rows.length;
  const categories = new Set(rows.map(row => row.dataset.category));
  document.querySelector('#categoryCount').textContent = `${categories.size} categor${categories.size === 1 ? 'y' : 'ies'}`;
  const totalBytes = rows.reduce((sum, row) => sum + Number(row.dataset.size || 0), 0);
  const used = totalBytes >= 1024 * 1024 ? `${(totalBytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(totalBytes / 1024)} KB`;
  document.querySelector('#storageUsed').textContent = used;
  document.querySelector('#sidebarStorage').textContent = `${used} of 10 GB`;
  document.querySelector('#sidebarProgress').style.width = `${Math.min(100, totalBytes / (10 * 1024 * 1024 * 1024) * 100)}%`;
}
search.addEventListener('input', updateList);
document.querySelectorAll('.category-tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelector('.category-tab.active').classList.remove('active');
  tab.classList.add('active');
  activeCategory = tab.dataset.filter;
  updateList();
}));
const fileInput = document.querySelector('#vaultFileInput');
function addFiles(files) {
  [...files].forEach(file => {
    const row = document.createElement('article'); row.className = 'vault-row';
    row.dataset.category = 'other'; row.dataset.name = `${file.name} uploaded`;
    row.dataset.size = file.size;
    const icon = document.createElement('span'); icon.className = `file-icon ${file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image-file'}`; icon.textContent = file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : '▧';
    const info = document.createElement('div'); info.className = 'vault-file';
    const title = document.createElement('b'); title.textContent = file.name;
    const subtitle = document.createElement('small'); subtitle.textContent = 'Selected just now · demo only'; info.append(title, subtitle);
    const category = document.createElement('span'); category.className = 'category'; category.textContent = 'New';
    const size = document.createElement('span'); size.className = 'file-size'; size.textContent = file.size < 1024 * 1024 ? `${Math.max(1, Math.round(file.size / 1024))} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`;
    const date = document.createElement('span'); date.className = 'file-date'; date.textContent = 'Today';
    const more = document.createElement('button'); more.className = 'more-button'; more.textContent = '···'; more.setAttribute('aria-label', `More options for ${file.name}`);
    row.append(icon, info, category, size, date, more); document.querySelector('#vaultList').prepend(row); rows.unshift(row);
  });
  if (files.length) showToast(`${files.length} file${files.length === 1 ? '' : 's'} added to this preview. They are not uploaded or saved.`);
  updateList();
}
document.querySelectorAll('#uploadButton,#bottomUploadButton').forEach(button => button.addEventListener('click', () => fileInput.click()));
fileInput.addEventListener('change', () => {
  addFiles(fileInput.files);
  fileInput.value = ''; updateList();
});
const dropzone = document.querySelector('#vaultDropzone');
dropzone.addEventListener('dragover', event => { event.preventDefault(); dropzone.classList.add('dragging'); });
dropzone.addEventListener('dragleave', event => { if (!dropzone.contains(event.relatedTarget)) dropzone.classList.remove('dragging'); });
dropzone.addEventListener('drop', event => { event.preventDefault(); dropzone.classList.remove('dragging'); addFiles(event.dataTransfer.files); });
document.querySelector('.menu-button').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
updateList();
