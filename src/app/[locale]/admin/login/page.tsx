import { notFound, redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';
import { getAdminSession } from '@/lib/admin-session';
import LoginForm from './LoginForm';

// Admin login. If already authenticated, skip straight to the dashboard.
export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  if (await getAdminSession()) redirect(`/${locale}/admin`);

  return <LoginForm locale={locale as Locale} />;
}
