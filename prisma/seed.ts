/**
 * Prisma seed script.
 * Run with: npx prisma db seed
 *
 * Creates the default admin account if none exists.
 * Set ADMIN_PASSWORD and ADMIN_EMAIL in .env.local before seeding.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.admin.count();
  if (existing > 0) {
    console.log("✓ Admin already exists — skipping seed.");
    return;
  }

  const rawPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const email       = process.env.ADMIN_EMAIL    ?? "admin@kaluluvision.com";
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  await prisma.admin.create({
    data: { email, passwordHash },
  });

  console.log(`✓ Admin created: ${email}`);
  console.log(`  Password: ${rawPassword}  ← change this in production!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
