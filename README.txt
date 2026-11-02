# ReVastra — HTML, CSS and JavaScript website prototype

## Run locally
1. Extract this ZIP.
2. Open the extracted folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Use the website navigation to visit the pages.

This is a plain static website. It does not require `npm install` or `npm run dev`.

## Included pages
- Home
- About
- How It Works
- Submit Donation
- Schedule Pickup
- Login / Register
- My Donations
- Admin
- Donation Tracking

## Donation flow in this prototype
1. The Submit Your Donation card opens the donation form.
2. The donor chooses clothing category, size, condition, quantity and uploads one or more photos.
3. The form moves to Schedule Pickup.
4. The donor enters name, contact number, email, city, address, PIN code, date, time slot and optional instructions.
5. A local reference is created and the donation appears in My Donations and its tracking page.

The local prototype stores demo submission details and uploaded photo data in the browser's localStorage. Keep image files at or below 1.5 MB each for this local demo. Data is only stored in the current browser on this computer and is not a secure shared database.

## Supabase is intentionally not connected yet
The original SQL migration files are included under `supabase/migrations/`. No Supabase credentials have been added. Until Supabase is configured:
- Login/Register cannot create real accounts.
- Donations are saved only in this browser's local demo storage.
- Admin database management is not active.
- Photo uploads are not sent to cloud storage.

When ready, connect Supabase Auth, the donations table, Row Level Security and a private `donation-photos` Storage bucket. Never put a service-role secret in browser JavaScript.

## Branding
- Browser tab favicon: the green leaf icon selected in the conversation.
- Website header brand mark: original tan shirt icon from the supplied design.

## Design fidelity
The supplied source project and screenshots were used as the visual reference. This is a hand-converted static implementation; exact pixel identity across every page has not been browser-verified.
