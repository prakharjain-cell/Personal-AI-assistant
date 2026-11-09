// Dashboard-level behavior: today's date and the demo-session welcome notice.
const dashboardToast = document.querySelector('#toast');
let dashboardToastTimer;
window.showDashboardToast = message => {
  dashboardToast.textContent = message;
  dashboardToast.classList.add('show');
  window.clearTimeout(dashboardToastTimer);
  dashboardToastTimer = window.setTimeout(() => dashboardToast.classList.remove('show'), 3000);
};

const todayLabel = document.querySelector('#todayLabel');
todayLabel.textContent = new Intl.DateTimeFormat('en-US', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
}).format(new Date()).toUpperCase();

try {
  if (sessionStorage.getItem('personal-ai-demo-entry') === 'true') {
    sessionStorage.removeItem('personal-ai-demo-entry');
    document.body.classList.add('demo-entry');
    window.showDashboardToast('Demo mode: no account was authenticated.');
    window.setTimeout(() => document.body.classList.remove('demo-entry'), 600);
  }
} catch { /* The dashboard remains usable if session storage is unavailable. */ }
