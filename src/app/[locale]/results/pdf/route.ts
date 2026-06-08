import { NextResponse, type NextRequest } from 'next/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { renderUrlToPdf } from '@/lib/pdf';

// PDF of a result profile. This spike renders the query-param preview page
// (/[locale]/results?d1..d4) so it works without a database; the token variant
// (/[locale]/results/[token]/pdf) is a one-line reuse of renderUrlToPdf once
// the DB is live. Chromium fetches the page same-origin, so the rendered PDF is
// byte-for-byte the on-screen result (correct Hebrew bidi included).

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Chromium cold start + render

const SCORE_KEYS = ['d1', 'd2', 'd3', 'd4'] as const;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const incoming = req.nextUrl.searchParams;
  const query = new URLSearchParams();
  for (const key of SCORE_KEYS) {
    const value = incoming.get(key);
    if (value !== null) query.set(key, value);
  }

  const target = `${req.nextUrl.origin}/${locale}/results?${query.toString()}`;

  try {
    const pdf = await renderUrlToPdf(target);
    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="pathfinder-profile.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    console.error('[pdf] render failed', e);
    return new NextResponse('PDF generation failed', { status: 500 });
  }
}
