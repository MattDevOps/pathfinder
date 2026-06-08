'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { capture, EVENTS } from '@/lib/analytics';
import { QUESTIONS } from '@/data/questions';
import { scoresFromSelections, type Selections } from '@/lib/quiz-session';
import { buildProfile } from '@/lib/profile';
import { completeSession } from './actions';
import type { CompleteSessionError } from './contract';

// Post-quiz email gate (funnel decision C1: gate AFTER the quiz, with a teaser).
// Shows the profile title computed client-side for an instant teaser, then
// collects email + consent and submits to the completeSession server action,
// which re-scores server-side and persists. On success we route to the
// shareable /results/[token]. A "preview" escape hatch renders the unsaved,
// query-param result instead.
//
// NOTE: the consent copy + privacy link are DRAFT pending the privacy policy
// and founder sign-off (PLAN.md section 4).

const ERROR_KEY: Record<CompleteSessionError, string> = {
  invalid_email: 'errorInvalidEmail',
  consent_required: 'errorConsent',
  incomplete: 'errorIncomplete',
  server_error: 'errorServer',
};

export default function EmailGate({
  selections,
  locale,
}: {
  selections: Selections;
  locale: Locale;
}) {
  const t = useTranslations('Gate');
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gateViewedRef = useRef(false);
  useEffect(() => {
    if (gateViewedRef.current) return;
    gateViewedRef.current = true;
    capture(EVENTS.gateViewed);
  }, []);

  // Instant teaser title (client-side scoring; the server recomputes
  // authoritatively on submit). Title is English-only for now (draft).
  const title = useMemo(() => {
    const scores = scoresFromSelections(selections, QUESTIONS);
    return buildProfile(scores, locale).title;
  }, [selections, locale]);

  const previewHref = useMemo(() => {
    const s = scoresFromSelections(selections, QUESTIONS);
    return `/results?d1=${s.dim1}&d2=${s.dim2}&d3=${s.dim3}&d4=${s.dim4}`;
  }, [selections]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await completeSession({
        selections,
        email,
        name,
        language: locale,
        consent,
      });
      if (res.ok) {
        capture(EVENTS.gateSubmitted);
        router.push(`/results/${res.shareToken}`);
        return;
      }
      capture(EVENTS.gateError, { error: res.error });
      setError(t(ERROR_KEY[res.error]));
    } catch {
      capture(EVENTS.gateError, { error: 'exception' });
      setError(t('errorServer'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-6 py-12">
      <div className="flex flex-col gap-2 text-center">
        <span className="text-sm uppercase tracking-widest text-foreground/50">
          {t('lead')}
        </span>
        <p className="text-lg text-foreground/80">{t('teaser', { title })}</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">{t('nameLabel')}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('namePlaceholder')}
            autoComplete="given-name"
            className="rounded-xl border border-foreground/20 px-4 py-2.5 text-base"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">{t('emailLabel')}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            autoComplete="email"
            dir="ltr"
            className="rounded-xl border border-foreground/20 px-4 py-2.5 text-base"
          />
        </label>

        <label className="flex items-start gap-2.5 text-sm text-foreground/70">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0"
          />
          <span>
            {t('consent')}{' '}
            <Link href="/privacy" className="underline underline-offset-2">
              {t('privacyLink')}
            </Link>
          </span>
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-foreground px-6 py-3 font-medium text-background transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? t('submitting') : t('submit')}
        </button>
      </form>

      <Link
        href={previewHref}
        onClick={() => capture(EVENTS.resultPreviewed)}
        className="text-center text-sm text-foreground/50 underline-offset-2 hover:underline"
      >
        {t('preview')}
      </Link>
    </main>
  );
}
