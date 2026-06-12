import { describe, it, expect } from 'vitest';
import {
  calcDimensions,
  calcArchetype,
  calcDomain,
  congruence,
  careerCongruence,
  careersFor,
  type Selections,
  type VisualProfile,
} from './archetype';
import { PHASE1_QUESTIONS } from '@/data/personality';

const NO_VISUAL: VisualProfile = {
  colors: [],
  shape: null,
  shapeSecondary: null,
  space: null,
  stimulus: null,
};

// Build P1 selections that pick the option with a given score on every question
// of a dimension. Returns option IDs (what the client sends).
function pickScore(dimension: string, score: number): Selections {
  const sel: Selections = {};
  for (const q of PHASE1_QUESTIONS) {
    if (q.dimension !== dimension) continue;
    const opt = q.options.find((o) => o.score === score);
    if (opt) sel[q.id] = [opt.id];
  }
  return sel;
}

describe('calcDimensions', () => {
  it('maxes a dimension when every answer is the top-scored option', () => {
    expect(calcDimensions(pickScore('DIM_1', 3)).d1).toBe(100);
  });

  it('zeroes a dimension when every answer is the lowest-scored option', () => {
    expect(calcDimensions(pickScore('DIM_1', 0)).d1).toBe(0);
  });

  it('defaults an unanswered dimension to neutral 50', () => {
    expect(calcDimensions({}).d2).toBe(50);
  });

  it('ignores neutral opt-out options when averaging', () => {
    const q = PHASE1_QUESTIONS.find((x) => x.dimension === 'DIM_3')!;
    const neutral = q.options.find((o) => o.neutral)!;
    // Only a neutral pick on one DIM_3 question -> no valid scores -> 50.
    expect(calcDimensions({ [q.id]: [neutral.id] }).d3).toBe(50);
  });
});

describe('calcArchetype', () => {
  it('picks specialist for a pure high-DIM_1 profile', () => {
    const dims = { d1: 100, d2: 0, d3: 0, d4: 0 };
    expect(calcArchetype(dims, { shape: null, shapeSecondary: null })).toBe('specialist');
  });

  it('breaks an all-tied profile deterministically (no silent Builder default)', () => {
    // All affinities equal 50 -> within-3 tiebreak on strongest single dim.
    // v5's reduce uses strict `>`, so a perfect tie resolves to the LAST
    // candidate (connector) rather than silently defaulting to Builder.
    const dims = { d1: 50, d2: 50, d3: 50, d4: 50 };
    expect(calcArchetype(dims, { shape: null, shapeSecondary: null })).toBe('connector');
  });

  it('lets a Phase 0 shape bias swing an otherwise-tied profile', () => {
    const dims = { d1: 50, d2: 50, d3: 50, d4: 50 };
    // circle biases connector (+15) past the others.
    expect(calcArchetype(dims, { shape: 'circle', shapeSecondary: null })).toBe('connector');
    // lightning biases creator.
    expect(calcArchetype(dims, { shape: 'lightning', shapeSecondary: null })).toBe('creator');
  });
});

describe('calcDomain', () => {
  it('picks the domain with the most Phase 2 points', () => {
    const q = { p2q01: ['o1'] }; // p2q01/o1 -> { FIN: 3 }
    expect(calcDomain(q, NO_VISUAL)).toBe('FIN');
  });

  it('adds Phase 0 hints (space/stimulus/colors) on top of Phase 2', () => {
    // No Phase 2 answers; a tech lab space (+6 TEC) should win.
    const visual: VisualProfile = { ...NO_VISUAL, space: 'lab' };
    expect(calcDomain({}, visual)).toBe('TEC');
  });
});

describe('congruence', () => {
  it('clamps into the 60-99 headline band', () => {
    const c = congruence({ d1: 100, d2: 0, d3: 0, d4: 0 }, 'specialist');
    expect(c).toBeGreaterThanOrEqual(60);
    expect(c).toBeLessThanOrEqual(99);
  });

  it('steps career badges down 3 points per rank', () => {
    expect(careerCongruence(93, 0)).toBe(93);
    expect(careerCongruence(93, 3)).toBe(84);
  });
});

describe('careersFor', () => {
  it('returns 4 concrete paths for a known archetype x domain', () => {
    expect(careersFor('specialist', 'FIN')).toHaveLength(4);
  });
});
