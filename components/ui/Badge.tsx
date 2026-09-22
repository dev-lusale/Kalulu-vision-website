import type { ReactNode } from "react";

type Variant =
  | "pending"
  | "verified"
  | "rejected"
  | "active"
  | "expired"
  | "disabled"
  | "info";

const variantClasses: Record<Variant, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 border border-yellow-200",
  verified:
    "bg-green-100 text-green-800 border border-green-200",
  rejected:
    "bg-red-100 text-red-800 border border-red-200",
  active:
    "bg-blue-100 text-blue-800 border border-blue-200",
  expired:
    "bg-gray-100 text-gray-600 border border-gray-200",
  disabled:
    "bg-gray-100 text-gray-500 border border-gray-200",
  info:
    "bg-indigo-100 text-indigo-800 border border-indigo-200",
};

interface BadgeProps {
  variant: Variant;
  children: ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
