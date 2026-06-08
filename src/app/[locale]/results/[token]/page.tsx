import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';
import type { DimensionScores } from '@/lib/types';
import { createPublicClient } from '@/lib/supabase/server';
import type { SharedResultRow } from '@/lib/supabase/types';
import ResultsView from '../ResultsView';

// Public, shareable result. Reads ONLY the result fields via the
// get_shared_result(token) SECURITY DEFINER function (migration 0002) using the
// anon client — answers, email, and user_id never leave the database. A
// non-existent or non-completed token 404s.
//
// The page renders from the stored 0-100 scores; ResultsView recomputes the
// DRAFT title/cluster/scenarios from them in the URL locale, so a recipient can
// toggle EN/HE freely.

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

  const scores: DimensionScores = {
    dim1: row.dim1_score,
    dim2: row.dim2_score,
    dim3: row.dim3_score,
    dim4: row.dim4_score,
  };

  return (
    <ResultsView
      scores={scores}
      locale={locale as Locale}
      toggleHref={`/results/${token}`}
    />
  );
}
