export const runtime = "nodejs";

import { revalidatePath } from "next/cache";
import { SCHEMAS, validateRecord } from "@/lib/admin-schema";
import { adminDelete, adminSave } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-guard";
import { hasDatabase } from "@/lib/server/pool";
import { entityOf, saveError } from "@/lib/server/admin-content";

export async function PUT(req: Request, ctx: RouteContext<"/api/admin/content/[entity]/[id]">) {
  const g = await requireAdmin(req); if ("response" in g) return g.response;
  const { entity: name, id } = await ctx.params;
  const entity = entityOf(name);
  if (!entity) return Response.json({ success: false, error: "Unknown content type." }, { status: 404 });
  if (!hasDatabase()) return Response.json({ success: false, error: "Database not configured." }, { status: 503 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return Response.json({ success: false, error: "Invalid request." }, { status: 400 });
  const [data, errors] = validateRecord(SCHEMAS[entity], body);
  if (Object.keys(errors).length) return Response.json({ success: false, error: "Please fix the highlighted fields.", fieldErrors: errors }, { status: 400 });
  if (entity === "posts" && data.published && !data.publishedAt) data.publishedAt = new Date().toISOString();
  try {
    await adminSave(entity, id, data);
    revalidatePath("/", "layout");
    return Response.json({ success: true, id });
  } catch (e) {
    return saveError(e);
  }
}

export async function DELETE(req: Request, ctx: RouteContext<"/api/admin/content/[entity]/[id]">) {
  const g = await requireAdmin(req); if ("response" in g) return g.response;
  const { entity: name, id } = await ctx.params;
  const entity = entityOf(name);
  if (!entity) return Response.json({ success: false, error: "Unknown content type." }, { status: 404 });
  if (!hasDatabase()) return Response.json({ success: false, error: "Database not configured." }, { status: 503 });
  await adminDelete(entity, id);
  revalidatePath("/", "layout");
  return Response.json({ success: true });
}
