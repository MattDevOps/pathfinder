import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// Render a URL to a PDF with headless Chromium.
//
// PDF-of-Hebrew is the single highest-risk deliverable (PLAN.md QA): React-PDF
// cannot do Hebrew bidi, so we render the actual results route in a real browser
// instead. The page self-hosts the Rubik webfont (hebrew subset, layout.tsx),
// so Chromium loads it and there are no tofu boxes.
//
// Executable resolution:
//   * local/dev: set CHROME_EXECUTABLE_PATH to a system Chrome.
//   * serverless (Vercel): @sparticuz/chromium provides the binary + args.

export async function renderUrlToPdf(url: string): Promise<Uint8Array> {
  const localExecutable = process.env.CHROME_EXECUTABLE_PATH;

  const browser = await puppeteer.launch({
    args: localExecutable
      ? ['--no-sandbox', '--disable-setuid-sandbox']
      : chromium.args,
    executablePath: localExecutable || (await chromium.executablePath()),
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30_000 });
    // Ensure webfonts (Rubik, incl. the Hebrew subset) are loaded before print.
    await page.evaluate(() => document.fonts.ready);
    const pdf = await page.pdf({
      format: 'a4',
      printBackground: true,
      margin: { top: '16mm', right: '14mm', bottom: '16mm', left: '14mm' },
    });
    return pdf;
  } finally {
    await browser.close();
  }
}
