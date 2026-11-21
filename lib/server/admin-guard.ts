import "server-only";
import { getAdminSession, type AdminSession } from "@/lib/auth";

/** For admin API routes: verifies the session and (for writes) that the request is same-origin. */
export async function requireAdmin(req: Request): Promise<{ session: AdminSession } | { response: Response }> {
  const session = await getAdminSession();
  if (!session) return { response: Response.json({ success: false, error: "Unauthorized." }, { status: 401 }) };
  if (req.method !== "GET" && req.method !== "HEAD") {
    const origin = req.headers.get("origin");
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      return { response: Response.json({ success: false, error: "Cross-site request blocked." }, { status: 403 }) };
    }
  }
  return { session };
}
