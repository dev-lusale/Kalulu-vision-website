export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getSubscriptionByEnrollmentId,
  saveSubscription,
  getEnrollmentByEnrollmentId,
} from "@/lib/db";
import { calculateExpiryDate, sanitizeString } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/subscriptions/[action]">
) {
  const authed = await isAdminAuthenticated();
  if (!authed) return Response.json({ success: false, error: "Unauthorized." }, { status: 401 });

  const { action } = await ctx.params;
  if (action !== "enable" && action !== "disable")
    return Response.json({ success: false, error: "Invalid action." }, { status: 400 });

  try {
    const body         = await request.json();
    const enrollmentId = sanitizeString(body.enrollmentId);
    if (!enrollmentId)
      return Response.json({ success: false, error: "Enrollment ID required." }, { status: 400 });

    const subscription = await getSubscriptionByEnrollmentId(enrollmentId);
    if (!subscription)
      return Response.json({ success: false, error: "Subscription not found." }, { status: 404 });

    if (action === "enable") {
      const enrollment = await getEnrollmentByEnrollmentId(enrollmentId);
      const startDate  = new Date();
      const expiryDate = calculateExpiryDate(enrollment?.plan ?? "monthly", startDate);
      subscription.status     = "ACTIVE";
      subscription.startDate  = startDate.toISOString();
      subscription.expiryDate = expiryDate.toISOString();
    } else {
      subscription.status = "DISABLED";
    }

    await saveSubscription(subscription);
    return Response.json({ success: true, action });
  } catch (e) {
    console.error("[POST /api/admin/subscriptions/[action]]", e);
    return Response.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
