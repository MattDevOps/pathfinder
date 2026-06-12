import type { VisualProfile, Selections } from '@/lib/archetype';

// Hand-written, minimal typing for the database surface the app touches. Not the
// full generated Supabase types (no live project to generate from yet) — just
// enough to type the RPCs the funnel uses. Regenerate with
// `supabase gen types typescript` once a project exists.

export interface SharedResultRow {
  archetype: string;
  domain: string;
  dim1_score: number;
  dim2_score: number;
  dim3_score: number;
  dim4_score: number;
  congruence: number;
  visual: VisualProfile;
  language: string;
}

// Argument shape for the atomic complete_session() function (migration 0005).
export interface CompleteSessionArgs {
  p_email_encrypted: string;
  p_email_index: string;
  p_name: string | null;
  p_language: string;
  p_share_token: string;
  p_archetype: string;
  p_domain: string;
  p_dims: { dim1: number; dim2: number; dim3: number; dim4: number };
  p_congruence: number;
  p_visual: VisualProfile;
  p_phase1: Selections;
  p_phase2: Selections;
  p_open: { p1: Record<string, string>; p2: Record<string, string> } | null;
  p_policy_version: string;
  p_purpose: string;
  p_ip: string | null;
}
