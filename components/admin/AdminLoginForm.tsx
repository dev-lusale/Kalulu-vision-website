"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password.trim()) { setError("Password is required."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) { setError(json.error ?? "Invalid credentials."); return; }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally { setLoading(false); }
  }

  return (
    <div className="w-full max-w-sm mx-auto">

      {/* Brand */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-3">
          <div className="rounded-xl overflow-hidden">
            <Image
              src="/logo.png"
              alt="Kalulu Vision"
              width={160}
              height={54}
              className="h-14 w-auto object-contain"
              style={{ mixBlendMode: "screen" }}
              priority
            />
          </div>
        </div>
        <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>Admin Portal</p>
      </div>

      {/* Card */}
      <div className="glass p-7"
        style={{ boxShadow: "0 0 40px rgba(14,165,233,0.1), 0 24px 64px rgba(0,0,0,0.5)" }}>
        <h2 className="font-bold text-white text-[15px] mb-6">Sign in to continue</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-[13px] font-semibold"
              style={{ color: "rgba(241,245,249,0.75)" }}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter admin password"
                autoComplete="current-password"
                className={`input-base pr-10 ${error ? "input-error" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                style={{ color: "var(--text-muted)" }}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <svg className="w-4 h-4 shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-[12.5px] text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-[15px] font-bold py-3.5 rounded-2xl transition-all cursor-pointer disabled:opacity-50"
            style={{
              background:  loading ? "var(--blue)" : "var(--blue)",
              color:       "#fff",
              boxShadow:   "0 0 24px var(--blue-glow)",
              border:      "none",
              touchAction: "manipulation",
            }}
          >
            {loading ? (
              <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg> Signing in…</>
            ) : "Sign In"}
          </button>
        </form>

        <p className="text-center text-[11.5px] mt-4" style={{ color: "var(--text-muted)" }}>
          Kalulu Vision Admin · Authorised access only
        </p>
      </div>

      <a href="/" className="block text-center text-[13px] mt-5 transition-colors text-white/40 hover:text-[#38bdf8]">
        ← Back to website
      </a>
    </div>
  );
}
