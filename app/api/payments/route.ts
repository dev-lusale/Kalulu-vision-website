import { NextRequest } from "next/server";
import {
  getEnrollmentByEnrollmentId,
  savePayment,
  saveSubscription,
  getPaymentByEnrollmentId,
  getSubscriptionByEnrollmentId,
} from "@/lib/db";
import type { Payment, Subscription } from "@/lib/types";
import { generateId, getPlanPrice, sanitizeString } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body         = await request.json();
    const enrollmentId = sanitizeString(body.enrollmentId);

    if (!enrollmentId) return err("Enrollment ID is required.", 400);

    const enrollment = await getEnrollmentByEnrollmentId(enrollmentId);
    if (!enrollment)   return err("Enrollment not found.", 404);

    // Idempotency
    const existing = await getPaymentByEnrollmentId(enrollmentId);
    if (existing) return ok(existing, 200);

    const payment: Payment = {
      id:            generateId(),
      enrollmentId,
      amount:        getPlanPrice(enrollment.plan),
      paymentMethod: "manual",
      status:        "PENDING_VERIFICATION",
      submittedAt:   new Date().toISOString(),
    };
    await savePayment(payment);

    // Create pending subscription if not already there
    const existingSub = await getSubscriptionByEnrollmentId(enrollmentId);
    if (!existingSub) {
      const subscription: Subscription = {
        id:          generateId(),
        enrollmentId,
        plan:        enrollment.plan,
        status:      "PENDING",
      };
      await saveSubscription(subscription);
    }

    return ok(payment, 201);
  } catch (e) {
    console.error("[POST /api/payments]", e);
    return err("Internal server error.", 500);
  }
}

function ok(data: unknown, status = 200) {
  return Response.json({ success: true, data }, { status });
}
function err(error: string, status = 400) {
  return Response.json({ success: false, error }, { status });
}
