-- Admin results listing for the dashboard + CSV export.
--
-- Returns each completed result joined to its user, including the ENCRYPTED
-- email (the app decrypts it for display/export — the DB never sees plaintext).
-- Called with the service role, which bypasses RLS; execution is revoked from
-- anon/authenticated so the anon key can never enumerate users.

create or replace function public.admin_list_results(p_limit int default 1000)
returns table (
  email_encrypted text,
  name           text,
  language       text,
  profile_title  text,
  sector_cluster text,
  dim1_score     int,
  dim2_score     int,
  dim3_score     int,
  dim4_score     int,
  share_token    text,
  created_at     timestamptz
)
language sql
as $$
  select u.email_encrypted, u.name, u.language,
         r.profile_title, r.sector_cluster,
         r.dim1_score, r.dim2_score, r.dim3_score, r.dim4_score,
         s.share_token, r.created_at
  from results r
  join sessions s on s.id = r.session_id
  join users    u on u.id = s.user_id
  order by r.created_at desc
  limit p_limit
$$;

revoke execute on function public.admin_list_results(int) from public, anon, authenticated;
