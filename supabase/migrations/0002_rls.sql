-- Row-Level Security. Apply on Supabase (or any Postgres where the app
-- connects with a non-superuser role). This enforces the spec 5.2 privacy
-- rule at the DB boundary: the public share path can read a results row but
-- NEVER the answers or users tables.
--
-- Strategy: deny-by-default. The server uses the service_role key (which
-- bypasses RLS) for all writes and trusted reads. No table is reachable by
-- the anon/public key directly; the public results view is exposed through a
-- SECURITY DEFINER function keyed by share_token, so answers/email stay
-- private even if the anon key leaks.

alter table users    enable row level security;
alter table sessions enable row level security;
alter table answers  enable row level security;
alter table results  enable row level security;
alter table consents enable row level security;

-- No permissive policies are created for anon/authenticated => deny by
-- default. All access goes through the service role (server) or the function
-- below. (Tests must assert anon cannot select from answers/users.)

-- Public, read-only results-by-share-token. Returns ONLY result fields and
-- the language; no email, no answers, no user_id.
create or replace function public.get_shared_result(token text)
returns table (
  dim1_score int, dim2_score int, dim3_score int, dim4_score int,
  dim1_label text, dim2_label text, dim3_label text, dim4_label text,
  profile_title text, sector_cluster text, language text
)
language sql
security definer
set search_path = public
as $$
  select r.dim1_score, r.dim2_score, r.dim3_score, r.dim4_score,
         r.dim1_label, r.dim2_label, r.dim3_label, r.dim4_label,
         r.profile_title, r.sector_cluster, u.language
  from sessions s
  join results r on r.session_id = s.id
  join users   u on u.id = s.user_id
  where s.share_token = token
    and s.status = 'completed'
$$;

grant execute on function public.get_shared_result(text) to anon, authenticated;
