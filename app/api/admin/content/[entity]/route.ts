export const runtime = "nodejs";

import { revalidatePath } from "next/cache";
import { SCHEMAS, validateRecord } from "@/lib/admin-schema";
import { adminList, adminSave } from "@/lib/content";
import { entityOf, saveError } from "@/lib/server/admin-content";
import { requireAdmin } from "@/lib/server/admin-guard";
import { hasDatabase } from "@/lib/server/pool";

export async function GET(req: Request, ctx: RouteContext<"/api/admin/content/[entity]">) {
  const g = await requireAdmin(req); if ("response" in g) return g.response;
  const entity = entityOf((await ctx.params).entity);
  if (!entity) return Response.json({ success: false, error: "Unknown content type." }, { status: 404 });
  if (!hasDatabase()) return Response.json({ success: false, error: "Database not configured." }, { status: 503 });
  return Response.json({ success: true, data: await adminList(entity) });
}

export async function POST(req: Request, ctx: RouteContext<"/api/admin/content/[entity]">) {
  const g = await requireAdmin(req); if ("response" in g) return g.response;
  const entity = entityOf((await ctx.params).entity);
  if (!entity) return Response.json({ success: false, error: "Unknown content type." }, { status: 404 });
  if (!hasDatabase()) return Response.json({ success: false, error: "Database not configured." }, { status: 503 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return Response.json({ success: false, error: "Invalid request." }, { status: 400 });
  const [data, errors] = validateRecord(SCHEMAS[entity], body);
  if (Object.keys(errors).length) return Response.json({ success: false, error: "Please fix the highlighted fields.", fieldErrors: errors }, { status: 400 });
  if (entity === "posts" && data.published && !data.publishedAt) data.publishedAt = new Date().toISOString();
  try {
    const id = await adminSave(entity, null, data);
    revalidatePath("/", "layout");
    return Response.json({ success: true, id }, { status: 201 });
  } catch (e) {
    return saveError(e);
  }
}
