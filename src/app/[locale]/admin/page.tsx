import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { requireAdmin } from '@/lib/admin-session';
import { fetchResults, type AdminResultRow } from '@/lib/admin-data';
import { logout } from './actions';

// Admin dashboard: a table of completed results with a CSV export and logout.
// Protected by requireAdmin (redirects to login when unauthenticated).
export const dynamic = 'force-dynamic';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  await requireAdmin(locale);

  let rows: AdminResultRow[] = [];
  let dbError: string | null = null;
  try {
    rows = await fetchResults();
  } catch (e) {
    dbError =
      e instanceof Error ? e.message : 'Could not load results (DB not configured?)';
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Results ({rows.length})</h1>
        <div className="flex items-center gap-3">
          <a
            href={`/${locale}/admin/export`}
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Export CSV
          </a>
          <form action={logout.bind(null, locale)}>
            <button className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium hover:bg-foreground/5">
              Log out
            </button>
          </form>
        </div>
      </div>

      {dbError && (
        <p className="rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {dbError}
        </p>
      )}

      {rows.length === 0 && !dbError ? (
        <p className="text-foreground/60">No results yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-start text-sm">
            <thead>
              <tr className="border-b border-foreground/15 text-foreground/60">
                <th className="px-3 py-2 text-start font-medium">Email</th>
                <th className="px-3 py-2 text-start font-medium">Name</th>
                <th className="px-3 py-2 text-start font-medium">Lang</th>
                <th className="px-3 py-2 text-start font-medium">Archetype</th>
                <th className="px-3 py-2 text-start font-medium">Domain</th>
                <th className="px-3 py-2 text-start font-medium">D1/D2/D3/D4</th>
                <th className="px-3 py-2 text-start font-medium">Congr.</th>
                <th className="px-3 py-2 text-start font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.share_token} className="border-b border-foreground/10">
                  <td className="px-3 py-2">{r.email}</td>
                  <td className="px-3 py-2">{r.name ?? ''}</td>
                  <td className="px-3 py-2">{r.language}</td>
                  <td className="px-3 py-2">{r.archetype}</td>
                  <td className="px-3 py-2">{r.domain}</td>
                  <td className="px-3 py-2 tabular-nums">
                    {r.dim1_score}/{r.dim2_score}/{r.dim3_score}/{r.dim4_score}
                  </td>
                  <td className="px-3 py-2 tabular-nums">{r.congruence}</td>
                  <td className="px-3 py-2 tabular-nums">
                    {r.created_at?.slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
