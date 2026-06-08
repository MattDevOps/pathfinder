'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/routing';
import { login } from '../actions';

// Minimal admin login. On success the server action redirects, so we only
// handle the failure cases here.
export default function LoginForm({ locale }: { locale: Locale }) {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await login(locale, password);
      // Only reached on failure (success redirects server-side).
      const message = {
        not_configured:
          'Admin login is not configured (set ADMIN_PASSWORD_HASH and ADMIN_JWT_SECRET).',
        rate_limited: 'Too many attempts. Please wait a few minutes and try again.',
        invalid: 'Incorrect password.',
      }[res.error];
      setError(message);
    } catch (err) {
      // A thrown NEXT_REDIRECT is the success path — let it propagate.
      if (
        err &&
        typeof err === 'object' &&
        'digest' in err &&
        String((err as { digest?: string }).digest).startsWith('NEXT_REDIRECT')
      ) {
        throw err;
      }
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-12">
      <h1 className="text-2xl font-bold">Admin</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="rounded-xl border border-foreground/20 px-4 py-2.5 text-base"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-foreground px-6 py-3 font-medium text-background transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
