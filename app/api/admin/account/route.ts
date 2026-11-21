export const runtime = "nodejs";

import { changeAdminPassword } from "@/lib/auth";
import { requireAdmin } from "@/lib/server/admin-guard";

export async function PUT(req: Request) {
  const g = await requireAdmin(req); if ("response" in g) return g.response;
  const body = await req.json().catch(() => ({}));
  const err = await changeAdminPassword(g.session.adminId, String(body.current ?? ""), String(body.next ?? ""));
  if (err) return Response.json({ success: false, error: err }, { status: 400 });
  return Response.json({ success: true });
}
