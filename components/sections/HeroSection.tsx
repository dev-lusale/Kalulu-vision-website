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
      className="relative overflow-hidden"
      style={{ paddingTop: "64px", minHeight: "100vh" }}
      aria-label="Hero"
    >
      {/* ── Full background image ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.png"
          alt=""
          fill
          priority
          quality={90}
          style={{ objectFit: "cover", objectPosition: "center top" }}
          sizes="100vw"
        />
        {/* Overlay so text stays readable */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(105deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 45%, rgba(255,255,255,0.55) 72%, rgba(255,255,255,0.15) 100%)",
          }}
        />
      </div>

      {/* Subtle lime wash at top */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-0"
        style={{
          height: "55%",
          background: "radial-gradient(ellipse at 20% 0%, rgba(233,255,163,0.35) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: text ── */}
          <div>
            {/* Eyebrow */}
            <span className="section-label">Technology Training Platform · Zambia</span>

            {/* Headline */}
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

            {/* Sub-copy */}
            <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "#4a5568" }}>
              Practical technology training designed to help you develop
              real-world digital skills and build solutions for the future.
            </p>

            {/* CTAs */}
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

            {/* Checklist */}
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

          {/* ── Right: person photo ── */}
          <div className="hidden lg:flex items-center justify-end">
            <div
              className="relative"
              style={{ width: "420px", height: "480px" }}
            >
              {/* Lime background block behind the image */}
              <div
                className="absolute"
                style={{
                  top: "24px", right: "0",
                  width: "88%", height: "100%",
                  background: "#E9FFA3",
                  borderRadius: "28px",
                  zIndex: 0,
                }}
              />

              {/* Decorative teal circle */}
              <div
                className="absolute"
                style={{
                  top: "0", left: "0",
                  width: "80px", height: "80px",
                  borderRadius: "50%",
                  border: "3px solid #063F3A",
                  zIndex: 1,
                  opacity: 0.4,
                }}
              />

              {/* Small lime square decoration */}
              <div
                className="absolute"
                style={{
                  bottom: "16px", right: "-12px",
                  width: "48px", height: "48px",
                  background: "#063F3A",
                  borderRadius: "10px",
                  zIndex: 1,
                  opacity: 0.7,
                  transform: "rotate(18deg)",
                }}
              />

              {/* Main person image */}
              <div
                className="absolute overflow-hidden"
                style={{
                  top: "0", left: "0",
                  width: "88%", height: "100%",
                  borderRadius: "28px",
                  zIndex: 2,
                  boxShadow: "0 20px 60px rgba(16,24,43,0.18)",
                }}
              >
                <Image
                  src="/background.png"
                  alt="Student learning technology at Kalulu Vision"
                  fill
                  quality={90}
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                  sizes="420px"
                  priority
                />
              </div>
            </div>
          </div>

        </div>

        {/* ── Stats bar ── */}
        <div
          className="mt-16 sm:mt-20 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6"
          style={{ borderTop: "1.5px solid rgba(16,24,43,0.1)" }}
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
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 hover:opacity-70 transition-opacity z-10"
        aria-label="Scroll to courses"
      >
        <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="#10182B" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
}
