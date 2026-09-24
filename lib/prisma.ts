/**
 * Prisma client singleton.
 *
 * Vercel Storage (Neon) creates env vars with a project prefix:
 *   kaluluvision_DATABASE_URL  (pooled)
 *   kaluluvision_POSTGRES_PRISMA_URL  (pooled + Prisma params)
 *
 * We resolve the best available URL and inject it as DATABASE_URL
 * so Prisma can pick it up from the schema's env() call.
 */

import { PrismaClient } from "@prisma/client";

// Resolve pooled connection URL — try all known Vercel variable names
const url =
  process.env.DATABASE_URL                        ||
  process.env.kaluluvision_POSTGRES_PRISMA_URL    ||
  process.env.kaluluvision_DATABASE_URL           ||
  process.env.POSTGRES_PRISMA_URL                 ||
  process.env.POSTGRES_URL;

if (!url) {
  console.error(
    "[KaluluVision] No database URL found. " +
    "Set DATABASE_URL in your environment variables."
  );
}

// Ensure DATABASE_URL is set so Prisma schema env() resolves it
if (url && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = url;
}

// Also resolve direct/unpooled URL for schema migrations
const directUrl =
  process.env.DATABASE_URL_UNPOOLED                    ||
  process.env.kaluluvision_POSTGRES_URL_NON_POOLING    ||
  process.env.kaluluvision_DATABASE_URL_UNPOOLED       ||
  process.env.POSTGRES_URL_NON_POOLING;

if (directUrl && !process.env.DATABASE_URL_UNPOOLED) {
  process.env.DATABASE_URL_UNPOOLED = directUrl;
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
