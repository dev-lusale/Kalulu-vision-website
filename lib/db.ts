/**
 * Database access layer.
 *
 * STRATEGY (same as auth.ts):
 * • DATABASE_URL present  → use PostgreSQL via Prisma
 * • DATABASE_URL absent   → use local JSON files in /data  (dev fallback)
 *
 * This means the app works immediately out-of-the-box without any DB setup,
 * and you can connect PostgreSQL later by adding DATABASE_URL to .env.local.
 */

import type {
  Enrollment,
  Payment,
  Subscription,
  EnrollmentRecord,
} from "./types";

const DB_AVAILABLE = !!process.env.DATABASE_URL;

// ── Lazy prisma loader ────────────────────────────────────────
async function getPrisma() {
  const { prisma } = await import("./prisma");
  return prisma;
}

// ═══════════════════════════════════════════════════════════════
//  FILE-BASED FALLBACK  (used when DATABASE_URL is not set)
// ═══════════════════════════════════════════════════════════════
import fs   from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}
function readJson<T>(file: string, fallback: T): T {
  ensureDir();
  const fp = path.join(DATA_DIR, file);
  try {
    if (!fs.existsSync(fp)) return fallback;
    return JSON.parse(fs.readFileSync(fp, "utf8")) as T;
  } catch { return fallback; }
}
function writeJson<T>(file: string, data: T): void {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

// ── File helpers ──────────────────────────────────────────────
function fileGetEnrollments(): Enrollment[] {
  return readJson<Enrollment[]>("enrollments.json", []);
}
function fileSaveEnrollment(e: Enrollment) {
  const all = fileGetEnrollments();
  const i   = all.findIndex((x) => x.id === e.id);
  if (i >= 0) all[i] = e; else all.push(e);
  writeJson("enrollments.json", all);
}
function fileGetPayments(): Payment[] {
  return readJson<Payment[]>("payments.json", []);
}
function fileSavePayment(p: Payment) {
  const all = fileGetPayments();
  const i   = all.findIndex((x) => x.id === p.id);
  if (i >= 0) all[i] = p; else all.push(p);
  writeJson("payments.json", all);
}
function fileGetSubscriptions(): Subscription[] {
  return readJson<Subscription[]>("subscriptions.json", []);
}
function fileSaveSubscription(s: Subscription) {
  const all = fileGetSubscriptions();
  const i   = all.findIndex((x) => x.id === s.id);
  if (i >= 0) all[i] = s; else all.push(s);
  writeJson("subscriptions.json", all);
}

// ═══════════════════════════════════════════════════════════════
//  PRISMA MAPPERS  (Prisma rows → our plain types)
// ═══════════════════════════════════════════════════════════════
/* eslint-disable @typescript-eslint/no-explicit-any */
function mapEnrollment(r: any): Enrollment {
  return {
    id: r.id, enrollmentId: r.enrollmentId, fullName: r.fullName,
    whatsapp: r.whatsapp, email: r.email, course: r.course,
    plan: r.plan, learningMode: r.learningMode,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  };
}
function mapPayment(r: any): Payment {
  return {
    id: r.id, enrollmentId: r.enrollmentId, amount: r.amount,
    paymentMethod: r.paymentMethod, status: r.status,
    submittedAt: r.submittedAt instanceof Date ? r.submittedAt.toISOString() : r.submittedAt,
    verifiedAt:  r.verifiedAt  instanceof Date ? r.verifiedAt.toISOString()  : r.verifiedAt ?? undefined,
  };
}
function mapSubscription(r: any): Subscription {
  return {
    id: r.id, enrollmentId: r.enrollmentId, plan: r.plan, status: r.status,
    startDate:  r.startDate  instanceof Date ? r.startDate.toISOString()  : r.startDate  ?? undefined,
    expiryDate: r.expiryDate instanceof Date ? r.expiryDate.toISOString() : r.expiryDate ?? undefined,
  };
}

// ═══════════════════════════════════════════════════════════════
//  PUBLIC API  — same signatures, works with or without DB
// ═══════════════════════════════════════════════════════════════

// ── Enrollments ───────────────────────────────────────────────
export async function getEnrollments(): Promise<Enrollment[]> {
  if (!DB_AVAILABLE) return fileGetEnrollments();
  const p = await getPrisma();
  return (await p.enrollment.findMany({ orderBy: { createdAt: "desc" } })).map(mapEnrollment);
}

export async function getEnrollmentByEnrollmentId(id: string): Promise<Enrollment | undefined> {
  if (!DB_AVAILABLE) return fileGetEnrollments().find((e) => e.enrollmentId === id);
  const p = await getPrisma();
  const r = await p.enrollment.findUnique({ where: { enrollmentId: id } });
  return r ? mapEnrollment(r) : undefined;
}

export async function saveEnrollment(e: Enrollment): Promise<void> {
  if (!DB_AVAILABLE) { fileSaveEnrollment(e); return; }
  const p = await getPrisma();
  await p.enrollment.upsert({
    where:  { enrollmentId: e.enrollmentId },
    update: { fullName: e.fullName, whatsapp: e.whatsapp, email: e.email,
              course: e.course, plan: e.plan, learningMode: e.learningMode },
    create: { id: e.id, enrollmentId: e.enrollmentId, fullName: e.fullName,
              whatsapp: e.whatsapp, email: e.email, course: e.course,
              plan: e.plan, learningMode: e.learningMode,
              createdAt: new Date(e.createdAt) },
  });
}

// ── Payments ──────────────────────────────────────────────────
export async function getPayments(): Promise<Payment[]> {
  if (!DB_AVAILABLE) return fileGetPayments();
  const p = await getPrisma();
  return (await p.payment.findMany({ orderBy: { submittedAt: "desc" } })).map(mapPayment);
}

export async function getPaymentByEnrollmentId(id: string): Promise<Payment | undefined> {
  if (!DB_AVAILABLE) return fileGetPayments().find((p) => p.enrollmentId === id);
  const p = await getPrisma();
  const r = await p.payment.findUnique({ where: { enrollmentId: id } });
  return r ? mapPayment(r) : undefined;
}

export async function savePayment(pay: Payment): Promise<void> {
  if (!DB_AVAILABLE) { fileSavePayment(pay); return; }
  const p = await getPrisma();
  await p.payment.upsert({
    where:  { enrollmentId: pay.enrollmentId },
    update: { status: pay.status,
              verifiedAt: pay.verifiedAt ? new Date(pay.verifiedAt) : null },
    create: { id: pay.id, enrollmentId: pay.enrollmentId, amount: pay.amount,
              paymentMethod: pay.paymentMethod, status: pay.status,
              submittedAt: new Date(pay.submittedAt),
              verifiedAt:  pay.verifiedAt ? new Date(pay.verifiedAt) : null },
  });
}

// ── Subscriptions ─────────────────────────────────────────────
export async function getSubscriptions(): Promise<Subscription[]> {
  if (!DB_AVAILABLE) return fileGetSubscriptions();
  const p = await getPrisma();
  return (await p.subscription.findMany()).map(mapSubscription);
}

export async function getSubscriptionByEnrollmentId(id: string): Promise<Subscription | undefined> {
  if (!DB_AVAILABLE) return fileGetSubscriptions().find((s) => s.enrollmentId === id);
  const p = await getPrisma();
  const r = await p.subscription.findUnique({ where: { enrollmentId: id } });
  return r ? mapSubscription(r) : undefined;
}

export async function saveSubscription(sub: Subscription): Promise<void> {
  if (!DB_AVAILABLE) { fileSaveSubscription(sub); return; }
  const p = await getPrisma();
  await p.subscription.upsert({
    where:  { enrollmentId: sub.enrollmentId },
    update: { status: sub.status,
              startDate:  sub.startDate  ? new Date(sub.startDate)  : null,
              expiryDate: sub.expiryDate ? new Date(sub.expiryDate) : null },
    create: { id: sub.id, enrollmentId: sub.enrollmentId, plan: sub.plan,
              status: sub.status,
              startDate:  sub.startDate  ? new Date(sub.startDate)  : null,
              expiryDate: sub.expiryDate ? new Date(sub.expiryDate) : null },
  });
}

// ── Combined records (admin dashboard) ───────────────────────
export async function getAllEnrollmentRecords(): Promise<EnrollmentRecord[]> {
  if (!DB_AVAILABLE) {
    const enrollments    = fileGetEnrollments();
    const payments       = fileGetPayments();
    const subscriptions  = fileGetSubscriptions();
    return enrollments.map((enrollment) => ({
      enrollment,
      payment:      payments.find((p) => p.enrollmentId === enrollment.enrollmentId),
      subscription: subscriptions.find((s) => s.enrollmentId === enrollment.enrollmentId),
    }));
  }
  const p   = await getPrisma();
  const rows = await p.enrollment.findMany({
    orderBy: { createdAt: "desc" },
    include: { payment: true, subscription: true },
  });
  return rows.map((r: any) => ({
    enrollment:   mapEnrollment(r),
    payment:      r.payment      ? mapPayment(r.payment)           : undefined,
    subscription: r.subscription ? mapSubscription(r.subscription) : undefined,
  }));
}

export async function getEnrollmentRecord(id: string): Promise<EnrollmentRecord | undefined> {
  if (!DB_AVAILABLE) {
    const enrollment = fileGetEnrollments().find((e) => e.enrollmentId === id);
    if (!enrollment) return undefined;
    return {
      enrollment,
      payment:      fileGetPayments().find((p) => p.enrollmentId === id),
      subscription: fileGetSubscriptions().find((s) => s.enrollmentId === id),
    };
  }
  const p = await getPrisma();
  const r = await p.enrollment.findUnique({
    where: { enrollmentId: id },
    include: { payment: true, subscription: true },
  });
  if (!r) return undefined;
  return {
    enrollment:   mapEnrollment(r),
    payment:      r.payment      ? mapPayment(r.payment)           : undefined,
    subscription: r.subscription ? mapSubscription(r.subscription) : undefined,
  };
}
