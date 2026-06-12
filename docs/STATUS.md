# Pathfinder — Status & Work Tracker

Living source of truth for what is done, what is in flight, what is blocked, and
what to pick up next. Keep it current: update it whenever a PR lands, a blocker
resolves, or scope changes. Companion docs: [`PLAN.md`](PLAN.md) (the build plan)
and [`FOUNDER-QUESTIONS.md`](FOUNDER-QUESTIONS.md) (decisions that gate the
results engine).

**Last updated:** 2026-06-12

---

## ⚠️ v5 pivot in progress (2026-06-12)

Rafi delivered **pathfinder v5** (a full redesign, kept as
[`pathfinder-v5-reference.html`](pathfinder-v5-reference.html)). It replaces the
single 40-question quiz with a **3-phase funnel** and a new results engine:

- **Phase 0** — visual profiling (3 colors ranked, primary/secondary shape,
  workspace, instinct image). Biases archetype + domain.
- **Phase 1** — 15 personality questions (multi-select, neutral opt-out) → 4
  dimensions → one of **4 archetypes** (Builder / Specialist / Creator / Connector).
- **Phase 2** — 12 passion questions → one of **12 domains**.
- **Result** — archetype × domain → one of **48 buckets**, each 4 concrete career
  paths + first step + a congruence %.

Language: **Italian is now primary**; EN/HE retained as locales (content
translation is tracked debt). This supersedes most of the old "blocked on the
founder" list — v5 *is* the resolved content, just in a new shape.

**Port complete (all six stages landed; legacy engine removed).**

- [x] Data layer — `src/data/{phase0,personality,passions,careers}.ts`, generated
  from the prototype by `scripts/gen-v5-data.mjs` (Italian authored, en/he empty).
  v5 types in `src/lib/types.ts`. Integrity test `src/data/v5-content.test.ts`.
- [x] Scoring engine — `src/lib/archetype.ts` (calcDimensions / calcArchetype /
  calcDomain / congruence), faithful port, unit-tested in `archetype.test.ts`.
- [x] Persistence — v5 `quiz-session.ts`, `contract.ts`, `completeSession`,
  `results-record.ts`, `profile.ts` view model, migration `0005_v5.sql`
  (archetype/domain/dims/congruence + jsonb visual/answers; refreshed
  complete_session / get_shared_result / admin_list_results), admin CSV. The
  pglite integration test exercises the 0001→0005 chain.
- [x] Quiz UI — `Quiz.tsx` rebuilt as Phase 0 (visual) / Phase 1 / interstitial /
  Phase 2 / gate, with localStorage resume and a stable per-question option order.
- [x] Results — `ResultsView.tsx` (archetype × domain, congruence, visual
  signature, 4 career paths, philosophy), preview + share-token pages, both PDF
  routes.
- [x] i18n — `it` locale added (Italian default); `messages/{it,en,he}.json` for
  the v5 chrome. e2e (`funnel`/`results`/`pdf`) rewritten for the 3-phase flow.

**Checks:** `npm run lint` green (the old pre-existing error is resolved),
`npm run typecheck` green, `npm test` 70 green, `npm run build` green, Playwright
chromium suite green (full funnel + results EN + HE/RTL + both PDF routes).

**Remaining content/translation debt (not blocking the build):**

- EN/HE translation of all v5 content (questions, options, careers, archetype
  copy) — Italian is authoritative; en/he fall back to Italian and are tracked
  by `v5-content.test.ts`. Hand-edit the generated `src/data/*.ts`, do not
  regenerate over them.
- Visual design is functional (Tailwind theme), not yet pixel-matched to the v5
  prototype's navy/gold treatment — a polish pass (e.g. `/design-review`).
- Hosted-Supabase wiring still unverified end to end (no live project/secrets).

---

## Snapshot

| Check | Command | State |
|---|---|---|
| Types | `npm run typecheck` | green |
| Unit + DB integration | `npm test` (vitest, 70 tests) | green |
| E2E | `npm run test:e2e` (Playwright, v5 funnel/results/pdf) | green (chromium) |
| Build | `npm run build` | green |
| Lint | `npm run lint` | green |

CI (`.github/workflows/ci.yml`): `verify` job (typecheck + unit/DB + build) and
`e2e` job (Playwright matrix). Both gate every push and PR.

---

## Done (shipped to `main`)

- [x] **Quiz funnel + Supabase persistence + PDF export** (PR #1) — landing -> 40-question quiz (keyboard + localStorage resume) -> post-quiz email gate -> results, plus the `completeSession` action / `complete_session` SQL and the public `/results/[token]` share path.
- [x] **Admin dashboard + CSV export**, admin login IP rate-limit, public submit rate-limit (per-IP + per-email/day).
- [x] **Playwright e2e suite** (PR #2) — landing, quiz nav, full 40-question funnel, gate consent-validation, preview, results EN + HE/RTL, both PDF routes.
- [x] **Cross-browser e2e matrix** (PR #3) — chromium (full), firefox + webkit (funnel + results), mobile-safari (iPhone 13 / WebKit funnel smoke).

## Verified working (dogfooded 2026-06-08)

- [x] Full funnel in a real browser, no bugs in the happy path.
- [x] Consent gate rejects before any DB call ("Please accept the privacy policy to continue").
- [x] Hebrew PDF renders correct bidi (219 Hebrew chars, no tofu); HE results page is `dir=rtl` with mirrored bars.
- [x] PDF route works with no `CHROME_EXECUTABLE_PATH` (bundled `@sparticuz/chromium`) and no Supabase secrets.

---

## Next up (engineering — NOT blocked on the founder)

- [ ] **Real on-device iOS Safari pass.** The CI mobile-safari project is WebKit emulation; the spec wants a true device. Needs a physical device or a service (BrowserStack/Sauce). Manual.
- [ ] **Verify hosted-Supabase wiring.** The SQL is pglite-verified; the JS client -> RPC round trip against a real Supabase project is not. Needs a Supabase project + secrets (`.env.local`). Do when secrets are available.
- [ ] **Fix pre-existing lint error** `Quiz.tsx:63` (`react-hooks/set-state-in-effect`). CI does not run lint, so non-blocking — but it should be cleaned up or lint should be added to CI.
- [ ] (Optional) Add `npm run lint` to the CI `verify` job once the error above is fixed.
- [ ] (Optional) PostHog funnel instrumentation is wired (`analytics.ts`, `TrackEvent.tsx`); confirm events land once a PostHog key is set.

## Blocked on the founder (gates the results engine — see `FOUNDER-QUESTIONS.md`)

These cannot be finished by engineering alone. The results logic and content are
**DRAFT** until these are answered.

- [ ] Freelancer definition (B1) — `dim2` contradiction in the spec.
- [ ] Sector map for all 9 DIM_1 x DIM_3 cells (only 5 defined).
- [ ] Profile-title rule + the actual EN/HE words.
- [ ] Scenario content — ~5 clusters x 3 scenarios x 2 langs. EN draft exists; **Hebrew not authored** (renders "התרגום בהכנה" placeholder).
- [ ] Data residency (D13) — EU/Frankfurt Supabase (default) vs AWS Tel Aviv. Decides the backend.
- [ ] Privacy policy legal text + consent wording.

---

## Conventions

- Keep this file updated as part of any substantive change (it's cheap; do it in the same PR).
- Check a box only when there's evidence (a merged PR, a green check, a verified run).
- Move finished "Next up" items into **Done**; don't delete the history.
