# CyberShield Arena Grade 12 Experience Design

## Intent

Transform CyberShield Arena into a mature, playful cybersecurity training game for Grade 12 students. The experience should feel like a field notebook with an arcade HUD: the existing scrapbook world remains the setting, while each activity gains clearer objectives, evidence-based decisions, meaningful feedback, and a persistent sense of progression.

The primary outcome is not merely higher scores. Students should be able to explain why a message is suspicious, protect an account, respond to an incident, reason about AI safety, and apply these habits outside the classroom.

## Goals

- Make every current activity feel like a deliberate game mission rather than a form.
- Raise the content level to realistic Grade 12 contexts: university admissions, scholarships, jobs, mobile banking, school systems, social media, privacy, and AI.
- Reward reasoning and evidence, not only guessing the final answer.
- Preserve existing bilingual English/Burmese support.
- Preserve local progress and saved records under `cybershield-arena-demo-v1`.
- Preserve existing scores, XP, ranks, badges, records, and demo API behavior while extending them safely.
- Make the interface usable with keyboard, touch, mobile layouts, and reduced-motion preferences.
- Reuse the existing voxel assets and scrapbook/hills visual language.

## Non-goals

- No real account system, multiplayer backend, leaderboard, or database.
- No collection or transmission of real passwords, OTPs, private images, or other sensitive student data.
- No destructive hacking instructions or real-world exploitation workflows.
- No requirement to connect a live AI API as part of this redesign.
- No breaking change to the current localStorage key or existing saved state.
- No total visual rewrite into a dark cyberpunk interface.

## Anti-goals

- Do not make the experience childish through excessive emoji, random jokes, or unexplained gamification.
- Do not reward blindly clicking through missions.
- Do not make animation essential to understanding or completion.
- Do not present simulated API answers as live AI answers.
- Do not imply that password strength scores are exact predictions of attack time.

## Current state and constraints

The app is a Next.js 16 App Router project using React 19 and Tailwind CSS. The main UI currently lives in `src/components/ArenaApp.tsx`; content, mock API behavior, state types, scoring, XP, rank, badges, migration, and localStorage constants live in `src/lib/content.ts`. Existing voxel assets are in `public/assets/`, and Burmese fonts are in `public/fonts/`.

The current state model already includes:

- English/Burmese language selection.
- Students-versus-AI score.
- Scam cards and class votes.
- Vault levels, attempts, and logs.
- Password roast history.
- Ask history.
- Finale quiz answers.
- Records, XP, streaks, ranks, badges, and migration.

The implementation must build on these structures. New state fields must be optional or migrated with defaults so old saves remain readable. The current mock `Api.call()` remains the only demo AI boundary.

## Chosen approach

### Approach 1: Upgrade the current renderers

This is fastest but would increase the coupling already present in the large `ArenaApp.tsx` file. It is not chosen as the primary approach.

### Approach 2: Extract reusable game components — chosen

Create a shared game shell and reusable interaction components while migrating the existing page renderers incrementally. Keep the state and content contracts stable, and introduce new fields only where a mission needs them.

Likely components include:

- `GameShell`: shared page title, objective, mission status, and feedback region.
- `PlayerHud`: XP, rank, streak, next reward, and progress.
- `MissionMap`: journey stops and recommended next mission.
- `MissionCard`: consistent mission framing and voxel visual.
- `EvidencePicker`: selectable evidence clues with keyboard and touch support.
- `FeedbackPanel`: result, explanation, next action, and learning takeaway.
- `ProgressMeter`: accessible visual progress with text equivalent.
- `BadgeShelf`: extracted from records and reused in progress views.
- One focused component per activity: threat analysis, prompt security, identity defense, incident response, and final command.

The builder may choose exact file names and component boundaries as long as the responsibilities remain clear and the existing behavior is not needlessly duplicated.

### Approach 3: Rebuild the game engine

This would be cleaner for a much larger game, but creates unnecessary migration and regression risk for the current app. It is not chosen.

