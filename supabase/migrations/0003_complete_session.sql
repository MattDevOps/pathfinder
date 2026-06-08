-- Atomic "complete a quiz session" write path.
--
-- The funnel's terminal write touches five tables (users, sessions, answers,
-- results, consents). Doing that as separate client calls risks partial writes
-- on failure. A single function body is implicitly one transaction, so the
-- whole thing commits or rolls back together. The app calls this once, after
-- it has server-scored the answers and encrypted the email.
--
-- Inputs are pre-computed by trusted server code (PLAN.md section 3):
--   * p_email_encrypted / p_email_index  -> app-layer AES-GCM + HMAC (crypto.ts)
--   * p_dims / p_labels / p_title / p_cluster -> server scoring (results-record.ts)
--   * p_answers -> server-resolved [{question_id,dimension,selected_option,score}]
--
-- Called with the service role (which bypasses RLS); execution is revoked from
-- anon/authenticated so a leaked anon key cannot write.

create or replace function public.complete_session(
  p_email_encrypted text,
  p_email_index     text,
  p_name            text,
  p_language        text,
  p_share_token     text,
  p_dims            jsonb,
  p_labels          jsonb,
  p_title           text,
  p_cluster         text,
  p_answers         jsonb,
  p_policy_version  text,
  p_purpose         text,
  p_ip              text
)
returns text
language plpgsql
as $$
declare
  v_user_id    uuid;
  v_session_id uuid;
begin
  -- Identity table: one row per email (by blind index). Retakes reuse it.
  insert into users (email_encrypted, email_index, name, language)
  values (p_email_encrypted, p_email_index, p_name, coalesce(p_language, 'en'))
  on conflict (email_index) do update
    set name     = coalesce(excluded.name, users.name),
        language = excluded.language
  returning id into v_user_id;

  -- A fresh session per completed attempt.
  insert into sessions (user_id, status, completed_at, share_token)
  values (v_user_id, 'completed', now(), p_share_token)
  returning id into v_session_id;

  -- Server-scored answers. Idempotent per (session_id, question_id).
  insert into answers (session_id, question_id, dimension, selected_option, score)
  select v_session_id,
         a->>'question_id',
         a->>'dimension',
         a->>'selected_option',
         (a->>'score')::int
  from jsonb_array_elements(p_answers) as a
  on conflict (session_id, question_id) do update
    set dimension       = excluded.dimension,
        selected_option = excluded.selected_option,
        score           = excluded.score;

  -- Computed result, one per session.
  insert into results (
    session_id,
    dim1_score, dim2_score, dim3_score, dim4_score,
    dim1_label, dim2_label, dim3_label, dim4_label,
    profile_title, sector_cluster
  ) values (
    v_session_id,
    (p_dims->>'dim1')::int, (p_dims->>'dim2')::int,
    (p_dims->>'dim3')::int, (p_dims->>'dim4')::int,
    p_labels->>'dim1', p_labels->>'dim2',
    p_labels->>'dim3', p_labels->>'dim4',
    p_title, p_cluster
  );

  -- Consent log (GDPR / Israeli Privacy Law).
  insert into consents (user_id, policy_version, purpose, ip)
  values (v_user_id, p_policy_version, p_purpose, nullif(p_ip, '')::inet);

  return p_share_token;
end;
$$;

revoke execute on function public.complete_session(
  text, text, text, text, text, jsonb, jsonb, text, text, jsonb, text, text, text
) from public, anon, authenticated;
