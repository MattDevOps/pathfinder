import { createServiceClient } from './supabase/server';
import { decryptEmail } from './crypto';
import type { ResultExportRecord } from './csv';

// Admin data access. Reads completed results via the admin_list_results RPC
// (migration 0004) with the service-role client, then decrypts each email in
// the app (the DB only ever holds ciphertext). Server-only.

export interface AdminResultRow extends ResultExportRecord {
  share_token: string;
}

interface RawRow {
  email_encrypted: string;
  name: string | null;
  language: string;
  profile_title: string;
  sector_cluster: string;
  dim1_score: number;
  dim2_score: number;
  dim3_score: number;
  dim4_score: number;
  share_token: string;
  created_at: string;
}

function safeDecrypt(ciphertext: string): string {
  try {
    return decryptEmail(ciphertext);
  } catch {
    return '[decrypt error]';
  }
}

export async function fetchResults(limit = 1000): Promise<AdminResultRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.rpc('admin_list_results', {
    p_limit: limit,
  });
  if (error) throw new Error(error.message);

  return ((data as RawRow[] | null) ?? []).map((row) => ({
    email: safeDecrypt(row.email_encrypted),
    name: row.name,
    language: row.language,
    profile_title: row.profile_title,
    sector_cluster: row.sector_cluster,
    dim1_score: row.dim1_score,
    dim2_score: row.dim2_score,
    dim3_score: row.dim3_score,
    dim4_score: row.dim4_score,
    created_at: row.created_at,
    share_token: row.share_token,
  }));
}
