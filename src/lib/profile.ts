import type { ArchetypeId, DomainId, Band } from './types';
import type { Dimensions, VisualProfile } from './archetype';
import { careersFor, careerCongruence } from './archetype';
import { ARCHETYPES, DOMAIN_NAMES } from '@/data/careers';
import { P0_COLORS, P0_SHAPES, P0_SPACES, P0_STIMULI } from '@/data/phase0';
import { t } from './localized';

// Pure assembly of the v5 results view model: combine the stored, server-scored
// result (archetype, domain, dims, congruence) with the Phase 0 visual picks and
// the localized content, producing exactly what the results UI renders. Content
// strings are resolved for `locale` (falling back to Italian). Display chrome
// that isn't content — dimension axis names, band words — stays the UI's job via
// next-intl, so this returns the structural `dimKey`/`band` instead of words.

export interface DimensionView {
  key: 'd1' | 'd2' | 'd3' | 'd4';
  score: number; // 0-100
  band: Band; // low <40, high >65, else mid (v5 thresholds)
}

export interface CareerView {
  name: string;
  desc: string;
  firstStep: string;
  congruence: number;
  best: boolean;
}

/** Which signals (archetype / domain) the Phase 0 visual picks agree with. */
export type AlignmentNote = 'both' | 'arch' | 'dom' | 'none';

export interface VisualSignature {
  colorDescs: string[];
  shapeName: string | null;
  shapeDesc: string | null;
  archAlign: boolean;
  domAlign: boolean;
  note: AlignmentNote;
}

export interface ProfileView {
  archetype: { id: ArchetypeId; icon: string; name: string; sub: string };
  domain: DomainId;
  domainName: string;
  congruence: number;
  dimensions: DimensionView[];
  careers: CareerView[];
  visual: VisualSignature;
}

// v5 band thresholds (showP1Result): <40 low, >65 high, else mid.
function bandOf(score: number): Band {
  if (score < 40) return 'low';
  if (score > 65) return 'high';
  return 'mid';
}

/** Phase 0 -> domain vote (space x2, stimulus x1); null if no hints. */
function visualDomainHint(visual: VisualProfile): DomainId | null {
  const votes = new Map<DomainId, number>();
  const add = (d: DomainId | null, n: number) => {
    if (d) votes.set(d, (votes.get(d) ?? 0) + n);
  };
  add(P0_SPACES.find((s) => s.id === visual.space)?.domHint ?? null, 2);
  add(P0_STIMULI.find((s) => s.id === visual.stimulus)?.domHint ?? null, 1);
  let best: DomainId | null = null;
  let bestN = 0;
  for (const [d, n] of votes) {
    if (n > bestN) {
      best = d;
      bestN = n;
    }
  }
  return best;
}

export function buildProfile(
  result: { archetype: ArchetypeId; domain: DomainId; dims: Dimensions; congruence: number },
  visual: VisualProfile,
  locale: string,
): ProfileView {
  const arch = ARCHETYPES.find((a) => a.id === result.archetype)!;

  const dimensions: DimensionView[] = (['d1', 'd2', 'd3', 'd4'] as const).map((key) => ({
    key,
    score: result.dims[key],
    band: bandOf(result.dims[key]),
  }));

  const careers: CareerView[] = careersFor(result.archetype, result.domain).map((c, i) => ({
    name: t(c.name, locale),
    desc: t(c.desc, locale),
    firstStep: t(c.firstStep, locale),
    congruence: careerCongruence(result.congruence, i),
    best: i === 0,
  }));

  // Visual signature: first two colours' descriptors + primary shape.
  const colorDescs = visual.colors
    .slice(0, 2)
    .map((id) => P0_COLORS.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => !!c)
    .map((c) => t(c.desc, locale));
  const shape = P0_SHAPES.find((s) => s.id === visual.shape) ?? null;
  const archAlign = !!shape?.archBias && shape.archBias === result.archetype;
  const domAlign = visualDomainHint(visual) === result.domain;
  const note: AlignmentNote =
    archAlign && domAlign ? 'both' : archAlign ? 'arch' : domAlign ? 'dom' : 'none';

  return {
    archetype: {
      id: arch.id,
      icon: arch.icon,
      name: t(arch.name, locale),
      sub: t(arch.sub, locale),
    },
    domain: result.domain,
    domainName: t(DOMAIN_NAMES[result.domain], locale),
    congruence: result.congruence,
    dimensions,
    careers,
    visual: {
      colorDescs,
      shapeName: shape ? t(shape.name, locale) : null,
      shapeDesc: shape ? t(shape.desc, locale) : null,
      archAlign,
      domAlign,
      note,
    },
  };
}
