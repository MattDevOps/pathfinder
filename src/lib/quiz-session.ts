import type { Answer, DimensionScores, Question } from './types';
import { calculateScores } from './scoring';

// Client-side quiz session: the in-progress state persisted to localStorage so
// a refresh restores the exact sequence and answers (PLAN.md "frontend"). Only
// the final scores leave the browser; the server is authoritative once the DB
// lands, but for now the funnel runs entirely client-side.

export const SESSION_STORAGE_KEY = 'pathfinder-quiz-v1';

// optionId selected per question, keyed by question id.
export type Selections = Record<string, 'A' | 'B' | 'C' | 'D'>;

export interface QuizSession {
  sessionId: string;
  language: string;
  questionOrder: string[]; // question ids, shuffled, persisted so refresh restores order
  currentIndex: number;
  selections: Selections;
}

// Fisher-Yates shuffle. Math.random is fine here (presentation order only, not
// a security token). Returns a new array; does not mutate the input.
export function shuffle<T>(items: readonly T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function createSession(
  questions: Question[],
  language: string,
  sessionId: string,
): QuizSession {
  return {
    sessionId,
    language,
    questionOrder: shuffle(questions.map((q) => q.id)),
    currentIndex: 0,
    selections: {},
  };
}

// Validate a parsed session against the current question set + locale. A stale
// or corrupt session (wrong language, missing/renamed questions) is rejected so
// we start fresh instead of rendering a broken quiz.
export function isValidSession(
  value: unknown,
  questions: Question[],
  language: string,
): value is QuizSession {
  if (!value || typeof value !== 'object') return false;
  const s = value as Partial<QuizSession>;
  if (s.language !== language) return false;
  if (typeof s.sessionId !== 'string') return false;
  if (!Array.isArray(s.questionOrder)) return false;
  const ids = new Set(questions.map((q) => q.id));
  if (s.questionOrder.length !== ids.size) return false;
  if (!s.questionOrder.every((id) => ids.has(id))) return false;
  if (typeof s.currentIndex !== 'number') return false;
  if (s.currentIndex < 0 || s.currentIndex >= s.questionOrder.length) return false;
  if (!s.selections || typeof s.selections !== 'object') return false;
  return true;
}

/**
 * Map per-question option selections to scored Answers, then to 0-100
 * dimension scores. Each question contributes its option's score under that
 * question's dimension (the same lookup the server will do authoritatively).
 * Unanswered questions are skipped (treated as 0 by calculateScores).
 */
export function scoresFromSelections(
  selections: Selections,
  questions: Question[],
): DimensionScores {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const answers: Answer[] = [];

  for (const [questionId, optionId] of Object.entries(selections)) {
    const question = byId.get(questionId);
    if (!question) continue;
    const option = question.options.find((o) => o.id === optionId);
    if (!option) continue;
    answers.push({ dimension: question.dimension, score: option.score });
  }

  return calculateScores(answers);
}

/** True once every question has a selection. */
export function isComplete(session: QuizSession, total: number): boolean {
  return Object.keys(session.selections).length >= total;
}
