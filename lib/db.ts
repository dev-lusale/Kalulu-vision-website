/**
 * Training-platform data access (enrollments, payments, subscriptions).
 *
 * PRODUCTION with a database → PostgreSQL via node-postgres (lib/server/pool.ts)
 * DEVELOPMENT without a database → JSON files in /data on local disk
 * PRODUCTION without a database → in-memory (resets on cold start; for test deploys only)
 *
 * Previously used Prisma; the tables and columns are unchanged (see db/migrations/001).
 */

import "server-only";
import fs from "node:fs";
import path from "node:path";
import { hasDatabase, query, queryOne } from "./server/pool";
import type {
  Enrollment,
  Payment,
  Subscription,
  EnrollmentRecord,
} from "./types";

const IS_PROD = process.env.NODE_ENV === "production";

// Use Postgres whenever a database URL is configured (dev or prod).
const HAS_DB = hasDatabase();

/* eslint-disable @typescript-eslint/no-explicit-any */
function iso(v: unknown): string | undefined {
  if (v == null) return undefined;
  return v instanceof Date ? v.toISOString() : String(v);
}
function mapE(r: any): Enrollment {
  return {
    id: r.id, enrollmentId: r.enrollmentId, fullName: r.fullName,
    whatsapp: r.whatsapp, email: r.email, course: r.course,
    plan: r.plan, learningMode: r.learningMode,
    createdAt: iso(r.createdAt) ?? new Date().toISOString(),
  };
}
function mapP(r: any): Payment {
  return {
    id: r.id, enrollmentId: r.enrollmentId, amount: Number(r.amount),
    paymentMethod: r.paymentMethod, status: r.status,
    submittedAt: iso(r.submittedAt) ?? new Date().toISOString(),
    verifiedAt: iso(r.verifiedAt),
  };
}
function mapS(r: any): Subscription {
  return {
    id: r.id, enrollmentId: r.enrollmentId, plan: r.plan, status: r.status,
    startDate: iso(r.startDate), expiryDate: iso(r.expiryDate),
  };
}

// ─────────────────────────────────────────────────────────────
//  FILE PATH  (local dev, JSON files)
// ─────────────────────────────────────────────────────────────
function getFs()   { return fs;   }
function getPath() { return path; }

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
    return (await query(`SELECT * FROM "enrollments" ORDER BY "createdAt" DESC`)).map(mapE);
  }
  return [...readEnrollments()].reverse();
}

export async function getEnrollmentByEnrollmentId(id: string): Promise<Enrollment | undefined> {
  if (HAS_DB) {
    const r = await queryOne(`SELECT * FROM "enrollments" WHERE "enrollmentId" = $1`, [id]);
    return r ? mapE(r) : undefined;
  }
  return readEnrollments().find((e) => e.enrollmentId === id);
}

export async function saveEnrollment(e: Enrollment & { subTopic?: string }): Promise<void> {
  if (HAS_DB) {
    await query(
      `INSERT INTO "enrollments" ("id","enrollmentId","fullName","whatsapp","email","course","plan","learningMode","subTopic","createdAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT ("enrollmentId") DO UPDATE SET
         "fullName" = EXCLUDED."fullName", "whatsapp" = EXCLUDED."whatsapp", "email" = EXCLUDED."email",
         "course" = EXCLUDED."course", "plan" = EXCLUDED."plan", "learningMode" = EXCLUDED."learningMode"`,
      [e.id, e.enrollmentId, e.fullName, e.whatsapp, e.email, e.course, e.plan, e.learningMode, e.subTopic || null, new Date(e.createdAt)]
    );
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
    return (await query(`SELECT * FROM "payments" ORDER BY "submittedAt" DESC`)).map(mapP);
  }
  return readPayments();
}

export async function getPaymentByEnrollmentId(id: string): Promise<Payment | undefined> {
  if (HAS_DB) {
    const r = await queryOne(`SELECT * FROM "payments" WHERE "enrollmentId" = $1`, [id]);
    return r ? mapP(r) : undefined;
  }
  return readPayments().find((p) => p.enrollmentId === id);
}

export async function savePayment(pay: Payment): Promise<void> {
  if (HAS_DB) {
    await query(
      `INSERT INTO "payments" ("id","enrollmentId","amount","paymentMethod","status","submittedAt","verifiedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT ("enrollmentId") DO UPDATE SET
         "status" = EXCLUDED."status", "paymentMethod" = EXCLUDED."paymentMethod", "verifiedAt" = EXCLUDED."verifiedAt"`,
      [pay.id, pay.enrollmentId, pay.amount, pay.paymentMethod, pay.status, new Date(pay.submittedAt), pay.verifiedAt ? new Date(pay.verifiedAt) : null]
    );
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
    return (await query(`SELECT * FROM "subscriptions"`)).map(mapS);
  }
  return readSubscriptions();
}

export async function getSubscriptionByEnrollmentId(id: string): Promise<Subscription | undefined> {
  if (HAS_DB) {
    const r = await queryOne(`SELECT * FROM "subscriptions" WHERE "enrollmentId" = $1`, [id]);
    return r ? mapS(r) : undefined;
  }
  return readSubscriptions().find((s) => s.enrollmentId === id);
}

export async function saveSubscription(sub: Subscription): Promise<void> {
  if (HAS_DB) {
    await query(
      `INSERT INTO "subscriptions" ("id","enrollmentId","plan","status","startDate","expiryDate")
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT ("enrollmentId") DO UPDATE SET
         "status" = EXCLUDED."status", "startDate" = EXCLUDED."startDate", "expiryDate" = EXCLUDED."expiryDate"`,
      [sub.id, sub.enrollmentId, sub.plan, sub.status,
       sub.startDate ? new Date(sub.startDate) : null, sub.expiryDate ? new Date(sub.expiryDate) : null]
    );
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
    const [es, ps, ss] = await Promise.all([getEnrollments(), getPayments(), getSubscriptions()]);
    return es.map((enrollment) => ({
      enrollment,
      payment:      ps.find((p) => p.enrollmentId === enrollment.enrollmentId),
      subscription: ss.find((x) => x.enrollmentId === enrollment.enrollmentId),
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
    const enrollment = await getEnrollmentByEnrollmentId(id);
    if (!enrollment) return undefined;
    const [payment, subscription] = await Promise.all([getPaymentByEnrollmentId(id), getSubscriptionByEnrollmentId(id)]);
    return { enrollment, payment, subscription };
  }
  const enrollment = readEnrollments().find((e) => e.enrollmentId === id);
  if (!enrollment) return undefined;
  return {
    enrollment,
    payment:      readPayments().find((p) => p.enrollmentId === id),
    subscription: readSubscriptions().find((s) => s.enrollmentId === id),
  };
}

/** Delete an enrollment and its payment/subscription (FK cascade in Postgres). */
export async function deleteEnrollmentRecord(enrollmentId: string): Promise<void> {
  if (HAS_DB) {
    await query(`DELETE FROM "enrollments" WHERE "enrollmentId" = $1`, [enrollmentId]);
    return;
  }
  writeEnrollments(readEnrollments().filter((r) => r.enrollmentId !== enrollmentId));
  writePayments(readPayments().filter((r) => r.enrollmentId !== enrollmentId));
  writeSubscriptions(readSubscriptions().filter((r) => r.enrollmentId !== enrollmentId));
}
