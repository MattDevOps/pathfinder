import { describe, it, expect } from 'vitest';
import { PHASE1_QUESTIONS } from './personality';
import { PHASE2_QUESTIONS } from './passions';
import { P0_COLORS, P0_SHAPES, P0_SPACES, P0_STIMULI } from './phase0';
import { ARCHETYPES, DOMAIN_NAMES, DOMAIN_SLUG, CAREERS } from './careers';
import { DIMENSIONS, DOMAINS, type Localized } from '@/lib/types';

// Walk every Localized string in the dataset so the it/en/he assertions below
// cover all content, not a sample.
function allLocalized(): Localized[] {
  const out: Localized[] = [];
  for (const q of PHASE1_QUESTIONS) {
    out.push(q.text, ...q.options.map((o) => o.text));
  }
  for (const q of PHASE2_QUESTIONS) {
    out.push(q.text, ...q.options.map((o) => o.text));
  }
  for (const c of P0_COLORS) out.push(c.desc);
  for (const s of [...P0_SHAPES, ...P0_SPACES, ...P0_STIMULI]) out.push(s.name, s.desc);
  for (const a of ARCHETYPES) out.push(a.name, a.sub);
  for (const n of Object.values(DOMAIN_NAMES)) out.push(n);
  for (const paths of Object.values(CAREERS)) {
    for (const p of paths) out.push(p.name, p.desc, p.firstStep);
  }
  return out;
}

describe('v5 dataset integrity', () => {
  it('Phase 1: 15 questions, each with one neutral opt-out and 0-3 scored options', () => {
    expect(PHASE1_QUESTIONS).toHaveLength(15);
    expect(new Set(PHASE1_QUESTIONS.map((q) => q.id)).size).toBe(15);
    for (const q of PHASE1_QUESTIONS) {
      expect(DIMENSIONS).toContain(q.dimension);
      const neutral = q.options.filter((o) => o.neutral);
      expect(neutral).toHaveLength(1);
      expect(neutral[0].score).toBeNull();
      const scored = q.options.filter((o) => !o.neutral);
      expect(scored.length).toBeGreaterThanOrEqual(2);
      for (const o of scored) expect([0, 1, 2, 3]).toContain(o.score);
    }
  });

  it('every dimension has at least one Phase 1 question', () => {
    for (const d of DIMENSIONS) {
      expect(PHASE1_QUESTIONS.some((q) => q.dimension === d)).toBe(true);
    }
  });

  it('Phase 2: 12 questions, each with one neutral and valid domain weights', () => {
    expect(PHASE2_QUESTIONS).toHaveLength(12);
    for (const q of PHASE2_QUESTIONS) {
      expect(q.options.filter((o) => o.neutral)).toHaveLength(1);
      for (const o of q.options) {
        for (const dom of Object.keys(o.domains)) expect(DOMAINS).toContain(dom);
      }
    }
  });

  it('Phase 0 stimuli counts and references', () => {
    expect(P0_COLORS).toHaveLength(8);
    expect(P0_SHAPES).toHaveLength(5);
    expect(P0_SPACES).toHaveLength(6);
    expect(P0_STIMULI).toHaveLength(4);
    for (const s of [...P0_SPACES, ...P0_STIMULI]) {
      if (s.domHint) expect(DOMAINS).toContain(s.domHint);
    }
  });

  it('4 archetypes, 12 domains, and a full 48-bucket career DB of 4 paths each', () => {
    expect(ARCHETYPES.map((a) => a.id).sort()).toEqual([
      'builder', 'connector', 'creator', 'specialist',
    ]);
    expect(Object.keys(DOMAIN_NAMES).sort()).toEqual([...DOMAINS].sort());
    expect(Object.keys(CAREERS)).toHaveLength(48);
    for (const a of ARCHETYPES) {
      for (const d of DOMAINS) {
        const paths = CAREERS[`${a.id}_${DOMAIN_SLUG[d]}`];
        expect(paths, `${a.id} x ${d}`).toBeDefined();
        expect(paths).toHaveLength(4);
      }
    }
  });

  it('Italian content is complete (authored from the prototype)', () => {
    const missing = allLocalized().filter((l) => l.it.trim().length === 0);
    expect(missing).toHaveLength(0);
  });

  // Tracks EN/HE translation debt (mirrors src/data/questions.test.ts). Flip to
  // assert full coverage once a copywriter has localized the v5 content.
  it('English/Hebrew are incomplete (known translation debt)', () => {
    const all = allLocalized();
    const enDone = all.filter((l) => l.en.trim().length > 0).length;
    const heDone = all.filter((l) => l.he.trim().length > 0).length;
    expect(enDone).toBeLessThan(all.length);
    expect(heDone).toBeLessThan(all.length);
  });
});
