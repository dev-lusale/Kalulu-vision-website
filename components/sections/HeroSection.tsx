"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const TYPED_WORDS = ["PROGRAMMING", "AI & ML", "WEB DEVELOPMENT", "DATA ANALYTICS", "AUTOMATION", "IoT SYSTEMS"];

const CHECK_ITEMS = [
  "100% Practical, Real-World Training",
  "WhatsApp Support Throughout",
  "Flexible Online & Physical Modes",
  "Certificate on Completion",
];

/* ── AI network visual (right column) ── */
function AIVisual() {
  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center select-none">
      {/* Lime background block */}
      <div
        className="absolute inset-[8%] rounded-[28px]"
        style={{ background: "#E9FFA3" }}
      />

      {/* Floating globe from existing asset — repurposed with new colors */}
      <div className="relative z-10 float w-64 h-64 sm:w-80 sm:h-80">
        {/* Outer ring */}
        <div
          className="orbit absolute inset-[4%] rounded-full"
          style={{ border: "1.5px solid rgba(6,63,58,0.2)" }}
        >
          <div
            className="absolute w-3.5 h-3.5 rounded-full -top-1.5 left-1/2 -translate-x-1/2"
            style={{ background: "#063F3A", boxShadow: "0 0 10px rgba(6,63,58,0.5)" }}
          />
        </div>

        {/* Inner ring */}
        <div
          className="orbit-rev absolute inset-[18%] rounded-full"
          style={{ border: "1.5px dashed rgba(6,63,58,0.25)" }}
        >
          <div
            className="absolute w-2.5 h-2.5 rounded-full top-0 right-[20%]"
            style={{ background: "#0d7068" }}
          />
        </div>

        {/* Core sphere */}
        <div
          className="absolute inset-[28%] rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, #0a5a52 0%, #063F3A 100%)",
            boxShadow: "0 0 30px rgba(6,63,58,0.3), inset 0 0 20px rgba(233,255,163,0.15)",
          }}
        >
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
            <ellipse cx="50" cy="50" rx="46" ry="18" fill="none" stroke="#E9FFA3" strokeWidth="0.8" />
            <ellipse cx="50" cy="50" rx="46" ry="34" fill="none" stroke="#E9FFA3" strokeWidth="0.8" />
            <line x1="4"  y1="50" x2="96" y2="50" stroke="#E9FFA3" strokeWidth="0.6" />
            <line x1="50" y1="4"  x2="50" y2="96" stroke="#E9FFA3" strokeWidth="0.6" />
          </svg>
          {/* Lime node */}
          <div className="absolute w-2.5 h-2.5 rounded-full"
            style={{ top: "28%", left: "62%", background: "#E9FFA3", boxShadow: "0 0 10px #E9FFA3" }} />
          <div className="absolute w-2 h-2 rounded-full"
            style={{ top: "64%", left: "32%", background: "#c8e86a" }} />
        </div>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 320 320">
          <line x1="260" y1="60"  x2="160" y2="160" stroke="#063F3A" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="60"  y1="260" x2="160" y2="160" stroke="#063F3A" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="260" cy="60"  r="4" fill="#063F3A" />
          <circle cx="60"  cy="260" r="3" fill="#063F3A" />
        </svg>
      </div>

      {/* Decorative geometric shapes (like reference screenshot) */}
      {/* Triangle */}
      <svg
        className="absolute top-[12%] right-[8%] opacity-70"
        width="32" height="28" viewBox="0 0 32 28" fill="none"
      >
        <path d="M16 2L30 26H2L16 2Z" stroke="#063F3A" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>

      {/* Circle ring */}
      <svg
        className="absolute bottom-[14%] left-[6%] opacity-60"
        width="44" height="44" viewBox="0 0 44 44" fill="none"
      >
        <circle cx="22" cy="22" r="18" stroke="#063F3A" strokeWidth="2.5" />
        <circle cx="22" cy="22" r="10" stroke="#063F3A" strokeWidth="1.5" />
        <circle cx="22" cy="22" r="3" fill="#063F3A" />
      </svg>

      {/* Mini lime rectangle */}
      <div
        className="absolute top-[18%] left-[10%] rounded-lg opacity-80"
        style={{ width: "18px", height: "18px", background: "#063F3A", transform: "rotate(15deg)" }}
      />
    </div>
  );
}

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = TYPED_WORDS[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else {
      setIsDeleting(false);
      setWordIndex(i => (i + 1) % TYPED_WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex]);

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-white dot-bg"
      style={{ paddingTop: "calc(44px + 64px)" }}
      aria-label="Hero"
    >
      {/* Soft lime wash top-right */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: "52vw", height: "70vh",
          background: "radial-gradient(ellipse at top right, rgba(233,255,163,0.45) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ── Left: text ── */}
          <div>
            {/* Eyebrow */}
            <span className="section-label">Technology Training Platform · Zambia</span>

            {/* Headline — preserve exact words, just new styling */}
            <h1
              className="font-extrabold leading-[1.05] tracking-tight mb-5"
              style={{
                fontSize: "clamp(2.6rem, 5.5vw, 4rem)",
                color: "#10182B",
              }}
            >
              MASTER
              <br />
              THE ART OF
              <br />
              <span className="text-gradient">{displayed}</span>
              <span className="cursor-blink" aria-hidden="true" />
            </h1>

            {/* Sub-copy — content frozen */}
            <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "#4a5568" }}>
              Practical technology training designed to help you develop
              real-world digital skills and build solutions for the future.
            </p>

            {/* CTAs — exact labels preserved */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a href="#enroll" className="btn-lime">
                Enroll Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a href="#courses" className="btn-navy">
                Explore Courses
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>

            {/* Feature checklist — content frozen */}
            <ul className="space-y-2.5">
              {CHECK_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "#E9FFA3", border: "1.5px solid #c8e86a" }}
                  >
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="#063F3A" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#4a5568" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: visual ── */}
          <div className="hidden lg:block">
            <AIVisual />
          </div>
        </div>

        {/* ── Stats bar — content frozen ── */}
        <div
          className="mt-16 sm:mt-20 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6"
          style={{ borderTop: "1.5px solid #E5E7DF" }}
        >
          {[
            { value: "7+",   label: "Courses"   },
            { value: "3",    label: "Plans"     },
            { value: "100%", label: "Practical" },
            { value: "24/7", label: "Support"   },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold mb-0.5" style={{ color: "#10182B" }}>
                {stat.value}
              </div>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#7a8394" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#courses"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 hover:opacity-70 transition-opacity"
        aria-label="Scroll to courses"
      >
        <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="#10182B" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
}
