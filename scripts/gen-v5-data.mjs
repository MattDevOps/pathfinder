// One-time bootstrap generator. Extracts the v5 prototype's data literals
// (docs/pathfinder-v5-reference.html) and emits typed TypeScript data modules.
//
// Italian is authored (from v5); English/Hebrew are emitted as empty strings to
// be filled by a copywriter (tracked as translation debt by the content test).
//
// This is NOT part of the build. Run manually after a new vN drop:
//   node scripts/gen-v5-data.mjs
// Then hand-edit en/he in the generated files — do NOT re-run blindly, it
// overwrites translations. Re-run only to re-bootstrap from a fresh prototype.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'docs/pathfinder-v5-reference.html'), 'utf8');

// Pull the single <script> body and evaluate it in a sandbox. Top-level code is
// only const/let/function declarations (no DOM touched until handlers fire), so
// stubbing document/window is enough. We append a `var` capture so the vm
// context exposes the data bindings back to us.
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const capture =
  '\n;var __DATA__={P0_COLORS,P0_SHAPES,P0_SPACES,P0_STIMULI,P1,P2,ARCHS,DOMAIN_NAMES,DMAP,DB};';
const sandbox = { document: {}, window: {}, console };
vm.runInNewContext(script + capture, sandbox);
const D = sandbox.__DATA__;

// ---- helpers ----------------------------------------------------------------
const j = (s) => JSON.stringify(s);
const loc = (it) => `{ it: ${j(it ?? '')}, en: '', he: '' }`;
const obj = (o) =>
  '{ ' +
  Object.entries(o)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ') +
  ' }';
const oid = (i) => `o${i + 1}`;
const pid = (prefix, i) => `${prefix}q${String(i + 1).padStart(2, '0')}`;

const HEADER = (note) =>
  `// AUTO-GENERATED from docs/pathfinder-v5-reference.html by\n` +
  `// scripts/gen-v5-data.mjs. ${note}\n` +
  `// Italian is authored; en/he are empty until a copywriter fills them\n` +
  `// (tracked by src/data/v5-content.test.ts). Do not hand-edit Italian here —\n` +
  `// edit the prototype and regenerate. DO hand-edit en/he, then stop regenerating.\n\n`;

// ---- phase0.ts --------------------------------------------------------------
{
  const colors = D.P0_COLORS.map(
    (c) =>
      `  { id: ${j(c.id)}, hex: ${j(c.hex)}, desc: ${loc(c.desc)}, dim: ${obj(c.dim)} },`,
  ).join('\n');
  const shapes = D.P0_SHAPES.map(
    (s) =>
      `  { id: ${j(s.id)}, name: ${loc(s.name)}, desc: ${loc(s.desc)}, archBias: ${
        s.archBias ? j(s.archBias) : 'null'
      }, svg: ${j(s.svg)} },`,
  ).join('\n');
  const spaces = D.P0_SPACES.map(
    (s) =>
      `  { id: ${j(s.id)}, emoji: ${j(s.emoji)}, name: ${loc(s.name)}, desc: ${loc(
        s.desc,
      )}, bg: ${j(s.bg)}, domHint: ${s.domHint ? j(s.domHint) : 'null'} },`,
  ).join('\n');
  const stimuli = D.P0_STIMULI.map(
    (s) =>
      `  { id: ${j(s.id)}, emoji: ${j(s.emoji)}, name: ${loc(s.name)}, desc: ${loc(
        s.desc,
      )}, bg: ${j(s.bg)}, domHint: ${s.domHint ? j(s.domHint) : 'null'} },`,
  ).join('\n');

  const out =
    HEADER('Phase 0 — visual profiling stimuli.') +
    `import type {\n  ColorStimulus,\n  ShapeStimulus,\n  SpaceStimulus,\n  ImageStimulus,\n} from '@/lib/types';\n\n` +
    `export const P0_COLORS: ColorStimulus[] = [\n${colors}\n];\n\n` +
    `export const P0_SHAPES: ShapeStimulus[] = [\n${shapes}\n];\n\n` +
    `export const P0_SPACES: SpaceStimulus[] = [\n${spaces}\n];\n\n` +
    `export const P0_STIMULI: ImageStimulus[] = [\n${stimuli}\n];\n`;
  writeFileSync(join(root, 'src/data/phase0.ts'), out);
}

