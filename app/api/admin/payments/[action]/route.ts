import { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getPaymentByEnrollmentId,
  savePayment,
  getSubscriptionByEnrollmentId,
  saveSubscription,
  getEnrollmentByEnrollmentId,
} from "@/lib/db";
import { generateId, calculateExpiryDate, sanitizeString } from "@/lib/utils";
import type { Subscription } from "@/lib/types";

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/payments/[action]">
) {
  const authed = await isAdminAuthenticated();
  if (!authed) return Response.json({ success: false, error: "Unauthorized." }, { status: 401 });

  const { action } = await ctx.params;
  if (action !== "verify" && action !== "reject")
    return Response.json({ success: false, error: "Invalid action." }, { status: 400 });

  try {
    const body         = await request.json();
    const enrollmentId = sanitizeString(body.enrollmentId);
    if (!enrollmentId) return Response.json({ success: false, error: "Enrollment ID required." }, { status: 400 });

    const payment = await getPaymentByEnrollmentId(enrollmentId);
    if (!payment)  return Response.json({ success: false, error: "Payment record not found." }, { status: 404 });

    if (action === "verify") {
      payment.status     = "VERIFIED";
      payment.verifiedAt = new Date().toISOString();
      await savePayment(payment);

      const enrollment = await getEnrollmentByEnrollmentId(enrollmentId);
      const startDate  = new Date();
      const expiryDate = calculateExpiryDate(enrollment?.plan ?? "monthly", startDate);

      const sub = await getSubscriptionByEnrollmentId(enrollmentId);
      if (sub) {
        sub.status     = "ACTIVE";
        sub.startDate  = startDate.toISOString();
        sub.expiryDate = expiryDate.toISOString();
        await saveSubscription(sub);
      } else {
        const newSub: Subscription = {
          id:          generateId(),
          enrollmentId,
          plan:        enrollment?.plan ?? "monthly",
          status:      "ACTIVE",
          startDate:   startDate.toISOString(),
          expiryDate:  expiryDate.toISOString(),
        };
        await saveSubscription(newSub);
      }
      return Response.json({ success: true, action: "verified" });
    }

    // reject
    payment.status = "REJECTED";
    await savePayment(payment);

    const sub = await getSubscriptionByEnrollmentId(enrollmentId);
    if (sub) {
      sub.status = "DISABLED";
      await saveSubscription(sub);
    }
    return Response.json({ success: true, action: "rejected" });

  } catch (e) {
    console.error("[POST /api/admin/payments/[action]]", e);
    return Response.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
