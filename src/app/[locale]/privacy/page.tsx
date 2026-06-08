import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { PRIVACY_POLICY_VERSION } from '@/lib/privacy';

// DRAFT privacy policy. Content is provisional and pending legal review for
// GDPR + Israeli Privacy Law (PLAN.md section 4). The version string here is
// the one recorded with each consent (see the quiz completeSession action), so
// keep them in sync. Localized inline (EN/HE) rather than via the message
// catalog to keep this long-form legal copy out of the UI strings.

type Section = { heading: string; body: string };

const CONTENT: Record<'en' | 'he', { title: string; intro: string; sections: Section[]; back: string }> = {
  en: {
    title: 'Privacy Policy',
    intro:
      'This explains what Pathfinder collects when you take the quiz, why, and your rights. It is a working draft pending legal review.',
    sections: [
      {
        heading: 'What we collect',
        body: 'Your quiz answers and the resulting profile; your email address (and name, if given) when you choose to unlock your full profile; and your IP address at the moment you consent, as a record of that consent.',
      },
      {
        heading: 'Why we collect it',
        body: 'To compute and show your career profile, to email you your results, and (only if you opt in) to send occasional related updates. We do not sell your data.',
      },
      {
        heading: 'How it is stored',
        body: 'Data is held in the EU (Frankfurt). Your email is encrypted at rest; it is never stored in plain text. Your individual answers are not exposed on the public, shareable result link.',
      },
      {
        heading: 'Retention',
        body: 'We keep your profile and email until you ask us to delete them. The final retention window is being finalized as part of legal review.',
      },
      {
        heading: 'Your rights',
        body: 'You can request a copy of your data or its deletion at any time. To do so, contact us at the address below.',
      },
      {
        heading: 'Contact',
        body: 'Email privacy@pathfinder.example (placeholder pending a real contact address).',
      },
    ],
    back: 'Back',
  },
  he: {
    title: 'מדיניות פרטיות',
    intro:
      'כאן מוסבר אילו נתונים Pathfinder אוסף כשאתם ממלאים את השאלון, לשם מה, ומהן הזכויות שלכם. זוהי טיוטה הממתינה לבדיקה משפטית.',
    sections: [
      {
        heading: 'מה אנחנו אוספים',
        body: 'את תשובות השאלון והפרופיל שמתקבל; את כתובת האימייל שלכם (ושם, אם נמסר) כשאתם בוחרים לפתוח את הפרופיל המלא; ואת כתובת ה-IP שלכם ברגע מתן ההסכמה, כתיעוד של ההסכמה.',
      },
      {
        heading: 'לשם מה אנחנו אוספים',
        body: 'כדי לחשב ולהציג את פרופיל הקריירה שלכם, לשלוח לכם את התוצאות במייל, ו(רק אם בחרתם בכך) לשלוח עדכונים רלוונטיים מדי פעם. איננו מוכרים את הנתונים שלכם.',
      },
      {
        heading: 'איך הנתונים נשמרים',
        body: 'הנתונים נשמרים באיחוד האירופי (פרנקפורט). האימייל מוצפן במנוחה ולעולם אינו נשמר כטקסט גלוי. התשובות הפרטניות שלכם אינן נחשפות בקישור התוצאה הציבורי לשיתוף.',
      },
      {
        heading: 'משך שמירה',
        body: 'אנו שומרים את הפרופיל והאימייל שלכם עד שתבקשו למחוק אותם. חלון השמירה הסופי ייקבע במסגרת הבדיקה המשפטית.',
      },
      {
        heading: 'הזכויות שלכם',
        body: 'תוכלו לבקש עותק של הנתונים שלכם או את מחיקתם בכל עת. לשם כך פנו אלינו לכתובת שלהלן.',
      },
      {
        heading: 'יצירת קשר',
        body: 'אימייל privacy@pathfinder.example (כתובת זמנית עד לקביעת כתובת קשר אמיתית).',
      },
    ],
    back: 'חזרה',
  },
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const c = CONTENT[locale === 'he' ? 'he' : 'en'];

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <p className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-center text-sm text-amber-700 dark:text-amber-300">
        DRAFT · v{PRIVACY_POLICY_VERSION}
      </p>

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{c.title}</h1>
        <p className="text-foreground/70">{c.intro}</p>
      </header>

      <div className="flex flex-col gap-6">
        {c.sections.map((s) => (
          <section key={s.heading} className="flex flex-col gap-1.5">
            <h2 className="text-lg font-semibold">{s.heading}</h2>
            <p className="text-foreground/70">{s.body}</p>
          </section>
        ))}
      </div>

      <Link
        href="/"
        className="text-sm text-foreground/50 underline-offset-2 hover:underline"
      >
        {c.back}
      </Link>
    </main>
  );
}
