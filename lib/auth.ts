/**
 * Admin authentication.
 *
 * STRATEGY:
 * 1. If DATABASE_URL is set AND the DB is reachable → use the Admin table
 *    (password stored as bcrypt hash).
 * 2. If no database is configured OR the DB is unreachable → fall back to
 *    ADMIN_PASSWORD env variable (plain comparison, dev-only).
 *
 * This lets the site work immediately without PostgreSQL while still
 * supporting a full DB setup in production.
 */

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { ADMIN_SESSION_COOKIE } from "./utils";

const SESSION_TOKEN =
  process.env.SESSION_SECRET ?? "kv-secret-change-in-production";

const FALLBACK_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const DB_AVAILABLE = !!process.env.DATABASE_URL;

// ── Lazy-load prisma only when DATABASE_URL is set ────────────
async function tryGetPrisma() {
  if (!DB_AVAILABLE) return null;
  try {
    const { prisma } = await import("./prisma");
    return prisma;
  } catch {
    return null;
  }
}

// ── Password verification ─────────────────────────────────────
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const prisma = await tryGetPrisma();

  if (prisma) {
    try {
      const admin = await prisma.admin.findFirst();
      if (admin) {
        return bcrypt.compare(password, admin.passwordHash);
      }
      // No admin row yet — fall through to env fallback
    } catch {
      // DB unreachable — fall through to env fallback
    }
  }

  // Env-variable fallback (works without any database)
  return password === FALLBACK_PASSWORD;
}

// ── Session management ────────────────────────────────────────
export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return token === SESSION_TOKEN;
}

// ── Admin bootstrap (only runs when DB is available) ─────────
export async function ensureDefaultAdmin(): Promise<void> {
  const prisma = await tryGetPrisma();
  if (!prisma) return; // No DB — nothing to bootstrap

  try {
    const count = await prisma.admin.count();
    if (count > 0) return;

    const rawPassword  = FALLBACK_PASSWORD;
    const passwordHash = await bcrypt.hash(rawPassword, 12);

    await prisma.admin.create({
      data: {
        email:        process.env.ADMIN_EMAIL ?? "admin@kaluluvision.com",
        passwordHash,
      },
    });
    console.log("[KaluluVision] Default admin seeded in database.");
  } catch {
    // DB not ready yet — silently skip
  }
}
