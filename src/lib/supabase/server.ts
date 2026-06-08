import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-side Supabase clients. Two roles, never mixed:
//
//   * service client — uses SUPABASE_SERVICE_ROLE_KEY, BYPASSES RLS. Only for
//     trusted server code (the complete-session action, admin). NEVER import
//     into a client component or expose its key.
//   * public client — uses the anon key, subject to RLS / deny-by-default.
//     Used to call get_shared_result() for the public share page.
//
// Clients are created per-call (cheap, stateless) with session persistence off
// since there is no quiz-taker auth.

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

const noAuthPersistence = {
  auth: { persistSession: false, autoRefreshToken: false },
} as const;

/** Trusted, RLS-bypassing client. Server-only. */
export function createServiceClient(): SupabaseClient {
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    noAuthPersistence,
  );
}

/** Anon client, subject to RLS. Safe for the public share-token read path. */
export function createPublicClient(): SupabaseClient {
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    noAuthPersistence,
  );
}
