# Pathfinder — Decisions Needed From the Founder

The spec (`docs/spec-extracted.md`) is strong, but the results engine cannot be built until these are answered. Grouped by urgency. Items marked **[CODE-BLOCKING]** stop the algorithm/results work; **[CONTENT]** is writing work that runs in parallel but must land by ~week 5-6.

---

## A. Scoring & scenario logic (blocks weeks 5-7)

1. **[CODE-BLOCKING] Freelancer definition.** The spec's code sets freelancer strength on `dim2 < 50` but the comment says "High DIM_2 (independent)" — yet Section 2.1 defines **high DIM_2 = Collaborative** (low = Independent). These contradict. What *is* a Pathfinder freelancer?
   - Proposed default: independent (low DIM_2) + moderate risk (mid DIM_4) + creative (high DIM_3). Confirm or correct.

2. **[CODE-BLOCKING] Band thresholds.** Confirm we use the same bands everywhere: **0-33 = Low, 34-66 = Mid, 67-100 = High**. (The spec mixes this with a stray `dim2 < 50` — we'd drop that.)

3. **[CODE-BLOCKING] Sector map for all 9 combinations.** The table in 3.4 only defines 5 of the 9 DIM_1 × DIM_3 combinations. Approve this full map (or edit):
   | DIM_1 \ DIM_3 | Low | Mid | High |
   |---|---|---|---|
   | **Low** | Operations & Engineering | Operations & Engineering | Craft & Production |
   | **Mid** | Strategy & Analysis | People & Communication | Innovation & Creativity |
   | **High** | Strategy & Analysis | Strategy & Analysis | Innovation & Creativity |

4. **[CODE-BLOCKING] Profile title rule.** The header ("The Creative Strategist") and `profile_title` column are never defined. Pick one approach:
   - (a) One fixed title per sector cluster (5 titles total), or
   - (b) Generated as "The {DIM_1 adjective} {DIM_3 noun}" from a small word table.
   - Either way we need the actual words, in EN **and** HE.

5. **Tie-break / flat profile.** What should an all-50s ("balanced everything") user see? Default proposal: route to People & Communication cluster with a "Versatile" title. Confirm.

---

## B. Scenario content (the hidden critical path — [CONTENT], needed by ~wk 5-6)

6. For **each sector cluster × each scenario (Employee / Freelancer / Founder)** we need authored copy:
   - a **headline**, **3 recommended roles**, a **motivation paragraph**, **3 next steps** — in **EN and HE**.
   - That's roughly **5 clusters × 3 scenarios = 15 blocks × 2 languages = ~30 content units.**
   - The spec only gives Employee roles + Founder ideas for 5 clusters, and no Freelancer roles, no paragraphs, no next-steps, no Hebrew. **Who writes this, and by when?** This gates the entire results page.

7. **Hebrew quality.** The example question's Hebrew uses masculine phrasing (`כשאתה`). Do you want **gender-neutral** Hebrew throughout, and will a native copywriter localize (not literally translate) all 40 questions + all result content?

---

## C. Product / funnel (we recommend changing the spec — confirm)

8. **Email gate placement.** Spec puts it *before* the quiz. We strongly recommend moving it to *after* completion (capture email to unlock/save the full report, with a teaser shown first). This typically lifts completion substantially. **OK to move it?**

9. **No back button.** Spec forbids going back. We recommend allowing **back-one** with a brief confirm/undo (one mis-tap across 40 questions is currently unrecoverable). Keep the fast feel, remove the trap. **OK?**

10. **"12 minutes" vs "under 15 minutes."** The hero headline and the Definition-of-Done disagree. Which is the real promise? (We'll measure actual median completion time once instrumented.)

11. **Coach booking.** MVP links to Calendly. Confirm the Calendly URL / that this is the intended booking path for beta.

---

## D. Privacy & legal (blocks launch, not build)

12. **Email handling.** Spec says "store hashed." That makes emailing the PDF and showing emails in the admin panel impossible. We'll instead **encrypt** the email at rest (recoverable) + add a lookup index. Confirm that's acceptable.

13. **[GATING - DATABASE CHOICE] Data residency.** This decides our entire backend platform. Most managed hosts (Supabase/Vercel/Neon) have **no Israel region** - best is EU/Frankfurt. AWS *does* have a Tel Aviv region (`il-central-1`). 
   - If **EU/Frankfurt is acceptable** (true for most GDPR/Israeli-law cases) -> we use **Supabase** (fast to ship). **This is our default until you say otherwise.**
   - If data **must physically live in Israel** (hard legal/enterprise requirement) -> we switch to **AWS RDS Postgres in Tel Aviv** from day 1 (more setup, slower MVP). 
   - **Which is it?**

14. **Privacy policy + consent.** We need a real privacy policy (controller identity, purpose, retention, deletion process) and a consent checkbox before launch. Who provides the legal text?

15. **Marketing use of emails.** Can captured emails be used for coach follow-up / marketing, or results-delivery only? (Determines the consent wording.)

---

## E. Scope confirmations

16. **Retakes.** Can a user take the quiz more than once with the same email? (Affects the data model — we'd treat email as identity and append new sessions.)
17. **Analytics.** We're adding PostHog (free) from week 1 to measure the funnel. Any objection to a privacy-respecting analytics tool?
