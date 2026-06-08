import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';
import Quiz from './Quiz';

// Screen 3 (spec 4.x): the quiz itself. The server component only validates the
// locale and enables static rendering; the interactive engine (localStorage
// resume, keyboard, scoring) lives in the Quiz client component.
export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return <Quiz locale={locale as Locale} />;
}
