// CSV export with two safety layers (PLAN.md section 4: "sanitize CSV export
// against formula injection"). Used by the admin results export.
//
//  1. Formula-injection neutralization: a cell whose text begins with = + - @
//     or a control char can execute as a formula when the CSV is opened in
//     Excel/Sheets. We prefix such cells with a single quote so they render as
//     literal text.
//  2. RFC 4180 quoting: cells containing a comma, quote, or newline are wrapped
//     in double quotes with internal quotes doubled.

const FORMULA_TRIGGERS = ['=', '+', '-', '@', '\t', '\r'];

/** Neutralize a value that could be interpreted as a spreadsheet formula. */
export function escapeFormula(value: string): string {
  return FORMULA_TRIGGERS.some((p) => value.startsWith(p)) ? `'${value}` : value;
}

/** Format one cell: formula-safe, then RFC 4180 quoted if needed. */
export function csvField(value: unknown): string {
  const raw = value === null || value === undefined ? '' : String(value);
  const safe = escapeFormula(raw);
  if (/[",\r\n]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

/** Build a CSV document (CRLF line endings per RFC 4180) from rows of cells. */
export function buildCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers, ...rows].map((row) => row.map(csvField).join(','));
  return lines.join('\r\n');
}

// Domain export: one row per completed result, for the admin panel. Column
// order is fixed so the export is stable.
export interface ResultExportRecord {
  email: string; // decrypted server-side for the export only
  name: string | null;
  language: string;
  archetype: string;
  domain: string;
  dim1_score: number;
  dim2_score: number;
  dim3_score: number;
  dim4_score: number;
  congruence: number;
  created_at: string;
}

const RESULT_HEADERS = [
  'email',
  'name',
  'language',
  'archetype',
  'domain',
  'dim1_score',
  'dim2_score',
  'dim3_score',
  'dim4_score',
  'congruence',
  'created_at',
];

export function buildResultsCsv(records: ResultExportRecord[]): string {
  const rows = records.map((r) => [
    r.email,
    r.name ?? '',
    r.language,
    r.archetype,
    r.domain,
    r.dim1_score,
    r.dim2_score,
    r.dim3_score,
    r.dim4_score,
    r.congruence,
    r.created_at,
  ]);
  return buildCsv(RESULT_HEADERS, rows);
}