## Experience design

### Shared shell: Field Notebook + Arcade HUD

Every mission view should visibly answer:

1. What is the mission?
2. What should I do next?
3. What did I learn?

The shared shell should provide:

- Mission title and short Grade 12-appropriate description.
- Current objective, phrased as an action.
- Progress status and earned/reward preview.
- Persistent player HUD with XP, rank, streak, and next rank.
- A consistent feedback region after an action.
- A clear path back to the mission map.
- English and Burmese labels for all student-facing content.

The scrapbook palette, paper cards, hills, tape/pushpin motifs, and voxel assets remain. UI icons should gradually move toward consistent SVG or asset-based visuals rather than adding more emoji as interface controls. Existing emoji content may remain where it is part of an intentional badge or lesson, but it should not be the only way to understand a control.

### Mission 1: Threat Analysis Lab

Replace the current Scam or Safe framing with an investigation flow:

1. Present a realistic message as a phone/email-style evidence card.
2. Allow students to select suspicious or reassuring evidence areas.
3. Ask for the threat classification: phishing, impersonation, urgency manipulation, credential theft, financial fraud, malicious link, or safe message.
4. Ask for the safest next action.
5. Reveal the answer with evidence markers and an explanation.
6. Award more meaningful progress for correct evidence and final reasoning.

Content should cover scholarships, university admissions, jobs, mobile banking, social accounts, school administration, shopping, and friend impersonation. Existing cards must remain playable and may be migrated into the richer metadata model with defaults.

The current students-versus-AI scoring remains. Existing `classVotes` and `revealed` records must not be discarded. If evidence selection is added, it should be stored as an additive optional field.

### Mission 2: Prompt Security Lab

Rename the player-facing concept from simply “Hack the Bot” to a prompt-security challenge while retaining the existing vault as the underlying save concept for compatibility.

Students should inspect attempts against a guard bot and identify manipulation techniques such as direct extraction, social engineering, instruction manipulation, translation/spelling tricks, and sensitive-data leakage. The lesson should emphasize defensive design and trust boundaries, not provide real exploitation guidance.

The bot should show a security state and explain why a response is safe or unsafe. Later levels should require students to choose or write a safe system rule. Existing three levels, five attempts, wins, logs, XP, and badge behavior remain compatible.

### Mission 3: Identity Defense Forge

Reframe Password Roast as an identity-security exercise:

- Continue accepting fake passwords only, with explicit warnings.
- Evaluate length, predictability, personal-information patterns, reuse risk, and MFA status.
- Offer a passphrase builder using non-sensitive word tiles as an optional path.
- Show a security profile and the next recommended improvement.
- Teach password managers, unique passwords, passphrases, recovery security, and MFA.

Never send or persist the raw password. Existing masked history and score remain. The score should be described as an educational band, not an exact cracking-time claim.

### Mission 4: Incident Response Desk

Reframe Ask the Hacker as an incident-response decision activity with a cyber mentor:

- Provide realistic scenario cards and suggested questions.
- For each answer, structure feedback as: Do now, Avoid this, Who to contact, Prevent next time.
- Add ordering or choice interactions for common incidents: suspicious link, account takeover, exposed OTP, malware-like popups, lost phone, impersonation, and non-consensual image sharing.
- Keep the mock answer boundary in `Api.call()` and clearly label demo/backup responses.
- Preserve existing question history and XP. New scenario metadata is additive.

Answers should direct students toward trusted adults, school staff, service providers, or appropriate reporting channels where relevant; the app must not pretend to be emergency or legal support.

### Mission 5: Cyber Defense Command

Reframe the Finale Quiz as a final scenario-based command mission:

- Use multi-step cases rather than isolated recall wherever possible.
- Ask students to identify the threat, evidence, safest action, and security principle.
- Preserve the existing eight-question answer map and scoring compatibility.
- Add clearer explanation after each response.
- Show a final competency report covering threat detection, identity security, privacy, AI safety, incident response, and critical thinking.
- Keep ranks and badges, but present them as skill achievements rather than childish prizes.

