import type { SectorCluster } from '@/lib/types';
import type { Locale } from '@/i18n/routing';

// ===========================================================================
// ⚠️  DRAFT — NOT FINAL. Pending founder sign-off (see docs/PLAN.md B4).
//
// The spec promises, for each sector cluster x {Employee, Freelancer, Founder},
// a headline, three example roles, a paragraph, and three next steps — and
// provides NONE of it. This file is placeholder copy so the results page can be
// built and demoed end-to-end. Every English block is provisional and the
// Hebrew is intentionally empty (mirroring src/data/questions.ts: a native
// copywriter fills HE, gender-neutral and localized not literal — B6/B7).
//
// Structure is the contract; words are throwaway. Once the founder answers
// FOUNDER-QUESTIONS, swap the strings here without touching profile.ts or the
// results UI.
// ===========================================================================

export interface ScenarioContent {
  /** Headline for this career path within this cluster. */
  headline: string;
  /** Three concrete example roles. */
  roles: [string, string, string];
  /** One short descriptive paragraph. */
  paragraph: string;
  /** Three actionable next steps. */
  nextSteps: [string, string, string];
}

export type ScenarioKey = 'employee' | 'freelancer' | 'founder';

export type ClusterContent = Record<ScenarioKey, ScenarioContent>;

// Empty Hebrew block — flagged by the content-completeness test until a
// copywriter fills it. Kept as a named constant so the debt is greppable.
const HE_PENDING: ScenarioContent = {
  headline: '',
  roles: ['', '', ''],
  paragraph: '',
  nextSteps: ['', '', ''],
};

