# Pathfinder

Career-orientation quiz platform. Users take a 40-question multiple-choice quiz
scored across 4 dimensions and receive a personalized profile with three career
scenarios (Employee, Freelancer, Founder), with PDF export and a shareable link.
Bilingual EN/HE with full RTL support.

## Status

Core funnel built end to end: landing -> quiz (40 questions, keyboard +
localStorage resume) -> post-quiz email gate -> results profile, plus a
server-side persistence path (`completeSession` action -> atomic
`complete_session` SQL function) and a public shareable result at
`/results/[token]` (read via the `get_shared_result` SECURITY DEFINER function).

**The scenario/sector/profile-title logic and all scenario content are DRAFT
pending founder sign-off** — see `docs/FOUNDER-QUESTIONS.md`. The DB write path
is code-complete but **needs a Supabase project + secrets to run** (see
"Backend / Supabase" below); it has not been exercised against a live database
yet.

## Docs

- `docs/PLAN.md` — full build plan + decision brief (output of a multi-agent review).
- `docs/FOUNDER-QUESTIONS.md` — open product/content/legal decisions blocking the results engine.
- `docs/spec-extracted.md` — the original spec (text-extracted from the source .docx).

## Stack

| Layer | Choice |
|---|---|
| Framework / hosting | Next.js 16 (App Router) on Vercel, region `fra1` (`vercel.ts`) |
| Database | Supabase (Postgres) in Frankfurt — **pending residency decision** (D13); schema kept portable for AWS RDS Tel Aviv |
| i18n / RTL | next-intl + Tailwind logical properties; `dir` on `<html>` per locale |
| PDF | Chromium via `@sparticuz/chromium` + `puppeteer-core` (renders the results route; correct Hebrew bidi) |
| Email | Resend |
| Auth | None for quiz-takers (email row + share_token); Supabase Auth for the single admin |
| Analytics | PostHog (planned, week 1) |
| Tests | Vitest (scoring engine + data integrity) |

## Key decisions baked in (vs the original spec)

- Email gate moved to **after** the quiz (activation).
- **Back-one + confirm** allowed (the spec's hard no-back is an A/B hypothesis, not a law).
- Single band scheme everywhere: `0-33 low / 34-66 mid / 67-100 high` (drops the spec's stray `dim2 < 50`).
- Email stored **encrypted** + HMAC blind index (not the spec's plaintext-unique / naive hash).
- Scoring runs **server-side**; client copy is for instant UI only.

## Project layout

```
src/
  app/[locale]/
    page.tsx               # landing (screen 1)
    quiz/                  # quiz engine (client), email gate, completeSession action
    results/               # /results (query-param preview) + /results/[token] (shared)
  i18n/                    # next-intl routing, request, navigation config
  lib/
    types.ts               # framework-free domain types
    scoring.ts             # CONFIRMED: normalization + labels (spec 3.1/3.2), tested
    scenarios.draft.ts     # DRAFT: sector/scenario/title mapping (pending sign-off)
    profile.ts             # buildProfile: assembles scores+labels+scenarios+content
    quiz-session.ts        # localStorage session, shuffle, selections -> scores
    results-record.ts      # server-authoritative result row from selections
    crypto.ts              # AES-256-GCM email enc + HMAC blind index + share token
    supabase/              # service-role + anon clients, hand-written RPC types
  data/
    questions.ts           # all 40 questions (EN complete; HE = Q001 + translation debt)
    scenario-content.draft.ts # DRAFT scenario copy (EN complete; HE stubbed)
messages/{en,he}.json      # UI strings
supabase/migrations/       # schema (0001) + RLS (0002) + complete_session fn (0003)
```

## Develop

```bash
npm install
cp .env.example .env.local   # fill in when integrating Supabase/Resend/PostHog
npm run dev                  # http://localhost:3000 -> redirects to /en
npm test                     # scoring + data integrity suite
npm run build
```

Visit `/he` to see the RTL layout and Hebrew toggle. The full funnel runs
without a backend up to the email gate; the gate's "preview" link renders an
unsaved result from query params (`/results?d1=..&d2=..&d3=..&d4=..`).

## Backend / Supabase

The persistence path (email-gate submit -> stored session -> `/results/[token]`)
needs a Supabase project. Until one exists, the email gate returns a graceful
error and the token route 404s.

1. Create a Supabase project (region **Frankfurt / eu-central-1**, per `vercel.ts`).
2. Apply migrations in order: `supabase/migrations/0001_init.sql`,
   `0002_rls.sql`, `0003_complete_session.sql` (Supabase SQL editor or
   `supabase db push`).
3. Fill `.env.local` from `.env.example`. The PII keys must be real:
   ```bash
   # 32-byte base64 key for AES-256-GCM email encryption
   openssl rand -base64 32      # -> EMAIL_ENCRYPTION_KEY
   openssl rand -hex 32         # -> EMAIL_INDEX_HMAC_SECRET
   ```
   plus `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY` from the project settings.
4. The privacy/RLS test from `docs/PLAN.md` (anon cannot read `answers`/`users`)
   is not written yet — add it before launch.

## PDF export

`GET /[locale]/results/pdf?d1=..&d2=..&d3=..&d4=..` renders the results page to
PDF with headless Chromium (correct Hebrew bidi via the self-hosted Rubik
font). On Vercel, `@sparticuz/chromium` supplies the binary. For **local dev**,
point it at a system Chrome:

```bash
CHROME_EXECUTABLE_PATH=/usr/bin/google-chrome npm run dev
```

The token variant (`/results/[token]/pdf`) is a one-line reuse of
`renderUrlToPdf` once the DB is live.
