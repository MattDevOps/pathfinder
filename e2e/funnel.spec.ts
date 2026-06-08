import { test, expect } from '@playwright/test';
import { answerAllQuestions, TOTAL_QUESTIONS } from './helpers';

// The funnel the way a real user walks it: landing -> quiz -> post-quiz email
// gate -> preview results. Stops short of the email submit (that path needs
// Supabase secrets); the consent-validation check below exercises the server
// action up to the point it rejects, which happens before any DB call.

test.describe('landing', () => {
  test('renders the hero and starts the quiz', async ({ page }) => {
    await page.goto('/en');

    await expect(
      page.getByRole('heading', { name: 'Find your direction' }),
    ).toBeVisible();

    const start = page.getByRole('link', { name: 'Start the quiz' });
    await expect(start).toBeVisible();
    await start.click();

    await expect(page).toHaveURL(/\/en\/quiz$/);
    await expect(page.getByText('Question 1 of 40')).toBeVisible();
  });

  test('has no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/en');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(errors).toEqual([]);
  });
});

test.describe('quiz navigation', () => {
  test('back is disabled on Q1, enabled after, and goes back one', async ({
    page,
  }) => {
    await page.goto('/en/quiz');
    await expect(page.getByText('Question 1 of 40')).toBeVisible();

    // exact: true — the quiz shuffles options, and an answer can contain the
    // word "back"; a substring match would ambiguously hit it too.
    const back = page.getByRole('button', { name: 'Back', exact: true });
    await expect(back).toBeDisabled();

    // Answer Q1 -> auto-advance to Q2.
    await page.locator('fieldset button').first().click();
    await expect(page.getByText('Question 2 of 40')).toBeVisible();
    await expect(back).toBeEnabled();

    // Back-one returns to Q1.
    await back.click();
    await expect(page.getByText('Question 1 of 40')).toBeVisible();
    await expect(back).toBeDisabled();
  });

  test('keyboard 1-4 selects an option and advances', async ({ page }) => {
    await page.goto('/en/quiz');
    await expect(page.getByText('Question 1 of 40')).toBeVisible();
    await page.keyboard.press('2');
    await expect(page.getByText('Question 2 of 40')).toBeVisible();
  });
});

test.describe('full funnel', () => {
  test('completing the quiz reaches the email gate with a teaser', async ({
    page,
  }) => {
    test.slow(); // 40 questions + gate

    await page.goto('/en/quiz');
    await answerAllQuestions(page);

    // Email gate (funnel C1: gate AFTER the quiz, with a teaser title).
    await expect(page.getByText('Your profile is ready')).toBeVisible();
    await expect(page.getByText(/You came out as .+\./)).toBeVisible();
    await expect(page.getByRole('checkbox')).toBeVisible();
  });

  test('gate blocks submit until the privacy policy is accepted', async ({
    page,
  }) => {
    test.slow();

    await page.goto('/en/quiz');
    await answerAllQuestions(page);
    await expect(page.getByText('Your profile is ready')).toBeVisible();

    // Valid email but consent unchecked -> the server action returns
    // consent_required (before touching Supabase) and the gate shows the error.
    await page.getByRole('textbox', { name: 'Email' }).fill('tester@example.com');
    await page.getByRole('button', { name: 'Unlock my full profile' }).click();
    await expect(
      page.getByText('Please accept the privacy policy to continue.'),
    ).toBeVisible();
  });

  test('preview escape hatch shows the full result without saving', async ({
    page,
  }) => {
    test.slow();

    await page.goto('/en/quiz');
    await answerAllQuestions(page);
    await expect(page.getByText('Your profile is ready')).toBeVisible();

    await page
      .getByRole('link', { name: "Just show me a preview (don't save)" })
      .click();

    // Lands on the query-param (unsaved) results route with all four dims.
    await expect(page).toHaveURL(/\/en\/results\?d1=\d+&d2=\d+&d3=\d+&d4=\d+/);
    await expect(
      page.getByRole('heading', { name: 'Your three paths' }),
    ).toBeVisible();
  });
});

test('quiz has exactly 40 questions', () => {
  // Guards the funnel copy ("Question N of 40") against a questions.ts change.
  expect(TOTAL_QUESTIONS).toBe(40);
});
