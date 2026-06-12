'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { capture, EVENTS } from '@/lib/analytics';
import { PHASE1_QUESTIONS } from '@/data/personality';
import { PHASE2_QUESTIONS } from '@/data/passions';
import { P0_COLORS, P0_SHAPES, P0_SPACES, P0_STIMULI } from '@/data/phase0';
import { ARCHETYPES } from '@/data/careers';
import { t as L } from '@/lib/localized';
import {
  calcDimensions,
  calcArchetype,
  type Selections,
  type VisualProfile,
} from '@/lib/archetype';
import {
  SESSION_STORAGE_KEY,
  PHASE1_COUNT,
  PHASE2_COUNT,
  createSession,
  isValidSession,
  isVisualComplete,
  type QuizSession,
} from '@/lib/quiz-session';
import EmailGate from './EmailGate';

type View = 'processing' | 'p1result' | 'gate';

export default function Quiz({ locale }: { locale: Locale }) {
  const t = useTranslations('Quiz');
  const [session, setSession] = useState<QuizSession | null>(null);
  // Ephemeral (non-persisted) screens layered over the funnel.
  const [view, setView] = useState<View | null>(null);

  const startedRef = useRef(false);
  const startTimeRef = useRef(0);

  // Restore or create the session on mount (client only).
  useEffect(() => {
    let restored: QuizSession | null = null;
    try {
      const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isValidSession(parsed, locale)) restored = parsed;
      }
    } catch {
      // ignore corrupt storage
    }
    // localStorage + crypto are client-only, so the session must be created in
    // this mount effect (not a render-phase initializer) to stay SSR-safe and
    // avoid a hydration mismatch — the rule's warning doesn't apply here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(restored ?? createSession(locale, crypto.randomUUID()));
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
      // storage may be unavailable (private mode)
    }
  }, [session]);

  const patch = useCallback((fn: (s: QuizSession) => QuizSession) => {
    setSession((prev) => (prev ? fn(prev) : prev));
  }, []);

  const restart = useCallback(() => {
    setView(null);
    setSession(createSession(locale, crypto.randomUUID()));
  }, [locale]);

  const openGate = useCallback(() => {
    try {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
    capture(EVENTS.quizCompleted, {
      durationMs: startTimeRef.current ? Date.now() - startTimeRef.current : null,
    });
    setView('gate');
  }, []);

  if (!session) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="text-foreground/60">{t('preparing')}</p>
      </main>
    );
  }

  // --- ephemeral overlays ---
  if (view === 'gate') {
    return (
      <EmailGate
        locale={locale}
        visual={session.visual}
        phase1={session.phase1}
        phase2={session.phase2}
        openP1={session.openP1}
        openP2={session.openP2}
      />
    );
  }
  if (view === 'processing') {
    return <Processing title={t('procTitle')} sub={t('procSub')} />;
  }
  if (view === 'p1result') {
    return (
      <Phase1Result
        session={session}
        locale={locale}
        onContinue={() => {
          patch((s) => ({ ...s, phase: 'phase2', index: 0 }));
          setView(null);
        }}
      />
    );
  }

  // --- main funnel ---
  if (session.phase === 'visual') {
    return (
      <VisualPhase
        session={session}
        patch={patch}
        onDone={() => {
          setView('processing');
          window.setTimeout(() => {
            patch((s) => ({ ...s, phase: 'phase1', index: 0 }));
            setView(null);
          }, 2200);
        }}
      />
    );
  }

  const isPhase1 = session.phase === 'phase1';
  const questions = isPhase1 ? PHASE1_QUESTIONS : PHASE2_QUESTIONS;
  const total = isPhase1 ? PHASE1_COUNT : PHASE2_COUNT;
  const answers: Selections = isPhase1 ? session.phase1 : session.phase2;
  const opens = isPhase1 ? session.openP1 : session.openP2;
  const q = questions[session.index];
  const selected = answers[q.id] ?? [];
  const number = session.index + 1;
  const pct = Math.round((number / total) * 100);
  const neutralId = q.options.find((o) => o.neutral)?.id;

  const toggle = (optId: string) => {
    const isNeutral = optId === neutralId;
    let next: string[];
    if (isNeutral) {
      next = selected.includes(optId) ? [] : [optId];
    } else {
      const base = neutralId ? selected.filter((x) => x !== neutralId) : selected;
      next = base.includes(optId) ? base.filter((x) => x !== optId) : [...base, optId];
    }
    patch((s) => {
      const key = isPhase1 ? 'phase1' : 'phase2';
      return { ...s, [key]: { ...answers, [q.id]: next } };
    });
    capture(EVENTS.questionAnswered, { phase: session.phase, questionId: q.id });
  };

  const setOpen = (value: string) => {
    patch((s) => {
      const key = isPhase1 ? 'openP1' : 'openP2';
      return { ...s, [key]: { ...opens, [q.id]: value } };
    });
  };

  const goNext = () => {
    if (session.index < total - 1) {
      patch((s) => ({ ...s, index: s.index + 1 }));
      window.scrollTo(0, 0);
    } else if (isPhase1) {
      setView('p1result');
      window.scrollTo(0, 0);
    } else {
      openGate();
    }
  };

  const goBack = () => {
    if (session.index > 0) {
      patch((s) => ({ ...s, index: s.index - 1 }));
      window.scrollTo(0, 0);
    }
  };

  const order = session.optionOrder[q.id] ?? q.options.map((o) => o.id);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10 pb-28">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm text-foreground/60">
          <span className="font-medium uppercase tracking-widest text-foreground/50">
            {t(isPhase1 ? 'p1PhaseLabel' : 'p2PhaseLabel')}
          </span>
          <span aria-live="polite">
            {t('questionProgress', { current: number, total })}
          </span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="absolute inset-y-0 start-0 rounded-full bg-foreground transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <span className="w-fit rounded-md bg-foreground/5 px-3 py-1 text-xs italic text-foreground/60">
        {t('multiHint')}
      </span>

      <h1 className="text-2xl font-semibold sm:text-3xl">{L(q.text, locale)}</h1>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="sr-only">{L(q.text, locale)}</legend>
        {order.map((optId) => {
          const opt = q.options.find((o) => o.id === optId)!;
          const isSel = selected.includes(optId);
          return (
            <button
              key={optId}
              type="button"
              aria-pressed={isSel}
              onClick={() => toggle(optId)}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-start transition ${
                opt.neutral ? 'border-dashed' : ''
              } ${
                isSel
                  ? 'border-foreground bg-foreground/5'
                  : 'border-foreground/15 hover:border-foreground/40'
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-semibold ${
                  isSel ? 'border-foreground bg-foreground text-background' : 'border-foreground/30'
                }`}
              >
                {isSel ? '✓' : ''}
              </span>
              <span>{L(opt.text, locale)}</span>
            </button>
          );
        })}
      </fieldset>

      {selected.length > 0 && (
        <p className="text-end text-xs text-foreground/50">
          {selected.length === 1
            ? t('selectedOne')
            : t('selectedMany', { count: selected.length })}
        </p>
      )}

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-foreground/60">
          {t('openLabel')}{' '}
          <span className="font-light text-foreground/40">{t('openOptional')}</span>
        </span>
        <textarea
          rows={2}
          value={opens[q.id] ?? ''}
          onChange={(e) => setOpen(e.target.value)}
          placeholder={t('openPlaceholder')}
          className="resize-none rounded-xl border border-foreground/20 px-3 py-2 text-sm"
        />
      </label>

      {/* Sticky footer nav */}
      <div className="fixed inset-x-0 bottom-0 border-t border-foreground/10 bg-background/95 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <button
            type="button"
            aria-label={t('back')}
            onClick={goBack}
            disabled={session.index === 0}
            className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium disabled:opacity-40"
          >
            ← {t('back')}
          </button>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={restart}
              className="text-xs text-foreground/50 underline-offset-2 hover:underline"
            >
              {t('restart')}
            </button>
            <button
              type="button"
              aria-label={t('next')}
              onClick={goNext}
              disabled={selected.length === 0}
              className="rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-40"
            >
              {t('next')} →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Phase 0: visual profiling -------------------------------------------------

function VisualPhase({
  session,
  patch,
  onDone,
}: {
  session: QuizSession;
  patch: (fn: (s: QuizSession) => QuizSession) => void;
  onDone: () => void;
}) {
  const t = useTranslations('Quiz');
  const locale = session.language as Locale;
  const step = session.index; // 0..3
  const v = session.visual;
  const setVisual = (vp: Partial<VisualProfile>) =>
    patch((s) => ({ ...s, visual: { ...s.visual, ...vp } }));

  const canContinue =
    step === 0
      ? v.colors.length === 3
      : step === 1
        ? !!v.shape
        : step === 2
          ? !!v.space
          : !!v.stimulus;

  const next = () => {
    if (step < 3) patch((s) => ({ ...s, index: s.index + 1 }));
    else if (isVisualComplete(v)) onDone();
    window.scrollTo(0, 0);
  };
  const back = () => {
    if (step > 0) patch((s) => ({ ...s, index: s.index - 1 }));
    window.scrollTo(0, 0);
  };

  const selectColor = (id: string) => {
    const colors = [...v.colors];
    const i = colors.indexOf(id);
    if (i > -1) colors.splice(i, 1);
    else if (colors.length < 3) colors.push(id);
    setVisual({ colors });
  };
  const selectShape = (id: string) => {
    if (!v.shape) setVisual({ shape: id });
    else if (v.shape === id) setVisual({ shape: v.shapeSecondary ?? null, shapeSecondary: null });
    else if (v.shapeSecondary === id) setVisual({ shapeSecondary: null });
    else setVisual({ shapeSecondary: id });
  };

  const hint =
    step === 0
      ? t('p0ColorsHint')
      : step === 1
        ? t('p0ShapesHint')
        : step === 2
          ? t('p0SpacesHint')
          : t('p0StimHint');

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10 pb-28 text-center">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-foreground/50">
          {t('p0StepLabel', { step: step + 1 })}
        </span>
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="absolute inset-y-0 start-0 rounded-full bg-foreground transition-[width] duration-500"
            style={{ width: `${(step + 1) * 25}%` }}
          />
        </div>
      </div>

      {step === 0 && (
        <>
          <StepHead title={t('p0ColorsTitle')} sub={t('p0ColorsSub')} />
          <div className="flex flex-wrap justify-center gap-4">
            {P0_COLORS.map((c) => {
              const rank = v.colors.indexOf(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-label={c.id}
                  aria-pressed={rank > -1}
                  onClick={() => selectColor(c.id)}
                  style={{ background: c.hex }}
                  className={`relative h-20 w-20 rounded-full transition hover:scale-105 ${
                    rank > -1 ? 'ring-4 ring-foreground ring-offset-2 ring-offset-background' : ''
                  }`}
                >
                  {rank > -1 && (
                    <span className="absolute -end-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                      {rank + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <StepHead title={t('p0ShapesTitle')} sub={t('p0ShapesSub')} />
          <div className="flex flex-wrap justify-center gap-4">
            {P0_SHAPES.map((s) => {
              const primary = v.shape === s.id;
              const secondary = v.shapeSecondary === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-label={s.id}
                  onClick={() => selectShape(s.id)}
                  className={`relative w-36 rounded-2xl border-2 p-5 text-center transition ${
                    primary
                      ? 'border-foreground bg-foreground/5'
                      : secondary
                        ? 'border-foreground/50 bg-foreground/5'
                        : 'border-foreground/15 hover:border-foreground/40'
                  }`}
                >
                  {(primary || secondary) && (
                    <span className="absolute -end-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                      {primary ? 1 : 2}
                    </span>
                  )}
                  <svg
                    viewBox="0 0 100 100"
                    className="mx-auto mb-2 h-14 w-14 text-foreground"
                    dangerouslySetInnerHTML={{ __html: s.svg }}
                  />
                  <div className="text-sm font-medium">{L(s.name, locale)}</div>
                  <div className="mt-1 text-xs text-foreground/50">{L(s.desc, locale)}</div>
                </button>
              );
            })}
          </div>
          {v.shape && <p className="text-xs text-foreground/40">{t('p0ShapesSecond')}</p>}
        </>
      )}

      {step === 2 && (
        <>
          <StepHead title={t('p0SpacesTitle')} sub={t('p0SpacesSub')} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {P0_SPACES.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-label={s.id}
                onClick={() => setVisual({ space: s.id })}
                style={{ background: s.bg }}
                className={`rounded-2xl p-4 text-center text-white transition hover:-translate-y-0.5 ${
                  v.space === s.id ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''
                }`}
              >
                <div className="mb-1 text-2xl">{s.emoji}</div>
                <div className="text-sm font-medium">{L(s.name, locale)}</div>
                <div className="mt-1 text-xs text-white/70">{L(s.desc, locale)}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <StepHead title={t('p0StimTitle')} sub={t('p0StimSub')} />
          <div className="mx-auto grid max-w-xl grid-cols-2 gap-4">
            {P0_STIMULI.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-label={s.id}
                onClick={() => setVisual({ stimulus: s.id })}
                style={{ background: s.bg }}
                className={`flex min-h-40 flex-col items-center justify-center rounded-2xl p-5 text-center text-white transition hover:-translate-y-1 ${
                  v.stimulus === s.id ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''
                }`}
              >
                <div className="mb-2 text-4xl">{s.emoji}</div>
                <div className="text-sm font-medium">{L(s.name, locale)}</div>
                <div className="mt-1.5 text-xs text-white/70">{L(s.desc, locale)}</div>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="fixed inset-x-0 bottom-0 border-t border-foreground/10 bg-background/95 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
          <button
            type="button"
            aria-label={t('back')}
            onClick={back}
            disabled={step === 0}
            className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium disabled:opacity-40"
          >
            ← {t('back')}
          </button>
          <span className="hidden text-xs italic text-foreground/40 sm:block">{hint}</span>
          <button
            type="button"
            aria-label={t('continue')}
            onClick={next}
            disabled={!canContinue}
            className="rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-40"
          >
            {t('continue')} →
          </button>
        </div>
      </div>
    </main>
  );
}

function StepHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
      <p className="text-sm italic text-foreground/50">{sub}</p>
    </div>
  );
}

function Processing({ title, sub }: { title: string; sub: string }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="max-w-md text-foreground/60">{sub}</p>
      <div className="mt-4 flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 animate-pulse rounded-full bg-foreground"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </main>
  );
}

function Phase1Result({
  session,
  locale,
  onContinue,
}: {
  session: QuizSession;
  locale: Locale;
  onContinue: () => void;
}) {
  const t = useTranslations('Quiz');
  const tr = useTranslations('Results');
  const dims = useMemo(() => calcDimensions(session.phase1), [session.phase1]);
  const archId = useMemo(() => calcArchetype(dims, session.visual), [dims, session.visual]);
  const arch = ARCHETYPES.find((a) => a.id === archId)!;
  const keys = ['d1', 'd2', 'd3', 'd4'] as const;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center gap-6 px-6 py-12 text-center">
      <span className="text-xs uppercase tracking-widest text-foreground/50">
        {t('p1ResultLead')}
      </span>
      <div className="text-5xl">{arch.icon}</div>
      <h1 className="text-3xl font-bold">{L(arch.name, locale)}</h1>
      <p className="text-foreground/70">{L(arch.sub, locale)}</p>

      <div className="grid w-full grid-cols-2 gap-2">
        {keys.map((k) => {
          const score = dims[k];
          const word =
            score < 40
              ? tr(`dimWord.${k}.low`)
              : score > 65
                ? tr(`dimWord.${k}.high`)
                : tr('balanced');
          return (
            <div key={k} className="rounded-lg bg-foreground/5 px-3 py-2 text-start">
              <div className="text-xs text-foreground/50">{tr(`dimAxis.${k}`)}</div>
              <div className="text-sm font-medium">
                {word} · {score}/100
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{t('p1ResultCtaTitle')}</h2>
        <p className="text-sm text-foreground/60">{t('p1ResultCtaBody')}</p>
      </div>
      <button
        type="button"
        aria-label={t('p1ResultCtaButton')}
        onClick={onContinue}
        className="rounded-full bg-foreground px-6 py-3 font-medium text-background transition hover:opacity-90"
      >
        {t('p1ResultCtaButton')} →
      </button>
    </main>
  );
}
