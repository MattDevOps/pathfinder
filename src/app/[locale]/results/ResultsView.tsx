import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/routing';
import type { Dimensions, VisualProfile } from '@/lib/archetype';
import type { ArchetypeId, DomainId } from '@/lib/types';
import { buildProfile } from '@/lib/profile';
import TrackEvent from '../TrackEvent';
import ShareButton from './ShareButton';
import { EVENTS } from '@/lib/analytics';

// Presentational results profile, shared by the query-param preview page
// (/results) and the public share-token page (/results/[token]). It takes the
// server-scored result + the render locale and resolves the localized archetype
// x domain view (careers, dimensions, visual signature) so both routes render
// identically. `toggleHref` is where the language switch points.

export interface ResultInput {
  archetype: ArchetypeId;
  domain: DomainId;
  dims: Dimensions;
  congruence: number;
}

export default async function ResultsView({
  result,
  visual,
  locale,
  toggleHref,
  source,
  pdfHref,
}: {
  result: ResultInput;
  visual: VisualProfile;
  locale: Locale;
  toggleHref: string;
  source: 'preview' | 'shared';
  pdfHref: string;
}) {
  const profile = buildProfile(result, visual, locale);
  const t = await getTranslations({ locale, namespace: 'Results' });
  const others = locales.filter((l) => l !== locale);
  const hasSignature = profile.visual.colorDescs.length > 0 || !!profile.visual.shapeName;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-12">
      <TrackEvent
        event={EVENTS.resultViewed}
        props={{ source, archetype: profile.archetype.id, domain: profile.domain }}
      />

      <div className="flex justify-end gap-2">
        {others.map((l) => (
          <Link
            key={l}
            href={toggleHref}
            locale={l}
            className="rounded-full border border-foreground/15 px-4 py-1.5 text-sm hover:bg-foreground/5"
          >
            {l.toUpperCase()}
          </Link>
        ))}
      </div>

      <header className="flex flex-col items-center gap-3 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="rounded-full bg-foreground/10 px-3 py-1 font-medium">
            {profile.archetype.name}
          </span>
          <span className="text-foreground/40">×</span>
          <span className="rounded-full bg-foreground/10 px-3 py-1 font-medium">
            {profile.domainName}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t('combo', { icon: profile.archetype.icon, domain: profile.domainName })}
        </h1>
        <p className="max-w-xl text-foreground/70">{t('sub')}</p>
        <p className="max-w-2xl text-sm text-foreground/60">{profile.archetype.sub}</p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">{t('dimensionsHeading')}</h2>
        <ul className="flex flex-col gap-4">
          {profile.dimensions.map((d) => {
            const word =
              d.band === 'low'
                ? t(`dimWord.${d.key}.low`)
                : d.band === 'high'
                  ? t(`dimWord.${d.key}.high`)
                  : t('balanced');
            return (
              <li key={d.key} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium">{t(`dimAxis.${d.key}`)}</span>
                  <span className="text-sm text-foreground/60">
                    {word} · {d.score}
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="absolute inset-y-0 start-0 rounded-full bg-foreground"
                    style={{ width: `${d.score}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {hasSignature && (
        <section className="flex flex-col gap-3 rounded-2xl border border-foreground/10 p-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
            {t('visualLabel')}
          </span>
          <div className="flex flex-wrap gap-2">
            {profile.visual.colorDescs.map((d) => (
              <span key={d} className="rounded-full bg-foreground/5 px-3 py-1 text-sm">
                🎨 {d}
              </span>
            ))}
            {profile.visual.shapeName && (
              <span className="rounded-full bg-foreground/5 px-3 py-1 text-sm">
                ◈ {profile.visual.shapeName} — {profile.visual.shapeDesc}
              </span>
            )}
          </div>
          <p className="text-sm italic text-foreground/60">{t(`align.${profile.visual.note}`)}</p>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">{t('careersHeading')}</h2>
        <div className="flex flex-col gap-4">
          {profile.careers.map((c) => (
            <article
              key={c.name}
              className={`flex flex-col gap-3 rounded-2xl border p-6 ${
                c.best ? 'border-foreground/40' : 'border-foreground/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold">
                  {c.best ? '✦ ' : ''}
                  {c.name}
                </h3>
                <span className="shrink-0 rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium">
                  {c.congruence}
                  {t('congruenceSuffix')}
                </span>
              </div>
              <p className="text-foreground/70">{c.desc}</p>
              <p className="rounded-lg bg-foreground/5 px-3 py-2 text-sm text-foreground/80">
                <strong>{t('firstStep')}</strong> {c.firstStep}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2 rounded-2xl bg-foreground/5 p-6 text-center">
        <h3 className="text-lg font-semibold">{t('philoTitle')}</h3>
        <p className="mx-auto max-w-xl text-sm text-foreground/70">{t('philoBody')}</p>
      </section>

      <section className="flex flex-col items-stretch gap-3 border-t border-foreground/10 pt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={pdfHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-foreground px-6 py-2.5 text-center font-medium text-background transition hover:opacity-90"
          >
            {t('cta.pdf')}
          </a>
          <ShareButton label={t('cta.share')} copiedLabel={t('cta.copied')} />
        </div>
      </section>
    </main>
  );
}
