-- Pathfinder initial schema.
-- Portable Postgres: runs on Supabase OR AWS RDS (the residency decision is
-- still open, see docs/FOUNDER-QUESTIONS.md D13). Avoids provider-specific
-- syntax. RLS policies live in 0002_rls.sql (apply only on Supabase).
--
-- Incorporates the PLAN.md fixes over the spec's section 5 schema:
--   * email stored ENCRYPTED, not plaintext-unique (security lens)
--   * a separate HMAC blind-index column gives uniqueness/lookup (privacy)
--   * answers are idempotent per (session_id, question_id) (backend lens)
--   * explicit consent record for GDPR / Israeli Privacy Law

create extension if not exists pgcrypto; -- gen_random_uuid()

-- Identity table. One row per email (case-folded), supports retakes by
-- attaching new sessions to the same user.
create table users (
  id              uuid primary key default gen_random_uuid(),
  -- App-layer AES-256-GCM ciphertext of the email (recoverable for sending
  -- mail + admin display). Never store plaintext here.
  email_encrypted text        not null,
  -- HMAC-SHA256(email) for uniqueness + lookup without decryption.
  email_index     text        not null unique,
  name            text,
  language        varchar(5)  not null default 'en' check (language in ('en','he')),
  created_at      timestamptz not null default now()
);

-- One quiz attempt.
create table sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references users(id) on delete cascade,
  started_at   timestamptz not null default now(),
  completed_at timestamptz,
  status       varchar(20) not null default 'in_progress'
                 check (status in ('in_progress','completed')),
  -- High-entropy capability token for the public share link. Generated with
  -- a CSPRNG in app code (crypto.randomBytes), not the DB.
  share_token  varchar(43) unique
);

-- Recorded answers. dimension + score are written by the SERVER from the
-- questions source of truth, never trusted from the client.
create table answers (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references sessions(id) on delete cascade,
  question_id     varchar(10) not null,
  dimension       varchar(10) not null check (dimension in ('DIM_1','DIM_2','DIM_3','DIM_4')),
  selected_option varchar(1)  not null check (selected_option in ('A','B','C','D')),
  score           int         not null check (score between 0 and 3),
  answered_at     timestamptz not null default now(),
  -- Idempotency: one answer per question per session (re-answer = upsert).
  unique (session_id, question_id)
);

-- Computed result, one per session.
create table results (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null unique references sessions(id) on delete cascade,
  dim1_score     int not null check (dim1_score between 0 and 100),
  dim2_score     int not null check (dim2_score between 0 and 100),
  dim3_score     int not null check (dim3_score between 0 and 100),
  dim4_score     int not null check (dim4_score between 0 and 100),
  dim1_label     varchar(50) not null,
  dim2_label     varchar(50) not null,
  dim3_label     varchar(50) not null,
  dim4_label     varchar(50) not null,
  profile_title  varchar(100) not null,
  sector_cluster varchar(50)  not null,
  created_at     timestamptz not null default now()
);

-- Consent log for GDPR / Israeli Privacy Law (security lens).
create table consents (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users(id) on delete cascade,
  policy_version varchar(20) not null,
  purpose       varchar(40) not null, -- 'results_delivery' | 'marketing'
  consented_at  timestamptz not null default now(),
  ip            inet
);

create index sessions_user_id_idx   on sessions(user_id);
create index answers_session_id_idx on answers(session_id);
create index sessions_share_token_idx on sessions(share_token);
