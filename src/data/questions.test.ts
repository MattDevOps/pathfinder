import { describe, it, expect } from 'vitest';
import { QUESTIONS } from './questions';
import { DIMENSIONS, type Dimension } from '@/lib/types';

describe('questions dataset integrity (spec 2.3)', () => {
  it('has exactly 40 questions', () => {
    expect(QUESTIONS).toHaveLength(40);
  });

  it('has unique sequential ids Q001..Q040', () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(40);
    expect(ids[0]).toBe('Q001');
    expect(ids[39]).toBe('Q040');
  });

  it('has exactly 10 questions per dimension', () => {
    const counts: Record<Dimension, number> = {
      DIM_1: 0, DIM_2: 0, DIM_3: 0, DIM_4: 0,
    };
    for (const q of QUESTIONS) counts[q.dimension]++;
    for (const d of DIMENSIONS) expect(counts[d]).toBe(10);
  });

  it('every question has 4 options A-D scored 0,1,2,3 in order', () => {
    for (const q of QUESTIONS) {
      expect(q.options.map((o) => o.id)).toEqual(['A', 'B', 'C', 'D']);
      expect(q.options.map((o) => o.score)).toEqual([0, 1, 2, 3]);
      for (const o of q.options) expect(o.text_en.length).toBeGreaterThan(0);
    }
  });

  // Tracks the Hebrew translation debt (FOUNDER-QUESTIONS B6/B7). When all
  // translations land, flip this to assert full coverage.
  it('Hebrew translation is incomplete (known content debt)', () => {
    const translated = QUESTIONS.filter((q) => q.text_he.length > 0);
    expect(translated.length).toBeGreaterThan(0); // Q001 from spec
    expect(translated.length).toBeLessThan(40); // rest pending
  });
});
