import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { use } from 'react';
import TrackEvent from './TrackEvent';
import { EVENTS } from '@/lib/analytics';

// Screen 1 of the user journey (spec 4.1): landing page with hero,
// "how it works", and the HE/EN language toggle. RTL is handled globally
// by the <html dir> set in the locale layout, so this component uses
// logical Tailwind utilities (ms/me/text-start) and works in both
// directions without changes.
export default function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('Landing');
  const other = locale === 'he' ? 'en' : 'he';

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <TrackEvent event={EVENTS.landingViewed} />
      <div className="flex w-full max-w-2xl justify-end">
        {/* Language toggle: links to the same page in the other locale. */}
        <Link
          href="/"
          locale={other}
          className="rounded-full border border-black/10 px-4 py-1.5 text-sm hover:bg-black/5"
        >
          {t('langToggle')}
        </Link>
      </div>

      <h1 className="max-w-2xl text-5xl font-bold tracking-tight">
        {t('hero')}
      </h1>
      <p className="max-w-xl text-lg text-foreground/70">{t('subhead')}</p>

      <Link
        href="/quiz"
        className="rounded-full bg-foreground px-8 py-3 text-lg font-medium text-background transition hover:opacity-90"
      >
        {t('cta')}
      </Link>
    </main>
  );
}
