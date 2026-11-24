# AI debriefs after every game

Date: 2026-11-24
Status: approved, implemented

## Intent

After any local game ends, the student can ask the AI for a short debrief of
that run: one thing they did well, one tell to remember next time. The AI
uses the run's actual results (score, missed items), not the whole game
content. Local scoring stays authoritative; the AI only explains.

## Goals

- Every game that ends in `EndPanel` gets a debrief button.
- One API call per run, only when the student taps.
- Works offline: a bilingual per-game fallback debrief when the API is down.
- No new state, no persistence, no records changes.

## Non-goals

- No per-item AI during timed games.
- No AI-generated rounds or answers.
- No AI role-play.
- No quiz debrief: the Finale Quiz already explains every answer inline.
- Scam or Safe, Hack the Bot, Password Roast and Ask the Hacker already
  have live AI; leave them alone.

## Approaches

1. **Hook in `EndPanel` + optional `summary` prop** (picked). One shared
   component renders the button and result; each game only passes a compact
   summary string. Least code, consistent UI.
2. `ctx.debrief()` called and rendered by each game. More control, but
   duplicates the loading/result UI in nine files.
3. Auto-call on end. More magical, but burns quota on every replay and
   removes presenter control.

## Design

### Route

`POST /api/ai` gains `route: "debrief"`:

```json
{ "route": "debrief", "payload": {
  "game": "rush", "cleared": false, "score": 70,
  "summary": "Correct 7/14. Missed: 'You won 1,000,000 MMK...' (scam).",
  "lang": "en"
} }
```

- `summary` is bounded to 800 chars, `game` to 40.
- The route imports each game's content from `games-content.ts` and
  `stories-content.ts` and builds a bounded digest (6000 chars) for the
  debrief prompt. The browser never sends the content.
- System prompt: defensive Grade 12 cybersecurity teacher, answer in the
  requested language, JSON only, exactly `{"debrief": string}`, 2–3 short
  sentences, no new facts beyond the summary/content.
- `shape()` returns `{ debrief }` for the route.
- Debrief calls use `max_tokens: 600`; the global 300 cap truncated
  Burmese JSON mid-string and forced the backup. Other routes stay at 300.
- Existing 20s server abort and backup fallback apply unchanged.

### Client

- `MockPayload` gains `game?`, `cleared?`, `summary?`.
- `ApiResult` gains `debrief?`.
- `MockBrain.answer("debrief")` returns a bilingual fallback from a
  `DEBRIEF_FALLBACK` map keyed by game id.
- `Api.call` merges `data.result.debrief` the same way it merges
  `explanation` and `answer`.
- `GameCtx` gains `bumpUsage(u)` so debrief calls show in the header
  usage counter.

### UI

- New `AiDebrief` component in `games/shared.tsx`:
  - button "AI debrief" / "AI ရှင်းလင်းချက်"
  - while waiting: existing "Thinking..." label
  - result: sky panel labelled "Live AI debrief" or "Backup debrief"
- `EndPanel` gains `summary?: string` and renders `<AiDebrief>` after
  `children`, above "Play again".
- The debrief is transient: replaying clears it with the panel.

### Per-game summary content

Built from local content only, English, no PII:

| Game | Summary |
|---|---|
| Rush | correct/total + missed message text and its true label |
| Link Detective | correct/total + missed theme, picked URL, real URL |
| Privacy Lockdown | count + names of risky settings fixed |
| Permission Panic | correct/total + missed app/permission and correct allow/deny |
| Spot the Fake | tells found out of total |
| Deepfake Detective | correct/total + missed case title and whether it was fake |
| Boss Fight | won/lost, wave, hearts, wrong shield and the correct one |
| Scam Call / Friend or Fraud | ending line + money left |

### Fallback copy

Nine short bilingual debriefs, one per game, plus a generic one. They carry
the core lesson, not the run's numbers, so they read correctly offline.

## Files

- `src/app/api/ai/route.ts`
- `src/lib/content.ts`
- `src/components/games/ctx.ts`
- `src/components/games/shared.tsx`
- `src/components/ArenaApp.tsx` (pass `bumpUsage` through ctx)
- `src/components/games/{Rush,LinkDetective,Privacy,PermissionPanic,SpotFake,Deepfake,BossFight,StoryGame}.tsx`

## Verification

- `npx tsc --noEmit` passes.
- `npm run lint` passes (only pre-existing warnings).
- `npm run build` passes.
- Live route checked for rush, link, privacy, permission, spot, deepfake,
  boss, call and friend in English; Burmese checked on rush and friend
  after the token-cap fix.
- With the quota out: `{"mode":"backup"}` and the local bilingual debrief.
- The debrief does not call until the button is tapped.

## Resolved

Button, not automatic. Replays don't spend a call unless the presenter taps.
