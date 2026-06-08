import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { DimensionScores } from '@/lib/types';
import { buildProfile, type ScenarioView } from '@/lib/profile';

// Presentational results profile, shared by the query-param preview page
// (/results) and the public share-token page (/results/[token]). It takes raw
// 0-100 scores + the render locale and recomputes the full DRAFT profile
// (title, cluster, dimension labels, scenarios, content) so both routes render
// identically. `toggleHref` is where the language switch points (the same
// content in the other locale).

export default async function ResultsView({
  scores,
  locale,
  toggleHref,
}: {
  scores: DimensionScores;
  locale: Locale;
  toggleHref: string;
}) {
  const profile = buildProfile(scores, locale);
  const t = await getTranslations({ locale, namespace: 'Results' });
  const other = locale === 'he' ? 'en' : 'he';

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-12">
      <p className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-center text-sm text-amber-700 dark:text-amber-300">
        {t('draftBanner')}
      </p>

      <div className="flex justify-end">
        <Link
          href={toggleHref}
          locale={other}
          className="rounded-full border border-black/10 px-4 py-1.5 text-sm hover:bg-black/5"
        >
          {locale === 'he' ? 'English' : 'עברית'}
        </Link>
      </div>

      <header className="flex flex-col items-center gap-3 text-center">
        <span className="text-sm uppercase tracking-widest text-foreground/50">
          {t('profileLead')}
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {profile.title}
        </h1>
        <span className="rounded-full bg-foreground/5 px-3 py-1 text-sm text-foreground/70">
          {t('sectorLabel')}: {profile.cluster}
        </span>
      </header>

      <section className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold">{t('dimensionsHeading')}</h2>
        <ul className="flex flex-col gap-4">
          {profile.dimensions.map((d) => (
            <li key={d.dimension} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium">{t(`dimension.${d.dimension}`)}</span>
                <span className="text-sm text-foreground/60">
                  {d.label} · {d.score}
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="absolute inset-y-0 start-0 rounded-full bg-foreground"
                  style={{ width: `${d.score}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold">{t('scenariosHeading')}</h2>
        <div className="flex flex-col gap-5">
          {profile.scenarios.map((s) => (
            <ScenarioCard
              key={s.key}
              scenario={s}
              pathLabel={t(`scenario.${s.key}`)}
              strengthLabel={t(`strength.${s.strength}`)}
              rolesLabel={t('rolesLabel')}
              nextStepsLabel={t('nextStepsLabel')}
              pendingLabel={t('translationPending')}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col items-stretch gap-3 border-t border-foreground/10 pt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button disabled className="rounded-full bg-foreground px-6 py-2.5 font-medium text-background opacity-50">
            {t('cta.pdf')}
          </button>
          <button disabled className="rounded-full border border-foreground/20 px-6 py-2.5 font-medium opacity-50">
            {t('cta.share')}
          </button>
          <button disabled className="rounded-full border border-foreground/20 px-6 py-2.5 font-medium opacity-50">
            {t('cta.email')}
          </button>
        </div>
        <p className="text-center text-xs text-foreground/50">{t('ctaNote')}</p>
      </section>
    </main>
  );
}

const STRENGTH_STYLES: Record<ScenarioView['strength'], string> = {
  high: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  low: 'bg-foreground/10 text-foreground/60',
};

function ScenarioCard({
  scenario,
  pathLabel,
  strengthLabel,
  rolesLabel,
  nextStepsLabel,
  pendingLabel,
}: {
  scenario: ScenarioView;
  pathLabel: string;
  strengthLabel: string;
  rolesLabel: string;
  nextStepsLabel: string;
  pendingLabel: string;
}) {
  const { content, strength } = scenario;
  const pending = content.headline.trim() === '';

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-foreground/10 p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold">{pathLabel}</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${STRENGTH_STYLES[strength]}`}>
          {strengthLabel}
        </span>
      </div>

      {pending ? (
        <p className="text-sm italic text-foreground/40">{pendingLabel}</p>
      ) : (
        <>
          <p className="font-medium text-foreground/90">{content.headline}</p>
          <p className="text-foreground/70">{content.paragraph}</p>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
              {rolesLabel}
            </span>
            <div className="flex flex-wrap gap-2">
              {content.roles.map((role) => (
                <span key={role} className="rounded-full bg-foreground/5 px-3 py-1 text-sm">
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
              {nextStepsLabel}
            </span>
            <ol className="flex list-inside list-decimal flex-col gap-1 text-sm text-foreground/70">
              {content.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </>
      )}
    </article>
  );
}
