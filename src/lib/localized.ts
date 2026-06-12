import type { Localized } from './types';

// Resolve a Localized string for a locale, falling back to Italian (the
// authored primary) when the requested translation is still empty. This keeps
// every screen renderable while en/he translation is outstanding debt.
export function t(value: Localized, locale: string): string {
  const v = value[locale as keyof Localized];
  return v && v.trim() ? v : value.it;
}
