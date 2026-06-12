import type { ArchetypeId, Dimension, DomainId, CareerPath } from './types';
import { DOMAINS } from './types';
import { PHASE1_QUESTIONS } from '@/data/personality';
import { PHASE2_QUESTIONS } from '@/data/passions';
import { P0_SHAPES, P0_SPACES, P0_STIMULI } from '@/data/phase0';
import { CAREERS, DOMAIN_SLUG } from '@/data/careers';

// v5 scoring engine (Phase 1 -> dimensions -> archetype; Phase 2 + Phase 0 ->
// domain; congruence). A faithful port of the prototype's calcDim /
// calcArchetype / calcDomain / getCongruenceScore (see
// docs/pathfinder-v5-reference.html). Framework-free and pure so the server can
// score authoritatively and unit tests can pin the math. Selections are option
// IDs; scores/weights are looked up HERE from the data source of truth, never
// trusted from the client.

/** Per-question selections: questionId -> selected option IDs (multi-select). */
export type Selections = Record<string, string[]>;

/** Phase 0 visual choices. */
export interface VisualProfile {
  colors: string[]; // ordered color IDs (up to 3; order matters)
  shape: string | null; // primary shape ID
  shapeSecondary: string | null;
  space: string | null;
  stimulus: string | null;
}

/** The four normalized dimension scores (0-100). */
export interface Dimensions {
  d1: number;
  d2: number;
  d3: number;
  d4: number;
}

// First-two-colors -> domain nudge (prototype calcDomain colorDomMap).
const COLOR_DOMAIN: Record<string, DomainId> = {
  blu: 'KNO', verde: 'NAT', rosso: 'FIN', giallo: 'ART',
  viola: 'ART', marrone: 'CRA', nero: 'FIN', grigio: 'KNO',
};

/**
 * One dimension's 0-100 score: average each answered question's selected
 * (non-neutral) option scores, normalize by max (3), average across answered
 * questions. No answers for the dimension -> neutral 50. (prototype calcDim)
 */
function calcDim(dim: Dimension, p1: Selections): number {
  let total = 0;
  let count = 0;
  for (const q of PHASE1_QUESTIONS) {
    if (q.dimension !== dim) continue;
    const selected = p1[q.id] ?? [];
    const scores = selected
      .map((oid) => q.options.find((o) => o.id === oid))
      .filter((o): o is NonNullable<typeof o> => !!o && o.score !== null)
      .map((o) => o.score as number);
    if (!scores.length) continue;
    total += scores.reduce((a, b) => a + b, 0) / scores.length;
    count += 1;
  }
  return count ? Math.round((total / (count * 3)) * 100) : 50;
}

export function calcDimensions(p1: Selections): Dimensions {
  return {
    d1: calcDim('DIM_1', p1),
    d2: calcDim('DIM_2', p1),
    d3: calcDim('DIM_3', p1),
    d4: calcDim('DIM_4', p1),
  };
}

/** Raw (pre-clamp) archetype affinity scores from the four dimensions. */
function archetypeScores(d: Dimensions): Record<ArchetypeId, number> {
  return {
    builder: d.d4 * 0.45 + d.d1 * 0.3 + d.d3 * 0.15 + (100 - d.d2) * 0.1,
    specialist: d.d1 * 0.5 + (100 - d.d4) * 0.25 + d.d3 * 0.15 + (100 - d.d2) * 0.1,
    creator: d.d3 * 0.45 + (100 - d.d2) * 0.25 + d.d4 * 0.2 + d.d1 * 0.1,
    connector: d.d2 * 0.5 + d.d3 * 0.25 + (100 - d.d4) * 0.15 + d.d1 * 0.1,
  };
}

/**
 * Pick the archetype: dimension affinities + Phase 0 shape bias (primary +15,
 * secondary +7). If the top two are within 3 points, break the tie on the
 * strongest single dimension instead of silently defaulting to Builder.
 * (prototype calcArchetype)
 */
export function calcArchetype(
  dims: Dimensions,
  visual: Pick<VisualProfile, 'shape' | 'shapeSecondary'>,
): ArchetypeId {
  const scores = archetypeScores(dims);

  const primary = P0_SHAPES.find((s) => s.id === visual.shape);
  if (primary?.archBias) scores[primary.archBias] += 15;
  const secondary = P0_SHAPES.find((s) => s.id === visual.shapeSecondary);
  if (secondary?.archBias) scores[secondary.archBias] += 7;

  const sorted = (Object.entries(scores) as [ArchetypeId, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  if (sorted[0][1] - sorted[1][1] < 3) {
    const byDim: { k: ArchetypeId; v: number }[] = [
      { k: 'builder', v: dims.d4 },
      { k: 'specialist', v: dims.d1 },
      { k: 'creator', v: dims.d3 },
      { k: 'connector', v: dims.d2 },
    ];
    return byDim.reduce((a, b) => (a.v > b.v ? a : b)).k;
  }
  return sorted[0][0];
}

/**
 * Pick the passion domain: sum Phase 2 option points, then add Phase 0 hints
 * (space +6, stimulus +4, first color +3, second color +2). Argmax over the 12
 * domains. (prototype calcDomain)
 */
export function calcDomain(p2: Selections, visual: VisualProfile): DomainId {
  const score = Object.fromEntries(DOMAINS.map((d) => [d, 0])) as Record<
    DomainId,
    number
  >;

  for (const q of PHASE2_QUESTIONS) {
    for (const oid of p2[q.id] ?? []) {
      const opt = q.options.find((o) => o.id === oid);
      if (!opt) continue;
      for (const [dom, pts] of Object.entries(opt.domains)) {
        score[dom as DomainId] += pts as number;
      }
    }
  }

  const space = P0_SPACES.find((s) => s.id === visual.space);
  if (space?.domHint) score[space.domHint] += 6;
  const stim = P0_STIMULI.find((s) => s.id === visual.stimulus);
  if (stim?.domHint) score[stim.domHint] += 4;
  const c1 = visual.colors[0] && COLOR_DOMAIN[visual.colors[0]];
  if (c1) score[c1] += 3;
  const c2 = visual.colors[1] && COLOR_DOMAIN[visual.colors[1]];
  if (c2) score[c2] += 2;

  return (Object.entries(score) as [DomainId, number][]).reduce((a, b) =>
    a[1] >= b[1] ? a : b,
  )[0];
}

/**
 * Congruence headline (60-99). Uses the chosen archetype's raw affinity WITHOUT
 * the Phase 0 shape bias (prototype getCongruenceScore). Per-path badges step
 * down 3 points each — see careerCongruence.
 */
export function congruence(dims: Dimensions, archetype: ArchetypeId): number {
  const raw = archetypeScores(dims)[archetype] ?? 50;
  return Math.min(99, Math.round(60 + (raw / 100) * 39));
}

/** Congruence shown next to the i-th career path (0-indexed): top minus 3/each. */
export function careerCongruence(headline: number, index: number): number {
  return headline - index * 3;
}

/** The 4 career paths for an archetype x domain pairing (empty if unknown). */
export function careersFor(archetype: ArchetypeId, domain: DomainId): CareerPath[] {
  return CAREERS[`${archetype}_${DOMAIN_SLUG[domain]}`] ?? [];
}
