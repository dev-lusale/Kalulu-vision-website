/** Shared by scripts and the app: resolves the Postgres URL from the env var names
 *  Vercel's Neon integration creates, plus plain DATABASE_URL. */
export function resolveDatabaseUrl({ direct = false } = {}) {
  const e = process.env;
  const pooled =
    e.DATABASE_URL || e.kaluluvision_POSTGRES_PRISMA_URL || e.kaluluvision_DATABASE_URL ||
    e.POSTGRES_PRISMA_URL || e.POSTGRES_URL;
  const unpooled =
    e.DATABASE_URL_UNPOOLED || e.kaluluvision_POSTGRES_URL_NON_POOLING ||
    e.kaluluvision_DATABASE_URL_UNPOOLED || e.POSTGRES_URL_NON_POOLING;
  const url = direct ? (unpooled || pooled) : (pooled || unpooled);
  return url ? cleanUrl(url) : "";
}

/** Prisma-only query params (pgbouncer, connection_limit…) confuse node-postgres. */
function cleanUrl(raw) {
  try {
    const u = new URL(raw);
    for (const k of ["pgbouncer", "connection_limit", "pool_timeout", "schema", "connect_timeout"]) u.searchParams.delete(k);
    return u.toString();
  } catch { return raw; }
}

export function sslFor(url) {
  try {
    const host = new URL(url).hostname;
    if (host === "localhost" || host === "127.0.0.1") return false;
  } catch { /* ignore */ }
  return { rejectUnauthorized: true };
}
