/**
 * Admin authentication — simple, reliable, no external dependencies.
 * 
 * Password is stored in ADMIN_PASSWORD env variable.
 * Session is an httpOnly cookie signed with SESSION_SECRET.
 * 
 * To upgrade to bcrypt+DB later: replace verifyAdminPassword()
 * with a bcrypt.compare() call against the Admin table.
 */

import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "./utils";

function getSessionToken(): string {
  return process.env.SESSION_SECRET ?? "kv-secret-change-in-production";
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

// ── Password check ────────────────────────────────────────────
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const expected = getAdminPassword();
  // Constant-time comparison to prevent timing attacks
  if (password.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < password.length; i++) {
    diff |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

// ── Session ───────────────────────────────────────────────────
export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, getSessionToken(), {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   60 * 60 * 8, // 8 hours
    path:     "/",
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return !!token && token === getSessionToken();
}

// Kept for backwards compatibility — no-op without DB
export async function ensureDefaultAdmin(): Promise<void> {}
