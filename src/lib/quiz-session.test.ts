import { describe, it, expect } from 'vitest';
import {
  scoresFromSelections,
  shuffle,
  isValidSession,
  createSession,
  type Selections,
} from './quiz-session';
import { QUESTIONS } from '@/data/questions';

describe('scoresFromSelections', () => {
  it('all option A (score 0) -> every dimension 0', () => {
    const selections: Selections = Object.fromEntries(
      QUESTIONS.map((q) => [q.id, 'A' as const]),
    );
    expect(scoresFromSelections(selections, QUESTIONS)).toEqual({
      dim1: 0, dim2: 0, dim3: 0, dim4: 0,
    });
  });

  it('all option D (score 3) -> every dimension 100', () => {
    const selections: Selections = Object.fromEntries(
      QUESTIONS.map((q) => [q.id, 'D' as const]),
    );
    expect(scoresFromSelections(selections, QUESTIONS)).toEqual({
      dim1: 100, dim2: 100, dim3: 100, dim4: 100,
    });
  });

  it('maxing one dimension does not leak into others', () => {
    const selections: Selections = {};
    for (const q of QUESTIONS) {
      selections[q.id] = q.dimension === 'DIM_3' ? 'D' : 'A';
    }
    expect(scoresFromSelections(selections, QUESTIONS)).toEqual({
      dim1: 0, dim2: 0, dim3: 100, dim4: 0,
    });
  });

  it('ignores selections for unknown questions and unknown options', () => {
    const selections = { NOPE: 'D', [QUESTIONS[0].id]: 'Z' } as unknown as Selections;
    expect(scoresFromSelections(selections, QUESTIONS)).toEqual({
      dim1: 0, dim2: 0, dim3: 0, dim4: 0,
    });
  });
});

describe('shuffle', () => {
  it('preserves the exact multiset of ids', () => {
    const ids = QUESTIONS.map((q) => q.id);
    const shuffled = shuffle(ids);
    expect(shuffled).toHaveLength(ids.length);
    expect([...shuffled].sort()).toEqual([...ids].sort());
  });

  it('does not mutate the input array', () => {
    const ids = QUESTIONS.map((q) => q.id);
    const copy = ids.slice();
    shuffle(ids);
    expect(ids).toEqual(copy);
  });
});

describe('isValidSession', () => {
  const session = createSession(QUESTIONS, 'en', 'sid-1');

  it('accepts a freshly created session', () => {
    expect(isValidSession(session, QUESTIONS, 'en')).toBe(true);
  });

  it('rejects a session from a different language', () => {
    expect(isValidSession(session, QUESTIONS, 'he')).toBe(false);
  });

  it('rejects a session with the wrong number of questions', () => {
    const bad = { ...session, questionOrder: session.questionOrder.slice(1) };
    expect(isValidSession(bad, QUESTIONS, 'en')).toBe(false);
  });

  it('rejects an out-of-range currentIndex', () => {
    const bad = { ...session, currentIndex: QUESTIONS.length };
    expect(isValidSession(bad, QUESTIONS, 'en')).toBe(false);
  });

  it('rejects junk', () => {
    expect(isValidSession(null, QUESTIONS, 'en')).toBe(false);
    expect(isValidSession({}, QUESTIONS, 'en')).toBe(false);
  });
});
