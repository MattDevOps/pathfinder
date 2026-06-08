import { describe, it, expect, beforeAll } from 'vitest';
import { randomBytes } from 'node:crypto';
import {
  encryptEmail,
  decryptEmail,
  emailBlindIndex,
  blindIndexEquals,
  generateShareToken,
  normalizeEmail,
} from './crypto';

beforeAll(() => {
  // Deterministic test keys (not used in any real environment).
  process.env.EMAIL_ENCRYPTION_KEY = randomBytes(32).toString('base64');
  process.env.EMAIL_INDEX_HMAC_SECRET = 'test-hmac-secret';
});

describe('email encryption (AES-256-GCM)', () => {
  it('round-trips to the normalized email', () => {
    const cipher = encryptEmail('Alice@Example.com');
    expect(decryptEmail(cipher)).toBe('alice@example.com');
  });

  it('produces a fresh IV each call (ciphertext differs)', () => {
    const a = encryptEmail('a@b.com');
    const b = encryptEmail('a@b.com');
    expect(a).not.toBe(b);
    expect(decryptEmail(a)).toBe(decryptEmail(b));
  });

  it('rejects a tampered ciphertext (auth tag)', () => {
    const cipher = encryptEmail('a@b.com');
    const [iv, tag, data] = cipher.split('.');
    const flipped = data[0] === 'A' ? 'B' : 'A';
    const tampered = [iv, tag, flipped + data.slice(1)].join('.');
    expect(() => decryptEmail(tampered)).toThrow();
  });

  it('rejects a malformed payload', () => {
    expect(() => decryptEmail('nope')).toThrow('malformed ciphertext');
  });
});

describe('blind index (HMAC-SHA256)', () => {
  it('is deterministic and case/whitespace-insensitive', () => {
    expect(emailBlindIndex(' A@B.com ')).toBe(emailBlindIndex('a@b.com'));
  });

  it('differs for different emails', () => {
    expect(emailBlindIndex('a@b.com')).not.toBe(emailBlindIndex('c@d.com'));
  });

  it('blindIndexEquals matches identical indexes', () => {
    expect(blindIndexEquals(emailBlindIndex('a@b.com'), emailBlindIndex('a@b.com'))).toBe(true);
    expect(blindIndexEquals(emailBlindIndex('a@b.com'), emailBlindIndex('x@y.com'))).toBe(false);
  });
});

describe('share token', () => {
  it('is 43 url-safe chars (256-bit) and unique', () => {
    const a = generateShareToken();
    const b = generateShareToken();
    expect(a).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(a).not.toBe(b);
  });
});

describe('normalizeEmail', () => {
  it('trims and lowercases', () => {
    expect(normalizeEmail('  Foo@Bar.COM ')).toBe('foo@bar.com');
  });
});
