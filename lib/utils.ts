import { PLANS } from "./config";
import type { PlanId } from "./config";

// ── Enrollment ID generator ───────────────────────────────────
export function generateEnrollmentId(): string {
  const year = new Date().getFullYear();
  // Use last 5 digits of timestamp + random 2 digits for uniqueness across restarts
  const seq = String(Date.now()).slice(-5) + String(Math.floor(Math.random() * 90) + 10);
  return `KV-${year}-${seq}`;
}

// ── UUID (tiny, browser-compatible) ──────────────────────────
export function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── Subscription date helpers ─────────────────────────────────
export function calculateExpiryDate(planId: PlanId, from: Date = new Date()): Date {
  const plan = PLANS.find((p) => p.id === planId);
  const days = plan?.durationDays ?? 30;
  const expiry = new Date(from);
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}

// ── Price lookup ──────────────────────────────────────────────
export function getPlanPrice(planId: PlanId): number {
  return PLANS.find((p) => p.id === planId)?.price ?? 0;
}

export function getPlanLabel(planId: PlanId): string {
  return PLANS.find((p) => p.id === planId)?.label ?? planId;
}

// ── Format currency ───────────────────────────────────────────
export function formatKwacha(amount: number): string {
  return `K${amount.toFixed(0)}`;
}

// ── WhatsApp URL builder ──────────────────────────────────────
export function buildWhatsAppUrl(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

// ── Build enrollment WhatsApp message ────────────────────────
export function buildPaymentWhatsAppMessage(params: {
  enrollmentId: string;
  fullName: string;
  whatsapp: string;
  email: string;
  course: string;
  plan: string;
  amount: number;
  language?: string;
}): string {
  const languageLine = params.language
    ? `\nLanguage: ${params.language}`
    : "";
  return `Hello Kalulu Vision,

I have completed my subscription payment.

Enrollment ID: ${params.enrollmentId}
Name: ${params.fullName}
WhatsApp: ${params.whatsapp}
Email: ${params.email}
Course: ${params.course}${languageLine}
Plan: ${params.plan}
Amount: K${params.amount}

I have attached my payment screenshot for verification.`;
}

// ── Build general enquiry WhatsApp message ────────────────────
export function buildEnquiryWhatsAppMessage(): string {
  return "Hello Kalulu Vision, I would like to know more about the technology lessons.";
}

// ── Simple server-side admin auth (cookie-based) ─────────────
export const ADMIN_SESSION_COOKIE = "kv_admin_session";

// ── Input sanitization (basic) ────────────────────────────────
export function sanitizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[<>]/g, "");
}
