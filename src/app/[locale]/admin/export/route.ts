import { NextResponse, type NextRequest } from 'next/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { getAdminSession } from '@/lib/admin-session';
import { fetchResults } from '@/lib/admin-data';
import { buildResultsCsv } from '@/lib/csv';

// CSV export of all results. Admin-gated (401 when not authenticated). Emails
// are decrypted for the export; buildResultsCsv neutralizes formula injection.

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new NextResponse('Not found', { status: 404 });
  }

  if (!(await getAdminSession())) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  let csv: string;
  try {
    csv = buildResultsCsv(await fetchResults());
  } catch (e) {
    console.error('[admin export] failed', e);
    return new NextResponse('Export failed', { status: 500 });
  }

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="pathfinder-results.csv"',
      'Cache-Control': 'no-store',
    },
  });
}
