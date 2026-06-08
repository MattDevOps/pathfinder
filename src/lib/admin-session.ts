import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  signAdminToken,
  verifyAdminToken,
  type AdminTokenPayload,
} from './admin-auth';

// Server-side admin session: a signed HS256 token in an httpOnly cookie. The
// crypto lives in admin-auth.ts (unit-tested); this module is the Next.js glue
// (cookies + redirect) and is only imported by server code.

const COOKIE = 'pf_admin';
const TTL_SECONDS = 8 * 60 * 60; // short-lived admin session

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export async function setAdminSession(): Promise<void> {
  const token = signAdminToken(TTL_SECONDS, nowSeconds());
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TTL_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    return verifyAdminToken(token, nowSeconds());
  } catch {
    // ADMIN_JWT_SECRET missing/invalid -> treat as unauthenticated
    return null;
  }
}

/** Guard for admin pages/routes: redirect to login when not authenticated. */
export async function requireAdmin(locale: string): Promise<AdminTokenPayload> {
  const session = await getAdminSession();
  if (!session) redirect(`/${locale}/admin/login`);
  return session;
}
