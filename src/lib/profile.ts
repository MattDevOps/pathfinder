import type { Dimension, DimensionScores, Band, SectorCluster, ScenarioStrength } from './types';
import { DIMENSIONS } from './types';
import { bandOf, labelFor } from './scoring';
import { assignSectorCluster, generateScenarios, profileTitle } from './scenarios.draft';
import {
  scenarioContent,
  type ScenarioContent,
  type ScenarioKey,
} from '@/data/scenario-content.draft';
import type { Locale } from '@/i18n/routing';

// Pure assembly: combine the CONFIRMED scoring engine with the DRAFT
// scenario/sector/content layer into a single view model the results UI can
// render directly. Framework-free so it stays unit-testable. Locale is only
// used to select content strings; all display chrome (dimension names,
// scenario path labels, strength words) is the UI's job via next-intl.
//
// NOTE: everything downstream of the scores here is DRAFT (see PLAN.md B1-B5
// and scenario-content.draft.ts) and will change after founder sign-off.

export interface DimensionView {
  dimension: Dimension; // 'DIM_1'..'DIM_4'
  score: number; // 0-100
  band: Band;
  label: string; // CONFIRMED band label from scoring.ts
}

export interface ScenarioView {
  key: ScenarioKey; // 'employee' | 'freelancer' | 'founder'
  strength: ScenarioStrength; // 'high' | 'medium' | 'low'
  content: ScenarioContent; // DRAFT copy (may have empty HE strings)
}

export interface ProfileResult {
  title: string; // DRAFT profile title, e.g. "The Strategist"
  cluster: SectorCluster;
  dimensions: DimensionView[];
  scenarios: ScenarioView[]; // sorted strongest-first
}

const STRENGTH_RANK: Record<ScenarioStrength, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const SCENARIO_KEYS: ScenarioKey[] = ['employee', 'freelancer', 'founder'];

export function buildProfile(
  scores: DimensionScores,
  locale: Locale,
): ProfileResult {
  const cluster = assignSectorCluster(scores);
  const strengths = generateScenarios(scores);

  const dimensions: DimensionView[] = DIMENSIONS.map((dimension) => {
    const score = scores[dimensionKey(dimension)];
    return {
      dimension,
      score,
      band: bandOf(score),
      label: labelFor(dimension, score),
    };
  });

  const scenarios: ScenarioView[] = SCENARIO_KEYS.map((key) => ({
    key,
    strength: strengths[key],
    content: scenarioContent(locale, cluster, key),
  })).sort((a, b) => STRENGTH_RANK[a.strength] - STRENGTH_RANK[b.strength]);

  return {
    title: profileTitle(cluster),
    cluster,
    dimensions,
    scenarios,
  };
}

// Map the 'DIM_1' enum to the lowercase 'dim1' key used by DimensionScores.
function dimensionKey(d: Dimension): keyof DimensionScores {
  return d.toLowerCase().replace('_', '') as keyof DimensionScores;
}
