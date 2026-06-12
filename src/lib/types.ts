// Core domain types for the v5 Pathfinder funnel. Kept framework-free so the
// scoring engine can be unit-tested in isolation and reused on client and
// server. Italian-primary, trilingual (Phase 0 visual + archetype x domain).

// The four personality dimensions, shared by Phase 1 scoring and the result.
export const DIMENSIONS = ['DIM_1', 'DIM_2', 'DIM_3', 'DIM_4'] as const;
export type Dimension = (typeof DIMENSIONS)[number];

// A 0-100 score's band (results display thresholds live in profile.ts).
export type Band = 'low' | 'mid' | 'high';

/** A string in every supported locale. Italian is authored; en/he may be ''. */
export interface Localized {
  it: string;
  en: string;
  he: string;
}

export type ArchetypeId = 'builder' | 'specialist' | 'creator' | 'connector';

export const DOMAINS = [
  'FIN', 'TEC', 'ART', 'LUX', 'NAT', 'PEO',
  'KNO', 'SPO', 'FOO', 'CRA', 'MED', 'SPI',
] as const;
export type DomainId = (typeof DOMAINS)[number];

// --- Phase 0 stimuli ---
export interface ColorStimulus {
  id: string;
  hex: string;
  desc: Localized;
  /** Per-dimension nudges applied when this color is picked (signed). */
  dim: Partial<Record<Dimension, number>>;
}

export interface ShapeStimulus {
  id: string;
  name: Localized;
  desc: Localized;
  /** Archetype this shape biases toward, if any. */
  archBias: ArchetypeId | null;
  /** Inline SVG path/markup for the glyph (language-neutral). */
  svg: string;
}

export interface SpaceStimulus {
  id: string;
  emoji: string;
  name: Localized;
  desc: Localized;
  /** CSS background (language-neutral). */
  bg: string;
  /** Domain this space hints at. */
  domHint: DomainId | null;
}

/** Phase 0 step 4 ("which image grabs you") — same shape as a space card. */
export type ImageStimulus = SpaceStimulus;

// --- Phase 1 (personality -> dimensions) ---
export interface P1Option {
  id: string;
  text: Localized;
  /** 0-3 contribution to the question's dimension; null = neutral opt-out. */
  score: 0 | 1 | 2 | 3 | null;
  neutral?: boolean;
}

export interface P1Question {
  id: string;
  dimension: Dimension;
  text: Localized;
  options: P1Option[];
}

// --- Phase 2 (passions -> domains) ---
export interface P2Option {
  id: string;
  text: Localized;
  /** Points added per domain when selected. */
  domains: Partial<Record<DomainId, number>>;
  neutral?: boolean;
}

export interface P2Question {
  id: string;
  text: Localized;
  options: P2Option[];
}

// --- Results model ---
export interface Archetype {
  id: ArchetypeId;
  icon: string;
  name: Localized;
  sub: Localized;
}

export interface CareerPath {
  name: Localized;
  desc: Localized;
  firstStep: Localized;
}

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
