import Link from "next/link";
import { adminCounts } from "@/lib/content";
import { hasDatabase } from "@/lib/server/pool";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const db = hasDatabase();
  let counts: Record<string, number> = {};
  let dbError = "";
  if (db) { try { counts = await adminCounts(); } catch (e) { dbError = (e as Error).message; } }
  const cards = [
    ["New enquiries", counts.newEnquiries, "/admin/enquiries"],
    ["Payments to verify", counts.pendingPayments, "/admin/training"],
    ["Projects", counts.projects, "/admin/content/projects"],
    ["Products", counts.products, "/admin/content/products"],
    ["Services", counts.services, "/admin/content/services"],
    ["Articles & research", counts.posts, "/admin/content/posts"],
    ["Open opportunities", counts.openOpportunities, "/admin/content/opportunities"],
  ] as const;
  return (
    <div>
      <h1 className="text-2xl font-semibold">Overview</h1>
      <p className="mt-1 text-sm text-slate-500">Manage the Kalulu Vision website content, enquiries and training enrollments.</p>
      {!db && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">No database is configured.</p>
          <p className="mt-1">The public site is showing its built-in starting content. Set <code>DATABASE_URL</code> and run <code>npm run db:migrate</code> to manage content here. See the README.</p>
        </div>
      )}
      {dbError && (
        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-semibold">The database could not be read.</p>
          <p className="mt-1">Run <code>npm run db:migrate</code> to create the content tables. ({dbError})</p>
        </div>
      )}
      {db && !dbError && (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(([label, n, href]) => (
            <li key={label}>
              <Link href={href} className="block rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md">
                <span className="text-sm text-slate-500">{label}</span>
                <span className="mt-2 block text-3xl font-semibold">{n ?? 0}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
