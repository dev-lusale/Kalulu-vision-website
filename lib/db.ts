/**
 * Database access layer.
 *
 * DEV  (no DATABASE_URL) → JSON files in /data on local disk
 * PROD (DATABASE_URL set) → PostgreSQL via Prisma
 *
 * On Vercel without a database, data won't persist between requests.
 * Add DATABASE_URL in Vercel → Settings → Environment Variables to enable
 * full persistence.
 */

import type {
  Enrollment,
  Payment,
  Subscription,
  EnrollmentRecord,
} from "./types";

const IS_PROD = process.env.NODE_ENV === "production";
const HAS_DB = !!(
  process.env.DATABASE_URL                     ||
  process.env.kaluluvision_POSTGRES_PRISMA_URL ||
  process.env.kaluluvision_DATABASE_URL        ||
  process.env.POSTGRES_PRISMA_URL              ||
  process.env.POSTGRES_URL
);

// ─────────────────────────────────────────────────────────────
//  PRISMA PATH  (PostgreSQL)
// ─────────────────────────────────────────────────────────────
async function db() {
  const { prisma } = await import("./prisma");
  return prisma;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapE(r: any): Enrollment {
  return {
    id: r.id, enrollmentId: r.enrollmentId, fullName: r.fullName,
    whatsapp: r.whatsapp, email: r.email, course: r.course,
    plan: r.plan, learningMode: r.learningMode,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  };
}
function mapP(r: any): Payment {
  return {
    id: r.id, enrollmentId: r.enrollmentId, amount: r.amount,
    paymentMethod: r.paymentMethod, status: r.status,
    submittedAt: r.submittedAt instanceof Date ? r.submittedAt.toISOString() : r.submittedAt,
    verifiedAt:  r.verifiedAt  instanceof Date ? r.verifiedAt.toISOString()  : (r.verifiedAt ?? undefined),
  };
}
function mapS(r: any): Subscription {
  return {
    id: r.id, enrollmentId: r.enrollmentId, plan: r.plan, status: r.status,
    startDate:  r.startDate  instanceof Date ? r.startDate.toISOString()  : (r.startDate  ?? undefined),
    expiryDate: r.expiryDate instanceof Date ? r.expiryDate.toISOString() : (r.expiryDate ?? undefined),
  };
}

// ─────────────────────────────────────────────────────────────
//  FILE PATH  (local dev, JSON files)
// ─────────────────────────────────────────────────────────────
function getFs()   { return require("fs")   as typeof import("fs");   }
function getPath() { return require("path") as typeof import("path"); }

function dataDir() {
  return getPath().join(process.cwd(), "data");
}
function ensureDir() {
  const fs = getFs();
  const d  = dataDir();
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}
function readFile<T>(file: string, fallback: T): T {
  try {
    ensureDir();
    const fp = getPath().join(dataDir(), file);
    if (!getFs().existsSync(fp)) return fallback;
    return JSON.parse(getFs().readFileSync(fp, "utf8")) as T;
  } catch { return fallback; }
}
function writeFile<T>(file: string, data: T): void {
  try {
    ensureDir();
    getFs().writeFileSync(
      getPath().join(dataDir(), file),
      JSON.stringify(data, null, 2),
      "utf8"
    );
  } catch (e) {
    // On Vercel the filesystem is read-only — log and continue gracefully
    console.warn("[KaluluVision] Cannot write to /data — add DATABASE_URL for persistence.", e);
  }
}

// ─────────────────────────────────────────────────────────────
//  IN-MEMORY FALLBACK  (Vercel without DATABASE_URL)
//  Data survives within a single serverless function invocation
//  but resets on cold starts.  Good enough for testing deploys.
// ─────────────────────────────────────────────────────────────
const mem = {
  enrollments:   [] as Enrollment[],
  payments:      [] as Payment[],
  subscriptions: [] as Subscription[],
};

// ─────────────────────────────────────────────────────────────
//  HELPERS — pick backend
// ─────────────────────────────────────────────────────────────
function readEnrollments():   Enrollment[]   { return IS_PROD ? mem.enrollments   : readFile("enrollments.json",   []); }
function readPayments():      Payment[]      { return IS_PROD ? mem.payments      : readFile("payments.json",      []); }
function readSubscriptions(): Subscription[] { return IS_PROD ? mem.subscriptions : readFile("subscriptions.json", []); }

function writeEnrollments(d: Enrollment[])     { if (IS_PROD) { mem.enrollments   = d; } else writeFile("enrollments.json",   d); }
function writePayments(d: Payment[])           { if (IS_PROD) { mem.payments      = d; } else writeFile("payments.json",      d); }
function writeSubscriptions(d: Subscription[]) { if (IS_PROD) { mem.subscriptions = d; } else writeFile("subscriptions.json", d); }

// ─────────────────────────────────────────────────────────────
//  PUBLIC API
// ─────────────────────────────────────────────────────────────

// ── Enrollments ──────────────────────────────────────────────
export async function getEnrollments(): Promise<Enrollment[]> {
  if (HAS_DB) {
    const p = await db();
    return (await p.enrollment.findMany({ orderBy: { createdAt: "desc" } })).map(mapE);
  }
  return [...readEnrollments()].reverse();
}

export async function getEnrollmentByEnrollmentId(id: string): Promise<Enrollment | undefined> {
  if (HAS_DB) {
    const p = await db();
    const r = await p.enrollment.findUnique({ where: { enrollmentId: id } });
    return r ? mapE(r) : undefined;
  }
  return readEnrollments().find((e) => e.enrollmentId === id);
}

export async function saveEnrollment(e: Enrollment): Promise<void> {
  if (HAS_DB) {
    const p = await db();
    await p.enrollment.upsert({
      where:  { enrollmentId: e.enrollmentId },
      update: { fullName: e.fullName, whatsapp: e.whatsapp, email: e.email,
                course: e.course, plan: e.plan, learningMode: e.learningMode },
      create: { id: e.id, enrollmentId: e.enrollmentId, fullName: e.fullName,
                whatsapp: e.whatsapp, email: e.email, course: e.course,
                plan: e.plan, learningMode: e.learningMode,
                createdAt: new Date(e.createdAt) },
    });
    return;
  }
  const all = readEnrollments();
  const idx = all.findIndex((x) => x.id === e.id);
  if (idx >= 0) all[idx] = e; else all.push(e);
  writeEnrollments(all);
}

// ── Payments ─────────────────────────────────────────────────
export async function getPayments(): Promise<Payment[]> {
  if (HAS_DB) {
    const p = await db();
    return (await p.payment.findMany({ orderBy: { submittedAt: "desc" } })).map(mapP);
  }
  return readPayments();
}

export async function getPaymentByEnrollmentId(id: string): Promise<Payment | undefined> {
  if (HAS_DB) {
    const p = await db();
    const r = await p.payment.findUnique({ where: { enrollmentId: id } });
    return r ? mapP(r) : undefined;
  }
  return readPayments().find((p) => p.enrollmentId === id);
}

export async function savePayment(pay: Payment): Promise<void> {
  if (HAS_DB) {
    const p = await db();
    await p.payment.upsert({
      where:  { enrollmentId: pay.enrollmentId },
      update: { status: pay.status, paymentMethod: pay.paymentMethod,
                verifiedAt: pay.verifiedAt ? new Date(pay.verifiedAt) : null },
      create: { id: pay.id, enrollmentId: pay.enrollmentId, amount: pay.amount,
                paymentMethod: pay.paymentMethod, status: pay.status,
                submittedAt: new Date(pay.submittedAt),
                verifiedAt:  pay.verifiedAt ? new Date(pay.verifiedAt) : null },
    });
    return;
  }
  const all = readPayments();
  const idx = all.findIndex((x) => x.id === pay.id);
  if (idx >= 0) all[idx] = pay; else all.push(pay);
  writePayments(all);
}

// ── Subscriptions ─────────────────────────────────────────────
export async function getSubscriptions(): Promise<Subscription[]> {
  if (HAS_DB) {
    const p = await db();
    return (await p.subscription.findMany()).map(mapS);
  }
  return readSubscriptions();
}

export async function getSubscriptionByEnrollmentId(id: string): Promise<Subscription | undefined> {
  if (HAS_DB) {
    const p = await db();
    const r = await p.subscription.findUnique({ where: { enrollmentId: id } });
    return r ? mapS(r) : undefined;
  }
  return readSubscriptions().find((s) => s.enrollmentId === id);
}

export async function saveSubscription(sub: Subscription): Promise<void> {
  if (HAS_DB) {
    const p = await db();
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
    return;
  }
  const all = readSubscriptions();
  const idx = all.findIndex((x) => x.id === sub.id);
  if (idx >= 0) all[idx] = sub; else all.push(sub);
  writeSubscriptions(all);
}

// ── Combined records ──────────────────────────────────────────
export async function getAllEnrollmentRecords(): Promise<EnrollmentRecord[]> {
  if (HAS_DB) {
    const p    = await db();
    const rows = await p.enrollment.findMany({
      orderBy: { createdAt: "desc" },
      include: { payment: true, subscription: true },
    });
    return rows.map((r: any) => ({
      enrollment:   mapE(r),
      payment:      r.payment      ? mapP(r.payment)      : undefined,
      subscription: r.subscription ? mapS(r.subscription) : undefined,
    }));
  }
  const enrollments   = readEnrollments();
  const payments      = readPayments();
  const subscriptions = readSubscriptions();
  return [...enrollments].reverse().map((enrollment) => ({
    enrollment,
    payment:      payments.find((p) => p.enrollmentId === enrollment.enrollmentId),
    subscription: subscriptions.find((s) => s.enrollmentId === enrollment.enrollmentId),
  }));
}

export async function getEnrollmentRecord(id: string): Promise<EnrollmentRecord | undefined> {
  if (HAS_DB) {
    const p = await db();
    const r = await p.enrollment.findUnique({
      where: { enrollmentId: id },
      include: { payment: true, subscription: true },
    });
    if (!r) return undefined;
    return {
      enrollment:   mapE(r),
      payment:      r.payment      ? mapP(r.payment)      : undefined,
      subscription: r.subscription ? mapS(r.subscription) : undefined,
    };
  }
  const enrollment = readEnrollments().find((e) => e.enrollmentId === id);
  if (!enrollment) return undefined;
  return {
    enrollment,
    payment:      readPayments().find((p) => p.enrollmentId === id),
    subscription: readSubscriptions().find((s) => s.enrollmentId === id),
  };
}
