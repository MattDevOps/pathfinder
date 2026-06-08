'use server';

import { headers } from 'next/headers';
import { QUESTIONS } from '@/data/questions';
import { buildResultRecord, isAnswerSetComplete } from '@/lib/results-record';
import { encryptEmail, emailBlindIndex, generateShareToken } from '@/lib/crypto';
import { createServiceClient } from '@/lib/supabase/server';
import type { CompleteSessionArgs } from '@/lib/supabase/types';
import type { CompleteSessionInput, CompleteSessionResult } from './contract';
import { PRIVACY_POLICY_VERSION } from '@/lib/privacy';
import { sendResultsEmail } from '@/lib/email';

// Terminal write of the funnel (the post-quiz email gate submits here). Runs on
// the server: it re-scores the answers from the questions source of truth,
// encrypts the email, and persists everything atomically via complete_session.
// The client's own scores are never trusted.

const SHARE_TOKEN_RETRIES = 3;

// Basic shape check; real deliverability is verified by the confirmation email.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function completeSession(
  input: CompleteSessionInput,
): Promise<CompleteSessionResult> {
  const email = input.email?.trim() ?? '';
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'invalid_email' };
  if (!input.consent) return { ok: false, error: 'consent_required' };

  // Server-authoritative scoring.
  const record = buildResultRecord(input.selections, QUESTIONS);
  if (!isAnswerSetComplete(record, QUESTIONS.length)) {
    return { ok: false, error: 'incomplete' };
  }

  const language = input.language === 'he' ? 'he' : 'en';
  const h = await headers();
  const ip = clientIp(h);
  const origin = requestOrigin(h);

  let supabase;
  try {
    supabase = createServiceClient();
  } catch (e) {
    console.error('[completeSession] supabase not configured', e);
    return { ok: false, error: 'server_error' };
  }

  const baseArgs: Omit<CompleteSessionArgs, 'p_share_token'> = {
    p_email_encrypted: encryptEmail(email),
    p_email_index: emailBlindIndex(email),
    p_name: input.name?.trim() || null,
    p_language: language,
    p_dims: record.dims,
    p_labels: record.labels,
    p_title: record.title,
    p_cluster: record.cluster,
    p_answers: record.answers,
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
        await sendResultsEmail(email, {
          name: input.name,
          title: record.title,
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
