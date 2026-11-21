/**
 * Admin authentication.
 *
 * - Admin accounts live in the "admins" table (bcrypt password hashes).
 * - Sessions are stateless, HMAC-SHA256-signed cookies: "<adminId>.<email>.<expiry>.<sig>".
 *   The signing key is SESSION_SECRET, which is never sent to the browser.
 * - First-run bootstrap: while the admins table is empty, signing in with
 *   ADMIN_EMAIL + ADMIN_PASSWORD (environment variables) creates the first admin.
 * - Without a database (local development only), ADMIN_PASSWORD alone signs you in.
 * - In production, logins are refused unless SESSION_SECRET is set (≥ 32 chars).
 */
import "server-only";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { hasDatabase, query, queryOne } from "./server/pool";
import { ADMIN_SESSION_COOKIE } from "./utils";

const SESSION_HOURS = 8;
const IS_PROD = process.env.NODE_ENV === "production";

export interface AdminSession { adminId: string; email: string; exp: number }

function secret(): string | null {
  const s = process.env.SESSION_SECRET ?? "";
  if (s.length >= 32) return s;
  if (!IS_PROD) return s || "development-only-session-secret-not-for-production";
  return null;
}

export function authConfigError(): string | null {
  if (!secret()) return "SESSION_SECRET must be set (at least 32 characters) before admins can sign in.";
  return null;
}

function sign(payload: string, key: string): string {
  return crypto.createHmac("sha256", key).update(payload).digest("base64url");
}

function encode(s: AdminSession, key: string): string {
  const payload = [s.adminId, Buffer.from(s.email).toString("base64url"), String(s.exp)].join(".");
  return `${payload}.${sign(payload, key)}`;
}

function decode(token: string | undefined, key: string): AdminSession | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const payload = parts.slice(0, 3).join(".");
  const expected = Buffer.from(sign(payload, key));
  const given = Buffer.from(parts[3]);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;
  const exp = Number(parts[2]);
  if (!Number.isFinite(exp) || exp < Date.now()) return null;
  return { adminId: parts[0], email: Buffer.from(parts[1], "base64url").toString(), exp };
}

// ── Brute-force protection (per server instance) ──────────────
const attempts = new Map<string, { n: number; until: number }>();
export function isRateLimited(key: string): boolean {
  const a = attempts.get(key);
  return !!a && a.n >= 5 && a.until > Date.now();
}
function noteFailure(key: string) {
  const a = attempts.get(key);
  const now = Date.now();
  if (!a || a.until < now) attempts.set(key, { n: 1, until: now + 15 * 60_000 });
  else a.n += 1;
}
function clearFailures(key: string) { attempts.delete(key); }

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

/** Returns the signed-in admin, or an error message. */
export async function verifyAdminCredentials(
  emailRaw: string, password: string, clientKey: string
): Promise<{ ok: true; adminId: string; email: string } | { ok: false; error: string; status: number }> {
  const email = emailRaw.trim().toLowerCase();
  if (isRateLimited(clientKey)) return { ok: false, error: "Too many attempts. Try again in 15 minutes.", status: 429 };
  const cfg = authConfigError();
  if (cfg) return { ok: false, error: cfg, status: 503 };

  const fail = async () => {
    noteFailure(clientKey);
    await new Promise((r) => setTimeout(r, 400));
    return { ok: false as const, error: "Invalid email or password.", status: 401 };
  };

  if (!hasDatabase()) {
    // Local development without Postgres: env password only.
    if (IS_PROD) return { ok: false, error: "Database is not configured.", status: 503 };
    const envPass = process.env.ADMIN_PASSWORD || "admin123";
    if (!safeEqual(password, envPass)) return fail();
    clearFailures(clientKey);
    return { ok: true, adminId: "dev-admin", email: email || "dev@localhost" };
  }

  const row = await queryOne<{ id: string; email: string; passwordHash: string }>(
    `SELECT "id","email","passwordHash" FROM "admins" WHERE lower("email") = $1`, [email]
  );
  if (row) {
    if (!(await bcrypt.compare(password, row.passwordHash))) return fail();
    clearFailures(clientKey);
    return { ok: true, adminId: row.id, email: row.email };
  }

  // Bootstrap the first admin from environment variables.
  const count = Number((await queryOne<{ n: string }>(`SELECT count(*)::text AS n FROM "admins"`))?.n ?? "0");
  const envEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const envPass = process.env.ADMIN_PASSWORD || "";
  if (count === 0 && envEmail && envPass.length >= 10 && email === envEmail && safeEqual(password, envPass)) {
    const id = crypto.randomUUID();
    await query(`INSERT INTO "admins" ("id","email","passwordHash") VALUES ($1,$2,$3)`, [id, envEmail, await bcrypt.hash(envPass, 12)]);
    clearFailures(clientKey);
    return { ok: true, adminId: id, email: envEmail };
  }
  return fail();
}

export async function createAdminSession(adminId: string, email: string): Promise<void> {
  const key = secret();
  if (!key) throw new Error("SESSION_SECRET missing");
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, encode({ adminId, email, exp: Date.now() + SESSION_HOURS * 3600_000 }, key), {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "strict",
    maxAge: SESSION_HOURS * 3600,
    path: "/",
  });
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const key = secret();
  if (!key) return null;
  const store = await cookies();
  return decode(store.get(ADMIN_SESSION_COOKIE)?.value, key);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return (await getAdminSession()) !== null;
}

export async function changeAdminPassword(adminId: string, current: string, next: string): Promise<string | null> {
  if (!hasDatabase()) return "A database is required to change passwords.";
  if (next.length < 10) return "The new password must be at least 10 characters.";
  const row = await queryOne<{ passwordHash: string }>(`SELECT "passwordHash" FROM "admins" WHERE "id" = $1`, [adminId]);
  if (!row || !(await bcrypt.compare(current, row.passwordHash))) return "Your current password is incorrect.";
  await query(`UPDATE "admins" SET "passwordHash" = $1 WHERE "id" = $2`, [await bcrypt.hash(next, 12), adminId]);
  return null;
}
