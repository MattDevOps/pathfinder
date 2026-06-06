// Core domain types for the Pathfinder quiz. Kept framework-free so the
// scoring engine can be unit-tested in isolation and reused on client and
// server.

export const DIMENSIONS = ['DIM_1', 'DIM_2', 'DIM_3', 'DIM_4'] as const;
export type Dimension = (typeof DIMENSIONS)[number];

export type OptionScore = 0 | 1 | 2 | 3;

export interface AnswerOption {
  id: 'A' | 'B' | 'C' | 'D';
  text_en: string;
  text_he: string;
  score: OptionScore;
}

export interface Question {
  id: string; // e.g. 'Q001'
  dimension: Dimension;
  text_en: string;
  text_he: string;
  options: AnswerOption[];
}

// A recorded answer. `dimension` and `score` are authoritative only when
// looked up server-side from the questions source of truth (see
// docs/PLAN.md section 3); never trust a client-supplied score.
export interface Answer {
  dimension: Dimension;
  score: OptionScore;
}

export type DimensionScores = {
  dim1: number; // 0-100
  dim2: number;
  dim3: number;
  dim4: number;
};

export type Band = 'low' | 'mid' | 'high';

export type SectorCluster =
  | 'Operations & Engineering'
  | 'Craft & Production'
  | 'Strategy & Analysis'
  | 'Innovation & Creativity'
  | 'People & Communication';

export type ScenarioStrength = 'high' | 'medium' | 'low';

export interface Scenarios {
  employee: ScenarioStrength;
  freelancer: ScenarioStrength;
  founder: ScenarioStrength;
}
