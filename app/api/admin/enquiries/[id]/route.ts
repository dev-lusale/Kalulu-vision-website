export const runtime = "nodejs";

import { deleteEnquiry, setEnquiryStatus } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-guard";

export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/enquiries/[id]">) {
  const g = await requireAdmin(req); if ("response" in g) return g.response;
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const status = body.status;
  if (!["new", "read", "archived"].includes(status)) return Response.json({ success: false, error: "Invalid status." }, { status: 400 });
  await setEnquiryStatus(id, status);
  return Response.json({ success: true });
}

export async function DELETE(req: Request, ctx: RouteContext<"/api/admin/enquiries/[id]">) {
  const g = await requireAdmin(req); if ("response" in g) return g.response;
  await deleteEnquiry((await ctx.params).id);
  return Response.json({ success: true });
}
