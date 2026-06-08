import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';

// Integration test for the DB write/read path against a REAL Postgres engine
// (pglite, in-process WASM — no Docker). This is the only place the SQL in
// supabase/migrations actually runs, so it guards the scariest unverified code:
// the complete_session plpgsql function, the get_shared_result privacy contract,
// and the RLS deny-by-default boundary (PLAN.md sections 4-5).
//
// We recreate Supabase's pre-provisioned roles (anon/authenticated/service_role)
// so the GRANT/REVOKE statements and RLS role-switching behave as they will in
// production.

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'supabase/migrations');
const readMigration = (file: string) =>
  readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

async function migratedDb(): Promise<PGlite> {
  const db = new PGlite({ extensions: { pgcrypto } });
  await db.exec(readMigration('0001_init.sql'));
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    grant usage on schema public to anon, authenticated;
  `);
  await db.exec(readMigration('0002_rls.sql'));
  await db.exec(readMigration('0003_complete_session.sql'));
  return db;
}

interface CompleteArgs {
  emailIndex?: string;
  emailEncrypted?: string;
  name?: string | null;
  language?: string;
  shareToken?: string;
  answers?: Array<{ question_id: string; dimension: string; selected_option: string; score: number }>;
  ip?: string | null;
}

async function callComplete(db: PGlite, args: CompleteArgs = {}) {
  const {
    emailEncrypted = 'ENC',
    emailIndex = 'idx-default',
    name = 'Alice',
    language = 'en',
    shareToken = 'tok_default',
    answers = [
      { question_id: 'Q001', dimension: 'DIM_1', selected_option: 'C', score: 2 },
      { question_id: 'Q002', dimension: 'DIM_1', selected_option: 'D', score: 3 },
    ],
    ip = '203.0.113.7',
  } = args;

  return db.query<{ token: string }>(
    `select public.complete_session($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8,$9,$10::jsonb,$11,$12,$13) as token`,
    [
      emailEncrypted,
      emailIndex,
      name,
      language,
      shareToken,
      JSON.stringify({ dim1: 72, dim2: 28, dim3: 81, dim4: 55 }),
      JSON.stringify({
        dim1: 'Conceptual Visionary',
        dim2: 'Independent Operator',
        dim3: 'Creative Pioneer',
        dim4: 'Calculated Risk-Taker',
      }),
      'The Innovator',
      'Innovation & Creativity',
      JSON.stringify(answers),
      '2026-06-draft',
      'results_delivery',
      ip,
    ],
  );
}

async function count(db: PGlite, table: string): Promise<number> {
  const r = await db.query<{ n: number }>(`select count(*)::int as n from ${table}`);
  return r.rows[0].n;
}

describe('migrations', () => {
  it('apply cleanly in order (0001 -> 0002 -> 0003)', async () => {
    await expect(migratedDb()).resolves.toBeTruthy();
  });
});

describe('complete_session', () => {
  let db: PGlite;
  beforeEach(async () => {
    db = await migratedDb();
  });

  it('writes one row across all five tables and returns the token', async () => {
    const res = await callComplete(db, { shareToken: 'tok_1', emailIndex: 'idx-1' });
    expect(res.rows[0].token).toBe('tok_1');
    expect(await count(db, 'users')).toBe(1);
    expect(await count(db, 'sessions')).toBe(1);
    expect(await count(db, 'answers')).toBe(2);
    expect(await count(db, 'results')).toBe(1);
    expect(await count(db, 'consents')).toBe(1);
  });

  it('marks the session completed and stores the IP as inet', async () => {
    await callComplete(db, { shareToken: 'tok_1', emailIndex: 'idx-1' });
    const s = await db.query<{ status: string; completed_at: string | null }>(
      `select status, completed_at from sessions`,
    );
    expect(s.rows[0].status).toBe('completed');
    expect(s.rows[0].completed_at).not.toBeNull();
    const c = await db.query<{ ip: string }>(`select host(ip) as ip from consents`);
    expect(c.rows[0].ip).toBe('203.0.113.7');
  });

  it('a retake (same email index) reuses the user and adds a session', async () => {
    await callComplete(db, { emailIndex: 'same', shareToken: 'tok_a' });
    await callComplete(db, { emailIndex: 'same', shareToken: 'tok_b', name: 'Alicia' });
    expect(await count(db, 'users')).toBe(1);
    expect(await count(db, 'sessions')).toBe(2);
    const u = await db.query<{ name: string }>(`select name from users`);
    expect(u.rows[0].name).toBe('Alicia'); // upsert refreshes the name
  });

  it('rejects a duplicate share token (so the action can retry)', async () => {
    await callComplete(db, { shareToken: 'dup', emailIndex: 'idx-1' });
    await expect(
      callComplete(db, { shareToken: 'dup', emailIndex: 'idx-2' }),
    ).rejects.toThrow(/unique|duplicate/i);
  });

  it('extracts dimension, option, and score for each answer from the jsonb', async () => {
    await callComplete(db, {
      shareToken: 'tok_1',
      emailIndex: 'idx-1',
      answers: [
        { question_id: 'Q005', dimension: 'DIM_2', selected_option: 'B', score: 1 },
        { question_id: 'Q031', dimension: 'DIM_4', selected_option: 'C', score: 2 },
      ],
    });
    const a = await db.query<{
      question_id: string;
      dimension: string;
      selected_option: string;
      score: number;
    }>(`select question_id, dimension, selected_option, score from answers order by question_id`);
    expect(a.rows).toEqual([
      { question_id: 'Q005', dimension: 'DIM_2', selected_option: 'B', score: 1 },
      { question_id: 'Q031', dimension: 'DIM_4', selected_option: 'C', score: 2 },
    ]);
  });
});

describe('get_shared_result (privacy contract)', () => {
  let db: PGlite;
  beforeEach(async () => {
    db = await migratedDb();
    await callComplete(db, { shareToken: 'share_me', emailIndex: 'idx-1' });
  });

  it('returns only result fields + language for a completed session', async () => {
    const r = await db.query<Record<string, unknown>>(
      `select * from public.get_shared_result($1)`,
      ['share_me'],
    );
    expect(r.rows).toHaveLength(1);
    const keys = Object.keys(r.rows[0]);
    expect(keys).toContain('profile_title');
    expect(keys).toContain('language');
    // No PII / answers / identifiers leak through the public path.
    for (const k of keys) {
      expect(k).not.toMatch(/email|answer|user|ip|consent|token/i);
    }
  });

  it('returns nothing for an unknown token', async () => {
    const r = await db.query(`select * from public.get_shared_result($1)`, ['nope']);
    expect(r.rows).toHaveLength(0);
  });

  it('returns nothing for a session that is not completed', async () => {
    await db.exec(`update sessions set status = 'in_progress'`);
    const r = await db.query(`select * from public.get_shared_result($1)`, ['share_me']);
    expect(r.rows).toHaveLength(0);
  });
});

describe('RLS deny-by-default boundary', () => {
  let db: PGlite;
  beforeEach(async () => {
    db = await migratedDb();
    await callComplete(db, { shareToken: 'share_me', emailIndex: 'idx-1' });
  });

  it('anon cannot read answers or users', async () => {
    await db.exec(`set role anon`);
    await expect(db.query(`select * from answers`)).rejects.toThrow();
    await expect(db.query(`select * from users`)).rejects.toThrow();
    await db.exec(`reset role`);
  });

  it('anon CAN read a shared result via the SECURITY DEFINER function', async () => {
    await db.exec(`set role anon`);
    const r = await db.query(`select profile_title from public.get_shared_result($1)`, ['share_me']);
    expect(r.rows).toHaveLength(1);
    await db.exec(`reset role`);
  });
});
