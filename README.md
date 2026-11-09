# Anvaya — Personal Document and AI Workspace

The site entry `frontend/index.html` redirects to the separately maintained welcome page, `frontend/landing.html`. The welcome page explains the Vault, AI, tasks and integrations, with **Get started** and **Sign in** links to the combined login and sign-up preview. Submitting that preview opens the dashboard with a short fade; it does not authenticate an account or save credentials. This prototype uses plain HTML, CSS, and JavaScript and needs no build step.

## Open the dashboard

Open [`frontend/index.html`](frontend/index.html) in a modern browser. It opens [`frontend/landing.html`](frontend/landing.html); the welcome button leads to [`frontend/signin.html`](frontend/signin.html). Open [`frontend/dashboard.html`](frontend/dashboard.html) to go straight to the dashboard preview.

## Learn the build, one layer at a time

1. **HTML pages.** `index.html` is a small entry redirect. `landing.html`, `signin.html`, `dashboard.html`, `vault.html`, `ask.html`, `tasks.html`, `integrations.html`, and `settings.html` each contain a separate page.
2. **Styles.** `styles.css` and `modern.css` hold shared components and theme tokens. Each page also has its own stylesheet: `landing.css`, `signin.css`, `dashboard.css`, `vault.css`, `ask.css`, `tasks.css`, `integrations.css`, or `settings.css`. This keeps shared layout consistent while letting each page's details be edited independently.
3. **Scripts.** Each page has its own JavaScript file: `index.js`, `landing.js`, `signin.js`, `dashboard.js`, `vault.js`, `ask.js`, `tasks.js`, `integrations.js`, or `settings.js`. Home's document section has its own `dashboard-documents.css` and `dashboard-documents.js` so its search and file-selection behavior stays separate from the rest of the dashboard.

## Planned technology roadmap

The intended implementation order and current status are recorded in [`docs/ROADMAP.md`](docs/ROADMAP.md). The current front end is still HTML/CSS/JavaScript; it has not yet been migrated to React or connected to PostgreSQL, FastAPI, or AI services.

## Current scope

This is a front-end prototype. Tasks, settings, and document metadata (names, sizes, dates, and Favorites) use browser localStorage, so they stay in that browser on that device and are not synced to a server. The Vault starts empty. File contents are never uploaded or saved. Sign-in does not save or send passwords. AI answers, account authentication, encryption, and cloud integrations are not connected. Chat replies and integration setup use previews only.
