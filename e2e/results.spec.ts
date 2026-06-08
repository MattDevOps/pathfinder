import { test, expect } from '@playwright/test';
import { HEBREW_RE } from './helpers';

// Results render straight off the query-param preview URL, so these run fast
// without walking the quiz. Same dims used in the manual dogfood.
const DIMS = 'd1=67&d2=63&d3=67&d4=67';

test.describe('results page (EN)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/en/results?${DIMS}`);
  });

  test('renders the profile, dimensions, and three paths', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');

    // Draft banner is present (content is provisional pending sign-off).
    await expect(
      page.getByText(/Draft preview: scoring and scenario content/),
    ).toBeVisible();

    // Profile title + sector.
    await expect(
      page.getByRole('heading', { name: 'The Innovator' }),
    ).toBeVisible();
    await expect(page.getByText('Innovation & Creativity')).toBeVisible();

    // All four dimension labels.
    for (const label of [
      'Thinking style',
      'Work style',
      'Creative drive',
      'Risk appetite',
    ]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }

    // Three scenario cards.
    for (const s of ['Founder', 'Freelancer', 'Employee']) {
      await expect(page.getByRole('heading', { name: s })).toBeVisible();
    }
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
  test('is right-to-left and renders Hebrew, keeping the English title', async ({
    page,
  }) => {
    await page.goto(`/he/results?${DIMS}`);

    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    // The page body contains real Hebrew glyphs (not tofu/fallback).
    const body = await page.locator('body').innerText();
    expect(body).toMatch(HEBREW_RE);

    // Profile title stays English even in the HE layout (it is not yet
    // localized — draft).
    await expect(
      page.getByRole('heading', { name: 'The Innovator' }),
    ).toBeVisible();
  });
});
