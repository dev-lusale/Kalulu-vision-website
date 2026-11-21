import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { STATUS_LABELS } from "@/lib/content-types";

/* ── Icons (inline SVG, 24px grid, stroke-based) ─────────────── */
const ICONS: Record<string, ReactNode> = {
  brain: <><path d="M9 4a3 3 0 0 0-3 3v.5A3 3 0 0 0 4 10.3 3 3 0 0 0 5 15a3 3 0 0 0 3 4 2 2 0 0 0 4 0V5a2 2 0 0 0-3-1Z"/><path d="M15 4a3 3 0 0 1 3 3v.5a3 3 0 0 1 2 2.8A3 3 0 0 1 19 15a3 3 0 0 1-3 4 2 2 0 0 1-4 0"/><path d="M9 9h1.5M14.5 12H16M9 14.5h2"/></>,
  code: <><path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/></>,
  browser: <><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></>,
  phone: <><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18h2"/></>,
  chart: <><path d="M4 4v16h16"/><path d="m8 15 3.5-4 3 2.5L20 7"/></>,
  chip: <><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/></>,
  arrows: <><path d="M4 8h13l-3-3M20 16H7l3 3"/></>,
  compass: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></>,
  spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></>,
  arrowRight: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  arrowUpRight: <><path d="M7 17 17 7M8 7h9v9"/></>,
  check: <><path d="m5 12.5 4.5 4.5L19 7.5"/></>,
  github: <><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></>,
  whatsapp: <><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9.5 9.5c.3 1.6 1.4 3.4 3.3 4.4l1-1 2 1c-.4 1.3-1.6 1.8-3 1.4-2.5-.8-4.8-3.1-5.3-5.6-.3-1.4.3-2.4 1.5-2.7l1 2z"/></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/></>,
  users: <><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/></>,
  flask: <><path d="M9 3h6M10 3v6L4.5 19A1.5 1.5 0 0 0 5.8 21h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
  shield: <><path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.3 7.5 9.5 4.3-1.2 7.5-5 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/></>,
  external: <><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  close: <><path d="M6 6l12 12M18 6 6 18"/></>,
  chevronDown: <><path d="m6 9 6 6 6-6"/></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.5 10v6.5M7.5 7.5v.01M11 16.5V10M11 13c0-1.7 1.2-3 2.8-3s2.7 1 2.7 3v3.5"/></>,
  youtube: <><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9 5 3-5 3V9Z"/></>,
  x: <><path d="M4 4l16 16M20 4 4 20"/></>,
  facebook: <><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z"/></>,
  tiktok: <><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.6 2.4 4.4 5 4.5"/></>,
};

export function Icon({ name, className = "size-5", strokeWidth = 1.7 }: { name: string; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {ICONS[name] ?? ICONS.spark}
    </svg>
  );
}

/* ── Buttons ─────────────────────────────────────────────────── */
type Variant = "primary" | "secondary" | "ghost";
const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-full font-display font-medium tracking-tight transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-60 disabled:cursor-not-allowed";
const sizes = { md: "min-h-12 px-6 text-[0.95rem]", sm: "min-h-11 px-5 text-sm", lg: "min-h-14 px-7 text-base" };
const variants: Record<Variant, string> = {
  primary: "bg-gradient-brand text-ink-900 shadow-[0_10px_40px_-12px_rgb(255_98_0/0.7)] hover:shadow-[0_14px_50px_-10px_rgb(255_98_0/0.9)] hover:-translate-y-0.5",
  secondary: "border border-line-strong text-fg bg-white/[0.03] hover:border-orange/70 hover:bg-orange/[0.08]",
  ghost: "text-fg hover:text-amber",
};

export function ButtonLink({
  href, children, variant = "primary", size = "md", arrow = false, className = "", ...rest
}: { href: string; children: ReactNode; variant?: Variant; size?: keyof typeof sizes; arrow?: boolean; className?: string } & Omit<ComponentProps<typeof Link>, "href" | "className">) {
  const external = /^https?:\/\//.test(href);
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && <Icon name={external ? "arrowUpRight" : "arrowRight"} className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />}
    </>
  );
  if (external) {
    return <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{inner}<span className="sr-only"> (opens in a new tab)</span></a>;
  }
  return <Link href={href} className={cls} {...rest}>{inner}</Link>;
}

export function Button({
  variant = "primary", size = "md", className = "", children, ...rest
}: { variant?: Variant; size?: keyof typeof sizes } & ComponentProps<"button">) {
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>{children}</button>;
}