// ---- personality.ts (Phase 1) ----------------------------------------------
{
  const qs = D.P1.map((q, qi) => {
    const opts = q.o
      .map((o, i) => {
        const score = o.s === null || o.s === undefined ? 'null' : o.s;
        const neutral = o.n ? ', neutral: true' : '';
        return `    { id: ${j(oid(i))}, text: ${loc(o.t)}, score: ${score}${neutral} },`;
      })
      .join('\n');
    return (
      `  {\n    id: ${j(pid('p1', qi))}, dimension: ${j(q.d)}, text: ${loc(q.t)},\n` +
      `    options: [\n${opts}\n    ],\n  },`
    );
  }).join('\n');

  const out =
    HEADER('Phase 1 — personality questions (-> 4 dimensions -> archetype).') +
    `import type { P1Question } from '@/lib/types';\n\n` +
    `export const PHASE1_QUESTIONS: P1Question[] = [\n${qs}\n];\n`;
  writeFileSync(join(root, 'src/data/personality.ts'), out);
}

// ---- passions.ts (Phase 2) --------------------------------------------------
{
  const qs = D.P2.map((q, qi) => {
    const opts = q.o
      .map((o, i) => {
        const domains = o.d && typeof o.d === 'object' ? obj(o.d) : '{}';
        const neutral = o.n ? ', neutral: true' : '';
        return `    { id: ${j(oid(i))}, text: ${loc(o.t)}, domains: ${domains}${neutral} },`;
      })
      .join('\n');
    return `  {\n    id: ${j(pid('p2', qi))}, text: ${loc(q.t)},\n    options: [\n${opts}\n    ],\n  },`;
  }).join('\n');

  const out =
    HEADER('Phase 2 — passion questions (-> 12 domains).') +
    `import type { P2Question } from '@/lib/types';\n\n` +
    `export const PHASE2_QUESTIONS: P2Question[] = [\n${qs}\n];\n`;
  writeFileSync(join(root, 'src/data/passions.ts'), out);
}

// ---- careers.ts (archetypes, domains, career DB) ----------------------------
{
  const archs = Object.entries(D.ARCHS)
    .map(
      ([id, a]) =>
        `  { id: ${j(id)}, icon: ${j(a.icon)}, name: ${loc(a.name)}, sub: ${loc(a.sub)} },`,
    )
    .join('\n');

  const domNames = Object.entries(D.DOMAIN_NAMES)
    .map(([id, name]) => `  ${id}: ${loc(name)},`)
    .join('\n');

  const dmap = Object.entries(D.DMAP)
    .map(([id, slug]) => `  ${id}: ${j(slug)},`)
    .join('\n');

  const db = Object.entries(D.DB)
    .map(([key, paths]) => {
      const items = paths
        .map(
          (p) =>
            `    { name: ${loc(p.n)}, desc: ${loc(p.d)}, firstStep: ${loc(p.s)} },`,
        )
        .join('\n');
      return `  ${j(key)}: [\n${items}\n  ],`;
    })
    .join('\n');

  const out =
    HEADER('Archetypes, domain names, and the archetype x domain career DB.') +
    `import type { Archetype, CareerPath, DomainId, Localized } from '@/lib/types';\n\n` +
    `export const ARCHETYPES: Archetype[] = [\n${archs}\n];\n\n` +
    `export const DOMAIN_NAMES: Record<DomainId, Localized> = {\n${domNames}\n};\n\n` +
    `// Domain id -> career-DB slug (the second half of each DB key).\n` +
    `export const DOMAIN_SLUG: Record<DomainId, string> = {\n${dmap}\n};\n\n` +
    `// Keyed \`\${archetypeId}_\${domainSlug}\` — 4 archetypes x 12 domains = 48 buckets.\n` +
    `export const CAREERS: Record<string, CareerPath[]> = {\n${db}\n};\n`;
  writeFileSync(join(root, 'src/data/careers.ts'), out);
}

console.log('generated: phase0.ts personality.ts passions.ts careers.ts');
console.log(
  `counts: P1=${D.P1.length} P2=${D.P2.length} colors=${D.P0_COLORS.length} ` +
    `shapes=${D.P0_SHAPES.length} spaces=${D.P0_SPACES.length} stimuli=${D.P0_STIMULI.length} ` +
    `archs=${Object.keys(D.ARCHS).length} domains=${Object.keys(D.DOMAIN_NAMES).length} ` +
    `careerBuckets=${Object.keys(D.DB).length}`,
);
