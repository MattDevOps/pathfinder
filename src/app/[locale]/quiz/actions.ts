'use server';

import { headers } from 'next/headers';
import { buildResultRecord, isRunComplete } from '@/lib/results-record';
import { encryptEmail, emailBlindIndex, generateShareToken } from '@/lib/crypto';
import { createServiceClient } from '@/lib/supabase/server';
import type { CompleteSessionArgs } from '@/lib/supabase/types';
import type { CompleteSessionInput, CompleteSessionResult } from './contract';
import { PRIVACY_POLICY_VERSION } from '@/lib/privacy';
import { sendResultsEmail } from '@/lib/email';
import { SlidingWindowRateLimiter } from '@/lib/rate-limit';
import { ARCHETYPES } from '@/data/careers';
import { t } from '@/lib/localized';
import { locales } from '@/i18n/routing';

// Terminal write of the funnel (the post-quiz email gate submits here). Runs on
// the server: it re-scores the run from the data source of truth, encrypts the
// email, and persists everything atomically via complete_session. The client's
// own scores are never trusted.

const SHARE_TOKEN_RETRIES = 3;

// Abuse limits on the public submit (PLAN.md section 4: per-IP + per-email/day).
// Per-email uses the HMAC blind index as the key, not the plaintext address.
// In-process state — see rate-limit.ts on the multi-instance caveat.
const submitIpLimiter = new SlidingWindowRateLimiter({
  maxEvents: 10,
  windowMs: 10 * 60 * 1000, // 10 / 10 min per IP
});
const submitEmailLimiter = new SlidingWindowRateLimiter({
  maxEvents: 5,
  windowMs: 24 * 60 * 60 * 1000, // 5 / day per email (allows retakes, blocks bombing)
});

// Basic shape check; real deliverability is verified by the confirmation email.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function completeSession(
  input: CompleteSessionInput,
): Promise<CompleteSessionResult> {
  const email = input.email?.trim() ?? '';
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'invalid_email' };
  if (!input.consent) return { ok: false, error: 'consent_required' };

  // Server-authoritative scoring.
  if (!isRunComplete(input.visual, input.phase1, input.phase2)) {
    return { ok: false, error: 'incomplete' };
  }
  const record = buildResultRecord(input.visual, input.phase1, input.phase2);

  const language = (locales as readonly string[]).includes(input.language)
    ? input.language
    : 'it';
  const h = await headers();
  const ip = clientIp(h) ?? 'unknown';
  const origin = requestOrigin(h);

  // Abuse throttle: per-IP and per-email/day (keyed by blind index, not the
  // plaintext email). Record every submission that passes validation.
  const emailIndex = emailBlindIndex(email);
  const now = Date.now();
  if (
    submitIpLimiter.isBlocked(ip, now) ||
    submitEmailLimiter.isBlocked(emailIndex, now)
  ) {
    return { ok: false, error: 'rate_limited' };
  }
  submitIpLimiter.record(ip, now);
  submitEmailLimiter.record(emailIndex, now);

  let supabase;
  try {
    supabase = createServiceClient();
  } catch (e) {
    console.error('[completeSession] supabase not configured', e);
    return { ok: false, error: 'server_error' };
  }

  const baseArgs: Omit<CompleteSessionArgs, 'p_share_token'> = {
    p_email_encrypted: encryptEmail(email),
    p_email_index: emailIndex,
    p_name: input.name?.trim() || null,
    p_language: language,
    p_archetype: record.archetype,
    p_domain: record.domain,
    p_dims: {
      dim1: record.dims.d1,
      dim2: record.dims.d2,
      dim3: record.dims.d3,
      dim4: record.dims.d4,
    },
    p_congruence: record.congruence,
    p_visual: input.visual,
    p_phase1: input.phase1,
    p_phase2: input.phase2,
    p_open:
      input.openP1 || input.openP2
        ? { p1: input.openP1 ?? {}, p2: input.openP2 ?? {} }
        : null,
    p_policy_version: PRIVACY_POLICY_VERSION,
    p_purpose: 'results_delivery',
    p_ip: ip,
  };

  // Retry only on share-token collision (unique_violation on a random 256-bit
  // token — astronomically rare, but handled).
  for (let attempt = 0; attempt < SHARE_TOKEN_RETRIES; attempt++) {
    const shareToken = generateShareToken();
    const { data, error } = await supabase.rpc('complete_session', {
      ...baseArgs,
      p_share_token: shareToken,
    });

    if (!error) {
      const token = (data as string) ?? shareToken;
      // Best-effort results email — never block or fail the funnel on it.
      if (origin) {
        const arch = ARCHETYPES.find((a) => a.id === record.archetype);
        await sendResultsEmail(email, {
          name: input.name,
          title: arch ? t(arch.name, language) : 'Pathfinder',
          shareUrl: `${origin}/${language}/results/${token}`,
          locale: language,
        });
      }
      return { ok: true, shareToken: token };
    }
    if (error.code === '23505' && attempt < SHARE_TOKEN_RETRIES - 1) {
      continue; // token collision; try a new one
    }
    console.error('[completeSession] rpc failed', error);
    return { ok: false, error: 'server_error' };
  }

  return { ok: false, error: 'server_error' };
}

// Best-effort client IP from the proxy headers (for the consent record). Null
// when unavailable; the column is nullable.
function clientIp(h: Headers): string | null {
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return h.get('x-real-ip');
}

// Absolute origin for building the share URL in the results email. Null if the
// host header is missing (then we skip the email rather than send a broken link).
function requestOrigin(h: Headers): string | null {
  const host = h.get('x-forwarded-host') ?? h.get('host');
  if (!host) return null;
  const proto = h.get('x-forwarded-proto') ?? 'https';
  return `${proto}://${host}`;
}
