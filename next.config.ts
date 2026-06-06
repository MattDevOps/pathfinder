import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // @sparticuz/chromium + puppeteer-core are only loaded inside the PDF
  // route handler; keep them external so they are not bundled for the client.
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
};

export default withNextIntl(nextConfig);
