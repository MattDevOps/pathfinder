# Pathfinder

Career-orientation quiz platform. Users take a 40-question multiple-choice quiz
scored across 4 dimensions and receive a personalized profile with three career
scenarios (Employee, Freelancer, Founder), with PDF export and a shareable link.
Bilingual EN/HE with full RTL support.

## Status

Scaffold + core engine. The funnel/screens are being built on top of a working
i18n/RTL shell and a tested scoring engine. **The scenario/sector/profile-title
logic and all scenario content are DRAFT pending founder sign-off** — see
`docs/FOUNDER-QUESTIONS.md`.

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
  app/[locale]/        # locale-routed screens (RTL handled in layout.tsx)
  i18n/                # next-intl routing, request, navigation config
  lib/
    types.ts           # framework-free domain types
    scoring.ts         # CONFIRMED: normalization + labels (spec 3.1/3.2), tested
    scenarios.draft.ts # DRAFT: sector/scenario/title mapping (pending sign-off)
  data/questions.ts    # all 40 questions (EN complete; HE = Q001 + translation debt)
messages/{en,he}.json  # UI strings
supabase/migrations/   # portable schema (0001) + Supabase RLS (0002)
```

## Develop

```bash
npm install
cp .env.example .env.local   # fill in when integrating Supabase/Resend/PostHog
npm run dev                  # http://localhost:3000 -> redirects to /en
npm test                     # scoring + data integrity suite
npm run build
```

Visit `/he` to see the RTL layout and Hebrew toggle.
