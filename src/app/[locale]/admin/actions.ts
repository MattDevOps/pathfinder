'use server';

import { redirect } from 'next/navigation';
import { verifyPassword } from '@/lib/admin-auth';
import { setAdminSession, clearAdminSession } from '@/lib/admin-session';

// Admin login/logout. Single-account: the password is checked against the
// scrypt hash in ADMIN_PASSWORD_HASH. On success we set a signed session cookie
// and redirect into the dashboard.
//
// TODO(security): add per-IP rate limiting on failed logins before launch
// (PLAN.md section 4). Serverless makes in-memory counters unreliable, so this
// belongs in a shared store (e.g. the DB or Upstash).

export type LoginResult = { ok: false; error: 'invalid' | 'not_configured' };

export async function login(
  locale: string,
  password: string,
): Promise<LoginResult> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash || !process.env.ADMIN_JWT_SECRET) {
    return { ok: false, error: 'not_configured' };
  }
  if (!verifyPassword(password, hash)) {
    return { ok: false, error: 'invalid' };
  }
  await setAdminSession();
  redirect(`/${locale}/admin`); // throws NEXT_REDIRECT; never returns
}

export async function logout(locale: string): Promise<void> {
  await clearAdminSession();
  redirect(`/${locale}/admin/login`);
}
