# CyberShield Arena: Next.js Rebuild (Creatie Scrapbook)

Built 2026-11-22 for Min, replacing the Pixor styling of the single-file
demo with the LatSaung / heinminthant.com Creatie scrapbook design.
Pushed to heinminthantt/arena and deployed on Vercel 2026-11-22, replacing
the Pixor static version, with Min's approval.

## Run it

```bash
npm install
npm run build
npm run start   # production, port 3000
# or: npm run dev
```

## What it is

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4.
- One route, `/`, rendering `src/components/ArenaApp.tsx`, a client
  component with the same 7 sections as the demo: Home, Scam or Safe
  (6 cards), Hack the Bot (3 levels), Password Roast, Ask the Hacker,
  Finale Quiz (8 questions), Records (full log + JSON download).
- All content, the mock brain and the single `Api.call()` stub live in
  `src/lib/content.ts`. Going live later means replacing only the body
  of `Api.call()` with a fetch to a server route. Nothing else changes.
- No database, no server state. Records persist in the browser under
  the SAME localStorage key as the old demo,
  `cybershield-arena-demo-v1`, with the same state shape, so records
  made in the old demo carry over on the same device and origin.

## Design

- Creatie scrapbook pattern (`~/workspace/design-patterns/creatie-scrapbook-pattern.md`):
  cream #FDF6E3 graph paper, LatSaung pastel palette and tokens,
  hand-drawn hills scene (`src/components/Hills.tsx`, copied from
  LatSaung), liquid glass sidebar, soft shadows only, scrapbook cards
  with pushpins and tape, black marquee with lime marks, huge extrabold
  headlines. No Pixor elements remain (no thick ink borders, no hard
  offset shadows, no lime/sky Pixor palette).
- Fonts: Geist for Latin (next/font), MiSans Myanmar for Burmese.
  The woff2 files in `public/fonts/` come from the Indeware TikTok
  graphics font set; `@font-face` rules are in `src/app/globals.css`.
  Geist sits first in the stack, so Latin glyphs use Geist and Myanmar
  glyphs fall back per glyph to MiSans Myanmar.
- The 4 voxel webp assets from the demo are reused as scrapbook
  stickers in `public/assets/`. No mascot (dropped by Min).
- Touch first: main buttons, nav, dots and score controls are 72px or
  larger. Designed at 1920x1080 for the 5 to 6 foot touch screen,
  fluid layout scales to 4K.

## Deploy later (when Min approves)

1. Push this folder to the `heinminthantt/arena` repo (replacing the
   static files). Binary assets (webp, woff2) cannot go through the
   snapshot-push path; use a local git checkout or the GitHub web UI.
2. In Vercel, change the arena project's framework preset from "Other"
   to "Next.js" (the included `vercel.json` already declares
   `"framework": "nextjs"`). No build command or env vars needed for
   the demo. Pushes to main auto-deploy.
3. Warning: plain arena.vercel.app is NOT Min's site. The real URL is
   the team scoped one, arena-...-heinminthant-team.vercel.app.

## Notes

- Burmese text for Scam or Safe cards 2, 4 and 6 is still the draft
  translation from the demo (marked in the text), awaiting Min's
  native review. It was ported unchanged.
- Previews from the verification run are in `previews/`
  (home and scam pages at 1920x1080).
