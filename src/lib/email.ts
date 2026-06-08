import { Resend } from 'resend';

// Results-delivery email (Resend). The content builder is pure and tested; the
// sender no-ops when RESEND_API_KEY / RESEND_FROM_EMAIL are absent so the funnel
// runs unchanged without email configured.
//
// DRAFT copy — final wording + a verified sending domain (SPF/DKIM, or Hebrew
// inboxes spam-folder it, PLAN.md section on email) are pending.

export interface ResultsEmailInput {
  name?: string | null;
  title: string; // profile title, e.g. "The Innovator"
  shareUrl: string; // absolute URL to /results/[token]
  locale: string;
}

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

const COPY = {
  en: {
    subject: (title: string) => `Your Pathfinder profile: ${title}`,
    greeting: (name?: string | null) => (name ? `Hi ${name},` : 'Hi,'),
    body: (title: string) =>
      `Your career profile is ready. You came out as ${title}. View and share your full profile, including your three career paths:`,
    cta: 'View my profile',
    footer: 'You received this because you completed the Pathfinder quiz.',
  },
  he: {
    subject: (title: string) => `הפרופיל שלכם ב-Pathfinder: ${title}`,
    greeting: (name?: string | null) => (name ? `שלום ${name},` : 'שלום,'),
    body: (title: string) =>
      `פרופיל הקריירה שלכם מוכן. יצאתם ${title}. צפו ושתפו את הפרופיל המלא, כולל שלושת מסלולי הקריירה:`,
    cta: 'לצפייה בפרופיל',
    footer: 'קיבלתם הודעה זו כיוון שמילאתם את שאלון Pathfinder.',
  },
} as const;

// Minimal HTML escaping for the interpolated values.
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildResultsEmail(input: ResultsEmailInput): BuiltEmail {
  const c = COPY[input.locale === 'he' ? 'he' : 'en'];
  const dir = input.locale === 'he' ? 'rtl' : 'ltr';
  const title = esc(input.title);
  const url = esc(input.shareUrl);

  const text = [
    c.greeting(input.name),
    '',
    c.body(input.title),
    input.shareUrl,
    '',
    c.footer,
  ].join('\n');

  const html = `<!doctype html>
<html dir="${dir}">
  <body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #171717;">
    <p>${esc(c.greeting(input.name))}</p>
    <p>${esc(c.body(input.title))}</p>
    <p>
      <a href="${url}" style="display:inline-block;padding:12px 24px;background:#171717;color:#fff;border-radius:999px;text-decoration:none;">
        ${esc(c.cta)}
      </a>
    </p>
    <p style="font-size:12px;color:#888;">${esc(c.footer)}</p>
    <p style="font-size:12px;color:#888;">${title}</p>
  </body>
</html>`;

  return { subject: c.subject(input.title), html, text };
}

export type SendResult =
  | { sent: true; id: string | null }
  | { sent: false; reason: 'not_configured' | 'error' };

/**
 * Send the results email. No-ops (not_configured) without Resend credentials so
 * callers can treat email as best-effort. Never throws.
 */
export async function sendResultsEmail(
  to: string,
  input: ResultsEmailInput,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return { sent: false, reason: 'not_configured' };

  const { subject, html, text } = buildResultsEmail(input);
  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });
    if (error) {
      console.error('[email] resend error', error);
      return { sent: false, reason: 'error' };
    }
    return { sent: true, id: data?.id ?? null };
  } catch (e) {
    console.error('[email] send failed', e);
    return { sent: false, reason: 'error' };
  }
}
