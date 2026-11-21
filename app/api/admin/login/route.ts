export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { verifyAdminCredentials, createAdminSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.slice(0, 200) : "";
    const password = typeof body.password === "string" ? body.password.slice(0, 200) : "";
    if (!password) return Response.json({ success: false, error: "Password is required." }, { status: 400 });

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const result = await verifyAdminCredentials(email, password, ip);
    if (!result.ok) return Response.json({ success: false, error: result.error }, { status: result.status });

    await createAdminSession(result.adminId, result.email);
    return Response.json({ success: true });
  } catch (e) {
    console.error("[POST /api/admin/login]", e);
    return Response.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
