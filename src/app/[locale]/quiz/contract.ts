import type { Selections } from '@/lib/quiz-session';

// Shared types for the completeSession server action. Kept out of actions.ts
// because a 'use server' module may only export async functions — exporting a
// type or const from it strips ALL of the module's exports.

export interface CompleteSessionInput {
  selections: Selections;
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
