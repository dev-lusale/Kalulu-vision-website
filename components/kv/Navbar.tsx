"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Icon } from "./ui";

export interface NavService { slug: string; title: string; summary: string; icon: string }
interface NavChild { href: string; label: string; text?: string; icon?: string }
interface NavItem { href: string; label: string; children?: NavChild[]; mega?: boolean }

export function Navbar({ services, email, phone }: { services: NavService[]; email: string; phone: string }) {
  const pathname = usePathname();
  const ITEMS: NavItem[] = [
    { href: "/", label: "Home" },
    {
      href: "/about", label: "About Us", children: [
        { href: "/about", label: "About Kalulu Vision", text: "Who we are, our mission and values", icon: "compass" },
        { href: "/partnerships", label: "Partnerships", text: "Collaborate with us", icon: "handshake" },
        { href: "/opportunities", label: "Careers & Opportunities", text: "Roles, internships and programmes", icon: "briefcase" },
      ],
    },
    { href: "/services", label: "Services", mega: true, children: services.map((s) => ({ href: `/services/${s.slug}`, label: s.title, text: s.summary, icon: s.icon })) },
    {
      href: "/products", label: "Products", children: [
        { href: "/products", label: "Products & Solutions", text: "What we have built and are building", icon: "layers" },
        { href: "/training", label: "Tech Lessons", text: "Practical technology courses — enrol online", icon: "book" },
      ],
    },
    { href: "/projects", label: "Projects" },
    { href: "/research", label: "Research" },
    { href: "/insights", label: "Insights" },
  ];

  const [open, setOpen] = useState(false);              // mobile drawer
  const [menu, setMenu] = useState<string | null>(null); // desktop dropdown
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // close menus on navigation (adjust state during render)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) { setLastPath(pathname); setOpen(false); setMenu(null); }

  // dropdown: close on outside click / Escape
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => { if (!navRef.current?.contains(e.target as Node)) setMenu(null); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const btn = navRef.current?.querySelector<HTMLButtonElement>(`[data-menu="${menu}"]`);
      setMenu(null); btn?.focus();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [menu]);

  // drawer: lock scroll, focus trap, Escape
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const panel = drawerRef.current;
    // the drawer starts right under the header, wherever the header currently sits
    if (panel && headerRef.current) panel.style.top = `${Math.max(0, headerRef.current.getBoundingClientRect().bottom)}px`;
    panel?.querySelector<HTMLElement>("a,button")?.focus();
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

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));
  const groupActive = (it: NavItem) => active(it.href) || !!it.children?.some((c) => active(c.href));

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-5 focus:py-3 focus:font-semibold focus:text-on-primary">
        Skip to main content
      </a>

      {/* Utility bar */}
      <div className="hidden border-b border-band-line bg-band text-band-muted md:block">
        <div className="container-kv flex h-10 items-center gap-6 text-[0.82rem]">
          <span className="font-display font-semibold tracking-[0.12em] text-band-fg uppercase">See beyond. Build the future.</span>
          <div className="ml-auto flex items-center gap-5">
            {email && <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:text-band-fg"><Icon name="mail" className="size-3.5" />{email}</a>}
            {phone && <a href={`tel:${phone.replace(/\s/g, "")}`} className="hidden items-center gap-1.5 hover:text-band-fg lg:inline-flex"><Icon name="phone" className="size-3.5" />{phone}</a>}
            <Link href="/training" className="inline-flex items-center gap-1.5 font-semibold text-band-fg hover:underline underline-offset-4"><Icon name="book" className="size-3.5" />Tech Lessons</Link>
          </div>
        </div>
      </div>

      <header ref={headerRef} className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/85">
        <div className="container-kv flex h-[var(--nav-h)] items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Kalulu Vision home">
            <Image src="/brand/logo-96.webp" alt="" width={44} height={44} priority className="size-11" />
            <span className="leading-none">
              <span className="block font-display text-[1.08rem] font-bold tracking-[0.1em] text-fg">KALULU VISION</span>
              <span className="mt-1 hidden text-[0.68rem] font-medium tracking-[0.08em] text-subtle uppercase sm:block">Technology &amp; Innovation</span>
            </span>
          </Link>

          <nav ref={navRef} aria-label="Primary" className="ml-auto hidden items-center xl:flex">
            <ul className="flex items-center">
              {ITEMS.map((it) => {
                const on = groupActive(it);
                const base = `relative flex min-h-11 items-center gap-1 rounded-md px-3 text-[0.92rem] font-medium transition-colors ${on ? "text-primary dark:text-fg" : "text-muted hover:text-fg"}`;
                const bar = on && <span className="absolute inset-x-3 -bottom-[17px] h-[3px] rounded-t bg-primary dark:bg-fg" aria-hidden="true" />;
                if (!it.children) {
                  return (
                    <li key={it.href}>
                      <Link href={it.href} aria-current={active(it.href) ? "page" : undefined} className={base}>{it.label}{bar}</Link>
                    </li>
                  );
                }
                const isOpen = menu === it.label;
                const id = `menu-${it.label.replace(/\W+/g, "-").toLowerCase()}`;
                return (
                  <li key={it.href} className="relative">
                    <button type="button" data-menu={it.label} aria-expanded={isOpen} aria-controls={id} onClick={() => setMenu(isOpen ? null : it.label)} className={base}>
                      {it.label}<Icon name="chevronDown" className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />{bar}
                    </button>
                    <div id={id} hidden={!isOpen}
                      className={`absolute top-full z-50 mt-4 rounded-xl border border-line bg-elevated p-2 shadow-lift [animation:kvIn_.18s_ease-out] ${it.mega ? "left-1/2 w-[min(760px,92vw)] -translate-x-1/2" : "left-0 w-80"}`}>
                      <ul className={`grid gap-0.5 ${it.mega ? "grid-cols-2" : ""}`}>
                        {it.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} aria-current={active(c.href) ? "page" : undefined} className="group flex gap-3 rounded-lg p-3 transition-colors hover:bg-soft">
                              {c.icon && <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/8 text-primary dark:bg-white/8 dark:text-fg"><Icon name={c.icon} /></span>}
                              <span>
                                <span className="block text-sm font-semibold text-fg group-hover:text-primary dark:group-hover:text-fg">{c.label}</span>
                                {c.text && <span className="mt-0.5 line-clamp-2 block text-[0.8rem] leading-snug text-muted">{c.text}</span>}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {it.mega && (
                        <Link href={it.href} className="mt-1 flex items-center justify-between rounded-lg border-t border-line px-3 pt-3 pb-2 text-sm font-semibold text-primary hover:underline dark:text-fg">
                          View all services <Icon name="arrowRight" className="size-4" />
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-3">
            <div className="hidden sm:block"><ThemeSwitcher compact /></div>
            <Link href="/contact" className="hidden min-h-11 items-center rounded-lg bg-primary px-4 font-display text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover sm:inline-flex">
              Contact Us
            </Link>
            <button
              ref={menuBtn}
              type="button"
              className="grid size-11 place-items-center rounded-lg border border-line-strong text-fg xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>

      </header>
      {/* Mobile / tablet drawer */}
      <div
        id="mobile-menu"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--nav-h)] z-40 overflow-y-auto border-t border-line bg-bg xl:hidden"
      >
        <nav aria-label="Mobile" className="container-kv flex flex-col gap-6 py-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <ul className="divide-y divide-line border-y border-line">
            {ITEMS.map((it) => (
              <li key={it.href}>
                {it.children ? (
                  <>
                    <button type="button" aria-expanded={mobileSub === it.label} onClick={() => setMobileSub(mobileSub === it.label ? null : it.label)}
                      className={`flex min-h-14 w-full items-center justify-between font-display text-lg font-semibold ${groupActive(it) ? "text-primary dark:text-fg" : "text-fg"}`}>
                      {it.label}<Icon name="chevronDown" className={`size-5 transition-transform ${mobileSub === it.label ? "rotate-180" : ""}`} />
                    </button>
                    <ul hidden={mobileSub !== it.label} className="grid gap-0.5 pb-3">
                      {it.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} aria-current={active(c.href) ? "page" : undefined} className="flex min-h-12 items-center gap-3 rounded-lg px-2 text-[0.98rem] text-muted hover:bg-soft hover:text-fg">
                            {c.icon && <span className="text-primary dark:text-fg"><Icon name={c.icon} /></span>}{c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={it.href} aria-current={active(it.href) ? "page" : undefined} className={`flex min-h-14 items-center font-display text-lg font-semibold ${active(it.href) ? "text-primary dark:text-fg" : "text-fg"}`}>{it.label}</Link>
                )}
              </li>
            ))}
            <li><Link href="/contact" className="flex min-h-14 items-center font-display text-lg font-semibold text-fg">Contact</Link></li>
          </ul>
          <div>
            <p className="mb-2 text-sm font-medium text-muted">Theme</p>
            <ThemeSwitcher />
          </div>
          <Link href="/contact" className="flex min-h-12 items-center justify-center rounded-lg bg-primary font-display font-semibold text-on-primary">Contact Us</Link>
        </nav>
      </div>
    </>
  );
}
