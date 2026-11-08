const search = document.querySelector('#vaultSearch');
const rows = [...document.querySelectorAll('.vault-row')];
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
  countLabel.textContent = `Showing ${count} document${count === 1 ? '' : 's'}`;
}
search.addEventListener('input', updateList);
document.querySelectorAll('.category-tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelector('.category-tab.active').classList.remove('active');
  tab.classList.add('active');
  activeCategory = tab.dataset.filter;
  updateList();
}));
const fileInput = document.querySelector('#vaultFileInput');
document.querySelector('#uploadButton').addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  [...fileInput.files].forEach(file => {
    const row = document.createElement('article'); row.className = 'vault-row';
    row.dataset.category = 'other'; row.dataset.name = `${file.name} uploaded`;
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
  if (fileInput.files.length) showToast('Files added to this preview. They are not uploaded or saved.');
  fileInput.value = ''; updateList();
});
document.querySelector('.menu-button').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
