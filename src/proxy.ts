import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Adds/validates the locale prefix on every request and negotiates the
// preferred locale from the Accept-Language header on first visit.
// (Next 16 "proxy" convention, formerly "middleware".)
export default createMiddleware(routing);

export const config = {
  // Skip Next internals and static assets; run on everything else.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
