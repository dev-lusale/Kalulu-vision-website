export const runtime = "nodejs";

import { revalidatePath } from "next/cache";
import { adminSaveSetting } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-guard";
import { hasDatabase } from "@/lib/server/pool";
import { SITE_IMAGE_SLOTS } from "@/lib/content-types";

const s = (v: unknown, max = 4000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const pairs = (v: unknown) => (Array.isArray(v) ? v : [])
  .map((x) => ({ title: s((x as { title?: unknown })?.title, 120), text: s((x as { text?: unknown })?.text, 600) }))
  .filter((x) => x.title).slice(0, 12);

export async function PUT(req: Request) {
  const g = await requireAdmin(req); if ("response" in g) return g.response;
  if (!hasDatabase()) return Response.json({ success: false, error: "Database not configured." }, { status: 503 });
  const body = await req.json().catch(() => null);
  const key = body?.key, v = body?.value ?? {};
  let value: unknown;
  if (key === "company") {
    const errors: Record<string, string> = {};
    if (!s(v.name, 80)) errors.name = "Company name is required.";
    if (s(v.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s(v.email))) errors.email = "Invalid email address.";
    const socials: Record<string, string> = {};
    for (const k of ["linkedin", "youtube", "github", "x", "facebook", "tiktok"]) {
      const u = s(v.socials?.[k], 300);
      if (u && !/^https:\/\//i.test(u)) errors[`socials.${k}`] = "Must start with https://";
      socials[k] = u;
    }
    if (Object.keys(errors).length) return Response.json({ success: false, error: "Please fix the highlighted fields.", fieldErrors: errors }, { status: 400 });
    value = { name: s(v.name, 80), slogan: s(v.slogan, 120), shortDescription: s(v.shortDescription, 400), email: s(v.email, 160),
      phone: s(v.phone, 40), whatsapp: s(v.whatsapp, 20).replace(/\D/g, ""), location: s(v.location, 120), socials };
  } else if (key === "about") {
    value = { overview: s(v.overview), story: s(v.story), mission: s(v.mission, 600), vision: s(v.vision, 600), values: pairs(v.values),
      philosophy: s(v.philosophy, 800), approach: pairs(v.approach), africa: s(v.africa) };
  } else if (key === "research") {
    value = { intro: s(v.intro, 800), areas: pairs(v.areas) };
  } else if (key === "images") {
    const errors: Record<string, string> = {};
    const out: Record<string, { url: string; alt: string; caption: string }> = {};
    for (const { key: k, label } of SITE_IMAGE_SLOTS) {
      const url = s(v[k]?.url, 500), alt = s(v[k]?.alt, 300), caption = s(v[k]?.caption, 300);
      if (url && !/^(https?:\/\/\S+|\/[^\s/]\S*)$/i.test(url)) errors[`${k}.url`] = "Use a full https:// address or a site path starting with /.";
      if (url && !alt) errors[`${k}.alt`] = `Describe the ${label.toLowerCase()} photo for screen readers.`;
      out[k] = { url, alt, caption };
    }
    if (Object.keys(errors).length) return Response.json({ success: false, error: "Please fix the highlighted fields.", fieldErrors: errors }, { status: 400 });
    value = out;
  } else {
    return Response.json({ success: false, error: "Unknown setting." }, { status: 400 });
  }
  await adminSaveSetting(key, value);
  revalidatePath("/", "layout");
  return Response.json({ success: true });
}
