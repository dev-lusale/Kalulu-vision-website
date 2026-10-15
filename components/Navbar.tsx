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

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

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
      {/* ── Main navbar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] nav-bar transition-all duration-200 ${scrolled ? "nav-bar-scrolled" : ""}`}
      >
        <div className="max-w-6xl mx-auto px-4 h-[64px] flex items-center justify-between gap-6">

          {/* Logo */}
          <a href="/" className="shrink-0 flex items-center">
            <div className="rounded-xl overflow-hidden">
              <Image
                src="/logo.png"
                alt="Kalulu Vision"
                width={130}
                height={44}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="px-4 py-2 rounded-lg text-[13.5px] font-semibold transition-all duration-150 hover:bg-[#F5F6F2]"
                  style={{ color: "#10182B" }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/admin"
              className="text-[13px] font-medium transition-colors hover:text-[#10182B]"
              style={{ color: "#7a8394" }}
            >
              Admin
            </a>
            <a
              href="#enroll"
              className="btn-lime text-sm px-5 py-2.5"
              style={{ borderRadius: "8px" }}
            >
              Enroll Now
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden flex items-center justify-center rounded-xl transition-colors"
            style={{
              width: "44px", height: "44px",
              background: open ? "#F5F6F2" : "transparent",
              border: "1.5px solid",
              borderColor: open ? "#E5E7DF" : "transparent",
              color: "#10182B",
              cursor: "pointer",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            } as React.CSSProperties}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></>
              ) : (
                <><line x1="2" y1="5" x2="18" y2="5" /><line x1="2" y1="10" x2="18" y2="10" /><line x1="2" y1="15" x2="18" y2="15" /></>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {open && (
        <div
          className="fixed left-0 right-0 z-[99] md:hidden"
          style={{
            top: "64px",
            background: "#FFFFFF",
            borderBottom: "1px solid #E5E7DF",
            boxShadow: "0 8px 30px rgba(16,24,43,0.1)",
          }}
        >
          <nav className="px-4 pt-3 pb-5 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                type="button"
                onClick={() => navClick(l.href)}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "13px 16px", borderRadius: "10px",
                  fontSize: "15px", fontWeight: 600,
                  color: "#10182B", background: "transparent",
                  border: "none", cursor: "pointer",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                } as React.CSSProperties}
                onTouchStart={e => (e.currentTarget.style.background = "#F5F6F2")}
                onTouchEnd={e => setTimeout(() => { if (e.currentTarget) e.currentTarget.style.background = "transparent"; }, 200)}
              >
                {l.label}
              </button>
            ))}

            <div style={{ borderTop: "1px solid #E5E7DF", margin: "6px 0" }} />

            <button
              type="button"
              onClick={() => navClick("#enroll")}
              className="btn-lime w-full justify-center"
              style={{ padding: "14px 20px", fontSize: "15px", borderRadius: "10px", border: "none" }}
            >
              Enroll Now
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <a
              href="/admin"
              onClick={() => setOpen(false)}
              style={{ display: "block", textAlign: "center", padding: "10px", fontSize: "13px", color: "#7a8394", textDecoration: "none" }}
            >
              Admin Portal
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
