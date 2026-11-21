export const runtime = "nodejs";

import { getMediaData } from "@/lib/content";
import { hasDatabase } from "@/lib/server/pool";

/** Public image delivery for files uploaded in the admin media library. */
export async function GET(_req: Request, ctx: RouteContext<"/api/media/[id]">) {
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/i.test(id) || !hasDatabase()) return new Response("Not found", { status: 404 });
  const m = await getMediaData(id).catch(() => null);
  if (!m) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(m.data), {
    headers: {
      "Content-Type": m.mime,
      // ids are immutable (a replaced image gets a new id), so cache aggressively
      "Cache-Control": "public, max-age=31536000, immutable",
      // let Vercel's CDN keep a copy near visitors (ids never change)
      "CDN-Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
