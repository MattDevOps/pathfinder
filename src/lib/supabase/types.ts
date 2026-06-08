// Hand-written, minimal typing for the database surface the app touches. Not
// the full generated Supabase types (no live project to generate from yet) —
// just enough to type the two RPCs the funnel uses. Regenerate with
// `supabase gen types typescript` once a project exists.

export interface SharedResultRow {
  dim1_score: number;
  dim2_score: number;
  dim3_score: number;
  dim4_score: number;
  dim1_label: string;
  dim2_label: string;
  dim3_label: string;
  dim4_label: string;
  profile_title: string;
  sector_cluster: string;
  language: string;
}

// Argument shape for the atomic complete_session() function (migration 0003).
export interface CompleteSessionArgs {
  p_email_encrypted: string;
  p_email_index: string;
  p_name: string | null;
  p_language: string;
  p_share_token: string;
  p_dims: { dim1: number; dim2: number; dim3: number; dim4: number };
  p_labels: { dim1: string; dim2: string; dim3: string; dim4: string };
  p_title: string;
  p_cluster: string;
  p_answers: Array<{
    question_id: string;
    dimension: string;
    selected_option: string;
    score: number;
  }>;
  p_policy_version: string;
  p_purpose: string;
  p_ip: string | null;
}
