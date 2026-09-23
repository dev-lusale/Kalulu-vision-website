export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { getEnrollments, saveEnrollment } from "@/lib/db";
import type { Enrollment } from "@/lib/types";
import { generateEnrollmentId, generateId, sanitizeString } from "@/lib/utils";
import { COURSES, PLANS, LEARNING_MODES } from "@/lib/config";
import type { CourseId, PlanId, LearningMode } from "@/lib/config";

const VALID_COURSE_IDS = new Set<string>(COURSES.map((c) => c.id));
const VALID_PLAN_IDS   = new Set<string>(PLANS.map((p) => p.id));
const VALID_MODES      = new Set<string>(LEARNING_MODES.map((m) => m.value));

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const fullName     = sanitizeString(body.fullName);
    const whatsapp     = sanitizeString(body.whatsapp);
    const email        = sanitizeString(body.email);
    const course       = sanitizeString(body.course);
    const plan         = sanitizeString(body.plan);
    const learningMode = sanitizeString(body.learningMode);
    const subTopic     = sanitizeString(body.subTopic);

    if (!fullName)                                             return err("Full name is required.", 400);
    if (!whatsapp || !/^[+\d\s\-()]{7,20}$/.test(whatsapp))  return err("Valid WhatsApp number is required.", 400);
    if (!email    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err("Valid email address is required.", 400);
    if (!VALID_COURSE_IDS.has(course))                         return err("Invalid course selection.", 400);
    if (!VALID_PLAN_IDS.has(plan))                             return err("Invalid plan selection.", 400);
    if (!VALID_MODES.has(learningMode))                        return err("Invalid learning mode.", 400);

    // Idempotency — same email + course returns existing enrollment
    const all      = await getEnrollments();
    const existing = all.find(
      (e) => e.email.toLowerCase() === email.toLowerCase() && e.course === course
    );
    if (existing) return ok(existing, 200);

    const enrollment: Enrollment = {
      id:           generateId(),
      enrollmentId: generateEnrollmentId(),
      fullName,
      whatsapp,
      email,
      course:       course       as CourseId,
      plan:         plan         as PlanId,
      learningMode: learningMode as LearningMode,
      createdAt:    new Date().toISOString(),
    };

    await saveEnrollment(enrollment);
    return ok(enrollment, 201);
  } catch (e) {
    console.error("[POST /api/enrollments]", e);
    return err("Internal server error.", 500);
  }
}

export async function GET() {
  return err("Not authorized.", 403);
}

function ok(data: unknown, status = 200) {
  return Response.json({ success: true, data }, { status });
}
function err(error: string, status = 400) {
  return Response.json({ success: false, error }, { status });
}
