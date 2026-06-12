import { describe, it, expect } from 'vitest';
import {
  escapeFormula,
  csvField,
  buildCsv,
  buildResultsCsv,
  type ResultExportRecord,
} from './csv';

describe('escapeFormula', () => {
  it('neutralizes cells starting with a formula trigger', () => {
    for (const v of ['=1+1', '+1', '-1', '@SUM', '\tx', '\rx']) {
      expect(escapeFormula(v)).toBe(`'${v}`);
    }
  });

  it('leaves safe values untouched', () => {
    expect(escapeFormula('alice@example.com')).toBe('alice@example.com');
    expect(escapeFormula('The Innovator')).toBe('The Innovator');
    expect(escapeFormula('72')).toBe('72');
  });
});

describe('csvField', () => {
  it('quotes cells containing comma, quote, or newline', () => {
    expect(csvField('a,b')).toBe('"a,b"');
    expect(csvField('he said "hi"')).toBe('"he said ""hi"""');
    expect(csvField('line1\nline2')).toBe('"line1\nline2"');
  });

  it('formula-neutralizes before quoting', () => {
    // =HYPERLINK("http://x","y") -> prefixed with ' and quoted (has commas/quotes)
    expect(csvField('=HYPERLINK("http://x")')).toBe('"\'=HYPERLINK(""http://x"")"');
  });

  it('renders null/undefined as empty', () => {
    expect(csvField(null)).toBe('');
    expect(csvField(undefined)).toBe('');
  });

  it('stringifies numbers', () => {
    expect(csvField(72)).toBe('72');
  });
});

describe('buildCsv', () => {
  it('emits header + rows with CRLF endings', () => {
    const csv = buildCsv(['a', 'b'], [
      ['1', '2'],
      ['3', '4'],
    ]);
    expect(csv).toBe('a,b\r\n1,2\r\n3,4');
  });
});

describe('buildResultsCsv', () => {
  const rec: ResultExportRecord = {
    email: 'alice@example.com',
    name: 'Alice',
    language: 'it',
    archetype: 'creator',
    domain: 'ART',
    dim1_score: 72,
    dim2_score: 28,
    dim3_score: 81,
    dim4_score: 55,
    congruence: 88,
    created_at: '2026-06-08T00:00:00Z',
  };

  it('produces a header row and one row per record', () => {
    const csv = buildResultsCsv([rec]);
    const lines = csv.split('\r\n');
    expect(lines[0]).toBe(
      'email,name,language,archetype,domain,dim1_score,dim2_score,dim3_score,dim4_score,congruence,created_at',
    );
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain('alice@example.com');
    expect(lines[1]).toContain('creator');
  });

  it('sanitizes a malicious name against formula injection', () => {
    const csv = buildResultsCsv([{ ...rec, name: '=cmd|calc' }]);
    expect(csv).toContain(`'=cmd|calc`);
  });

  it('handles a null name', () => {
    const csv = buildResultsCsv([{ ...rec, name: null }]);
    expect(csv.split('\r\n')[1]).toContain('alice@example.com,,it,');
  });
});
