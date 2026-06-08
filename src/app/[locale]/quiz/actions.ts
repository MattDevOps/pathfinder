'use server';

import { headers } from 'next/headers';
import { QUESTIONS } from '@/data/questions';
import { buildResultRecord, isAnswerSetComplete } from '@/lib/results-record';
import { encryptEmail, emailBlindIndex, generateShareToken } from '@/lib/crypto';
import { createServiceClient } from '@/lib/supabase/server';
import type { CompleteSessionArgs } from '@/lib/supabase/types';
import type { CompleteSessionInput, CompleteSessionResult } from './contract';
import { PRIVACY_POLICY_VERSION } from '@/lib/privacy';

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
  const ip = await clientIp();

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
      return { ok: true, shareToken: (data as string) ?? shareToken };
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
async function clientIp(): Promise<string | null> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return h.get('x-real-ip');
}
