# Pathfinder — Build Plan & Decision Brief

Synthesis of a multi-agent review (7 role lenses + 4 tech comparisons) of `docs/spec-extracted.md`.
Date: 2026-06-06.

---

## 0. Bottom line up front

The spec is unusually well-disciplined for an MVP (clear scope table, real data model, real algorithm sketch). It is **buildable in ~10-12 weeks by one experienced dev**. But it is **not implementable as written** — the scoring/scenario layer has genuine bugs and missing content, the privacy section contradicts the product flow, and the conversion funnel has two self-inflicted wounds. None are hard to fix; all must be decided *before* coding the relevant week.

The recommended stack is essentially the doc's own recommendation, tightened:

| Layer | Pick | Note |
|---|---|---|
| Framework + hosting | **Next.js (App Router) on Vercel** | SSR needed for shareable `/results/[token]` OG cards (the viral loop) |
| DB + backend | **Supabase** (Postgres + Storage + RLS), region **Frankfurt eu-central-1** | bundles what we need; pin EU region for Israeli data residency |
| Auth | **No auth for quiz-takers** (email row + share_token). Supabase Auth for the *single* admin only | spec's "user account" = a DB row, not a login |
| PDF | **Chromium (Playwright/Puppeteer) rendering the results route** via `@sparticuz/chromium` | React-PDF **cannot** do Hebrew bidi correctly — disqualified |
| Email | **Resend** (PDF as attachment) | verify sending domain (SPF/DKIM) or Hebrew inboxes spam-folder it |
| i18n / RTL | **next-intl** + Tailwind **logical properties** (`ms/me/ps/pe/start/end`), `dir` on `<html>` | no `tailwindcss-rtl` plugin needed |
| Analytics | **PostHog free tier** (added week 1) | the spec is conversion-driven but specifies zero instrumentation |

Cost at beta: ~**$45/mo** (Vercel Pro $20 + Supabase Pro $25). Free tiers cover dev, but Vercel Hobby is non-commercial and Supabase free projects auto-pause after ~7 days idle.

---

## 1. Must-fix BLOCKERS (cannot build the results page without these)

These come from the algorithm-audit and PM lenses. They need the **founder's** product intent, not just a dev decision.

### B1 — Scenario logic contradicts the dimension definitions
`generateScenarios` sets `freelanceStrength` on `dim2 < 50`, with a comment "High DIM_2 (independent)". But Section 2.1 defines **high DIM_2 = Collaborative**, low = Independent. The code and comment disagree about what a freelancer *is*. Proposed fix (consistent with 2.1): freelancer = independent + mid risk + creative →
`freelanceStrength = (dim4>=34 && dim4<=66 && dim2<34 && dim3>=67) ? 'high' : ...` and give it a `low` branch so all three scenarios use the same `{high,medium,low}` enum.

### B2 — Sector table (3.4) is unimplementable
"Low/Mid/High" for DIM_1 and DIM_3 have **no numeric thresholds**, and the table covers only 5 of 9 combinations. Proposed: reuse the 3.2 bands (0-33 Low / 34-66 Mid / 67-100 High) and define a **total function over all 9 cells** (proposal in the audit; e.g. Mid/High → Innovation & Creativity).

### B3 — `profile_title` is referenced but never defined
The results page header ("The Creative Strategist") and the `results.profile_title` column have no derivation rule. Need a deterministic mapping from the 9-cell matrix (or 5 clusters) to a title, in EN + HE.

### B4 — Scenario *content* doesn't exist
For each cluster × {Employee, Freelancer, Founder} the spec promises a headline, 3 roles, a paragraph, and 3 next steps — and provides **none of it**. That is roughly **5 clusters × 3 scenarios × 2 languages = ~30 content blocks**. This is the real critical path and it is **content authoring, not engineering** — it belongs to the founder/a copywriter and must land *before* week 6.

### B5 — Threshold inconsistency
`generateScenarios` uses `dim2 < 50` and `34/67` bands in the same function. Pick one scheme (recommend the 34/67 bands everywhere) and lock the cut points as shared named constants used by both code and tests.

---

## 2. Conversion risks (PM lens) — founder decisions

### C1 — Email gate is BEFORE the quiz
Screen 2 asks for PII before delivering any value. This is the textbook activation killer for a free quiz where the result *is* the payoff. **Recommendation: move the gate to after completion** ("enter email to unlock/save your full profile"), showing a teaser (profile title + one bar) above it. If marketing insists on early capture, A/B test it rather than hard-coding the riskier variant.

### C2 — No back button + auto-advance on 40 questions
Asserted as a "core principle" but it's an untested hypothesis with a hard cost: one mis-tap is unrecoverable across 40 questions → rage-quit. **Recommendation: keep the fast feel but allow back-one** (localStorage already has the data) and add a brief confirm/undo window. Treat "no back" as an A/B test against completion rate.

### C3 — Zero analytics
The product optimizes for conversion but can't measure it. Add per-step funnel events (landing → start → email → per-question drop-off → results → PDF/share/coach), time-per-question, and completion time (to validate the "12 minutes" claim, which also contradicts the "under 15 minutes" DoD).

---

## 3. Architecture decisions (dev-owned)

### Data model fixes (backend lens)
- **`users.email UNIQUE NOT NULL` breaks retakes.** Treat `users` as an identity table: `INSERT ... ON CONFLICT (email) DO UPDATE ... RETURNING id`, then create a *new* session. Retakes append sessions/results.
- **Add a `questions` table** (+ options with per-option score) as server-side source of truth. The `answers` table currently denormalizes `dimension`+`score` *from the untrusted client* — the server must look these up by `(question_id, selected_option)` and ignore client-sent scores.
- **Score server-side only**, in a "complete session" endpoint. The client may run the same pure functions for instant UI, but the stored result is server-authoritative.
- **`share_token`**: generate with `crypto.randomBytes(16).toString('base64url')` (128-bit), not `Math.random`/UUIDv1. Handle the unique-collision retry.
- Add a uniqueness constraint on `(session_id, question_id)` to make answer writes idempotent.

