'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyPassword } from '@/lib/admin-auth';
import { setAdminSession, clearAdminSession } from '@/lib/admin-session';
import { SlidingWindowRateLimiter } from '@/lib/rate-limit';

// Admin login/logout. Single-account: the password is checked against the
// scrypt hash in ADMIN_PASSWORD_HASH. On success we set a signed session cookie
// and redirect into the dashboard.
//
// Per-IP failed-login throttle. In-process state: on Fluid Compute instances
// are reused so this is meaningful for a single-admin login; a multi-instance
// deployment should back it with a shared store (Upstash/DB) behind the same
// interface (see rate-limit.ts).
const loginLimiter = new SlidingWindowRateLimiter({
  maxEvents: 5,
  windowMs: 15 * 60 * 1000,
});

export type LoginResult = {
  ok: false;
  error: 'invalid' | 'not_configured' | 'rate_limited';
};

export async function login(
  locale: string,
  password: string,
): Promise<LoginResult> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash || !process.env.ADMIN_JWT_SECRET) {
    return { ok: false, error: 'not_configured' };
  }

  const ip = await loginIp();
  const now = Date.now();
  if (loginLimiter.isBlocked(ip, now)) {
    return { ok: false, error: 'rate_limited' };
  }

  if (!verifyPassword(password, hash)) {
    loginLimiter.record(ip, now);
    return { ok: false, error: 'invalid' };
  }

  loginLimiter.reset(ip);
  await setAdminSession();
  redirect(`/${locale}/admin`); // throws NEXT_REDIRECT; never returns
}

async function loginIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0].trim() : h.get('x-real-ip')) || 'unknown';
}

export async function logout(locale: string): Promise<void> {
  await clearAdminSession();
  redirect(`/${locale}/admin/login`);
}
