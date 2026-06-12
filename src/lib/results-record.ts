import type { ArchetypeId, DomainId } from './types';
import {
  calcDimensions,
  calcArchetype,
  calcDomain,
  congruence,
  type Selections,
  type VisualProfile,
  type Dimensions,
} from './archetype';
import {
  isVisualComplete,
  isPhase1Complete,
  isPhase2Complete,
} from './quiz-session';

// Server-authoritative assembly of the persisted result from a v5 run. This is
// the trusted path: dimension/domain weights are looked up here from the data
// source of truth (NEVER trusted from the client). The client may compute the
// same values for an instant UI, but THIS is what gets stored.

export interface ResultRecord {
  archetype: ArchetypeId;
  domain: DomainId;
  dims: Dimensions;
  congruence: number;
}

/** Resolve a completed run into its scored result. */
export function buildResultRecord(
  visual: VisualProfile,
  phase1: Selections,
  phase2: Selections,
): ResultRecord {
  const dims = calcDimensions(phase1);
  const archetype = calcArchetype(dims, visual);
  const domain = calcDomain(phase2, visual);
  return {
    archetype,
    domain,
    dims,
    congruence: congruence(dims, archetype),
  };
}

/** True when Phase 0 + Phase 1 + Phase 2 are all answered. */
export function isRunComplete(
  visual: VisualProfile,
  phase1: Selections,
  phase2: Selections,
): boolean {
  return (
    isVisualComplete(visual) &&
    isPhase1Complete(phase1) &&
    isPhase2Complete(phase2)
  );
}
