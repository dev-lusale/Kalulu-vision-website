import type { CourseId, LearningMode, PlanId } from "./config";

// ── Enrollment ────────────────────────────────────────────────
export interface Enrollment {
  id: string; // UUID
  enrollmentId: string; // KV-2026-XXXXX
  fullName: string;
  whatsapp: string;
  email: string;
  course: CourseId;
  plan: PlanId;
  learningMode: LearningMode;
  createdAt: string; // ISO date string
}

// ── Payment ───────────────────────────────────────────────────
export type PaymentStatus =
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "REJECTED";

export interface Payment {
  id: string;
  enrollmentId: string;
  amount: number;
  paymentMethod: string;
  status: PaymentStatus;
  submittedAt: string;
  verifiedAt?: string;
}

// ── Subscription ──────────────────────────────────────────────
export type SubscriptionStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "DISABLED";

export interface Subscription {
  id: string;
  enrollmentId: string;
  plan: PlanId;
  status: SubscriptionStatus;
  startDate?: string;
  expiryDate?: string;
}

// ── Combined record (for admin dashboard) ────────────────────
export interface EnrollmentRecord {
  enrollment: Enrollment;
  payment?: Payment;
  subscription?: Subscription;
}

// ── API response shapes ───────────────────────────────────────
export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;
