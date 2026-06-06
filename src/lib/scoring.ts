import type {
  Answer,
  Band,
  Dimension,
  DimensionScores,
} from './types';

// ---------------------------------------------------------------------------
// CONFIRMED LOGIC (spec sections 3.1 and 3.2)
// These rules are unambiguous in the spec and are covered by unit tests.
// ---------------------------------------------------------------------------

// 10 questions per dimension x max 3 points each = 30 max raw points.
export const MAX_RAW_PER_DIMENSION = 30;

// Band cut points. We use a single consistent scheme everywhere
// (spec 3.2): 0-33 = low, 34-66 = mid, 67-100 = high. The stray
// `dim2 < 50` from the spec's generateScenarios is intentionally dropped
// (see docs/FOUNDER-QUESTIONS.md A2).
export const BAND_LOW_MAX = 33;
export const BAND_HIGH_MIN = 67;

/**
 * Normalize raw per-dimension points (0-30) to a 0-100 score.
 * Implements spec 3.1 calculateScores exactly.
 */
export function calculateScores(answers: Answer[]): DimensionScores {
  const raw: Record<Dimension, number> = {
    DIM_1: 0,
    DIM_2: 0,
    DIM_3: 0,
    DIM_4: 0,
  };

  for (const a of answers) {
    raw[a.dimension] += a.score;
  }

  const norm = (v: number) =>
    Math.round((v / MAX_RAW_PER_DIMENSION) * 100);

  return {
    dim1: norm(raw.DIM_1),
    dim2: norm(raw.DIM_2),
    dim3: norm(raw.DIM_3),
    dim4: norm(raw.DIM_4),
  };
}

/** Map a 0-100 score to its band. */
export function bandOf(score: number): Band {
  if (score <= BAND_LOW_MAX) return 'low';
  if (score >= BAND_HIGH_MIN) return 'high';
  return 'mid';
}

// Dimension label tables (spec 3.2). Index by band.
const LABELS: Record<Dimension, Record<Band, string>> = {
  DIM_1: { low: 'Practical Thinker', mid: 'Balanced Analyst', high: 'Conceptual Visionary' },
  DIM_2: { low: 'Independent Operator', mid: 'Selective Collaborator', high: 'Natural Connector' },
  DIM_3: { low: 'Systems Builder', mid: 'Craft-Driven', high: 'Creative Pioneer' },
  DIM_4: { low: 'Stability Seeker', mid: 'Calculated Risk-Taker', high: 'Entrepreneurial Risk-Taker' },
};

export function labelFor(dimension: Dimension, score: number): string {
  return LABELS[dimension][bandOf(score)];
}

export function assignLabels(scores: DimensionScores) {
  return {
    dim1_label: labelFor('DIM_1', scores.dim1),
    dim2_label: labelFor('DIM_2', scores.dim2),
    dim3_label: labelFor('DIM_3', scores.dim3),
    dim4_label: labelFor('DIM_4', scores.dim4),
  };
}
