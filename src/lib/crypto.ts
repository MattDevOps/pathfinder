import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';

// Server-only PII crypto (security lens, PLAN.md section 4):
//   * email is stored as AES-256-GCM ciphertext (recoverable to send mail and
//     show in the admin CSV) — never plaintext, never a bare hash.
//   * a separate HMAC-SHA256 blind index gives uniqueness + lookup without
//     decrypting every row.
//   * share tokens are 256-bit CSPRNG capability strings.
//
// Keys come from the environment and are read lazily so importing this module
// (e.g. during `next build` of an unrelated route) does not crash when secrets
// are absent. They throw only when crypto is actually used.

const KEY_ENV = 'EMAIL_ENCRYPTION_KEY';
const HMAC_ENV = 'EMAIL_INDEX_HMAC_SECRET';

function encryptionKey(): Buffer {
  const raw = process.env[KEY_ENV];
  if (!raw) throw new Error(`${KEY_ENV} is not set`);
  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) {
    throw new Error(`${KEY_ENV} must decode to 32 bytes (got ${key.length})`);
  }
  return key;
}

function hmacSecret(): Buffer {
  const raw = process.env[HMAC_ENV];
  if (!raw) throw new Error(`${HMAC_ENV} is not set`);
  return Buffer.from(raw, 'utf8');
}

// Case-fold + trim before any keyed operation so "A@B.com" and "a@b.com " map
// to the same blind index and ciphertext-input.
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

const IV_BYTES = 12; // GCM standard nonce length

/**
 * AES-256-GCM encrypt. Output: base64url(iv).base64url(tag).base64url(cipher),
 * a single self-describing string that fits the `users.email_encrypted` column.
 */
export function encryptEmail(email: string): string {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const enc = Buffer.concat([
    cipher.update(normalizeEmail(email), 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [
    iv.toString('base64url'),
    tag.toString('base64url'),
    enc.toString('base64url'),
  ].join('.');
}

/** Reverse encryptEmail. Throws if the payload is malformed or tampered. */
export function decryptEmail(payload: string): string {
  const parts = payload.split('.');
  if (parts.length !== 3) throw new Error('malformed ciphertext');
  const [ivB64, tagB64, dataB64] = parts;
  const decipher = createDecipheriv(
    'aes-256-gcm',
    encryptionKey(),
    Buffer.from(ivB64, 'base64url'),
  );
  decipher.setAuthTag(Buffer.from(tagB64, 'base64url'));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
}

/** Deterministic HMAC-SHA256 blind index, hex. Same email -> same index. */
export function emailBlindIndex(email: string): string {
  return createHmac('sha256', hmacSecret())
    .update(normalizeEmail(email))
    .digest('hex');
}

/** Constant-time compare of two blind indexes (hex of equal length). */
export function blindIndexEquals(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/**
 * 256-bit capability token for the public share link. base64url of 32 random
 * bytes = 43 chars, matching `sessions.share_token varchar(43)`.
 */
export function generateShareToken(): string {
  return randomBytes(32).toString('base64url');
}
