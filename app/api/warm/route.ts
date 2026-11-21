export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { hasDatabase, ping } from "@/lib/server/pool";

/**
 * Wakes the serverless function and the database ahead of a form submission or admin
 * sign-in, so the visitor doesn't wait for both to start when they press the button.
 */
export async function GET() {
  if (hasDatabase()) { try { await ping(); } catch { /* best effort */ } }
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
