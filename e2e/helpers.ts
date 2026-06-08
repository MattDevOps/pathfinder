import { expect, type Page } from '@playwright/test';
import { QUESTIONS } from '../src/data/questions';

export const TOTAL_QUESTIONS = QUESTIONS.length;

// Walk the whole quiz by clicking the first option on each question. We gate
// each click on the question-number indicator becoming visible first, so we
// never click a stale (pre-rerender) button — this is what keeps the 40-step
// loop from flaking. After the final answer the quiz hands off to the email
// gate, so the caller asserts the gate, not another question.
export async function answerAllQuestions(page: Page): Promise<void> {
  for (let q = 1; q <= TOTAL_QUESTIONS; q++) {
    await expect(
      page.getByText(`Question ${q} of ${TOTAL_QUESTIONS}`),
    ).toBeVisible();
    await page.locator('fieldset button').first().click();
  }
}

// Hebrew Unicode block (U+0590-U+05FF) plus presentation forms (U+FB1D-U+FB4F).
// Used to assert the HE route renders Hebrew glyphs, not tofu/fallback boxes.
export const HEBREW_RE = /[֐-׿יִ-ﭏ]/;
