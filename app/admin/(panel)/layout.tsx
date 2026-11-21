import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Shell } from "@/components/cms/Shell";
import { getAdminSession } from "@/lib/auth";
import { adminCounts } from "@/lib/content";
import { hasDatabase } from "@/lib/server/pool";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  let newEnquiries = 0;
  if (hasDatabase()) {
    try { newEnquiries = (await adminCounts()).newEnquiries ?? 0; } catch { /* tables may not exist yet */ }
  }
  return <Shell email={session.email} newEnquiries={newEnquiries}>{children}</Shell>;
}
