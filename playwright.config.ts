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

  // First cut: Chromium only, to keep CI fast and green. The PLAN calls for a
  // Firefox + WebKit + real-device matrix — add projects here once the funnel
  // is stable (one extra block per browser via devices['Desktop Firefox'] etc).
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
