/**
 * Prisma client singleton.
 *
 * Vercel Postgres Storage creates vars with a project prefix
 * (kaluluvision_DATABASE_URL). We support both the prefixed
 * and unprefixed names so the app works in all environments.
 */

import { PrismaClient } from "@prisma/client";

// Resolve the connection URL — try the Vercel-prefixed name first,
// then fall back to plain DATABASE_URL
const databaseUrl =
  process.env.kaluluvision_POSTGRES_PRISMA_URL ||
  process.env.kaluluvision_DATABASE_URL        ||
  process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "No database URL found. Set DATABASE_URL or kaluluvision_DATABASE_URL in your environment."
  );
}

// Inject as DATABASE_URL so Prisma can read it from schema env()
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
