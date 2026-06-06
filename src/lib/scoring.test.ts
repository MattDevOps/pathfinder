import { describe, it, expect } from 'vitest';
import {
  calculateScores,
  bandOf,
  labelFor,
  BAND_LOW_MAX,
  BAND_HIGH_MIN,
} from './scoring';
import type { Answer, Dimension, OptionScore } from './types';

// Build a full 40-answer set: 10 questions per dimension, each at `score`.
function answersAll(score: OptionScore): Answer[] {
  const dims: Dimension[] = ['DIM_1', 'DIM_2', 'DIM_3', 'DIM_4'];
  return dims.flatMap((dimension) =>
    Array.from({ length: 10 }, () => ({ dimension, score })),
  );
}

// Set one dimension to a raw total, the rest to zero.
function answersForDim(dimension: Dimension, perQuestion: OptionScore): Answer[] {
  return Array.from({ length: 10 }, () => ({ dimension, score: perQuestion }));
}

describe('calculateScores (spec 3.1)', () => {
  it('all-zero answers -> every dimension 0', () => {
    expect(calculateScores(answersAll(0))).toEqual({
      dim1: 0, dim2: 0, dim3: 0, dim4: 0,
    });
  });

  it('all-max answers (3 each) -> every dimension 100', () => {
    expect(calculateScores(answersAll(3))).toEqual({
      dim1: 100, dim2: 100, dim3: 100, dim4: 100,
    });
  });

  it('no cross-dimension leakage: maxing one dim leaves others at 0', () => {
    const s = calculateScores(answersForDim('DIM_2', 3));
    expect(s).toEqual({ dim1: 0, dim2: 100, dim3: 0, dim4: 0 });
  });

  it('all four dimensions are independent and complete', () => {
    const dims: Dimension[] = ['DIM_1', 'DIM_2', 'DIM_3', 'DIM_4'];
    for (const d of dims) {
      const key = d.replace('DIM_', 'dim') as keyof ReturnType<typeof calculateScores>;
      const s = calculateScores(answersForDim(d, 3));
      expect(s[key]).toBe(100);
    }
  });

  it('known mixed vector rounds correctly (raw 16/30 -> 53)', () => {
    // 10 answers summing to 16: five 2s and three 2s... build raw=16 directly.
    const ans: Answer[] = [
      ...Array.from({ length: 5 }, () => ({ dimension: 'DIM_1' as const, score: 3 as OptionScore })), // 15
      { dimension: 'DIM_1', score: 1 }, // +1 = 16
    ];
    // raw 16 -> round(16/30*100) = round(53.33) = 53
    expect(calculateScores(ans).dim1).toBe(53);
  });

  it('rounds to nearest integer (raw 1 -> 3)', () => {
    expect(calculateScores([{ dimension: 'DIM_1', score: 1 }]).dim1).toBe(3);
  });
});

describe('bandOf (spec 3.2 boundaries)', () => {
  it('low up to and including 33', () => {
    expect(bandOf(0)).toBe('low');
    expect(bandOf(BAND_LOW_MAX)).toBe('low'); // 33
  });
  it('mid from 34 to 66', () => {
    expect(bandOf(34)).toBe('mid');
    expect(bandOf(66)).toBe('mid');
  });
  it('high from 67 up', () => {
    expect(bandOf(BAND_HIGH_MIN)).toBe('high'); // 67
    expect(bandOf(100)).toBe('high');
  });
});

describe('labelFor (spec 3.2 tables)', () => {
  it('returns the correct band label per dimension', () => {
    expect(labelFor('DIM_1', 10)).toBe('Practical Thinker');
    expect(labelFor('DIM_1', 50)).toBe('Balanced Analyst');
    expect(labelFor('DIM_1', 90)).toBe('Conceptual Visionary');
    expect(labelFor('DIM_4', 90)).toBe('Entrepreneurial Risk-Taker');
  });
});
