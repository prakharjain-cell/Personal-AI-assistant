const form = document.querySelector('#chatForm');
const input = document.querySelector('#chatInput');
const scroll = document.querySelector('#chatScroll');
const toast = document.querySelector('#chatToast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}
function addUserMessage(text) {
  const message = document.createElement('article'); message.className = 'message user-message';
  const meta = document.createElement('div'); meta.className = 'message-meta'; meta.append('You ');
  const time = document.createElement('time'); time.textContent = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date()); meta.append(time);
  const bubble = document.createElement('div'); bubble.className = 'bubble'; bubble.textContent = text;
  message.append(meta, bubble); document.querySelector('#suggestedBlock').hidden = true; document.querySelector('#chatEmpty').hidden = true; scroll.append(message);
}
function addPreviewReply() {
  const message = document.createElement('article'); message.className = 'message assistant-message';
  message.innerHTML = '<div class="message-meta"><span class="mini-assistant">✦</span> Personal AI <time>preview</time></div><div class="answer-card"><p>This chat screen is a front-end preview. It is not connected to an AI service, so I can’t read or summarize your documents yet.</p><div class="source-label">NEXT STEP <span>Backend needed</span></div><a class="source-card" href="vault.html"><span class="file-icon pdf">PDF</span><span><b>Connect a document-aware AI</b><small>Then answers can cite files from your vault.</small></span><span class="source-arrow">↗</span></a><div class="answer-note">No document contents were sent or analyzed.</div></div>';
  scroll.append(message); scroll.scrollTop = scroll.scrollHeight;
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const question = input.value.trim();
  if (!question) return;
  addUserMessage(question); input.value = ''; input.style.height = 'auto';
  window.setTimeout(addPreviewReply, 450);
});
input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 120)}px`; });
input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); } });
document.querySelectorAll('.prompt-chip').forEach(chip => chip.addEventListener('click', () => { input.value = chip.textContent; form.requestSubmit(); }));
function clearCurrentChat() {
  scroll.querySelectorAll('.message.user-message, .message.assistant-message').forEach(message => message.remove());
  document.querySelector('#chatEmpty').hidden = false;
  document.querySelector('#suggestedBlock').hidden = false;
  input.value = '';
  input.style.height = 'auto';
}
document.querySelector('#newChat').addEventListener('click', () => { clearCurrentChat(); showToast('Started a new chat.'); });
document.querySelector('#deleteChat').addEventListener('click', () => { clearCurrentChat(); showToast('Current chat deleted.'); });
document.querySelectorAll('[data-feedback]').forEach(button => button.addEventListener('click', () => showToast(`${button.dataset.feedback} feedback noted for this preview.`)));
document.querySelectorAll('[data-history]').forEach(button => button.addEventListener('click', () => { input.value = button.dataset.history; input.focus(); showToast('Try this example question.'); }));
document.querySelector('.menu-button').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
