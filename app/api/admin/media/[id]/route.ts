export const runtime = "nodejs";

import { deleteMedia, updateMediaAlt } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-guard";

export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/media/[id]">) {
  const g = await requireAdmin(req); if ("response" in g) return g.response;
  const body = await req.json().catch(() => ({}));
  if (typeof body.alt !== "string") return Response.json({ success: false, error: "Missing description." }, { status: 400 });
  await updateMediaAlt((await ctx.params).id, body.alt.trim().slice(0, 300));
  return Response.json({ success: true });
}

export async function DELETE(req: Request, ctx: RouteContext<"/api/admin/media/[id]">) {
  const g = await requireAdmin(req); if ("response" in g) return g.response;
  await deleteMedia((await ctx.params).id);
  return Response.json({ success: true });
}
