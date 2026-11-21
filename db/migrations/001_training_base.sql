-- 001: Training platform tables.
-- Mirrors the tables Prisma previously created with `prisma db push`,
-- so this is a no-op on the existing production database and creates
-- the same structure on a fresh one. Column names stay camelCase (quoted).

CREATE TABLE IF NOT EXISTS "enrollments" (
  "id"           TEXT NOT NULL,
  "enrollmentId" TEXT NOT NULL,
  "fullName"     TEXT NOT NULL,
  "whatsapp"     TEXT NOT NULL,
  "email"        TEXT NOT NULL,
  "course"       TEXT NOT NULL,
  "plan"         TEXT NOT NULL,
  "learningMode" TEXT NOT NULL,
  "subTopic"     TEXT,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "enrollments_enrollmentId_key" ON "enrollments" ("enrollmentId");
CREATE INDEX IF NOT EXISTS "enrollments_email_course_idx" ON "enrollments" ("email", "course");

CREATE TABLE IF NOT EXISTS "payments" (
  "id"            TEXT NOT NULL,
  "enrollmentId"  TEXT NOT NULL,
  "amount"        DOUBLE PRECISION NOT NULL,
  "paymentMethod" TEXT NOT NULL DEFAULT 'manual',
  "status"        TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
  "submittedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "verifiedAt"    TIMESTAMP(3),
  CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "payments_enrollmentId_key" ON "payments" ("enrollmentId");

CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id"           TEXT NOT NULL,
  "enrollmentId" TEXT NOT NULL,
  "plan"         TEXT NOT NULL,
  "status"       TEXT NOT NULL DEFAULT 'PENDING',
  "startDate"    TIMESTAMP(3),
  "expiryDate"   TIMESTAMP(3),
  CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "subscriptions_enrollmentId_key" ON "subscriptions" ("enrollmentId");

CREATE TABLE IF NOT EXISTS "admins" (
  "id"           TEXT NOT NULL,
  "email"        TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "admins_email_key" ON "admins" ("email");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payments_enrollmentId_fkey') THEN
    ALTER TABLE "payments" ADD CONSTRAINT "payments_enrollmentId_fkey"
      FOREIGN KEY ("enrollmentId") REFERENCES "enrollments" ("enrollmentId") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_enrollmentId_fkey') THEN
    ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_enrollmentId_fkey"
      FOREIGN KEY ("enrollmentId") REFERENCES "enrollments" ("enrollmentId") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
