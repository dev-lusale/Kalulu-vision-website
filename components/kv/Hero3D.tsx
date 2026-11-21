"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * The hero visual. Renders a lightweight CSS-layered logo immediately (also the
 * fallback), then upgrades to the three.js scene when the device can handle it.
 */
export function Hero3D({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"fallback" | "webgl">("fallback");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const weak = (nav.deviceMemory !== undefined && nav.deviceMemory < 2) || nav.connection?.saveData === true;
    const mobile = window.matchMedia("(max-width: 767px)").matches || window.matchMedia("(pointer: coarse)").matches;

    let gl = false;
    try {
      const c = document.createElement("canvas");
      gl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch { gl = false; }

    if (!gl || weak || reduced || !canvasRef.current) return; // keep the static fallback
    // Hidden (e.g. on phones the 3D card is not shown): never download the 3D engine.
    if (canvasRef.current.getClientRects().length === 0 || canvasRef.current.offsetParent === null) return;
    let disposed = false;
    let handle: { dispose(): void } | null = null;
    // Load the 3D engine only after the page has finished loading, so it never delays first paint.
    const start = () => {
      if (disposed) return;
      import("./hero-scene")
        .then(({ createHeroScene }) => {
          if (disposed || !canvasRef.current) return;
          handle = createHeroScene(canvasRef.current, { mobile, reducedMotion: reduced, onReady: () => !disposed && setMode("webgl") });
        })
        .catch((e) => console.warn("[hero] 3D unavailable, using fallback", e));
    };
    const idle = (cb: () => void) => (typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(cb, { timeout: 2500 }) : setTimeout(cb, 1200));
    if (document.readyState === "complete") idle(start);
    else window.addEventListener("load", () => idle(start), { once: true });
    return () => { disposed = true; handle?.dispose(); };
  }, []);

  // CSS tilt for the fallback (desktop pointers only)
  useEffect(() => {
    const el = fallbackRef.current;
    if (!el || mode !== "fallback") return;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      el.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * 14).toFixed(2)}deg`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mode]);

  return (
    <div className={`relative aspect-square [perspective:1200px] ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className={`absolute inset-[-12%] h-[124%] w-[124%] [mask-image:radial-gradient(closest-side,#000_80%,transparent)] transition-opacity duration-1000 ${mode === "webgl" ? "opacity-100" : "opacity-0"}`} />
      <div
        ref={fallbackRef}
        className={`absolute inset-[10%] transition-[opacity,transform] duration-700 ease-out [transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,-8deg))] ${mode === "webgl" ? "opacity-0" : "opacity-100"}`}
      >
        <div className="absolute inset-[12%] rounded-full bg-brand/20 blur-[50px]" />
        {[0.08, 0.04].map((z, i) => (
          <Image key={z} src="/brand/logo-640.webp" alt="" width={640} height={640} sizes="208px" className="absolute inset-0 h-full w-full brightness-[0.45] saturate-150"
            style={{ transform: `translateZ(-${z * 300}px) translate(${(i + 1) * 3}px, ${(i + 1) * 3}px)` }} />
        ))}
        <Image src="/brand/logo-640.webp" alt="" width={640} height={640} sizes="208px" className="absolute inset-0 h-full w-full drop-shadow-[0_24px_40px_rgb(200_90_0/0.3)]" />
      </div>
    </div>
  );
}
