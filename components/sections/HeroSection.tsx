"use client";

import { useState, useEffect } from "react";

const TYPED_WORDS = ["PROGRAMMING", "AI & ML", "WEB DEVELOPMENT", "DATA ANALYTICS", "AUTOMATION", "IoT SYSTEMS"];

const CHECK_ITEMS = [
  "100% Practical, Real-World Training",
  "WhatsApp Support Throughout",
  "Flexible Online & Physical Modes",
  "Certificate on Completion",
];

/* Inline SVG globe — orbital rings with glowing sphere */
function GlobeIllustration() {
  return (
    <div className="relative w-72 h-72 sm:w-96 sm:h-96 mx-auto float">
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />

      {/* Core sphere */}
      <div
        className="absolute inset-[18%] rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 35%, rgba(56,189,248,0.35) 0%, rgba(14,165,233,0.2) 40%, rgba(7,11,20,0.8) 100%)",
          border: "1px solid rgba(14,165,233,0.35)",
          boxShadow: "0 0 40px rgba(14,165,233,0.25), inset 0 0 40px rgba(14,165,233,0.1)",
        }}
      >
        {/* Sphere grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
          <ellipse cx="50" cy="50" rx="48" ry="20" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
          <ellipse cx="50" cy="50" rx="48" ry="35" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
          <line x1="2" y1="50" x2="98" y2="50" stroke="#38bdf8" strokeWidth="0.5" />
          <line x1="50" y1="2" x2="50" y2="98" stroke="#38bdf8" strokeWidth="0.5" />
        </svg>

        {/* Glowing node */}
        <div
          className="absolute w-3 h-3 rounded-full"
          style={{
            top: "30%", left: "60%",
            background: "#22d3ee",
            boxShadow: "0 0 12px #22d3ee, 0 0 24px rgba(34,211,238,0.5)",
          }}
        />
        <div
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: "65%", left: "35%",
            background: "#0ea5e9",
            boxShadow: "0 0 8px #0ea5e9",
          }}
        />
      </div>

      {/* Orbit ring 1 */}
      <div
        className="orbit absolute inset-[8%] rounded-full"
        style={{ border: "1px solid rgba(14,165,233,0.25)" }}
      >
        <div
          className="absolute w-3.5 h-3.5 rounded-full -top-1.5 left-1/2 -translate-x-1/2"
          style={{
            background: "#0ea5e9",
            boxShadow: "0 0 10px #0ea5e9, 0 0 20px rgba(14,165,233,0.6)",
          }}
        />
      </div>

      {/* Orbit ring 2 — reverse, tilted */}
      <div
        className="orbit-rev absolute inset-0 rounded-full"
        style={{
          border: "1px solid rgba(239,68,68,0.2)",
          transform: "rotateX(70deg) rotateZ(20deg)",
        }}
      >
        <div
          className="absolute w-2.5 h-2.5 rounded-full top-0 right-[25%]"
          style={{
            background: "#f87171",
            boxShadow: "0 0 8px rgba(248,113,113,0.8)",
          }}
        />
      </div>

      {/* Floating connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 400">
        <line x1="320" y1="80" x2="200" y2="200" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="80" y1="300" x2="200" y2="200" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="320" cy="80" r="4" fill="#38bdf8" />
        <circle cx="80" cy="300" r="3" fill="#38bdf8" />
      </svg>
    </div>
  );
}

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  /* Typing animation */
  useEffect(() => {
    const current = TYPED_WORDS[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setWordIndex((i) => (i + 1) % TYPED_WORDS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden dot-bg"
      style={{ paddingTop: "var(--nav-h)" }}
      aria-label="Hero"
    >
      {/* ── Background radial glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-right large blue glow */}
        <div
          className="absolute"
          style={{
            top: "-15%", right: "-10%",
            width: "55vw", height: "55vw",
            background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 65%)",
          }}
        />
        {/* Bottom-left cyan glow */}
        <div
          className="absolute"
          style={{
            bottom: "-10%", left: "-5%",
            width: "40vw", height: "40vw",
            background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
          }}
        />
        {/* Subtle gradient overlay to deepen bg at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32"
          style={{ background: "linear-gradient(to top, var(--bg-base), transparent)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ── Left column: text ── */}
          <div>
            {/* Eyebrow label */}
            <span className="section-label">
              Technology Training Platform · Zambia
            </span>

            {/* Main headline */}
            <h1 className="font-black text-4xl sm:text-5xl md:text-6xl leading-[1.08] tracking-tight mb-5">
              <span className="text-white">MASTER</span>
              <br />
              <span className="text-white">THE ART OF</span>
              <br />
              <span className="text-gradient">{displayed}</span>
              <span className="cursor-blink" aria-hidden="true" />
            </h1>

            {/* Sub-copy */}
            <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
              style={{ color: "var(--text-secondary)" }}>
              Practical technology training designed to help you develop
              real-world digital skills and build solutions for the future.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a href="#enroll" className="btn-glow">
                Enroll Now
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a href="#courses" className="btn-ghost">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#22c55e", boxShadow: "0 0 8px #22c55e" }}
                />
                Explore Courses
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>

            {/* Feature checklist */}
            <ul className="space-y-2.5">
              {CHECK_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 shrink-0"
                    style={{ color: "var(--blue)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm" style={{ color: "rgba(241,245,249,0.8)" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right column: globe ── */}
          <div className="hidden lg:flex items-center justify-center">
            <GlobeIllustration />
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div
          className="mt-16 sm:mt-20 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {[
            { value: "7+",    label: "Courses" },
            { value: "3",     label: "Plans" },
            { value: "100%",  label: "Practical" },
            { value: "24/7",  label: "Support" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl sm:text-3xl font-black mb-0.5"
                style={{ color: "var(--cyan)" }}
              >
                {stat.value}
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#courses"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-opacity opacity-50 hover:opacity-100"
        aria-label="Scroll to courses"
      >
        <svg
          className="w-5 h-5 animate-bounce"
          style={{ color: "var(--blue)" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
}
