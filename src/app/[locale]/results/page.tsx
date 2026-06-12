import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';
import { DOMAINS, type ArchetypeId, type DomainId } from '@/lib/types';
import { emptyVisual } from '@/lib/quiz-session';
import ResultsView, { type ResultInput } from './ResultsView';

// Preview/dev path: render a profile from the result in the query string
// (?a=archetype&dom=domain&d1..d4&c=congruence). The instant, client-scored
// result after the quiz lands here. The shareable, persisted result (with the
// full visual signature) lives at /results/[token].

const ARCHETYPES_SET = new Set<ArchetypeId>([
  'builder', 'specialist', 'creator', 'connector',
]);
const SAMPLE: ResultInput = {
  archetype: 'builder',
  domain: 'TEC',
  dims: { d1: 72, d2: 28, d3: 81, d4: 66 },
  congruence: 88,
};

function one(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}
function clampScore(raw: string | string[] | undefined, fallback: number): number {
  const v = Number(one(raw));
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
  const a = one(sp.a) as ArchetypeId | undefined;
  const dom = one(sp.dom) as DomainId | undefined;
  const result: ResultInput = {
    archetype: a && ARCHETYPES_SET.has(a) ? a : SAMPLE.archetype,
    domain: dom && (DOMAINS as readonly string[]).includes(dom) ? dom : SAMPLE.domain,
    dims: {
      d1: clampScore(sp.d1, SAMPLE.dims.d1),
      d2: clampScore(sp.d2, SAMPLE.dims.d2),
      d3: clampScore(sp.d3, SAMPLE.dims.d3),
      d4: clampScore(sp.d4, SAMPLE.dims.d4),
    },
    congruence: clampScore(sp.c, SAMPLE.congruence),
  };
  const q =
    `a=${result.archetype}&dom=${result.domain}` +
    `&d1=${result.dims.d1}&d2=${result.dims.d2}&d3=${result.dims.d3}&d4=${result.dims.d4}` +
    `&c=${result.congruence}`;

  return (
    <ResultsView
      result={result}
      visual={emptyVisual()}
      locale={locale as Locale}
      toggleHref={`/results?${q}`}
      source="preview"
      pdfHref={`/${locale}/results/pdf?${q}`}
    />
  );
}
