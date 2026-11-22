# CyberShield Arena: Demo Build

Built 2026-11-22 for Min, from the CyberShield Arena build spec in this goal folder.

## How to open

Open `index.html` in any browser (Chrome or Edge). No server, no install, no internet needed. Keep the four `asset-*.webp` images in the same folder as `index.html`.

## Deploy on Vercel (repo name: arena)

No database is needed, and no build step. All records are stored in the browser on the device running the demo (localStorage), so the demo runs fully as a static site.

1. Put `index.html`, `README.md`, and the four `asset-*.webp` files in the repo root.
2. In Vercel: Add New Project, import the `arena` repo, framework preset "Other", no build command, no environment variables, Deploy.

Later, the live Claude API version still needs no database (per the build spec). It only adds server side environment variables on Vercel: the API key, base URL, and model names.

## Style

Pixor inspired restyle (2026-11-22): light cream background, thick ink borders, hard offset shadows, lime green and sky blue accents, pastel hero, scrolling safety marquee, and original voxel 3D assets (shield, key, trophy, chat bubble) generated for this app. No mascot is used, at Min's direction. The voxel assets are original creations, not files taken from the Pixor template.

## What works in this demo

- **Free navigation.** The left sidebar is always visible. Tap any section to jump straight to it: Home, Scam or Safe, Hack the Bot, Password Roast, Ask the Hacker, Finale Quiz, Records. There is no locked order and no forced Next flow. Cards and quiz questions also have their own number dots for direct jumps.
- **Everything is stored.** Scores, votes, AI reveals, vault attempts, password roast history, Q and A history, quiz answers, language choice, and the current page are saved in the browser (localStorage) on every action. Reload the page, close it, come back: everything is still there.
- **Records on every page.** Each section shows its own recent records at the bottom. The Records page shows the full log (time, page, action, detail) and can download it as JSON.
- **Scoreboard** stays at the top on every page, with plus and minus buttons for the presenter.
- **Bilingual.** EN and Burmese toggle in the sidebar, saved between visits. Default is Burmese. Some Burmese card translations are drafts and still need native review, as the spec requires.
- **Touch first.** Big tap targets for the 5 to 6 foot touch screen, designed at desktop scale.

## What is NOT connected yet: only the API

The app calls one small function, `Api.call(route, payload)`, in `index.html`. In this demo it answers from saved content and local rules after a short delay, and the header badge says DEMO: API NOT CONNECTED. Every answer is labelled source: backup.

To go live later, replace only the body of `Api.call()` with a fetch to the real server route (the Next.js app from the spec, with the reseller key in server env vars only). No page, navigation, or storage code changes.

Demo notes:
- Password Roast scores the password locally and never sends or stores the password itself. Only a masked version (first 2 characters) is kept in history.
- Hack the Bot uses simple local rules for the guard replies in the demo (Level 1 falls for direct asks, Level 2 falls for spelling tricks, Level 3 holds). The real version uses the Claude vault prompts from the spec.
- Ask the Hacker answers from a small saved answer set matched by keywords, and refuses attack instructions with a defense redirect.
- Reset all records button (sidebar) clears scores, progress, and the log after a confirm.
