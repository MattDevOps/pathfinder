import { describe, it, expect } from 'vitest';
import {
  assignSectorCluster,
  generateScenarios,
  profileTitle,
} from './scenarios.draft';
import type { DimensionScores } from './types';

// These tests assert STRUCTURE only (totality + valid enums), not specific
// product outcomes, because the underlying mapping is DRAFT pending founder
// sign-off (docs/FOUNDER-QUESTIONS.md A1-A5). They guard against the spec's
// real bug: undefined behavior for some score combinations.

const STRENGTHS = ['high', 'medium', 'low'];
const CLUSTERS = [
  'Operations & Engineering',
  'Craft & Production',
  'Strategy & Analysis',
  'Innovation & Creativity',
  'People & Communication',
];

// Sample every band boundary for all four dimensions.
const SAMPLES = [0, 33, 34, 50, 66, 67, 100];

function* allScores(): Generator<DimensionScores> {
  for (const dim1 of SAMPLES)
    for (const dim2 of SAMPLES)
      for (const dim3 of SAMPLES)
        for (const dim4 of SAMPLES)
          yield { dim1, dim2, dim3, dim4 };
}

describe('scenario engine is TOTAL over all score combinations', () => {
  it('assignSectorCluster never returns undefined and always a valid cluster', () => {
    for (const s of allScores()) {
      const c = assignSectorCluster(s);
      expect(CLUSTERS).toContain(c);
    }
  });

  it('generateScenarios always returns valid strengths for all 3 paths', () => {
    for (const s of allScores()) {
      const r = generateScenarios(s);
      expect(STRENGTHS).toContain(r.employee);
      expect(STRENGTHS).toContain(r.freelancer);
      expect(STRENGTHS).toContain(r.founder);
    }
  });

  it('profileTitle is defined for every cluster', () => {
    for (const s of allScores()) {
      const title = profileTitle(assignSectorCluster(s));
      expect(title.length).toBeGreaterThan(0);
    }
  });
});
