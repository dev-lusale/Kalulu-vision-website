import { EnquiriesInbox } from "@/components/cms/EnquiriesInbox";
import { listEnquiries } from "@/lib/content";
import { hasDatabase } from "@/lib/server/pool";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  if (!hasDatabase()) return <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">A database is required to receive enquiries.</p>;
  return <EnquiriesInbox initial={await listEnquiries()} />;
}
