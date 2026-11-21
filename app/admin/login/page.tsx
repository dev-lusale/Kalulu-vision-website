import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { authConfigError, isAdminAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");
  return (
    <main id="main" className="relative grid min-h-dvh place-items-center overflow-hidden bg-soft px-4 py-10">
      <div className="kv-dots pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative w-full max-w-sm"><AdminLoginForm configError={authConfigError()} /></div>
    </main>
  );
}
