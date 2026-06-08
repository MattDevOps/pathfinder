import { describe, it, expect } from 'vitest';
import { buildResultRecord, isAnswerSetComplete } from './results-record';
import { QUESTIONS } from '@/data/questions';
import type { Selections } from './quiz-session';

function selectAll(option: 'A' | 'B' | 'C' | 'D'): Selections {
  return Object.fromEntries(QUESTIONS.map((q) => [q.id, option]));
}

describe('buildResultRecord', () => {
  it('all D -> every dimension 100, full answer set', () => {
    const rec = buildResultRecord(selectAll('D'), QUESTIONS);
    expect(rec.dims).toEqual({ dim1: 100, dim2: 100, dim3: 100, dim4: 100 });
    expect(rec.answers).toHaveLength(QUESTIONS.length);
    expect(isAnswerSetComplete(rec, QUESTIONS.length)).toBe(true);
  });

  it('all A -> The Builder / Operations & Engineering (low/low cluster)', () => {
    const rec = buildResultRecord(selectAll('A'), QUESTIONS);
    expect(rec.dims).toEqual({ dim1: 0, dim2: 0, dim3: 0, dim4: 0 });
    expect(rec.cluster).toBe('Operations & Engineering');
    expect(rec.title).toBe('The Builder');
    expect(rec.labels.dim1).toBe('Practical Thinker');
  });

  it('each answer carries server-resolved dimension + score', () => {
    const rec = buildResultRecord({ [QUESTIONS[0].id]: 'C' }, QUESTIONS);
    expect(rec.answers).toEqual([
      {
        question_id: QUESTIONS[0].id,
        dimension: QUESTIONS[0].dimension,
        selected_option: 'C',
        score: 2,
      },
    ]);
    expect(isAnswerSetComplete(rec, QUESTIONS.length)).toBe(false);
  });

  it('drops selections for unknown questions/options', () => {
    const sel = { BOGUS: 'D', [QUESTIONS[0].id]: 'Z' } as unknown as Selections;
    const rec = buildResultRecord(sel, QUESTIONS);
    expect(rec.answers).toHaveLength(0);
    expect(rec.dims).toEqual({ dim1: 0, dim2: 0, dim3: 0, dim4: 0 });
  });
});
