"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const input = "min-h-12 w-full rounded-lg border border-line-strong bg-surface px-4 text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

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
    <form onSubmit={submit} className="kv-card w-full p-8 shadow-lift" noValidate>
      <Image src="/brand/logo-256.webp" alt="" width={64} height={64} className="mx-auto size-16" />
      <h1 className="mt-5 text-center text-2xl font-bold text-fg" style={{ fontFamily: "var(--font-space-grotesk)" }}>Admin sign in</h1>
      <p className="mt-1 text-center text-sm text-muted">Kalulu Vision content and enrollments</p>
      <div className="mt-8 grid gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-fg">Email</label>
          <input id="email" name="email" type="email" autoComplete="username" required className={input} />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="password" className="text-sm font-semibold text-fg">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
        </div>
        {error && <p role="alert" className="rounded-lg border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
        <button disabled={busy} className="mt-2 min-h-12 rounded-lg bg-primary font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
      </div>
    </form>
  );
}
