import { notFound } from "next/navigation";
import { ContentManager } from "@/components/cms/ContentManager";
import { SCHEMAS } from "@/lib/admin-schema";
import { adminList, ENTITIES, type EntityName } from "@/lib/content";
import { hasDatabase } from "@/lib/server/pool";

export const dynamic = "force-dynamic";

export default async function ContentPage({ params }: PageProps<"/admin/content/[entity]">) {
  const { entity } = await params;
  if (!(entity in ENTITIES) || !SCHEMAS[entity]) notFound();
  if (!hasDatabase()) {
    return <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">A database is required to manage content. See the README for setup.</p>;
  }
  const rows = await adminList(entity as EntityName);
  return <ContentManager key={entity} entity={entity} rows={rows} />;
}
