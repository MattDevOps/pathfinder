# Pathfinder — Status & Work Tracker

Living source of truth for what is done, what is in flight, what is blocked, and
what to pick up next. Keep it current: update it whenever a PR lands, a blocker
resolves, or scope changes. Companion docs: [`PLAN.md`](PLAN.md) (the build plan)
and [`FOUNDER-QUESTIONS.md`](FOUNDER-QUESTIONS.md) (decisions that gate the
results engine).

**Last updated:** 2026-06-08

---

## Snapshot

| Check | Command | State |
|---|---|---|
| Types | `npm run typecheck` | green |
| Unit + DB integration | `npm test` (vitest, 84 tests) | green |
| E2E | `npm run test:e2e` (Playwright, 43 tests on CI) | green |
| Build | `npm run build` | green |
| Lint | `npm run lint` | 1 pre-existing error (see Known issues) |

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
