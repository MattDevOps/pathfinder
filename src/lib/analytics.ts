import posthog from 'posthog-js';

// Thin analytics wrapper around PostHog (PLAN.md C3: the funnel is
// conversion-driven but the spec instruments nothing). Every funnel step calls
// capture(); without NEXT_PUBLIC_POSTHOG_KEY it no-ops (logging to the console
// in dev) so the app runs identically with or without analytics configured.

export const EVENTS = {
  landingViewed: 'landing_viewed',
  quizStarted: 'quiz_started',
  questionAnswered: 'question_answered',
  quizCompleted: 'quiz_completed',
  gateViewed: 'gate_viewed',
  gateSubmitted: 'gate_submitted',
  gateError: 'gate_error',
  resultPreviewed: 'result_previewed',
  resultViewed: 'result_viewed',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

let initialized = false;

export function initAnalytics(): void {
  if (initialized || typeof window === 'undefined') return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return; // analytics disabled until a key is configured
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com',
    capture_pageview: false, // we capture funnel steps explicitly
    person_profiles: 'always',
  });
  initialized = true;
}

export function capture(
  event: EventName,
  props?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return;
  if (initialized) {
    posthog.capture(event, props);
  } else if (process.env.NODE_ENV !== 'production') {
    // Visible in dev so funnel instrumentation is verifiable without a key.
    console.debug('[analytics]', event, props ?? {});
  }
}
