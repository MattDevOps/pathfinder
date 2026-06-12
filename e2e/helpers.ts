import { expect, type Page } from '@playwright/test';
import { PHASE1_QUESTIONS } from '../src/data/personality';
import { PHASE2_QUESTIONS } from '../src/data/passions';

export const PHASE1_COUNT = PHASE1_QUESTIONS.length; // 15
export const PHASE2_COUNT = PHASE2_QUESTIONS.length; // 12

// Walk Phase 0 (visual profiling): 3 colours, a shape, a space, an image. Each
// selectable carries an aria-label = its stable id (see Quiz.tsx), so we target
// by label rather than localized text. "Continue" advances each step; the last
// one kicks off the processing transition into Phase 1.
export async function completeVisual(page: Page): Promise<void> {
  const cont = page.getByRole('button', { name: 'Continue', exact: true });
  for (const c of ['blu', 'verde', 'rosso']) await page.getByLabel(c).click();
  await cont.click();
  await page.getByLabel('square').click();
  await cont.click();
  await page.getByLabel('solo').click();
  await cont.click();
  await page.getByLabel('growth').click();
  await cont.click();
}

// Walk one multi-select phase: pick the first option on each question and
// advance with Next. The question-number indicator gates each step so we never
// click a stale (pre-rerender) button.
async function answerPhase(page: Page, total: number): Promise<void> {
  const next = page.getByRole('button', { name: 'Next', exact: true });
  for (let q = 1; q <= total; q++) {
    await expect(page.getByText(`Question ${q} of ${total}`)).toBeVisible();
    await page.locator('fieldset button').first().click();
    await next.click();
  }
}

// Full funnel: Phase 0 -> Phase 1 -> interstitial -> Phase 2. Stops at the
// email gate (the caller asserts the gate).
export async function completeQuiz(page: Page): Promise<void> {
  await completeVisual(page);
  await expect(page.getByText(`Question 1 of ${PHASE1_COUNT}`)).toBeVisible({
    timeout: 15_000, // processing transition
  });
  await answerPhase(page, PHASE1_COUNT);
  await page.getByRole('button', { name: 'Continue to Phase 2', exact: true }).click();
  await answerPhase(page, PHASE2_COUNT);
}

// Hebrew Unicode block (U+0590-U+05FF) plus presentation forms (U+FB1D-U+FB4F).
// Used to assert the HE route renders Hebrew glyphs, not tofu/fallback boxes.
export const HEBREW_RE = /[֐-׿יִ-ﭏ]/;
