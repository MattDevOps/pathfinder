import type { VisualProfile, Selections } from './archetype';
import { PHASE1_QUESTIONS } from '@/data/personality';
import { PHASE2_QUESTIONS } from '@/data/passions';

// Client-side quiz session: the in-progress v5 funnel state persisted to
// localStorage so a refresh restores exactly where the user was (Phase 0 visual
// picks + Phase 1/2 multi-select answers + optional free text). Only the final
// selections leave the browser; the server re-scores authoritatively.

export const SESSION_STORAGE_KEY = 'pathfinder-quiz-v5';

export type Phase = 'visual' | 'phase1' | 'phase2';

/** A completed-or-in-progress run. Selections map questionId -> option IDs. */
export interface QuizSession {
  sessionId: string;
  language: string;
  phase: Phase;
  /** Index of the current Phase 0 step (0-3) or question within phase 1/2. */
  index: number;
  visual: VisualProfile;
  phase1: Selections;
  phase2: Selections;
  /** Optional "anything to add?" free text, keyed by question id. */
  openP1: Record<string, string>;
  openP2: Record<string, string>;
  /**
   * Shuffled option-id order per question (neutral kept last), computed once at
   * session creation so the presentation order is stable across re-renders and
   * resume. Persisted with the rest of the session.
   */
  optionOrder: Record<string, string[]>;
}

export const PHASE1_COUNT = PHASE1_QUESTIONS.length;
export const PHASE2_COUNT = PHASE2_QUESTIONS.length;

export function emptyVisual(): VisualProfile {
  return { colors: [], shape: null, shapeSecondary: null, space: null, stimulus: null };
}

export function createSession(language: string, sessionId: string): QuizSession {
  return {
    sessionId,
    language,
    phase: 'visual',
    index: 0,
    visual: emptyVisual(),
    phase1: {},
    phase2: {},
    openP1: {},
    openP2: {},
    optionOrder: buildOptionOrder(),
  };
}

// Fisher-Yates shuffle. Math.random is fine here (option presentation order
// only, not a security token). Returns a new array; does not mutate the input.
export function shuffle<T>(items: readonly T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Shuffle each question's options once (neutral opt-out kept last), keyed by id.
function buildOptionOrder(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const q of [...PHASE1_QUESTIONS, ...PHASE2_QUESTIONS]) {
    const rest = q.options.filter((o) => !o.neutral);
    const neutral = q.options.filter((o) => o.neutral);
    map[q.id] = [...shuffle(rest), ...neutral].map((o) => o.id);
  }
  return map;
}

/** Phase 0 is done when 3 colours, a primary shape, a space, and an image are set. */
export function isVisualComplete(v: VisualProfile): boolean {
  return v.colors.length === 3 && !!v.shape && !!v.space && !!v.stimulus;
}

/** True once every Phase 1 question has at least one selection. */
export function isPhase1Complete(s: Selections): boolean {
  return PHASE1_QUESTIONS.every((q) => (s[q.id]?.length ?? 0) > 0);
}

/** True once every Phase 2 question has at least one selection. */
export function isPhase2Complete(s: Selections): boolean {
  return PHASE2_QUESTIONS.every((q) => (s[q.id]?.length ?? 0) > 0);
}

/** The whole funnel is answered (what the submit gate requires). */
export function isComplete(session: QuizSession): boolean {
  return (
    isVisualComplete(session.visual) &&
    isPhase1Complete(session.phase1) &&
    isPhase2Complete(session.phase2)
  );
}

// Validate a parsed session against the current schema + locale. A stale or
// corrupt session (wrong language, wrong shape) is rejected so we start fresh
// instead of rendering a broken quiz.
export function isValidSession(
  value: unknown,
  language: string,
): value is QuizSession {
  if (!value || typeof value !== 'object') return false;
  const s = value as Partial<QuizSession>;
  if (s.language !== language) return false;
  if (typeof s.sessionId !== 'string') return false;
  if (s.phase !== 'visual' && s.phase !== 'phase1' && s.phase !== 'phase2') return false;
  if (typeof s.index !== 'number' || s.index < 0) return false;
  const v = s.visual;
  if (!v || typeof v !== 'object' || !Array.isArray(v.colors)) return false;
  if (!s.phase1 || typeof s.phase1 !== 'object') return false;
  if (!s.phase2 || typeof s.phase2 !== 'object') return false;
  if (!s.optionOrder || typeof s.optionOrder !== 'object') return false;
  return true;
}
