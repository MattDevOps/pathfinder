import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { use } from 'react';
import { locales } from '@/i18n/routing';
import TrackEvent from './TrackEvent';
import { EVENTS } from '@/lib/analytics';

// Screen 1 of the v5 journey: landing page with the brand, the three-phase
// promise, and the start CTA. RTL is handled globally by the <html dir> set in
// the locale layout, so this uses logical Tailwind utilities (ms/me/text-start)
// and works in both directions.
export default function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('Landing');
  const others = locales.filter((l) => l !== locale);

  const phases = [
    { label: t('phaseLabel', { n: 0 }), title: t('phase0Title'), desc: t('phase0Desc') },
    { label: t('phaseLabel', { n: 1 }), title: t('phase1Title'), desc: t('phase1Desc') },
    { label: t('phaseLabel', { n: 2 }), title: t('phase2Title'), desc: t('phase2Desc') },
    { label: t('resultLabel'), title: t('resultTitle'), desc: t('resultDesc') },
  ];

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <TrackEvent event={EVENTS.landingViewed} />
      <div className="flex w-full max-w-4xl justify-end gap-2">
        {others.map((l) => (
          <Link
            key={l}
            href="/"
            locale={l}
            className="rounded-full border border-foreground/15 px-4 py-1.5 text-sm hover:bg-foreground/5"
          >
            {l.toUpperCase()}
          </Link>
        ))}
      </div>

      <h1 className="text-6xl font-bold tracking-tight">Pathfinder</h1>
      <p className="max-w-xl text-lg text-foreground/70">{t('tagline')}</p>

      <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map((p) => (
          <div
            key={p.label}
            className="flex flex-col gap-1.5 rounded-2xl border border-foreground/10 p-5 text-start"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-foreground/50">
              {p.label}
            </span>
            <span className="font-semibold">{p.title}</span>
            <span className="text-sm text-foreground/60">{p.desc}</span>
          </div>
        ))}
      </div>

      <Link
        href="/quiz"
        className="rounded-full bg-foreground px-8 py-3 text-lg font-medium text-background transition hover:opacity-90"
      >
        {t('cta')} →
      </Link>
      <p className="text-sm text-foreground/40">{t('meta')}</p>
    </main>
  );
}
