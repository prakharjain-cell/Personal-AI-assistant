// Home's document section: the newest five files, Favorites, search, and upload preview.
const documentPicker = document.querySelector('#fileInput');
const recentDocumentList = document.querySelector('#documentList');
const documentSearch = document.querySelector('#documentSearch');
const noSearchResults = document.querySelector('#searchEmpty');
const favoritesList = document.querySelector('#favoritesList');
const favoritesEmpty = document.querySelector('#favoritesEmpty');
const documentStore = window.AnvayaDocuments;

function formatFileSize(bytes) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatAddedDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Recently' : new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
}

function makeDocumentMenu(documentInfo) {
  const details = document.createElement('details');
  details.className = 'document-options';
  const summary = document.createElement('summary');
  summary.textContent = '···';
  summary.setAttribute('aria-label', `More options for ${documentInfo.name}`);
  const menu = document.createElement('div');
  menu.className = 'document-options-menu';
  menu.dataset.dropdownPanel = '';

  const favorite = document.createElement('button');
  favorite.type = 'button';
  favorite.dataset.documentAction = 'favorite';
  favorite.dataset.documentId = documentInfo.id;
  favorite.textContent = documentInfo.favorite ? 'Remove from Favorites' : 'Mark as important';

  const openVault = document.createElement('button');
  openVault.type = 'button';
  openVault.dataset.documentAction = 'open-vault';
  openVault.textContent = 'Open all documents';

  menu.append(favorite, openVault);
  details.append(summary, menu);
  window.AnvayaDropdownMotion.enable(details);
  return details;
}

function makeRecentRow(documentInfo) {
  const row = document.createElement('article');
  row.className = 'document-row';
  row.dataset.name = documentInfo.name;

  const icon = document.createElement('span');
  const isPdf = documentInfo.name.toLowerCase().endsWith('.pdf');
  icon.className = `file-icon ${isPdf ? 'pdf' : 'image-file'}`;
  icon.textContent = isPdf ? 'PDF' : '▧';

  const file = document.createElement('div');
  file.className = 'file-name';
  const name = document.createElement('b');
  name.textContent = documentInfo.name;
  const date = document.createElement('small');
  date.textContent = documentInfo.favorite ? 'Important document' : `Added ${formatAddedDate(documentInfo.addedAt)}`;
  file.append(name, date);

  const category = document.createElement('span');
  category.className = 'category';
  category.textContent = 'Other';
  const size = document.createElement('span');
  size.className = 'file-size';
  size.textContent = formatFileSize(documentInfo.size);
  const modified = document.createElement('span');
  modified.className = 'file-date';
  modified.textContent = formatAddedDate(documentInfo.addedAt);

  row.append(icon, file, category, size, modified, makeDocumentMenu(documentInfo));
  return row;
}

function makeFavoriteRow(documentInfo) {
  const row = document.createElement('article');
  row.className = 'favorite-document-row';
  const icon = document.createElement('span');
  icon.className = 'favorite-file-icon';
  icon.textContent = documentInfo.name.toLowerCase().endsWith('.pdf') ? 'PDF' : '▧';
  const info = document.createElement('div');
  info.className = 'favorite-file-info';
  const name = document.createElement('b');
  name.textContent = documentInfo.name;
  const meta = document.createElement('small');
  meta.textContent = `${formatFileSize(documentInfo.size)} · Added ${formatAddedDate(documentInfo.addedAt)}`;
  info.append(name, meta);
  row.append(icon, info, makeDocumentMenu(documentInfo));
  return row;
}

function filterRecentDocuments() {
  const query = documentSearch.value.trim().toLocaleLowerCase();
  const rows = [...recentDocumentList.querySelectorAll('.document-row')];
  let visibleRows = 0;

  rows.forEach(row => {
    const matches = row.dataset.name.toLocaleLowerCase().includes(query);
    row.hidden = !matches;
    if (matches) visibleRows += 1;
  });
  noSearchResults.hidden = !query || rows.length === 0 || visibleRows > 0;
}

function renderDocumentSections() {
  const documents = documentStore.read().sort((left, right) => new Date(right.addedAt) - new Date(left.addedAt));
  const recent = documents.slice(0, 5);
  const favorites = documents.filter(documentInfo => documentInfo.favorite);

  recentDocumentList.querySelectorAll('.document-row').forEach(row => row.remove());
  recent.forEach(documentInfo => recentDocumentList.insertBefore(makeRecentRow(documentInfo), noSearchResults));
  document.querySelector('#emptyState').hidden = recent.length > 0;
  document.querySelector('#recentSummary').textContent = documents.length > 5
    ? `Showing the 5 newest of ${documents.length} documents.`
    : `${documents.length} recent document${documents.length === 1 ? '' : 's'}, ready when you need them.`;

  favoritesList.querySelectorAll('.favorite-document-row').forEach(row => row.remove());
  favorites.forEach(documentInfo => favoritesList.append(makeFavoriteRow(documentInfo)));
  favoritesEmpty.hidden = favorites.length > 0;
  filterRecentDocuments();
}

document.querySelector('#addDocument').addEventListener('click', () => documentPicker.click());
document.querySelector('#emptyUpload').addEventListener('click', () => documentPicker.click());
documentPicker.addEventListener('change', () => {
  const added = documentStore.addFiles(documentPicker.files);
  documentPicker.value = '';
  if (added.length) {
    renderDocumentSections();
    window.showDashboardToast(`${added.length} document detail${added.length === 1 ? '' : 's'} saved in this browser. File contents were not uploaded or saved.`);
  }
});
documentSearch.addEventListener('input', filterRecentDocuments);
document.addEventListener('click', event => {
  const action = event.target.closest('[data-document-action]');
  if (!action) return;

  if (action.dataset.documentAction === 'open-vault') {
    window.location.href = 'vault.html';
    return;
  }
  if (action.dataset.documentAction === 'favorite') {
    const documentInfo = documentStore.read().find(item => item.id === action.dataset.documentId);
    if (!documentInfo) return;
    documentStore.setFavorite(documentInfo.id, !documentInfo.favorite);
    renderDocumentSections();
    window.showDashboardToast(documentInfo.favorite ? 'Removed from Favorites.' : 'Added to Favorites.');
  }
});

document.addEventListener('click', event => {
  document.querySelectorAll('.document-options[open]').forEach(menu => {
    if (!menu.contains(event.target)) window.AnvayaDropdownMotion.close(menu);
  });
});

renderDocumentSections();
