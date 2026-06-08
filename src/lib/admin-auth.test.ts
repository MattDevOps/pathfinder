import { describe, it, expect, beforeAll } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  signAdminToken,
  verifyAdminToken,
} from './admin-auth';

beforeAll(() => {
  process.env.ADMIN_JWT_SECRET = 'x'.repeat(40); // >= 32 bytes
});

describe('password hashing (scrypt)', () => {
  it('round-trips the correct password', () => {
    const stored = hashPassword('hunter2!');
    expect(verifyPassword('hunter2!', stored)).toBe(true);
  });

  it('rejects the wrong password', () => {
    const stored = hashPassword('hunter2!');
    expect(verifyPassword('wrong', stored)).toBe(false);
  });

  it('uses a fresh salt each time (hashes differ)', () => {
    expect(hashPassword('same')).not.toBe(hashPassword('same'));
  });

  it('rejects a malformed stored hash', () => {
    expect(verifyPassword('x', 'not-a-hash')).toBe(false);
    expect(verifyPassword('x', 'bcrypt$a$b')).toBe(false);
  });
});

describe('admin session token (HS256 JWT)', () => {
  const now = 1_000_000;

  it('verifies a freshly signed token', () => {
    const token = signAdminToken(3600, now);
    const payload = verifyAdminToken(token, now + 10);
    expect(payload?.sub).toBe('admin');
  });

  it('rejects an expired token', () => {
    const token = signAdminToken(3600, now);
    expect(verifyAdminToken(token, now + 3601)).toBeNull();
  });

  it('rejects a tampered payload', () => {
    const token = signAdminToken(3600, now);
    const [h, , s] = token.split('.');
    const forged = Buffer.from(JSON.stringify({ sub: 'admin', iat: now, exp: now + 99999 })).toString('base64url');
    expect(verifyAdminToken(`${h}.${forged}.${s}`, now)).toBeNull();
  });

  it('rejects alg:none', () => {
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify({ sub: 'admin', iat: now, exp: now + 3600 })).toString('base64url');
    // no signature
    expect(verifyAdminToken(`${header}.${body}.`, now)).toBeNull();
  });

  it('rejects a token signed with a different secret', () => {
    const token = signAdminToken(3600, now);
    process.env.ADMIN_JWT_SECRET = 'y'.repeat(40);
    const result = verifyAdminToken(token, now);
    process.env.ADMIN_JWT_SECRET = 'x'.repeat(40); // restore
    expect(result).toBeNull();
  });
});