### Frontend (frontend lens)
- **RTL from day 1** — the spec says critical but the milestone plan defers it to week 8 (contradiction). Wire next-intl + `dir` switch in week 1-2, extract all strings to `he/en` JSON from the first component, build screens bidi-correct. Week 8 becomes "finalize translations + RTL QA," not "add RTL."
- **Quiz content** = a typed TS module / static JSON shipped with the frontend (it's static), shuffled client-side; only *answers* hit the DB.
- **localStorage session schema**: `{ sessionId, language, questionOrder[], currentIndex, answers }`, persisted on every answer; persist `questionOrder` so refresh restores the exact sequence.
- Accessibility: make auto-advance keyboard-operable (Enter/Space commits), announce progress via `aria-live`.

### Infra (cloud lens)
- **Pin everything to Frankfurt (fra1 / eu-central-1)** — region is immutable after creation; co-locate Vercel functions with the DB via `vercel.ts` (`@vercel/config`, replaces `vercel.json`). Document EU residency in the privacy policy.
- **Three envs**: local / preview / production, with a **separate Supabase project for preview** so PR deploys never touch prod PII. Scope env vars per environment.
- Keep everything on Fluid Compute / Node.js runtime (not Edge).

---

## 4. Security & privacy (appsec lens) — must close before launch

- **"Store email hashed" (5.2) is wrong here** — you must email the PDF and show emails in the admin CSV, so a plain hash is irrecoverable. Use **app-layer AES-256-GCM encryption** (KMS/managed key) for the email, plus an **HMAC blind-index** column for uniqueness/lookup without decrypting every row.
- **RLS deny-by-default on all tables.** Write an explicit test asserting the share-token path can read the `results` row but **never** `answers` (5.2 requirement). Never ship the `service_role` key to the client.
- **Admin JWT**: HS256 with a ≥256-bit secret from a secret manager, pin the alg (reject `alg:none`), short TTL, store the founder credential as an **argon2id/bcrypt** hash. (Simplest correct path: use Supabase Auth for the one admin account instead of hand-rolling.)
- **Rate limit** the email/submit endpoint (per-IP + per-email/day) and share-token GETs. Send the confirmation email only *after* completion to remove email-bomb leverage.
- **Consent**: explicit unticked checkbox at the gate linking to a real privacy policy; persist `policy_version, consented_at, ip, purpose`. Sanitize CSV export against formula injection (`=,+,-,@` prefixes).

---

## 5. QA strategy (QA lens)

- **Scoring/scenarios are pure functions** → the unit-test core. The doc's "10 cases" is a floor: all-zero→0, all-max→100, each dim independently maxed (prove no cross-dim leakage), boundary walks at the 33/34 and 66/67 transitions, scenario boundaries at `dim4 ∈ {33,34,66,67}`.
- **Coverage test**: enumerate all 9 band combinations and assert every one yields a non-null sector_cluster + complete authored scenario set in both languages (directly catches B2/B4).
- **Privacy test**: hit `/results/:token` unauthenticated, assert payload has zero email/answers/user_id.
- **PDF-of-Hebrew is the single highest-risk deliverable** — spike it early with a *mixed-direction line* (Hebrew label + English role + numeric score). Automated check: generate PDF, extract text, assert Hebrew strings present and ordered. Embed a Hebrew webfont (Heebo/Rubik/Noto Sans Hebrew) or you get tofu boxes.
- **e2e**: Playwright happy-path on Chromium+Firefox+WebKit, device emulation for Android/iPhone, **plus a real-device smoke for iOS Safari** (the spec's hard requirement). RTL visual-regression baselines for every screen in EN-LTR and HE-RTL.
- **CI gate**: scoring suite + smoke e2e block merge.
- Convert the "MVP Done" (6.3) bullets into a pass/fail verification matrix.

---

## 6. Revised sequencing

The doc's 12-week plan back-loads the two riskiest pieces (RTL, funnel). Reordered:

| Week | Focus | Why moved |
|---|---|---|
| 1-2 | Setup + DB + **i18n/RTL scaffold + analytics + region pinning** | RTL & analytics must be day-1, not week 8 |
| 3-4 | Quiz engine (static content, localStorage resume, server answer writes) | |
| 5 | **Finalized algorithm** (B1-B5 resolved) + heavy unit tests | needs founder sign-off on intent first |
| 6-7 | Results page + **scenario content integration** (content authored in parallel from wk 1) | content is the hidden critical path |
| 8 | PDF (Hebrew spike done earlier) + email + share link | |
| 9 | Landing + (post-quiz) email gate + privacy/consent | |
| 10 | Admin panel + CSV + security hardening | |
| 11 | RTL QA, real-device matrix, e2e, perf | |
| 12 | Beta, measure the funnel, iterate | |

**Parallel non-eng track (founder/copywriter), must finish by wk 5-6:** all scenario content + profile titles + professional Hebrew localization (note the example question's Hebrew uses masculine `כשאתה` — needs gender-neutral phrasing).

---

## 7. "Sell for millions" reality check

The MVP as specced is a solid lead-gen quiz funnel, not yet a defensible business. The value isn't the 40-question quiz (easy to clone) — it's the V2 roadmap: the coach-booking marketplace, the data network effect from thousands of profiles, and AI-generated personalized guidance (Vercel AI Gateway is the natural fit, already in this stack). Build the MVP to *learn*, instrument it so the funnel data tells you which V2 bet is real.
