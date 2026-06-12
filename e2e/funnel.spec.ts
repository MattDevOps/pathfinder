import { test, expect } from '@playwright/test';
import { completeQuiz, completeVisual, PHASE1_COUNT, PHASE2_COUNT } from './helpers';

// The v5 funnel the way a real user walks it: landing -> Phase 0 visual ->
// Phase 1 -> interstitial -> Phase 2 -> post-quiz email gate -> preview results.
// Stops short of the email submit (that path needs Supabase secrets); the
// consent-validation check exercises the server action up to the point it
// rejects, which happens before any DB call.

test.describe('landing', () => {
  test('renders the brand and starts the quiz', async ({ page }) => {
    await page.goto('/en');

    await expect(page.getByRole('heading', { name: 'Pathfinder' })).toBeVisible();

    const start = page.getByRole('link', { name: 'Start' });
    await expect(start).toBeVisible();
    await start.click();

    await expect(page).toHaveURL(/\/en\/quiz$/);
    await expect(page.getByText('Phase 0 · Step 1 of 4')).toBeVisible();
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

test.describe('Phase 0 navigation', () => {
  test('back is disabled on step 1 and Continue gates on a selection', async ({
    page,
  }) => {
    await page.goto('/en/quiz');
    await expect(page.getByText('Phase 0 · Step 1 of 4')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Back', exact: true })).toBeDisabled();
    const cont = page.getByRole('button', { name: 'Continue', exact: true });
    await expect(cont).toBeDisabled();

    // Three colours unlock Continue.
    for (const c of ['blu', 'verde', 'rosso']) await page.getByLabel(c).click();
    await expect(cont).toBeEnabled();
    await cont.click();
    await expect(page.getByText('Phase 0 · Step 2 of 4')).toBeVisible();
  });
});

test.describe('full funnel', () => {
  test('completing the funnel reaches the email gate with a teaser', async ({
    page,
  }) => {
    test.slow(); // visual + 27 questions

    await page.goto('/en/quiz');
    await completeQuiz(page);

    await expect(page.getByText('Your profile is ready')).toBeVisible();
    await expect(page.getByText(/You came out as .+\./)).toBeVisible();
    await expect(page.getByRole('checkbox')).toBeVisible();
  });

  test('gate blocks submit until the privacy policy is accepted', async ({
    page,
  }) => {
    test.slow();

    await page.goto('/en/quiz');
    await completeQuiz(page);
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
    await completeQuiz(page);
    await expect(page.getByText('Your profile is ready')).toBeVisible();

    await page
      .getByRole('link', { name: "Just show me a preview (don't save)" })
      .click();

    // Lands on the query-param (unsaved) results route with archetype + domain.
    await expect(page).toHaveURL(/\/en\/results\?a=\w+&dom=\w+/);
    await expect(
      page.getByRole('heading', { name: 'Your specific paths' }),
    ).toBeVisible();
  });
});

test('the funnel has 15 + 12 questions', () => {
  // Guards the funnel copy ("Question N of 15/12") against a data change.
  expect(PHASE1_COUNT).toBe(15);
  expect(PHASE2_COUNT).toBe(12);
});

test('Phase 0 can be completed independently', async ({ page }) => {
  await page.goto('/en/quiz');
  await completeVisual(page);
  await expect(page.getByText(`Question 1 of ${PHASE1_COUNT}`)).toBeVisible({
    timeout: 15_000,
  });
});
