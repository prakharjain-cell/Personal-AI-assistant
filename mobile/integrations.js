const integrationInfo = {
  'Google Drive': 'Browse documents you choose and let the assistant cite them when answering questions.',
  'Gmail': 'Search selected email details and use them to help answer questions in your workspace.',
  'Google Calendar': 'View events and create reminders with your permission.'
};
const dialog = document.querySelector('#integrationDialog');
document.querySelectorAll('.integration-setup').forEach(button => button.addEventListener('click', () => {
  const service = button.dataset.service;
  document.querySelector('#integrationTitle').textContent = `Set up ${service}`;
  document.querySelector('#integrationDescription').textContent = integrationInfo[service];
  dialog.showModal();
}));
document.querySelector('.menu-button').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
