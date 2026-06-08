import { NextResponse, type NextRequest } from 'next/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { renderUrlToPdf } from '@/lib/pdf';

// PDF of a shared result. Renders the same /[locale]/results/[token] page the
// recipient sees, so the document matches the screen (correct Hebrew bidi).
// The page itself enforces the privacy boundary (get_shared_result), so this
// route exposes nothing the page does not.

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ locale: string; token: string }> },
) {
  const { locale, token } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const target = `${req.nextUrl.origin}/${locale}/results/${encodeURIComponent(token)}`;

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
    console.error('[pdf:token] render failed', e);
    return new NextResponse('PDF generation failed', { status: 500 });
  }
}
