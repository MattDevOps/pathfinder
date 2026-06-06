import { bandOf } from './scoring';
import type {
  Band,
  DimensionScores,
  Scenarios,
  SectorCluster,
} from './types';

// ===========================================================================
// ⚠️  DRAFT — NOT FINAL. Pending founder sign-off.
//
// The spec's section 3.3/3.4 is NOT implementable as written:
//   - the freelancer rule contradicts the dimension definitions (A1)
//   - the sector table has no numeric thresholds and covers 5 of 9 cells (A2/A3)
//   - profile_title is referenced but never defined (A4)
//   - the scenario content table does not exist (B / A4-content)
//
// The mappings below are the PROPOSED defaults from docs/PLAN.md, isolated in
// this file so they are trivially swappable once the founder answers
// docs/FOUNDER-QUESTIONS.md (A1-A5). Do NOT treat these values as final.
// Unit tests assert STRUCTURE (totality, valid enums) here, not specific
// product outcomes, until the intent is confirmed.
// ===========================================================================

/**
 * Sector cluster from the DIM_1 (thinking) x DIM_3 (energy) bands.
 * Total over all 9 band combinations (spec 3.4 only defined 5). DRAFT.
 */
export function assignSectorCluster(scores: DimensionScores): SectorCluster {
  const d1 = bandOf(scores.dim1);
  const d3 = bandOf(scores.dim3);

  const grid: Record<Band, Record<Band, SectorCluster>> = {
    low: {
      low: 'Operations & Engineering',
      mid: 'Operations & Engineering',
      high: 'Craft & Production',
    },
    mid: {
      low: 'Strategy & Analysis',
      mid: 'People & Communication',
      high: 'Innovation & Creativity',
    },
    high: {
      low: 'Strategy & Analysis',
      mid: 'Strategy & Analysis',
      high: 'Innovation & Creativity',
    },
  };

  return grid[d1][d3];
}

/**
 * Strength of each of the 3 career scenarios. DRAFT.
 * Uses a consistent {high, medium, low} enum for all three (the spec's
 * freelancer was only 2-state). Freelancer interpretation: independent
 * (low DIM_2) + moderate risk (mid DIM_4) + creative (high DIM_3).
 */
export function generateScenarios(scores: DimensionScores): Scenarios {
  const { dim2, dim3, dim4 } = scores;

  const employee: Scenarios['employee'] =
    dim4 <= 33 ? 'high' : dim4 <= 66 ? 'medium' : 'low';

  const freelancer: Scenarios['freelancer'] =
    dim4 >= 34 && dim4 <= 66 && dim2 <= 33 && dim3 >= 67
      ? 'high'
      : dim4 >= 34 && dim2 <= 66
        ? 'medium'
        : 'low';

  const founder: Scenarios['founder'] =
    dim4 >= 67 ? 'high' : dim4 >= 34 ? 'medium' : 'low';

  return { employee, freelancer, founder };
}

/**
 * Profile title. DRAFT — one fixed title per sector cluster (option A4-a).
 */
const TITLE_BY_CLUSTER: Record<SectorCluster, string> = {
  'Operations & Engineering': 'The Builder',
  'Craft & Production': 'The Maker',
  'Strategy & Analysis': 'The Strategist',
  'Innovation & Creativity': 'The Innovator',
  'People & Communication': 'The Connector',
};

export function profileTitle(cluster: SectorCluster): string {
  return TITLE_BY_CLUSTER[cluster];
}
