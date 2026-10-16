export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getEnrollmentByEnrollmentId } from "@/lib/db";
import { sanitizeString } from "@/lib/utils";

// ── Lazy-load db write helpers ────────────────────────────────
async function deleteEnrollmentRecord(enrollmentId: string): Promise<void> {
  const HAS_DB = !!(
    process.env.DATABASE_URL                     ||
    process.env.kaluluvision_POSTGRES_PRISMA_URL ||
    process.env.kaluluvision_DATABASE_URL
  );

  if (HAS_DB) {
    const { prisma } = await import("@/lib/prisma");
    // Cascade deletes payment + subscription via schema relations
    await prisma.enrollment.delete({ where: { enrollmentId } });
    return;
  }

  // File-based fallback
  const fs   = require("fs")   as typeof import("fs");
  const path = require("path") as typeof import("path");
  const dir  = path.join(process.cwd(), "data");

  const files = ["enrollments.json", "payments.json", "subscriptions.json"];
  for (const file of files) {
    const fp = path.join(dir, file);
    if (!fs.existsSync(fp)) continue;
    const data = JSON.parse(fs.readFileSync(fp, "utf8")) as { enrollmentId?: string }[];
    const filtered = data.filter((r) => r.enrollmentId !== enrollmentId);
    fs.writeFileSync(fp, JSON.stringify(filtered, null, 2), "utf8");
  }
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/enrollments/[enrollmentId]">
) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return Response.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { enrollmentId } = await ctx.params;
    const id = sanitizeString(enrollmentId);

    if (!id) {
      return Response.json({ success: false, error: "Enrollment ID required." }, { status: 400 });
    }

    const enrollment = await getEnrollmentByEnrollmentId(id);
    if (!enrollment) {
      return Response.json({ success: false, error: "Enrollment not found." }, { status: 404 });
    }

    await deleteEnrollmentRecord(id);

    return Response.json({
      success: true,
      message: `Enrollment ${id} and all associated payment/subscription records deleted.`,
    });
  } catch (e) {
    console.error("[DELETE /api/admin/enrollments/[enrollmentId]]", e);
    return Response.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
