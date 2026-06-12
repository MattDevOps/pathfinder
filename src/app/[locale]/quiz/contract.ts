import type { VisualProfile, Selections } from '@/lib/archetype';

// Shared types for the completeSession server action. Kept out of actions.ts
// because a 'use server' module may only export async functions — exporting a
// type or const from it strips ALL of the module's exports.

export interface CompleteSessionInput {
  visual: VisualProfile;
  phase1: Selections;
  phase2: Selections;
  /** Optional "anything to add?" free text, keyed by question id. */
  openP1?: Record<string, string>;
  openP2?: Record<string, string>;
  email: string;
  name?: string;
  language: string;
  consent: boolean;
}

export type CompleteSessionError =
  | 'invalid_email'
  | 'consent_required'
  | 'incomplete'
  | 'rate_limited'
  | 'server_error';

export type CompleteSessionResult =
  | { ok: true; shareToken: string }
  | { ok: false; error: CompleteSessionError };
