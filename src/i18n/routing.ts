import { defineRouting } from 'next-intl/routing';

// Supported locales. Italian is the primary market (v5); Hebrew is RTL.
export const locales = ['it', 'en', 'he'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'it',
  // Always show the locale prefix (/it, /en, /he) so language + direction are
  // unambiguous on first server render. RTL must be correct from day 1.
  localePrefix: 'always',
});

// Text direction per locale. Hebrew renders right-to-left.
export function dir(locale: string): 'rtl' | 'ltr' {
  return locale === 'he' ? 'rtl' : 'ltr';
}
