import { SettingsEditor } from "@/components/cms/SettingsEditor";
import { adminGetSettings } from "@/lib/content";
import { hasDatabase } from "@/lib/server/pool";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  if (!hasDatabase()) return <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">A database is required to edit company information.</p>;
  const s = await adminGetSettings();
  return <SettingsEditor company={s.company} about={s.about} research={s.research} />;
}
