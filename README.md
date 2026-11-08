# Personal AI Assistant — Home Dashboard

The first screen is a responsive, standalone dashboard based on the supplied product overview. The project did not include an existing application framework, so this version uses plain HTML, CSS, and JavaScript. No build step or package installation is needed.

## Open the dashboard

Open [`mobile/index.html`](mobile/index.html) in a modern browser. On Windows, you can double-click the file in File Explorer. It also works from a small static file server if you prefer to use one.

## Learn the build, one layer at a time

1. **Structure — `mobile/index.html` and `mobile/vault.html`.** The home page is divided into navigation, search, quick actions, summaries, documents, and tasks. The Vault page adds category filters, a search bar, and a document list.
2. **Visual design — `mobile/styles.css`.** Shared color variables define the dark navy and violet palette. Grid and flex layouts position the screens; media queries rearrange them for tablets and phones. Text labels have been enlarged for readability.
3. **Interactions — `mobile/app.js` and `mobile/vault.js`.** The scripts filter the sample documents, open the system file picker, add selected file names to the visible list, and let you create and complete sample tasks. Vault filters work together with search.

## Current scope

This is a front-end prototype. Documents and tasks are sample data held only in the current page; selected file contents are not uploaded or saved, and AI answers, accounts, encryption, cloud integrations, and persistent storage are not connected. Those require a backend and product decisions, so they are suitable next steps after the dashboard UI.
