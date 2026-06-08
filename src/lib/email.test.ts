import { describe, it, expect } from 'vitest';
import { buildResultsEmail } from './email';

describe('buildResultsEmail', () => {
  const base = {
    title: 'The Innovator',
    shareUrl: 'https://pathfinder.example/en/results/tok_abc',
    locale: 'en',
  };

  it('puts the profile title in the subject', () => {
    expect(buildResultsEmail(base).subject).toContain('The Innovator');
  });

  it('includes the share URL in both html and text', () => {
    const email = buildResultsEmail(base);
    expect(email.html).toContain(base.shareUrl);
    expect(email.text).toContain(base.shareUrl);
  });

  it('greets by name when provided', () => {
    expect(buildResultsEmail({ ...base, name: 'Dana' }).text).toContain('Hi Dana,');
    expect(buildResultsEmail(base).text).toContain('Hi,');
  });

  it('switches language and direction for Hebrew', () => {
    const he = buildResultsEmail({ ...base, locale: 'he' });
    expect(he.subject).toContain('Pathfinder');
    expect(he.html).toContain('dir="rtl"');
    expect(he.text).toMatch(/[֐-׿]/); // contains Hebrew
  });

  it('html-escapes interpolated values', () => {
    const email = buildResultsEmail({
      ...base,
      name: '<script>',
      shareUrl: 'https://x.example/r?a=1&b=2',
    });
    expect(email.html).not.toContain('<script>');
    expect(email.html).toContain('&lt;script&gt;');
    expect(email.html).toContain('a=1&amp;b=2');
  });
});
