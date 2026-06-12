import { test, expect } from '@playwright/test';

// The PDF route is the PLAN's single highest-risk deliverable (Hebrew bidi via
// real-Chromium render). These guard that both locales return a structurally
// valid PDF. Deep Hebrew-glyph extraction from the compressed PDF stream is out
// of scope here; the HE *route* rendering Hebrew is asserted in results.spec.ts,
// and the same route is what Chromium prints.
// Serial: each test launches its own Chromium to print; running them in
// parallel races the route's first-hit compile + two cold starts and can time
// out (passes fine one at a time).
test.describe.configure({ mode: 'serial' });

const RESULT = 'a=builder&dom=TEC&d1=67&d2=63&d3=67&d4=67&c=80';

for (const locale of ['en', 'he'] as const) {
  test(`${locale} PDF route returns a valid PDF`, async ({ request }) => {
    test.slow(); // first hit compiles the route + launches Chromium

    const res = await request.get(`/${locale}/results/pdf?${RESULT}`);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/pdf');

    const body = await res.body();
    // PDF magic number + a non-trivial size (a tofu/empty render is tiny).
    expect(body.subarray(0, 5).toString('latin1')).toBe('%PDF-');
    expect(body.byteLength).toBeGreaterThan(10_000);
  });
}
