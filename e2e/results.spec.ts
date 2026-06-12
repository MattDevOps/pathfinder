import { test, expect } from '@playwright/test';
import { HEBREW_RE } from './helpers';

// Results render straight off the query-param preview URL, so these run fast
// without walking the funnel. archetype x domain + dims + congruence.
const RESULT = 'a=builder&dom=TEC&d1=72&d2=28&d3=81&d4=66&c=88';

test.describe('results page (EN)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/en/results?${RESULT}`);
  });

  test('renders the archetype x domain, dimensions, and career paths', async ({
    page,
  }) => {
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');

    // All four dimension axis labels (English chrome).
    for (const label of [
      'Way of thinking',
      'Social mode',
      'Source of energy',
      'Risk tolerance',
    ]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }

    // Career section + philosophy block.
    await expect(
      page.getByRole('heading', { name: 'Your specific paths' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: "Potential doesn't depend on the path" }),
    ).toBeVisible();

    // Four congruence badges (one per path).
    await expect(page.getByText(/% congruence/).first()).toBeVisible();
  });

  test('exposes the PDF and share actions', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: 'Download as PDF' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Share your result' }),
    ).toBeVisible();
  });
});

test.describe('results page (HE / RTL)', () => {
  test('is right-to-left and renders Hebrew chrome', async ({ page }) => {
    await page.goto(`/he/results?${RESULT}`);

    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    // The page body contains real Hebrew glyphs (not tofu/fallback).
    const body = await page.locator('body').innerText();
    expect(body).toMatch(HEBREW_RE);
  });
});