The existing quiz data can be upgraded incrementally. Old answers must continue to render correctly after migration.

## Progress and rewards

Existing XP, streak, ranks, and badges remain the source of truth. New rewards should support learning:

- Evidence selection can add a small reasoning bonus, with anti-farming rules.
- Correct incident-response sequences can award a flat mission bonus.
- Replaying a completed mission should not endlessly farm completion rewards.
- Every reward should explain what behavior earned it.
- The HUD should preview the next unlock and recommended mission.

Existing badge IDs should remain stable. New badges may be added only with clear Grade 12 skill criteria, such as `evidence-reader`, `account-defender`, or `incident-responder`.

## Accessibility and interaction

- All controls need visible labels or accessible names.
- Keyboard focus order must follow visual order.
- Interactive targets should be at least 44–48px where practical, with at least 8px spacing.
- Evidence selections must not rely on color alone; use selected state, labels, and text.
- Loading and submission states must be announced or otherwise clear.
- Every major action needs success/error feedback near the action.
- Use no more than one or two important animated elements per view.
- Respect `prefers-reduced-motion`; final states must remain understandable without animation.
- Ensure readable contrast and responsive layouts at approximately 375px, 768px, 1024px, and desktop widths.
- Add a teacher/presenter-friendly large-text path where practical without creating a separate app.

## Implementation boundary

No new dependency is required for the first pass. Use React state, existing Tailwind utilities, CSS transitions/keyframes, the existing images, and the existing mock API. If a dependency becomes clearly necessary, the builder must explain why before adding it.

The work should be delivered in incremental, reviewable changes. Each mission should remain playable after its extraction. Run lint and build validation after the refactor and after the content migration. Do not commit unless separately requested.

## Approved live AI integration scope

The approved live-AI policy is deliberately hybrid:

- **Threat Analysis Lab:** live AI may enrich the evidence explanation, but the authoritative scam/safe verdict and scoring remain deterministic from lesson content.
- **Prompt Security Lab:** secret values and win conditions remain deterministic; live AI may provide a bounded defensive explanation only.
- **Identity Defense Forge:** the raw password is never sent. The server may receive only derived values such as score, length, and detected pattern flags.
- **Incident Response Desk:** live AI provides mentor-style explanations using fixed defensive system instructions, with a local fallback.
- **Cyber Defense Command:** correctness and scoring remain deterministic; live AI may provide optional explanations.

Live mode activates server-side when `ANTHROPIC_BASE_URL`, `ANTHROPIC_API_KEY`, and `CLAUDE_MODEL` are configured. If configuration is absent or a request fails, the app uses the existing local/demo response and presents a non-blocking demo-backup status. The API key is never sent to the browser, included in client bundles, logged, exported, or placed in a `NEXT_PUBLIC_*` variable.

The integration should use a server-only route and preserve the existing client-facing `Api.call()` contract. Route-specific prompts must be defensive and bounded. User-authored text must be length-limited and treated as untrusted input. The implementation should use a non-streaming request because the current UI awaits one structured result; streaming is out of scope for this iteration. The official SDK or compatible HTTP client may be selected by the builder after verifying the supplied base URL's contract, and the exact endpoint must not be guessed without checking the provider's compatibility.

## Open builder decisions

The builder may decide:

- Exact component file names and folder structure.
- Whether mission content is represented with new typed fields in `content.ts` or separate content modules.
- The smallest migration shape needed for additive evidence, scenario, and competency data.
- Whether to use CSS-only transitions or a small existing animation abstraction.
- The exact order of extraction, provided the app remains functional at each stage.

## Success criteria

A Grade 12 student can open the app, understand the next action without explanation, complete each mission, see evidence-based feedback, and identify one real-world habit learned from it. Existing saved users retain their progress. The interface feels like one coherent field-training game rather than five unrelated forms, and it remains comfortable to use in both English and Burmese on classroom screens and phones.
