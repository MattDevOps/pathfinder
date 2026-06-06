import { defineRouting } from 'next-intl/routing';

// Supported locales. Hebrew is RTL; English is LTR.
export const locales = ['en', 'he'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  // Always show the locale prefix (/en, /he) so language + direction are
  // unambiguous on first server render. RTL must be correct from day 1.
  localePrefix: 'always',
});

// Text direction per locale. Hebrew renders right-to-left.
export function dir(locale: string): 'rtl' | 'ltr' {
  return locale === 'he' ? 'rtl' : 'ltr';
}
