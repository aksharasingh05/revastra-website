# ReVastra — single-entry HTML/CSS/JavaScript website

## Project structure
- `index.html` is the only HTML entry point.
- `app.js` selects and renders Home, About, How It Works, Donate, Schedule Pickup, Login, My Donations, Admin and Track based on the URL.
- `styles.css` contains the shared design.
- `assets/` contains the website's shared image files.
- `vercel.json` rewrites page URLs to the root `index.html`, while the browser URL remains `/donate`, `/about`, etc.

## Run locally
1. Extract this ZIP.
2. Open the extracted `ReVastra` folder itself in VS Code (not a nested folder).
3. Right-click the root `index.html` and choose Open with Live Server.
4. Use the website navigation. Routes such as `/donate/` should be rendered by the same `index.html`.

## Deploy to Vercel
1. Upload/commit the CONTENTS of this folder to the root of the GitHub repository.
2. In Vercel Project Settings → Build & Development Settings, use Framework Preset `Other`.
3. Set Root Directory to `./` (the folder containing this `index.html`).
4. Leave Build Command and Output Directory blank/default for static deployment.
5. Redeploy the latest commit.
6. Test `/`, `/donate/`, `/about/`, `/login/`, `/schedule-pickup/`, `/dashboard/`, `/admin/` and `/track/`.

Important: do not upload the ZIP itself to the GitHub repository. Upload the extracted files and folders. Confirm the deployment's source root contains `index.html`, `app.js`, `styles.css`, `vercel.json` and `assets/`.

## Supabase
Supabase is not configured yet. The project URL and public/publishable anon key in `app.js` are blank placeholders. Login, cloud donation records and cloud photo storage will not work until Supabase is configured. Never put a service-role key in frontend code.

## Photo handling
The site has two different image systems:
- Website images (hero, volunteers, flatlay) are static files in `assets/`.
- Donor-uploaded clothing photos are selected through the donation form. In this prototype they are stored locally in browser storage, not uploaded to Supabase Storage.

The static images should load from `/assets/...` when deployed from this project root. Cloud photo uploads require the later Supabase Storage integration.
