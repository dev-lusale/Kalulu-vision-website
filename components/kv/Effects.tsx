"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Site-wide progressive enhancements:
 *  - scroll reveal for [data-reveal] (content is fully visible without JS / with reduced motion)
 *  - pointer-tracking glow for .kv-glow-card
 */
export function Effects() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    root.classList.add("js-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach((el) => {
      // anything already above the fold appears immediately
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) requestAnimationFrame(() => el.classList.add("is-in"));
      else io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    function onMove(e: PointerEvent) {
      const card = (e.target as Element | null)?.closest?.(".kv-glow-card") as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  // Old links to the former single-page training site (/#enroll etc.) now live at /training.
  useEffect(() => {
    if (pathname === "/" && ["#courses", "#plans", "#enroll", "#contact"].includes(window.location.hash)) {
      window.location.replace(`/training${window.location.hash}`);
    }
  }, [pathname]);

  return null;
}
