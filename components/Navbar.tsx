"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Courses", href: "#courses" },
  { label: "Plans",   href: "#plans"   },
  { label: "Enroll",  href: "#enroll"  },
  { label: "Contact", href: "#contact" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id.replace("#", ""));
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* scroll → opaque navbar */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* resize → close drawer */
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);

  function navClick(href: string) {
    setOpen(false);
    setTimeout(() => scrollTo(href), 50);
  }

  return (
    <>
      {/* ── Fixed header bar ─────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{
          background:           scrolled || open ? "rgba(7,11,20,0.97)" : "rgba(7,11,20,0.55)",
          backdropFilter:       "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom:         "1px solid rgba(14,165,233,0.12)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-[68px] flex items-center justify-between">

          {/* Logo */}
          <a href="/" className="shrink-0">
            <div className="rounded-xl overflow-hidden">
              <Image
                src="/logo.png"
                alt="Kalulu Vision"
                width={130}
                height={44}
                className="h-11 w-auto object-contain"
                style={{ mixBlendMode: "screen" }}
                priority
              />
            </div>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="px-4 py-2 rounded-lg text-[13.5px] font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/admin" className="text-[13px] text-white/50 hover:text-white/80 transition-colors">
              Admin
            </a>
            <a
              href="#enroll"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-bold px-5 py-2 rounded-full text-white"
              style={{ background: "#0ea5e9", boxShadow: "0 0 18px rgba(14,165,233,0.4)" }}
            >
              Enroll Now
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* ── Hamburger button ── */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden flex items-center justify-center rounded-xl"
            style={{
              width:       "48px",
              height:      "48px",
              background:  open ? "rgba(14,165,233,0.18)" : "rgba(255,255,255,0.06)",
              border:      open ? "1px solid rgba(14,165,233,0.4)" : "1px solid rgba(255,255,255,0.1)",
              color:       "#f1f5f9",
              cursor:      "pointer",
              touchAction: "manipulation",
              /* -webkit-tap removes 300 ms delay on iOS */
              WebkitTapHighlightColor: "transparent",
            } as React.CSSProperties}
          >
            {/* Three lines ↔ X  */}
            <svg
              width="22" height="22"
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <line x1="4"  y1="4"  x2="18" y2="18" />
                  <line x1="18" y1="4"  x2="4"  y2="18" />
                </>
              ) : (
                <>
                  <line x1="2" y1="5"  x2="20" y2="5"  />
                  <line x1="2" y1="11" x2="20" y2="11" />
                  <line x1="2" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>

        </div>
      </header>

      {/* ── Mobile drawer — rendered OUTSIDE header ──────── */}
      {/* Positioned absolutely so it doesn't block header touch events */}
      {open && (
        <div
          className="fixed left-0 right-0 z-[99] md:hidden"
          style={{
            top:                  "68px",
            background:           "rgba(7,11,20,0.98)",
            backdropFilter:       "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom:         "1px solid rgba(14,165,233,0.15)",
            boxShadow:            "0 12px 40px rgba(0,0,0,0.6)",
          }}
        >
          <nav className="px-5 pt-4 pb-6 flex flex-col gap-1">

            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                type="button"
                onClick={() => navClick(l.href)}
                style={{
                  display:                 "block",
                  width:                   "100%",
                  textAlign:               "left",
                  padding:                 "14px 16px",
                  borderRadius:            "12px",
                  fontSize:                "16px",
                  fontWeight:              "600",
                  color:                   "rgba(241,245,249,0.9)",
                  background:              "transparent",
                  border:                  "none",
                  cursor:                  "pointer",
                  touchAction:             "manipulation",
                  WebkitTapHighlightColor: "transparent",
                } as React.CSSProperties}
              >
                {l.label}
              </button>
            ))}

            {/* Divider */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", margin: "6px 0" }} />

            {/* Enroll button */}
            <button
              type="button"
              onClick={() => navClick("#enroll")}
              style={{
                display:                 "flex",
                alignItems:              "center",
                justifyContent:          "center",
                gap:                     "8px",
                width:                   "100%",
                padding:                 "15px 20px",
                borderRadius:            "16px",
                fontSize:                "16px",
                fontWeight:              "700",
                color:                   "#ffffff",
                background:              "#0ea5e9",
                border:                  "none",
                cursor:                  "pointer",
                touchAction:             "manipulation",
                WebkitTapHighlightColor: "transparent",
                boxShadow:               "0 0 24px rgba(14,165,233,0.4)",
              } as React.CSSProperties}
            >
              Enroll Now
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            {/* Admin link */}
            <a
              href="/admin"
              onClick={() => setOpen(false)}
              style={{
                display:                 "block",
                textAlign:               "center",
                padding:                 "10px",
                fontSize:                "13px",
                color:                   "rgba(148,163,184,0.5)",
                touchAction:             "manipulation",
                WebkitTapHighlightColor: "transparent",
                textDecoration:          "none",
              }}
            >
              Admin Portal
            </a>

          </nav>
        </div>
      )}
    </>
  );
}
