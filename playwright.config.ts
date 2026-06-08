import { defineConfig, devices } from '@playwright/test';

// E2E config. Lives separate from the vitest unit/integration suite:
//   * vitest globs src/**/*.test.ts (pure logic + crypto + pglite DB).
//   * Playwright is scoped to ./e2e and runs the real app in a browser.
// testDir MUST stay set — Playwright's default testMatch also picks up
// *.test.ts, which would otherwise try to run the vitest files in src/.
//
// The webServer runs `next dev`. Routes compile lazily on first hit (the PDF
// route in particular spins up Chromium), so per-action timeouts are generous.

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  // Cross-browser matrix (PLAN.md QA section: Chromium + Firefox + WebKit, plus
  // an iOS Safari smoke).
  //
  // Test split, to avoid wasteful re-runs:
  //   * chromium runs the full suite, including pdf.spec. The PDF route is
  //     engine-independent (it hits an HTTP endpoint that renders via a
  //     server-side Chromium), so there's no value in triplicating it across
  //     Firefox/WebKit — they testIgnore it.
  //   * Mobile Safari runs only the funnel happy-path as a smoke: this is the
  //     closest CI proxy for the spec's real-device iOS Safari requirement
  //     (true device testing still needs a manual pass). It exercises the
  //     40-question quiz + gate + results under a phone viewport on WebKit.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: '**/pdf.spec.ts',
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: '**/pdf.spec.ts',
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
      testMatch: '**/funnel.spec.ts',
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
