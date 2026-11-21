import "server-only";
import { Pool, type QueryResultRow } from "pg";

/**
 * Postgres connection pool (node-postgres).
 * Resolves the URL from DATABASE_URL or the variable names Vercel's Neon
 * integration creates. When no URL is set, hasDatabase() is false and callers
 * fall back to built-in defaults (public pages) or show a setup notice (admin).
 */
export function resolveDatabaseUrl(): string {
  const e = process.env;
  const raw =
    e.DATABASE_URL || e.kaluluvision_POSTGRES_PRISMA_URL || e.kaluluvision_DATABASE_URL ||
    e.POSTGRES_PRISMA_URL || e.POSTGRES_URL || e.DATABASE_URL_UNPOOLED || "";
  if (!raw) return "";
  try {
    const u = new URL(raw);
    // sslmode is dropped because TLS is configured explicitly below (full certificate verification)
    for (const k of ["pgbouncer", "connection_limit", "pool_timeout", "schema", "connect_timeout", "sslmode"]) u.searchParams.delete(k);
    return u.toString();
  } catch {
    return raw;
  }
}

export function hasDatabase(): boolean {
  return resolveDatabaseUrl() !== "";
}

const g = globalThis as unknown as { __kvPool?: Pool };

function pool(): Pool {
  if (g.__kvPool) return g.__kvPool;
  const url = resolveDatabaseUrl();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  let ssl: false | { rejectUnauthorized: boolean } = { rejectUnauthorized: true };
  try {
    const host = new URL(url).hostname;
    if (host === "localhost" || host === "127.0.0.1") ssl = false;
  } catch { /* keep ssl */ }
  g.__kvPool = new Pool({ connectionString: url, ssl, max: 5, idleTimeoutMillis: 120_000, connectionTimeoutMillis: 10_000 });
  g.__kvPool.on("error", (err) => console.error("[db] idle client error", err.message));
  return g.__kvPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<T[]> {
  const res = await pool().query<T>(text, params as unknown[]);
  return res.rows;
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<T | undefined> {
  const rows = await query<T>(text, params);
  return rows[0];
}

/** Cheap round trip used to wake the database (Neon pauses it after ~5 idle minutes). */
export async function ping(): Promise<void> {
  await pool().query("SELECT 1");
}
