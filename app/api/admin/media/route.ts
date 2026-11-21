export const runtime = "nodejs";

import { revalidatePath } from "next/cache";
import { listMedia, saveMedia } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-guard";
import { inspectImage } from "@/lib/server/image-info";
import { hasDatabase } from "@/lib/server/pool";

const MAX_BYTES = 4 * 1024 * 1024; // stays under Vercel's 4.5 MB request limit

export async function GET(req: Request) {
  const g = await requireAdmin(req); if ("response" in g) return g.response;
  if (!hasDatabase()) return Response.json({ success: true, items: [], note: "No database configured." });
  return Response.json({ success: true, items: await listMedia() });
}

export async function POST(req: Request) {
  const g = await requireAdmin(req); if ("response" in g) return g.response;
  if (!hasDatabase()) return Response.json({ success: false, error: "Uploads need a database. Set DATABASE_URL." }, { status: 503 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ success: false, error: "Choose an image to upload." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ success: false, error: "Images must be 4 MB or smaller. Try exporting it as WebP or JPEG." }, { status: 413 });

  const data = Buffer.from(await file.arrayBuffer());
  const info = inspectImage(data);
  if (!info) return Response.json({ success: false, error: "Only PNG, JPEG, WebP or GIF images can be uploaded." }, { status: 415 });

  const filename = (file.name || "image").replace(/[^\w.\- ]+/g, "_").slice(0, 120);
  const alt = String(form?.get("alt") ?? "").trim().slice(0, 300);
  const item = await saveMedia({ filename, mime: info.mime, data, width: info.width, height: info.height, alt });
  revalidatePath("/admin/media");
  return Response.json({ success: true, item }, { status: 201 });
}
