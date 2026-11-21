"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const input = "min-h-12 w-full rounded-xl border border-white/15 bg-[#04070F] px-4 text-white placeholder:text-[#7D879A] focus:border-[#FF8A00] focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30";

export function AdminLoginForm({ configError }: { configError?: string | null }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(configError ?? null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.error ?? "Sign-in failed."); return; }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full rounded-3xl border border-white/10 bg-[#0B1224]/90 p-8 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)] backdrop-blur" noValidate>
      <Image src="/brand/logo-256.webp" alt="" width={64} height={64} className="mx-auto size-16" />
      <h1 className="mt-5 text-center text-2xl font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>Admin sign in</h1>
      <p className="mt-1 text-center text-sm text-[#A7B0C0]">Kalulu Vision content and enrollments</p>
      <div className="mt-8 grid gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-white">Email</label>
          <input id="email" name="email" type="email" autoComplete="username" required className={input} />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="password" className="text-sm font-semibold text-white">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
        </div>
        {error && <p role="alert" className="rounded-xl border border-[#FF8A80]/50 bg-[#FF8A80]/10 px-4 py-3 text-sm text-[#FFB4AD]">{error}</p>}
        <button disabled={busy} className="mt-2 min-h-12 rounded-full bg-[linear-gradient(135deg,#FFB52E,#FF8A00_45%,#FF4D16)] font-semibold text-[#070B18] disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
      </div>
    </form>
  );
}
