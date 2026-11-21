"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Site-wide progressive enhancements:
 *  - scroll reveal for [data-reveal] (content is fully visible without JS / with reduced motion)
 *  - gentle parallax for [data-parallax] photos
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

  // Gentle parallax for [data-parallax="<speed>"] (photos inside overflow-hidden frames)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (!els.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        const speed = Number(el.dataset.parallax) || 0.08;
        const offset = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.08)`;
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [pathname]);

  // Old links to the former single-page training site (/#enroll etc.) now live at /training.
  useEffect(() => {
    if (pathname === "/" && ["#courses", "#plans", "#enroll", "#contact"].includes(window.location.hash)) {
      window.location.replace(`/training${window.location.hash}`);
    }
  }, [pathname]);

  return null;
}
