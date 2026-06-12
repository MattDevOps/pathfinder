import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';
import type { ArchetypeId, DomainId } from '@/lib/types';
import { createPublicClient } from '@/lib/supabase/server';
import type { SharedResultRow } from '@/lib/supabase/types';
import { emptyVisual } from '@/lib/quiz-session';
import ResultsView, { type ResultInput } from '../ResultsView';

// Public, shareable result. Reads ONLY the result fields via the
// get_shared_result(token) SECURITY DEFINER function (migration 0005) using the
// anon client — answers, email, and user_id never leave the database. A
// non-existent or non-completed token 404s. The stored visual profile lets the
// shared page render the full visual signature; the recipient can toggle locale.

export default async function SharedResultPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  let row: SharedResultRow | null = null;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.rpc('get_shared_result', { token });
    if (error) {
      console.error('[shared result] rpc failed', error);
      notFound();
    }
    row = (data as SharedResultRow[] | null)?.[0] ?? null;
  } catch (e) {
    console.error('[shared result] supabase not configured', e);
    notFound();
  }

  if (!row) notFound();

  const result: ResultInput = {
    archetype: row.archetype as ArchetypeId,
    domain: row.domain as DomainId,
    dims: { d1: row.dim1_score, d2: row.dim2_score, d3: row.dim3_score, d4: row.dim4_score },
    congruence: row.congruence,
  };

  return (
    <ResultsView
      result={result}
      visual={row.visual ?? emptyVisual()}
      locale={locale as Locale}
      toggleHref={`/results/${token}`}
      source="shared"
      pdfHref={`/${locale}/results/${token}/pdf`}
    />
  );
}
