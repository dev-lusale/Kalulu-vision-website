import { NextRequest } from "next/server";
import {
  verifyAdminPassword,
  createAdminSession,
  ensureDefaultAdmin,
} from "@/lib/auth";
import { sanitizeString } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body     = await request.json();
    const password = sanitizeString(body.password);

    if (!password) {
      return Response.json({ success: false, error: "Password is required." }, { status: 400 });
    }

    // Bootstrap default admin if no admin exists yet
    await ensureDefaultAdmin();

    const valid = await verifyAdminPassword(password);
    if (!valid) {
      // Constant-time delay prevents timing attacks
      await new Promise((r) => setTimeout(r, 400));
      return Response.json({ success: false, error: "Invalid credentials." }, { status: 401 });
    }

    await createAdminSession();
    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error("[POST /api/admin/login]", e);
    return Response.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
