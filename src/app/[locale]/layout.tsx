import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Rubik } from 'next/font/google';
import { routing, dir } from '@/i18n/routing';
import Providers from '../providers';
import '../globals.css';

// Rubik covers both Latin and Hebrew, so one font renders EN and HE
// correctly and avoids a tofu/fallback font in the Hebrew PDF.
const rubik = Rubik({
  subsets: ['latin', 'hebrew'],
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  title: 'Pathfinder',
  description: 'Find your direction.',
};

// Pre-render both locales at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Enable static rendering for this locale.
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${rubik.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
