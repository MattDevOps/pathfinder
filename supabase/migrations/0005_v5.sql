-- v5 schema migration: Phase 0 visual + archetype x domain results.
--
-- The product pivoted from the 40-question dimension-label quiz to the v5 funnel
-- (see docs/pathfinder-v5-reference.html + docs/STATUS.md). Nothing is deployed
-- yet (the SQL is pglite-verified only), so we revise the result shape in place
-- rather than carrying the old columns forward. users/sessions/consents are
-- unchanged except for adding Italian as a language.

-- Italian is now the primary locale.
alter table users drop constraint if exists users_language_check;
alter table users
  add constraint users_language_check check (language in ('it','en','he'));
alter table users alter column language set default 'it';

-- The old granular per-answer table and dimension-label result table don't fit
-- v5 (multi-select across two phases + a visual profile). Replace them.
drop table if exists answers;
drop table if exists results;

create table results (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null unique references sessions(id) on delete cascade,
  archetype    varchar(20) not null
                 check (archetype in ('builder','specialist','creator','connector')),
  domain       varchar(3)  not null, -- DomainId (FIN, TEC, ...)
  dim1_score   int not null check (dim1_score between 0 and 100),
  dim2_score   int not null check (dim2_score between 0 and 100),
  dim3_score   int not null check (dim3_score between 0 and 100),
  dim4_score   int not null check (dim4_score between 0 and 100),
  congruence   int not null check (congruence between 0 and 100),
  -- Raw inputs kept for analytics + qualitative review (free-text answers).
  visual       jsonb not null,        -- Phase 0 profile
  phase1       jsonb not null,        -- { questionId: [optionId, ...] }
  phase2       jsonb not null,
  open_answers jsonb,                 -- optional { p1: {...}, p2: {...} }
  created_at   timestamptz not null default now()
);

-- Replace the v1 write path (different signature, so drop then recreate).
drop function if exists public.complete_session(
  text, text, text, text, text, jsonb, jsonb, text, text, jsonb, text, text, text
);

create or replace function public.complete_session(
  p_email_encrypted text,
  p_email_index     text,
  p_name            text,
  p_language        text,
  p_share_token     text,
  p_archetype       text,
  p_domain          text,
  p_dims            jsonb,
  p_congruence      int,
  p_visual          jsonb,
  p_phase1          jsonb,
  p_phase2          jsonb,
  p_open            jsonb,
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
  insert into users (email_encrypted, email_index, name, language)
  values (p_email_encrypted, p_email_index, p_name, coalesce(p_language, 'it'))
  on conflict (email_index) do update
    set name     = coalesce(excluded.name, users.name),
        language = excluded.language
  returning id into v_user_id;

  insert into sessions (user_id, status, completed_at, share_token)
  values (v_user_id, 'completed', now(), p_share_token)
  returning id into v_session_id;

  insert into results (
    session_id, archetype, domain,
    dim1_score, dim2_score, dim3_score, dim4_score,
    congruence, visual, phase1, phase2, open_answers
  ) values (
    v_session_id, p_archetype, p_domain,
    (p_dims->>'dim1')::int, (p_dims->>'dim2')::int,
    (p_dims->>'dim3')::int, (p_dims->>'dim4')::int,
    p_congruence, p_visual, p_phase1, p_phase2, p_open
  );

  insert into consents (user_id, policy_version, purpose, ip)
  values (v_user_id, p_policy_version, p_purpose, nullif(p_ip, '')::inet);

  return p_share_token;
end;
$$;

revoke execute on function public.complete_session(
  text, text, text, text, text, text, text, jsonb, int, jsonb, jsonb, jsonb, jsonb, text, text, text
) from public, anon, authenticated;

-- Refresh the admin listing for the v5 result shape.
drop function if exists public.admin_list_results(int);

create or replace function public.admin_list_results(p_limit int default 1000)
returns table (
  email_encrypted text,
  name           text,
  language       text,
  archetype      text,
  domain         text,
  dim1_score     int,
  dim2_score     int,
  dim3_score     int,
  dim4_score     int,
  congruence     int,
  share_token    text,
  created_at     timestamptz
)
language sql
as $$
  select u.email_encrypted, u.name, u.language,
         r.archetype, r.domain,
         r.dim1_score, r.dim2_score, r.dim3_score, r.dim4_score,
         r.congruence, s.share_token, r.created_at
  from results r
  join sessions s on s.id = r.session_id
  join users    u on u.id = s.user_id
  order by r.created_at desc
  limit p_limit
$$;

revoke execute on function public.admin_list_results(int) from public, anon, authenticated;

-- The recreated results table needs RLS re-enabled (deny-by-default; reads go
-- through the SECURITY DEFINER function below). The old `answers` table is gone.
alter table results enable row level security;

-- Public, read-only result-by-share-token for the v5 shape. Returns ONLY result
-- fields (archetype/domain/dims/congruence/visual) + language; never email,
-- raw answers, or user_id.
drop function if exists public.get_shared_result(text);

create or replace function public.get_shared_result(token text)
returns table (
  archetype text, domain text,
  dim1_score int, dim2_score int, dim3_score int, dim4_score int,
  congruence int, visual jsonb, language text
)
language sql
security definer
set search_path = public
as $$
  select r.archetype, r.domain,
         r.dim1_score, r.dim2_score, r.dim3_score, r.dim4_score,
         r.congruence, r.visual, u.language
  from sessions s
  join results r on r.session_id = s.id
  join users   u on u.id = s.user_id
  where s.share_token = token
    and s.status = 'completed'
$$;

grant execute on function public.get_shared_result(text) to anon, authenticated;