/* ── Headings ────────────────────────────────────────────────── */
export function SectionHeading({
  eyebrow, title, lead, align = "left", as: Tag = "h2", id,
}: { eyebrow?: string; title: ReactNode; lead?: ReactNode; align?: "left" | "center"; as?: "h1" | "h2"; id?: string }) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-4" data-reveal><span className="h-px w-6 bg-amber/70" aria-hidden="true" />{eyebrow}</p>}
      <Tag id={id} className="text-[clamp(2rem,1.4rem+2.6vw,3.4rem)] font-semibold" data-reveal style={{ ["--d" as string]: 1 }}>{title}</Tag>
      {lead && <p className="mt-5 text-lg text-muted" data-reveal style={{ ["--d" as string]: 2 }}>{lead}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line pt-[calc(var(--nav-h)+64px)] pb-16 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="kv-aurora absolute -inset-[20%]" />
        <div className="kv-grid-bg absolute inset-0" />
      </div>
      <div className="container-kv">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} lead={lead} />
        {children && <div className="mt-8" data-reveal style={{ ["--d" as string]: 3 }}>{children}</div>}
      </div>
    </section>
  );
}

/* ── Badges & chips ──────────────────────────────────────────── */
export function StatusBadge({ status }: { status: string }) {
  const live = status === "live";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${live ? "border-success/40 text-success" : "border-amber/40 text-amber"}`}>
      <span className={`size-1.5 rounded-full ${live ? "bg-success" : "bg-amber"}`} aria-hidden="true" />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function Chips({ items, label }: { items: string[]; label?: string }) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((t) => (
        <li key={t} className="rounded-full border border-line bg-white/[0.03] px-3 py-1 text-sm text-muted">{t}</li>
      ))}
    </ul>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-muted">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-orange/15 text-orange"><Icon name="check" className="size-3.5" strokeWidth={2.4} /></span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

/** A tasteful abstract visual for items that have no image (no fake screenshots). Motif varies per item. */
export function AbstractVisual({ seed, label }: { seed: string; label?: string }) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const a = 20 + (h % 50), b = 30 + ((h >> 3) % 40);
  const motif = h % 4;
  const cx = 200 + ((h >> 5) % 80) - 40;
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink-850" aria-hidden="true">
      <div className="absolute inset-0 opacity-70" style={{ background: `radial-gradient(60% 70% at ${a}% ${b}%, rgb(255 138 0 / 0.32), transparent 70%), radial-gradient(50% 60% at ${100 - a}% ${100 - b}%, rgb(255 77 22 / 0.18), transparent 70%)` }} />
      <div className="kv-grid-bg absolute inset-0 opacity-60" />
      <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" fill="none" strokeLinecap="round">
        {motif === 0 && (<>
          <circle cx={cx} cy="120" r="78" stroke="rgb(255 181 46 / 0.45)" strokeWidth="1.2" />
          <circle cx={cx} cy="120" r="44" stroke="rgb(255 138 0 / 0.6)" strokeWidth="1.2" strokeDasharray="4 6" />
          <circle cx={cx} cy="120" r="5" fill="#FF8A00" />
        </>)}
        {motif === 1 && (<>
          {[[90, 70], [150, 150], [210, 90], [270, 160], [320, 80]].map(([x, y], i, arr) => (
            <g key={i}>
              {i > 0 && <line x1={arr[i - 1][0]} y1={arr[i - 1][1]} x2={x} y2={y} stroke="rgb(255 181 46 / 0.45)" strokeWidth="1.2" />}
              <circle cx={x} cy={y} r={i === 2 ? 8 : 5} fill={i === 2 ? "#FF8A00" : "#0B1224"} stroke="#FFB52E" strokeWidth="1.5" />
            </g>
          ))}
        </>)}
        {motif === 2 && (<>
          <path d={`M20 ${130 + (h % 20)} C 90 60, 140 200, 200 120 S 320 40, 380 ${110 + (h % 30)}`} stroke="#FF8A00" strokeWidth="2" opacity="0.85" />
          <path d="M20 150 C 90 90, 140 210, 200 140 S 320 70, 380 140" stroke="rgb(255 181 46 / 0.35)" strokeWidth="1.2" strokeDasharray="3 6" />
        </>)}
        {motif === 3 && (<>
          {Array.from({ length: 9 }).map((_, i) => {
            const hh = 30 + ((h >> (i % 16)) % 90);
            return <rect key={i} x={70 + i * 30} y={190 - hh} width="14" height={hh} rx="3" fill={i % 3 === 1 ? "#FF8A00" : "rgb(255 255 255 / 0.08)"} stroke="rgb(255 181 46 / 0.35)" />;
          })}
        </>)}
      </svg>
      {label && <span className="absolute bottom-4 left-5 font-display text-sm font-medium tracking-wide text-white/70">{label}</span>}
    </div>
  );
}
