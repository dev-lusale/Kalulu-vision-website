"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [show,     setShow]     = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const pwd = password.trim();
    if (!pwd) { setError("Password is required."); return; }
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/admin/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ password: pwd }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "Invalid credentials.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: "100%", maxWidth: "360px", margin: "0 auto" }}>

      {/* ── Brand ── */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <div style={{ borderRadius: "12px", overflow: "hidden" }}>
            <Image
              src="/logo.png"
              alt="Kalulu Vision"
              width={160}
              height={54}
              style={{ height: "54px", width: "auto", objectFit: "contain", mixBlendMode: "screen" }}
              priority
            />
          </div>
        </div>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Admin Portal</p>
      </div>

      {/* ── Card ── */}
      <div style={{
        background:     "rgba(255,255,255,0.04)",
        border:         "1px solid rgba(255,255,255,0.08)",
        borderRadius:   "18px",
        padding:        "28px 24px",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow:      "0 0 40px rgba(14,165,233,0.08), 0 20px 60px rgba(0,0,0,0.5)",
      }}>
        <h2 style={{ color: "#f1f5f9", fontSize: "15px", fontWeight: 700, marginBottom: "22px", marginTop: 0 }}>
          Sign in to continue
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Password field */}
          <div>
            <label
              htmlFor="admin-password"
              style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(241,245,249,0.75)", marginBottom: "6px" }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="admin-password"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter admin password"
                autoComplete="current-password"
                style={{
                  display:         "block",
                  width:           "100%",
                  boxSizing:       "border-box",
                  padding:         "13px 44px 13px 14px",
                  fontSize:        "15px",
                  color:           "#f1f5f9",
                  background:      "rgba(255,255,255,0.06)",
                  border:          error ? "1.5px solid #f87171" : "1.5px solid rgba(255,255,255,0.1)",
                  borderRadius:    "10px",
                  outline:         "none",
                  WebkitAppearance: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1.5px solid #0ea5e9";
                  e.currentTarget.style.background = "rgba(14,165,233,0.07)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = error ? "1.5px solid #f87171" : "1.5px solid rgba(255,255,255,0.1)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }}
              />
              {/* Show/hide toggle */}
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                style={{
                  position:                "absolute",
                  right:                   "12px",
                  top:                     "50%",
                  transform:               "translateY(-50%)",
                  background:              "none",
                  border:                  "none",
                  cursor:                  "pointer",
                  color:                   "#475569",
                  padding:                 "4px",
                  touchAction:             "manipulation",
                  WebkitTapHighlightColor: "transparent",
                } as React.CSSProperties}
              >
                {show ? (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              display:      "flex",
              alignItems:   "center",
              gap:          "8px",
              padding:      "10px 12px",
              borderRadius: "10px",
              background:   "rgba(239,68,68,0.1)",
              border:       "1px solid rgba(239,68,68,0.25)",
            }}>
              <svg width="16" height="16" fill="#f87171" viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span style={{ fontSize: "13px", color: "#f87171" }}>{error}</span>
            </div>
          )}

          {/* Submit button — hardcoded colours, no CSS vars */}
          <button
            type="submit"
            disabled={loading}
            style={{
              display:                 "flex",
              alignItems:              "center",
              justifyContent:          "center",
              gap:                     "8px",
              width:                   "100%",
              padding:                 "15px 20px",
              fontSize:                "16px",
              fontWeight:              700,
              color:                   "#ffffff",
              background:              loading ? "#0284c7" : "#0ea5e9",
              border:                  "none",
              borderRadius:            "14px",
              cursor:                  loading ? "wait" : "pointer",
              opacity:                 loading ? 0.8 : 1,
              touchAction:             "manipulation",
              WebkitTapHighlightColor: "transparent",
              boxShadow:               "0 0 20px rgba(14,165,233,0.4)",
              transition:              "background 0.15s",
            } as React.CSSProperties}
          >
            {loading ? (
              <>
                <svg
                  style={{ animation: "spin 1s linear infinite", width: "18px", height: "18px" }}
                  fill="none" viewBox="0 0 24 24"
                >
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Signing in…
              </>
            ) : "Sign In"}
          </button>

        </form>

        <p style={{ textAlign: "center", fontSize: "11.5px", color: "#475569", marginTop: "14px", marginBottom: 0 }}>
          Kalulu Vision Admin · Authorised access only
        </p>
      </div>

      {/* Back link */}
      <a
        href="/"
        style={{
          display:    "block",
          textAlign:  "center",
          marginTop:  "20px",
          fontSize:   "13px",
          color:      "rgba(148,163,184,0.5)",
          textDecoration: "none",
          touchAction: "manipulation",
        }}
      >
        ← Back to website
      </a>

      {/* Spin keyframe injected inline so it always works */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
