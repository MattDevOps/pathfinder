import {
  scryptSync,
  randomBytes,
  timingSafeEqual,
  createHmac,
} from 'node:crypto';

// Self-contained admin auth (single founder account), no external deps. Two
// pieces, both from node:crypto:
//
//   * password: scrypt KDF with a per-hash random salt. The hash string
//     (stored in ADMIN_PASSWORD_HASH) is `scrypt$<saltB64>$<hashB64>`. scrypt
//     is a memory-hard KDF built into Node, so we avoid a native bcrypt/argon2
//     dependency while keeping a real password hash (PLAN.md section 4).
//   * session: a minimal HS256 JWT signed with ADMIN_JWT_SECRET. The verifier
//     PINS alg=HS256 (rejects alg:none) and enforces expiry — the two classic
//     JWT footguns the security review called out.

// ---- password ------------------------------------------------------------

const SCRYPT_KEYLEN = 64;

export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, SCRYPT_KEYLEN);
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  const parts = stored.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const salt = Buffer.from(parts[1], 'base64');
  const expected = Buffer.from(parts[2], 'base64');
  if (expected.length !== SCRYPT_KEYLEN) return false;
  const actual = scryptSync(plain, salt, SCRYPT_KEYLEN);
  return timingSafeEqual(actual, expected);
}

// ---- session token (HS256 JWT) -------------------------------------------

export interface AdminTokenPayload {
  sub: string; // 'admin'
  iat: number; // issued-at (epoch seconds)
  exp: number; // expiry (epoch seconds)
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString('base64url');
}

function adminSecret(): Buffer {
  const raw = process.env.ADMIN_JWT_SECRET;
  if (!raw) throw new Error('ADMIN_JWT_SECRET is not set');
  if (Buffer.byteLength(raw, 'utf8') < 32) {
    throw new Error('ADMIN_JWT_SECRET must be at least 32 bytes');
  }
  return Buffer.from(raw, 'utf8');
}

function sign(data: string): string {
  return createHmac('sha256', adminSecret()).update(data).digest('base64url');
}

/** Sign a short-lived admin session token. `nowSeconds` is injectable for tests. */
export function signAdminToken(ttlSeconds: number, nowSeconds: number): string {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload: AdminTokenPayload = {
    sub: 'admin',
    iat: nowSeconds,
    exp: nowSeconds + ttlSeconds,
  };
  const body = b64url(JSON.stringify(payload));
  const signature = sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

/**
 * Verify a token: signature, pinned alg (HS256, never `none`), and expiry.
 * Returns the payload or null. `nowSeconds` is injectable for tests.
 */
export function verifyAdminToken(
  token: string,
  nowSeconds: number,
): AdminTokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, bodyB64, signatureB64] = parts;

  let header: { alg?: string };
  try {
    header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (header.alg !== 'HS256') return null; // reject alg:none and others

  const expected = sign(`${headerB64}.${bodyB64}`);
  const a = Buffer.from(signatureB64);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  let payload: AdminTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(bodyB64, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (payload.sub !== 'admin') return null;
  if (typeof payload.exp !== 'number' || payload.exp <= nowSeconds) return null;
  return payload;
}
