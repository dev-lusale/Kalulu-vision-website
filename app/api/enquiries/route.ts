export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { saveEnquiry } from "@/lib/content";
import { ENQUIRY_KINDS, PARTNER_TYPES, type EnquiryKind } from "@/lib/content-types";
import { hasDatabase } from "@/lib/server/pool";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const hits = new Map<string, number[]>();

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 5) return Response.json({ success: false, error: "Too many messages. Please try again in a few minutes." }, { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return Response.json({ success: false, error: "Invalid request." }, { status: 400 });

  // Honeypot: pretend nothing happened, store nothing.
  if (clean(body.website, 200)) return Response.json({ success: true });

  const kind: EnquiryKind = (ENQUIRY_KINDS as readonly string[]).includes(body.kind) ? body.kind : "contact";
  const data = {
    kind,
    name: clean(body.name, 120),
    email: clean(body.email, 160),
    organisation: clean(body.organisation, 160),
    subject: clean(body.subject, 160),
    service: clean(body.service, 120),
    opportunity: clean(body.opportunity, 200),
    linkUrl: clean(body.linkUrl, 300),
    message: clean(body.message, 5000),
  };
  const fieldErrors: Record<string, string> = {};
  if (kind === "newsletter") {
    // email-only subscription
    if (!EMAIL.test(data.email)) fieldErrors.email = "Enter a valid email address.";
    data.name = data.name || "Newsletter subscriber";
    data.subject = "Newsletter subscription";
    data.message = "Subscribed to updates from the website.";
  }
  if (data.name.length < 2) fieldErrors.name = "Enter your name.";
  if (!EMAIL.test(data.email)) fieldErrors.email = "Enter a valid email address.";
  if (kind === "partnership") {
    if (!PARTNER_TYPES.some((p) => p.label === data.service)) fieldErrors.service = "Choose the type of organisation.";
    if (data.organisation.length < 2) fieldErrors.organisation = "Enter your organisation's name.";
    data.subject = data.subject || `Partnership enquiry: ${data.service}`;
  }
  if (kind === "contact" && data.subject.length < 3) fieldErrors.subject = "Add a short subject.";
  if (kind === "opportunity" && !data.opportunity) fieldErrors.opportunity = "Choose what you're interested in.";
  if (kind !== "newsletter" && data.message.length < 20) fieldErrors.message = "Add a little more detail (at least 20 characters).";
  if (data.linkUrl && !/^https?:\/\//i.test(data.linkUrl)) fieldErrors.linkUrl = "Links must start with http:// or https://";
  if (Object.keys(fieldErrors).length) return Response.json({ success: false, error: "Please check the form.", fieldErrors }, { status: 400 });

  if (!hasDatabase()) {
    return Response.json({ success: false, error: "Online messages are temporarily unavailable." }, { status: 503 });
  }
  try {
    await saveEnquiry(data);
    hits.set(ip, [...recent, now]);
    return Response.json({ success: true }, { status: 201 });
  } catch (e) {
    console.error("[POST /api/enquiries]", e);
    return Response.json({ success: false, error: "We couldn't save your message right now." }, { status: 500 });
  }
}
