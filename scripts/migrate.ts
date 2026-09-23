/**
 * Run during Vercel build to push the Prisma schema to Neon.
 * Called via: node -r ts-node/register scripts/migrate.ts
 * OR directly as part of the build command.
 */

import { execSync } from "child_process";

const url =
  process.env.kaluluvision_POSTGRES_PRISMA_URL ||
  process.env.kaluluvision_DATABASE_URL        ||
  process.env.DATABASE_URL;

if (!url) {
  console.log("[migrate] No DATABASE_URL — skipping schema push.");
  process.exit(0);
}

// Set DATABASE_URL so prisma can read it
process.env.DATABASE_URL = url;

console.log("[migrate] Pushing Prisma schema to database...");
try {
  execSync("node node_modules/prisma/build/index.js db push --skip-generate --accept-data-loss", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: url },
  });
  console.log("[migrate] ✓ Schema pushed successfully.");
} catch (e) {
  console.error("[migrate] Failed:", e);
  process.exit(1);
}
