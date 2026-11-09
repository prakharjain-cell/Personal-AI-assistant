// The Vault renders the shared browser-only document details and lets you favorite files.
const search = document.querySelector('#vaultSearch');
const vaultList = document.querySelector('#vaultList');
const emptyState = document.querySelector('#vaultEmpty');
const countLabel = document.querySelector('#resultsCount');
const toast = document.querySelector('#vaultToast');
const documentStore = window.AnvayaDocuments;
let activeCategory = 'all';
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function formatFileSize(bytes) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatAddedDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Recently' : new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function makeVaultRow(documentInfo) {
  const row = document.createElement('article');
  row.className = 'vault-row';
  row.dataset.id = documentInfo.id;
  row.dataset.category = documentInfo.category || 'other';
  row.dataset.name = documentInfo.name.toLowerCase();
  row.dataset.size = documentInfo.size;

  const isPdf = documentInfo.name.toLowerCase().endsWith('.pdf');
  const icon = document.createElement('span');
  icon.className = `file-icon ${isPdf ? 'pdf' : 'image-file'}`;
  icon.textContent = isPdf ? 'PDF' : '▧';
  const info = document.createElement('div');
  info.className = 'vault-file';
  const name = document.createElement('b');
  name.textContent = documentInfo.name;
  const subtitle = document.createElement('small');
  subtitle.textContent = documentInfo.favorite ? 'Favorite · details only' : 'Details only · file stays on your device';
  info.append(name, subtitle);

  const category = document.createElement('span');
  category.className = 'category';
  category.textContent = documentInfo.category === 'other' ? 'Other' : documentInfo.category;
  const size = document.createElement('span');
  size.className = 'file-size';
  size.textContent = formatFileSize(documentInfo.size);
  const date = document.createElement('span');
  date.className = 'file-date';
  date.textContent = formatAddedDate(documentInfo.addedAt);

  const details = document.createElement('details');
  details.className = 'vault-document-options';
  const summary = document.createElement('summary');
  summary.textContent = '···';
  summary.setAttribute('aria-label', `More options for ${documentInfo.name}`);
  const menu = document.createElement('div');
  menu.className = 'vault-document-menu';
  menu.dataset.dropdownPanel = '';
  const favorite = document.createElement('button');
  favorite.type = 'button';
  favorite.dataset.vaultAction = 'favorite';
  favorite.dataset.documentId = documentInfo.id;
  favorite.textContent = documentInfo.favorite ? 'Remove from Favorites' : 'Mark as important';
  menu.append(favorite);
  details.append(summary, menu);
  window.AnvayaDropdownMotion.enable(details);

  row.append(icon, info, category, size, date, details);
  return row;
}

function renderDocuments() {
  const documents = documentStore.read().sort((left, right) => new Date(right.addedAt) - new Date(left.addedAt));
  vaultList.querySelectorAll('.vault-row').forEach(row => row.remove());
  documents.forEach(documentInfo => vaultList.append(makeVaultRow(documentInfo)));

  const query = search.value.trim().toLowerCase();
  const rows = [...vaultList.querySelectorAll('.vault-row')];
  let visibleCount = 0;
  rows.forEach(row => {
    const matches = (activeCategory === 'all' || row.dataset.category === activeCategory) && row.dataset.name.includes(query);
    row.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  emptyState.hidden = visibleCount > 0;
  emptyState.textContent = documents.length === 0
    ? 'Your vault is empty. Add a document to get started.'
    : 'No documents match those filters.';
  countLabel.textContent = `Showing ${visibleCount} document${visibleCount === 1 ? '' : 's'}`;
  document.querySelector('#documentCount').textContent = `${documents.length} file${documents.length === 1 ? '' : 's'}`;
  document.querySelector('#allFilterCount').textContent = documents.length;

  const categories = new Set(documents.map(documentInfo => documentInfo.category || 'other'));
  document.querySelector('#categoryCount').textContent = `${categories.size} categor${categories.size === 1 ? 'y' : 'ies'}`;
  const totalBytes = documents.reduce((sum, documentInfo) => sum + Number(documentInfo.size || 0), 0);
  const used = totalBytes === 0 ? '0 MB' : totalBytes >= 1024 * 1024 ? `${(totalBytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(totalBytes / 1024))} KB`;
  document.querySelector('#storageUsed').textContent = used;
  document.querySelector('#sidebarStorage').textContent = `${used} of 10 GB`;
  document.querySelector('#sidebarProgress').style.width = `${Math.min(100, totalBytes / (10 * 1024 * 1024 * 1024) * 100)}%`;
}

search.addEventListener('input', renderDocuments);
document.querySelectorAll('.category-tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelector('.category-tab.active').classList.remove('active');
  tab.classList.add('active');
  activeCategory = tab.dataset.filter;
  renderDocuments();
}));

const fileInput = document.querySelector('#vaultFileInput');
function addFiles(files) {
  const added = documentStore.addFiles(files);
  if (added.length) showToast(`${added.length} document detail${added.length === 1 ? '' : 's'} saved in this browser. File contents were not uploaded or saved.`);
  renderDocuments();
}

document.querySelectorAll('#uploadButton,#bottomUploadButton').forEach(button => button.addEventListener('click', () => fileInput.click()));
fileInput.addEventListener('change', () => { addFiles(fileInput.files); fileInput.value = ''; });

const dropzone = document.querySelector('#vaultDropzone');
dropzone.addEventListener('dragover', event => { event.preventDefault(); dropzone.classList.add('dragging'); });
dropzone.addEventListener('dragleave', event => { if (!dropzone.contains(event.relatedTarget)) dropzone.classList.remove('dragging'); });
dropzone.addEventListener('drop', event => { event.preventDefault(); dropzone.classList.remove('dragging'); addFiles(event.dataTransfer.files); });

document.addEventListener('click', event => {
  const action = event.target.closest('[data-vault-action="favorite"]');
  if (!action) return;
  const documentInfo = documentStore.read().find(item => item.id === action.dataset.documentId);
  if (!documentInfo) return;
  documentStore.setFavorite(documentInfo.id, !documentInfo.favorite);
  renderDocuments();
  showToast(documentInfo.favorite ? 'Removed from Favorites.' : 'Added to Favorites.');
});

document.addEventListener('click', event => {
  document.querySelectorAll('.vault-document-options[open]').forEach(menu => {
    if (!menu.contains(event.target)) window.AnvayaDropdownMotion.close(menu);
  });
});

renderDocuments();
