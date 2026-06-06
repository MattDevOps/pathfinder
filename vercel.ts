import type { VercelConfig } from '@vercel/config/v1';

// Vercel project config (the current recommended format, replaces vercel.json).
//
// Region: pin functions to Frankfurt (fra1) so compute sits next to the
// EU/Frankfurt database and to align with Israeli/EU data-residency
// expectations (infra review; see docs/PLAN.md section 3 and
// docs/FOUNDER-QUESTIONS.md D13). If the residency decision flips to
// in-country AWS, this whole hosting story changes.
const config: VercelConfig = {
  framework: 'nextjs',
  regions: ['fra1'],
};

export default config;
