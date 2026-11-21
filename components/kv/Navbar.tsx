"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./ui";

export interface NavService { slug: string; title: string; summary: string; icon: string }

const LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/products", label: "Products" },
  { href: "/research", label: "Research" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
];
const MORE = [
  { href: "/opportunities", label: "Opportunities" },
  { href: "/training", label: "Tech Lessons" },
];

export function Navbar({ services }: { services: NavService[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);          // mobile drawer
  const [svcOpen, setSvcOpen] = useState(false);    // desktop dropdown
  const ddRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const ddId = useId();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // close menus on navigation (adjust state during render)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) { setLastPath(pathname); setOpen(false); setSvcOpen(false); }

  // dropdown: close on outside click / Escape
  useEffect(() => {
    if (!svcOpen) return;
    const onDown = (e: MouseEvent) => { if (!ddRef.current?.contains(e.target as Node)) setSvcOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setSvcOpen(false); ddRef.current?.querySelector("button")?.focus(); } };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [svcOpen]);

  // drawer: lock scroll, focus trap, Escape
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const panel = drawerRef.current;
    const first = panel?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); menuBtn.current?.focus(); return; }
      if (e.key !== "Tab" || !panel) return;
      const f = Array.from(panel.querySelectorAll<HTMLElement>("a,button")).filter((n) => n.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [open]);

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-orange focus:px-5 focus:py-3 focus:font-semibold focus:text-ink-900">
        Skip to main content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] transition-all duration-500 ${
          scrolled || open ? "border-b border-line bg-ink-900/80 backdrop-blur-xl backdrop-saturate-150" : "border-b border-transparent"
        }`}
      >
        <div className="container-kv flex h-full items-center gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Kalulu Vision home">
            <Image src="/brand/logo-96.webp" alt="" width={40} height={40} priority className="size-10" />
            <span className="font-display text-[1.05rem] font-bold tracking-[0.14em]">KALULU<span className="font-medium text-muted"> VISION</span></span>
          </Link>

          <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 lg:flex">
            <div className="relative" ref={ddRef}>
              <button
                type="button"
                aria-expanded={svcOpen}
                aria-controls={ddId}
                onClick={() => setSvcOpen((v) => !v)}
                className={`flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[0.93rem] font-medium transition-colors hover:text-fg ${active("/services") ? "text-fg" : "text-muted"}`}
              >
                Services <Icon name="chevronDown" className={`size-4 transition-transform duration-300 ${svcOpen ? "rotate-180" : ""}`} />
              </button>
              <div
                id={ddId}
                hidden={!svcOpen}
                className="absolute left-1/2 top-full mt-3 w-[min(720px,90vw)] -translate-x-1/2 rounded-2xl border border-line-strong bg-ink-850/95 p-3 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] backdrop-blur-xl"
              >
                <ul className="grid grid-cols-2 gap-1">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`} className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.05]">
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-white/[0.03] text-orange transition-colors group-hover:border-orange/50">
                          <Icon name={s.icon} />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-fg">{s.title}</span>
                          <span className="mt-0.5 line-clamp-2 block text-[0.8rem] leading-snug text-muted">{s.summary}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/services" className="mt-2 flex items-center justify-between rounded-xl border-t border-line px-3 pt-3 pb-1 text-sm font-semibold text-amber hover:text-orange">
                  View all services <Icon name="arrowRight" className="size-4" />
                </Link>
              </div>
            </div>
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active(l.href) ? "page" : undefined}
                className={`relative flex min-h-11 items-center rounded-full px-4 text-[0.93rem] font-medium transition-colors hover:text-fg ${active(l.href) ? "text-fg" : "text-muted"}`}
              >
                {l.label}
                {active(l.href) && <span className="absolute inset-x-4 bottom-1.5 h-0.5 rounded-full bg-gradient-brand" aria-hidden="true" />}
              </Link>
            ))}
          </nav>

          <Link
            href="/contact"
            className="ml-auto hidden min-h-11 items-center rounded-full bg-gradient-brand px-5 font-display text-sm font-semibold text-ink-900 shadow-[0_8px_30px_-10px_rgb(255_98_0/0.8)] transition-transform hover:-translate-y-0.5 sm:inline-flex lg:ml-2"
          >
            Contact us
          </Link>
          <button
            ref={menuBtn}
            type="button"
            className="ml-auto grid size-11 place-items-center rounded-full border border-line-strong sm:ml-0 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--nav-h)] z-40 overflow-y-auto bg-ink-900/98 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Mobile" className="container-kv flex flex-col gap-8 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <div>
            <p className="eyebrow mb-3">Services</p>
            <ul className="grid gap-1">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="flex min-h-12 items-center gap-3 rounded-xl px-2 text-[0.98rem] text-muted hover:bg-white/[0.04] hover:text-fg">
                    <span className="text-orange"><Icon name={s.icon} /></span>{s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid gap-1 border-t border-line pt-6">
            {[...LINKS, ...MORE].map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={active(l.href) ? "page" : undefined} className={`flex min-h-12 items-center rounded-xl px-2 font-display text-2xl font-medium ${active(l.href) ? "text-orange" : "text-fg"}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className="flex min-h-13 items-center justify-center rounded-full bg-gradient-brand py-3.5 font-display font-semibold text-ink-900">Contact us</Link>
        </nav>
      </div>
    </>
  );
}