const EN: Record<SectorCluster, ClusterContent> = {
  'Operations & Engineering': {
    employee: {
      headline: 'The dependable engine inside a strong team',
      roles: ['Operations Manager', 'Systems / DevOps Engineer', 'Project Coordinator'],
      paragraph:
        'You turn ambiguity into reliable, repeatable systems. In an organization with clear goals you become the person things actually run on.',
      nextSteps: [
        'List three processes around you that break often and document the fix',
        'Earn one certification in your core tooling',
        'Ask to own a recurring operational metric end to end',
      ],
    },
    freelancer: {
      headline: 'The specialist teams hire to make it work',
      roles: ['Implementation Consultant', 'Automation Contractor', 'Fractional Ops Lead'],
      paragraph:
        'Companies pay well for someone who can drop in and stabilize a messy system. Your edge is execution others can rely on without supervision.',
      nextSteps: [
        'Package one repeatable engagement (e.g. "30-day ops audit")',
        'Build two case studies from past wins',
        'Set a day rate and find your first three referral sources',
      ],
    },
    founder: {
      headline: 'The operator who builds a business that runs without drama',
      roles: ['Service-business Founder', 'Productized-ops Startup', 'Agency Owner'],
      paragraph:
        'Your instinct for systems is the foundation of a durable company. You win by out-executing, not out-dreaming, the competition.',
      nextSteps: [
        'Find a process people already pay to outsource and do it better',
        'Sell the service manually before automating it',
        'Track unit economics from day one',
      ],
    },
  },
  'Craft & Production': {
    employee: {
      headline: 'The maker who raises the quality bar for everyone',
      roles: ['Product Designer', 'Skilled Technician', 'Quality / Production Lead'],
      paragraph:
        'You care how things are made, not just that they ship. A team that values craft will lean on your standards and hands-on skill.',
      nextSteps: [
        'Build a portfolio that shows the craft, not just the outcome',
        'Apprentice under someone whose work you admire',
        'Volunteer for the project with the highest quality stakes',
      ],
    },
    freelancer: {
      headline: 'The independent craftsperson clients seek out by name',
      roles: ['Commissioned Maker', 'Freelance Designer', 'Specialist Fabricator'],
      paragraph:
        'Your work itself is the marketing. Buyers come to you for a quality and style they cannot get off the shelf.',
      nextSteps: [
        'Publish your work where your buyers already look',
        'Price by value of the outcome, not hours of labor',
        'Build a small waitlist before you need it',
      ],
    },
    founder: {
      headline: 'The founder who turns a craft into a brand',
      roles: ['Studio / Workshop Owner', 'Maker-brand Founder', 'Boutique Producer'],
      paragraph:
        'You can grow a craft into a product line people are proud to own. The challenge is scaling without losing the quality that made it special.',
      nextSteps: [
        'Sell a small batch and learn what people repeat-buy',
        'Decide what you will never compromise as you scale',
        'Find a production partner before demand outruns you',
      ],
    },
  },
  'Strategy & Analysis': {
    employee: {
      headline: 'The clear thinker leadership trusts with the hard calls',
      roles: ['Strategy Analyst', 'Product Manager', 'Management Consultant'],
      paragraph:
        'You see the structure under the noise and make decisions defensible. Organizations promote the person who reliably reduces uncertainty.',
      nextSteps: [
        'Turn one fuzzy problem at work into a one-page recommendation',
        'Get fluent in the metric your leadership watches most',
        'Find a mentor two levels above you',
      ],
    },
    freelancer: {
      headline: 'The advisor businesses pay to think clearly for them',
      roles: ['Independent Consultant', 'Fractional Strategist', 'Research Analyst'],
      paragraph:
        'Your thinking is the deliverable. Clients hire you for judgment they lack in-house and clarity they can act on.',
      nextSteps: [
        'Define the single decision you help clients get right',
        'Write publicly to prove how you think',
        'Land one anchor client before going full-time',
      ],
    },
    founder: {
      headline: 'The founder who spots the opportunity others miss',
      roles: ['Startup Founder', 'Investor / Analyst', 'Niche SaaS Founder'],
      paragraph:
        'Your strength is reading a market and placing the right bet. The risk is over-analyzing instead of shipping — pair your insight with momentum.',
      nextSteps: [
        'Validate one sharp hypothesis with real customers this month',
        'Set a deadline that forces a shippable v1',
        'Find a builder-partner who balances your analysis',
      ],
    },
  },
  'Innovation & Creativity': {
    employee: {
      headline: 'The idea engine a forward-looking team needs',
      roles: ['Innovation Lead', 'Creative Director', 'R&D / Design Strategist'],
      paragraph:
        'You generate the possibilities others refine. You thrive where experimentation is rewarded, not where the playbook is fixed.',
      nextSteps: [
        'Pitch one concrete experiment with a clear success metric',
        'Find the most ambitious team in your organization and join it',
        'Build a habit of shipping small bets, not just ideas',
      ],
    },
    freelancer: {
      headline: 'The creative force clients bring in to break the mold',
      roles: ['Creative Consultant', 'Brand / Concept Designer', 'Innovation Facilitator'],
      paragraph:
        'You are hired for original thinking that in-house teams cannot produce. Your reputation is built on a portfolio of bold, distinctive work.',
      nextSteps: [
        'Make one self-directed project that shows your range',
        'Niche down to the kind of work you want more of',
        'Charge for outcomes and originality, not time',
      ],
    },
    founder: {
      headline: 'The visionary founder building something new',
      roles: ['Startup Founder', 'Product Innovator', 'Creative-venture Founder'],
      paragraph:
        'You are wired to create what does not exist yet. Your gift is vision; your discipline must be execution and focus.',
      nextSteps: [
        'Narrow your vision to one thing you can ship in 90 days',
        'Get it in front of real users before it feels ready',
        'Surround yourself with people who finish what they start',
      ],
    },
  },
  'People & Communication': {
    employee: {
      headline: 'The connector who makes a team more than its parts',
      roles: ['Team Lead / Manager', 'Account / Client Manager', 'People & Culture Lead'],
      paragraph:
        'You read people and align them toward a shared goal. Organizations rise or fall on this, and they reward those who do it well.',
      nextSteps: [
        'Volunteer to lead one cross-team effort',
        'Get feedback on how you come across, then close the gap',
        'Build relationships before you need them',
      ],
    },
    freelancer: {
      headline: 'The independent professional people love to work with',
      roles: ['Coach / Facilitator', 'Communications Consultant', 'Community Builder'],
      paragraph:
        'Trust is your product. Clients and referrals follow you because working with you is genuinely better.',
      nextSteps: [
        'Pick the audience you most want to serve and show up for them',
        'Turn satisfied clients into a referral engine',
        'Package your help into a clear, repeatable offer',
      ],
    },
    founder: {
      headline: 'The founder who builds around people and community',
      roles: ['Community-led Startup', 'Marketplace Founder', 'Coaching / Education Business'],
      paragraph:
        'You build businesses powered by relationships and trust. Your edge is rallying people; your job is to turn that into a repeatable model.',
      nextSteps: [
        'Grow a small, engaged community before building the product',
        'Let early members tell you what to build',
        'Design for word-of-mouth from the start',
      ],
    },
  },
};

const HE: Record<SectorCluster, ClusterContent> = {
  'Operations & Engineering': { employee: HE_PENDING, freelancer: HE_PENDING, founder: HE_PENDING },
  'Craft & Production': { employee: HE_PENDING, freelancer: HE_PENDING, founder: HE_PENDING },
  'Strategy & Analysis': { employee: HE_PENDING, freelancer: HE_PENDING, founder: HE_PENDING },
  'Innovation & Creativity': { employee: HE_PENDING, freelancer: HE_PENDING, founder: HE_PENDING },
  'People & Communication': { employee: HE_PENDING, freelancer: HE_PENDING, founder: HE_PENDING },
};

const BY_LOCALE: Record<Locale, Record<SectorCluster, ClusterContent>> = {
  en: EN,
  he: HE,
};

/**
 * Look up the (DRAFT) content for one cluster x scenario in one locale.
 * Returns possibly-empty strings for HE until translations land; the UI is
 * responsible for showing a visible "translation pending" affordance rather
 * than silently falling back to English (so the debt stays visible).
 */
export function scenarioContent(
  locale: Locale,
  cluster: SectorCluster,
  scenario: ScenarioKey,
): ScenarioContent {
  return BY_LOCALE[locale][cluster][scenario];
}
