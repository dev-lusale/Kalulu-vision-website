export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteEnrollmentRecord, getEnrollmentByEnrollmentId } from "@/lib/db";
import { sanitizeString } from "@/lib/utils";

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
