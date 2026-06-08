import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';
import type { DimensionScores } from '@/lib/types';
import ResultsView from './ResultsView';

// Preview/dev path: render a profile from scores in the query string
// (?d1=&d2=&d3=&d4=, each 0-100). The instant, client-scored result after the
// quiz lands here. The shareable, persisted result lives at /results/[token].

const SAMPLE: DimensionScores = { dim1: 72, dim2: 28, dim3: 81, dim4: 55 };

function clamp(raw: string | string[] | undefined, fallback: number): number {
  const v = Number(Array.isArray(raw) ? raw[0] : raw);
  if (!Number.isFinite(v)) return fallback;
  return Math.max(0, Math.min(100, Math.round(v)));
}

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const sp = await searchParams;
  const scores: DimensionScores = {
    dim1: clamp(sp.d1, SAMPLE.dim1),
    dim2: clamp(sp.d2, SAMPLE.dim2),
    dim3: clamp(sp.d3, SAMPLE.dim3),
    dim4: clamp(sp.d4, SAMPLE.dim4),
  };

  return (
    <ResultsView scores={scores} locale={locale as Locale} toggleHref="/results" />
  );
}
