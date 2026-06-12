import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';

// Integration test for the DB write/read path against a REAL Postgres engine
// (pglite, in-process WASM — no Docker). This is the only place the SQL in
// supabase/migrations actually runs, so it guards the scariest unverified code:
// the v5 complete_session plpgsql function, the get_shared_result privacy
// contract, and the RLS deny-by-default boundary (PLAN.md sections 4-5).
//
// We recreate Supabase's pre-provisioned roles (anon/authenticated/service_role)
// so the GRANT/REVOKE statements and RLS role-switching behave as in production.

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
  await db.exec(readMigration('0004_admin_list.sql'));
  await db.exec(readMigration('0005_v5.sql'));
  return db;
}

interface CompleteArgs {
  emailIndex?: string;
  emailEncrypted?: string;
  name?: string | null;
  language?: string;
  shareToken?: string;
  archetype?: string;
  domain?: string;
  ip?: string | null;
}

async function callComplete(db: PGlite, args: CompleteArgs = {}) {
  const {
    emailEncrypted = 'ENC',
    emailIndex = 'idx-default',
    name = 'Alice',
    language = 'it',
    shareToken = 'tok_default',
    archetype = 'creator',
    domain = 'ART',
    ip = '203.0.113.7',
  } = args;

  return db.query<{ token: string }>(
    `select public.complete_session(
       $1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::int,$10::jsonb,$11::jsonb,$12::jsonb,$13::jsonb,$14,$15,$16
     ) as token`,
    [
      emailEncrypted,
      emailIndex,
      name,
      language,
      shareToken,
      archetype,
      domain,
      JSON.stringify({ dim1: 72, dim2: 28, dim3: 81, dim4: 55 }),
      88,
      JSON.stringify({ colors: ['blu', 'verde'], shape: 'lightning', space: 'creative', stimulus: 'art' }),
      JSON.stringify({ p1q01: ['o1'] }),
      JSON.stringify({ p2q01: ['o3'] }),
      JSON.stringify({ p1: { p1q01: 'note' }, p2: {} }),
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
  it('apply cleanly in order (0001 -> 0005)', async () => {
    await expect(migratedDb()).resolves.toBeTruthy();
  });
});

describe('complete_session (v5)', () => {
  let db: PGlite;
  beforeEach(async () => {
    db = await migratedDb();
  });

  it('writes one row across users/sessions/results/consents and returns the token', async () => {
    const res = await callComplete(db, { shareToken: 'tok_1', emailIndex: 'idx-1' });
    expect(res.rows[0].token).toBe('tok_1');
    expect(await count(db, 'users')).toBe(1);
    expect(await count(db, 'sessions')).toBe(1);
    expect(await count(db, 'results')).toBe(1);
    expect(await count(db, 'consents')).toBe(1);
  });

  it('stores the archetype, domain, dims, congruence, and raw inputs', async () => {
    await callComplete(db, { shareToken: 'tok_1', emailIndex: 'idx-1' });
    const r = await db.query<{
      archetype: string;
      domain: string;
      dim1_score: number;
      congruence: number;
      visual: { shape: string };
      open_answers: { p1: Record<string, string> };
    }>(`select archetype, domain, dim1_score, congruence, visual, open_answers from results`);
    expect(r.rows[0].archetype).toBe('creator');
    expect(r.rows[0].domain).toBe('ART');
    expect(r.rows[0].dim1_score).toBe(72);
    expect(r.rows[0].congruence).toBe(88);
    expect(r.rows[0].visual.shape).toBe('lightning');
    expect(r.rows[0].open_answers.p1.p1q01).toBe('note');
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
    expect(keys).toContain('archetype');
    expect(keys).toContain('congruence');
    expect(keys).toContain('language');
    // No PII / identifiers leak through the public path.
    for (const k of keys) {
      expect(k).not.toMatch(/email|user|ip|consent|token|phase|open/i);
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

describe('admin_list_results (v5)', () => {
  let db: PGlite;
  beforeEach(async () => {
    db = await migratedDb();
  });

  it('returns completed results with the encrypted email, newest first', async () => {
    await callComplete(db, { emailIndex: 'idx-a', shareToken: 'tok_a', emailEncrypted: 'ENC_A' });
    await callComplete(db, { emailIndex: 'idx-b', shareToken: 'tok_b', emailEncrypted: 'ENC_B' });

    const r = await db.query<{ email_encrypted: string; share_token: string; archetype: string }>(
      `select email_encrypted, share_token, archetype from public.admin_list_results(100)`,
    );
    expect(r.rows).toHaveLength(2);
    // Emails are returned as ciphertext only (decryption happens in the app).
    expect(r.rows.map((x) => x.email_encrypted).sort()).toEqual(['ENC_A', 'ENC_B']);
    expect(r.rows.every((x) => x.archetype === 'creator')).toBe(true);
  });

  it('is not executable by anon', async () => {
    await db.exec(`set role anon`);
    await expect(db.query(`select * from public.admin_list_results(10)`)).rejects.toThrow();
    await db.exec(`reset role`);
  });
});

describe('RLS deny-by-default boundary', () => {
  let db: PGlite;
  beforeEach(async () => {
    db = await migratedDb();
    await callComplete(db, { shareToken: 'share_me', emailIndex: 'idx-1' });
  });

  it('anon cannot read results or users directly', async () => {
    await db.exec(`set role anon`);
    await expect(db.query(`select * from results`)).rejects.toThrow();
    await expect(db.query(`select * from users`)).rejects.toThrow();
    await db.exec(`reset role`);
  });

  it('anon CAN read a shared result via the SECURITY DEFINER function', async () => {
    await db.exec(`set role anon`);
    const r = await db.query(`select archetype from public.get_shared_result($1)`, ['share_me']);
    expect(r.rows).toHaveLength(1);
    await db.exec(`reset role`);
  });
});
