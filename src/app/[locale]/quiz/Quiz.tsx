'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { capture, EVENTS } from '@/lib/analytics';
import { QUESTIONS } from '@/data/questions';
import type { Question } from '@/lib/types';
import {
  SESSION_STORAGE_KEY,
  createSession,
  isValidSession,
  type QuizSession,
  type Selections,
} from '@/lib/quiz-session';
import EmailGate from './EmailGate';

const OPTION_IDS = ['A', 'B', 'C', 'D'] as const;

// Pick the localized string, falling back to English. Hebrew question/option
// text is only authored for Q001 so far (see questions.ts); the fallback keeps
// the quiz takeable in HE until a copywriter fills the rest, rather than
// showing empty options.
function localized(locale: Locale, en: string, he: string): string {
  return locale === 'he' && he.trim() !== '' ? he : en;
}

export default function Quiz({ locale }: { locale: Locale }) {
  const t = useTranslations('Quiz');
  const total = QUESTIONS.length;

  // On completion the quiz hands off to the email gate (funnel C1: gate after
  // the quiz). We hold the finished selections here and stop rendering the
  // question UI.
  const [completed, setCompleted] = useState<Selections | null>(null);

  // Funnel timing/instrumentation. startedRef guards quiz_started against React
  // StrictMode's double effect invocation in dev.
  const startedRef = useRef(false);
  const startTimeRef = useRef(0);

  const byId = useMemo(
    () => new Map(QUESTIONS.map((q) => [q.id, q] as const)),
    [],
  );

  // Session is created/restored on the client only (localStorage, crypto), so
  // it starts null and the component renders a "preparing" state until ready —
  // this avoids any SSR/CSR hydration mismatch.
  const [session, setSession] = useState<QuizSession | null>(null);

  useEffect(() => {
    let restored: QuizSession | null = null;
    try {
      const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isValidSession(parsed, QUESTIONS, locale)) restored = parsed;
      }
    } catch {
      // ignore corrupt storage; fall through to a fresh session
    }
    setSession(
      restored ?? createSession(QUESTIONS, locale, crypto.randomUUID()),
    );

    if (!startedRef.current) {
      startedRef.current = true;
      startTimeRef.current = Date.now();
      capture(EVENTS.quizStarted, { resumed: restored !== null, locale });
    }
  }, [locale]);

  // Persist on every change.
  useEffect(() => {
    if (!session) return;
    try {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // storage may be unavailable (private mode); the quiz still works in-memory
    }
  }, [session]);

  const finish = useCallback((selections: Selections) => {
    try {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
    capture(EVENTS.quizCompleted, {
      durationMs: startTimeRef.current ? Date.now() - startTimeRef.current : null,
    });
    setCompleted(selections);
  }, []);

  const select = useCallback(
    (questionId: string, optionId: (typeof OPTION_IDS)[number]) => {
      if (!session) return;
      const isNew = !(questionId in session.selections);
      const selections = { ...session.selections, [questionId]: optionId };
      const answeredAll = Object.keys(selections).length >= total;
      capture(EVENTS.questionAnswered, {
        index: session.currentIndex,
        questionId,
        option: optionId,
        changed: !isNew,
      });
      const next: QuizSession = {
        ...session,
        selections,
        // Auto-advance, unless this answer completed the set.
        currentIndex: answeredAll
          ? session.currentIndex
          : Math.min(session.currentIndex + 1, total - 1),
      };
      setSession(next);
      if (answeredAll) finish(selections);
    },
    [session, finish, total],
  );

  const goBack = useCallback(() => {
    setSession((prev) =>
      prev ? { ...prev, currentIndex: Math.max(0, prev.currentIndex - 1) } : prev,
    );
  }, []);

  const restart = useCallback(() => {
    setSession(createSession(QUESTIONS, locale, crypto.randomUUID()));
  }, [locale]);

  const current: Question | undefined = session
    ? byId.get(session.questionOrder[session.currentIndex])
    : undefined;

  // Keyboard: 1-4 selects the matching option on the current question.
  useEffect(() => {
    if (!session || !current || completed) return;
    const onKey = (e: KeyboardEvent) => {
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < OPTION_IDS.length) {
        e.preventDefault();
        select(current.id, OPTION_IDS[idx]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [session, current, select, completed]);

  // Quiz finished -> hand off to the email gate.
  if (completed) {
    return <EmailGate selections={completed} locale={locale} />;
  }

  if (!session || !current) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="text-foreground/60">{t('preparing')}</p>
      </main>
    );
  }

  const number = session.currentIndex + 1;
  const selected = session.selections[current.id];
  const pct = Math.round((number / total) * 100);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      {/* Progress */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm text-foreground/60">
          <span aria-live="polite">
            {t('progress', { current: number, total })}
          </span>
          <button
            type="button"
            onClick={restart}
            className="underline-offset-2 hover:underline"
          >
            {t('restart')}
          </button>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="absolute inset-y-0 start-0 rounded-full bg-foreground transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex flex-1 flex-col gap-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          {localized(locale, current.text_en, current.text_he)}
        </h1>

        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">
            {localized(locale, current.text_en, current.text_he)}
          </legend>
          {current.options.map((opt, i) => {
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => select(current.id, opt.id)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-start transition ${
                  isSelected
                    ? 'border-foreground bg-foreground/5'
                    : 'border-foreground/15 hover:border-foreground/40'
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground/10 text-xs font-medium">
                  {i + 1}
                </span>
                <span>{localized(locale, opt.text_en, opt.text_he)}</span>
              </button>
            );
          })}
        </fieldset>

        <p className="text-sm text-foreground/50">{t('selectHint')}</p>
      </div>

      {/* Footer: back-one. */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={session.currentIndex === 0}
          className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium disabled:opacity-40"
        >
          {t('back')}
        </button>
      </div>
    </main>
  );
}
