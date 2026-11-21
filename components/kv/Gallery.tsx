"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, Photo } from "./ui";

/** Screenshot gallery with an accessible lightbox (native <dialog>, arrow keys, Escape). */
export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [i, setI] = useState<number | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (i !== null && !d.open) d.showModal();
    if (i === null && d.open) d.close();
  }, [i]);

  useEffect(() => {
    if (i === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setI((v) => (v === null ? v : (v + 1) % images.length));
      if (e.key === "ArrowLeft") setI((v) => (v === null ? v : (v - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, images.length]);

  if (!images.length) return null;
  const alt = (n: number) => `${title} screenshot ${n + 1} of ${images.length}`;

  return (
    <>
      <ul className={`grid gap-4 ${images.length > 1 ? "sm:grid-cols-2" : ""} ${images.length > 2 ? "lg:grid-cols-3" : ""}`}>
        {images.map((src, n) => (
          <li key={src}>
            <button type="button" onClick={(e) => { opener.current = e.currentTarget; setI(n); }}
              className="group kv-photo relative block aspect-[16/10] w-full rounded-xl border border-line shadow-card" aria-label={`Enlarge ${alt(n)}`}>
              <Photo src={src} alt="" sizes="(min-width: 1024px) 33vw, 50vw" className="object-top transition-transform duration-500 group-hover:scale-[1.03]" />
              <span className="absolute right-2 bottom-2 grid size-9 place-items-center rounded-lg bg-surface/90 text-fg opacity-0 shadow-card transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"><Icon name="search" className="size-4" /></span>
            </button>
          </li>
        ))}
      </ul>

      <dialog ref={dlg} onClose={() => { setI(null); opener.current?.focus(); }} onClick={(e) => { if (e.target === dlg.current) setI(null); }}
        aria-label={i !== null ? alt(i) : "Screenshot"}
        className="m-auto max-h-[92vh] w-[min(1200px,94vw)] overflow-visible bg-transparent p-0 backdrop:bg-black/80">
        {i !== null && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[i]} alt={alt(i)} className="mx-auto max-h-[82vh] w-auto rounded-xl bg-white object-contain shadow-2xl" />
            <div className="mt-3 flex items-center justify-between text-white">
              <span className="text-sm">{i + 1} / {images.length}</span>
              <div className="flex gap-2">
                {images.length > 1 && <>
                  <button type="button" onClick={() => setI((i - 1 + images.length) % images.length)} className="grid size-11 place-items-center rounded-lg bg-white/15 hover:bg-white/25" aria-label="Previous screenshot"><Icon name="arrowRight" className="size-5 rotate-180" /></button>
                  <button type="button" onClick={() => setI((i + 1) % images.length)} className="grid size-11 place-items-center rounded-lg bg-white/15 hover:bg-white/25" aria-label="Next screenshot"><Icon name="arrowRight" className="size-5" /></button>
                </>}
                <button type="button" onClick={() => setI(null)} className="grid size-11 place-items-center rounded-lg bg-white/15 hover:bg-white/25" aria-label="Close"><Icon name="close" className="size-5" /></button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
