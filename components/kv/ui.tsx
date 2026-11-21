import Image from "next/image";
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
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></>,
  building: <><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M2 21h20M8 7h4M8 11h4M8 15h4"/></>,
  handshake: <><path d="m11 17 2 2a1.4 1.4 0 0 0 2-2M14 14l2.5 2.5a1.4 1.4 0 0 0 2-2l-3.9-3.9a2 2 0 0 0-2.8 0l-.9.9a1.4 1.4 0 0 1-2-2l2.8-2.8a3.8 3.8 0 0 1 4.6-.6l.5.3a2 2 0 0 0 1.5.2L21 6M21 3v8h-2M3 3l1 0v8H3M3 11l6.5 6.5a1.4 1.4 0 0 0 2-2"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  play: <><circle cx="12" cy="12" r="9"/><path d="m10 8.5 5.5 3.5-5.5 3.5Z"/></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/></>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  heart: <><path d="M12 20s-7.5-4.6-9-9.4A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9 4.6C19.5 15.4 12 20 12 20Z"/></>,
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
type Variant = "primary" | "secondary" | "accent" | "brand" | "ghost" | "light";
const base =
  "group inline-flex items-center justify-center gap-2 rounded-lg font-display font-semibold tracking-tight transition-[background-color,border-color,color,box-shadow,transform] duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:translate-y-px";
const sizes = { md: "min-h-12 px-5 text-[0.95rem]", sm: "min-h-11 px-4 text-sm", lg: "min-h-13 px-6 text-base" };
const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover shadow-card",
  secondary: "border border-line-strong bg-surface text-fg hover:border-primary hover:text-primary",
  accent: "bg-accent-ink text-white hover:brightness-95 dark:text-[#171717]",
  brand: "bg-brand text-[#171717] hover:brightness-105 shadow-card",
  ghost: "text-primary hover:bg-primary/5 dark:text-fg dark:hover:bg-white/5",
  light: "border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20",
};

export function ButtonLink({
  href, children, variant = "primary", size = "md", arrow = false, className = "", ...rest
}: { href: string; children: ReactNode; variant?: Variant; size?: keyof typeof sizes; arrow?: boolean; className?: string } & Omit<ComponentProps<typeof Link>, "href" | "className">) {
  const external = /^https?:\/\//.test(href);
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && <Icon name={external ? "arrowUpRight" : "arrowRight"} className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />}
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

/** Text link with arrow, used at the end of cards and sections. */
export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const external = /^https?:\/\//.test(href);
  const cls = `group inline-flex items-center gap-1.5 font-display text-sm font-semibold text-primary hover:underline underline-offset-4 dark:text-fg ${className}`;
  const inner = <>{children}<Icon name={external ? "arrowUpRight" : "arrowRight"} className="size-4 transition-transform group-hover:translate-x-0.5" /></>;
  return external
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}<span className="sr-only"> (opens in a new tab)</span></a>
    : <Link href={href} className={cls}>{inner}</Link>;
}

/* ── Headings ────────────────────────────────────────────────── */
export function SectionHeading({
  eyebrow, title, lead, align = "left", as: Tag = "h2", id, invert = false,
}: { eyebrow?: string; title: ReactNode; lead?: ReactNode; align?: "left" | "center"; as?: "h1" | "h2"; id?: string; invert?: boolean }) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`eyebrow mb-3 ${invert ? "!text-band-muted" : ""}`} data-reveal>{eyebrow}</p>}
      <Tag id={id} className={`text-[clamp(1.9rem,1.35rem+2.2vw,3rem)] font-bold ${invert ? "text-band-fg" : "text-fg"}`} data-reveal style={{ ["--d" as string]: 1 }}>{title}</Tag>
      <span className={`kv-rule mt-5 ${align === "center" ? "mx-auto" : ""}`} aria-hidden="true" />
      {lead && <p className={`mt-5 text-lg ${invert ? "text-band-muted" : "text-muted"}`} data-reveal style={{ ["--d" as string]: 2 }}>{lead}</p>}
    </div>
  );
}

export interface Crumb { href: string; label: string }

/** Inner-page header: soft band, breadcrumb, title and lead. `aside` renders on the right (photo, facts, actions). */
export function PageHero({ eyebrow, title, lead, crumbs = [], children, aside, tone = "soft" }: {
  eyebrow: string; title: ReactNode; lead?: ReactNode; crumbs?: Crumb[]; children?: ReactNode; aside?: ReactNode; tone?: "soft" | "band";
}) {
  const band = tone === "band";
  return (
    <section className={`relative overflow-hidden border-b ${band ? "border-band-line bg-band text-band-fg" : "border-line bg-soft"}`}>
      {!band && <div className="kv-dots pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(90deg,transparent,#000_70%)]" aria-hidden="true" />}
      <div className={`container-kv relative grid gap-10 py-12 sm:py-16 ${aside ? "lg:grid-cols-[1.15fr_1fr] lg:items-center" : ""}`}>
        <div>
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className={`flex flex-wrap items-center gap-1.5 text-sm ${band ? "text-band-muted" : "text-muted"}`}>
              <li><Link href="/" className="hover:underline underline-offset-4">Home</Link></li>
              {crumbs.map((c) => (
                <li key={c.href} className="flex items-center gap-1.5"><span aria-hidden="true">/</span><Link href={c.href} className="hover:underline underline-offset-4">{c.label}</Link></li>
              ))}
              <li className="flex items-center gap-1.5" aria-current="page"><span aria-hidden="true">/</span><span className={band ? "text-band-fg" : "text-fg"}>{eyebrow}</span></li>
            </ol>
          </nav>
          <h1 className="max-w-4xl text-[clamp(2.1rem,1.4rem+2.8vw,3.6rem)] font-bold" data-reveal>{title}</h1>
          <span className="kv-rule mt-5" aria-hidden="true" />
          {lead && <p className={`mt-5 max-w-2xl text-lg ${band ? "text-band-muted" : "text-muted"}`} data-reveal style={{ ["--d" as string]: 1 }}>{lead}</p>}
          {children && <div className="mt-8" data-reveal style={{ ["--d" as string]: 2 }}>{children}</div>}
        </div>
        {aside && <div data-reveal style={{ ["--d" as string]: 2 }}>{aside}</div>}
      </div>
    </section>
  );
}

/* ── Photos ──────────────────────────────────────────────────── */
/** Uses next/image for bundled photos and screenshots; plain <img> for uploaded or external URLs. */
export function Photo({ src, alt, className = "", sizes = "(min-width: 1024px) 50vw, 100vw", priority = false, fit = "cover" }: {
  src: string; alt: string; className?: string; sizes?: string; priority?: boolean; fit?: "cover" | "contain";
}) {
  const fitCls = fit === "contain" ? "object-contain" : "object-cover";
  if (/^\/(photos|screens|brand)\//.test(src) || /^\/api\/media\/[0-9a-f-]{36}$/i.test(src)) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`${fitCls} ${className}`} />;
  }
  return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" className={`absolute inset-0 h-full w-full ${fitCls} ${className}`} />;
}

export function Figure({ image, className = "", ratio = "aspect-[4/3]", sizes, priority, rounded = "rounded-[var(--radius-card)]" }: {
  image: { url: string; alt: string; caption?: string }; className?: string; ratio?: string; sizes?: string; priority?: boolean; rounded?: string;
}) {
  return (
    <figure className={className}>
      <div className={`kv-photo ${ratio} ${rounded} border border-line`}>
        <Photo src={image.url} alt={image.alt} sizes={sizes} priority={priority} />
      </div>
      {image.caption && <figcaption className="mt-3 text-sm text-subtle">{image.caption}</figcaption>}
    </figure>
  );
}

/* ── Badges & chips ──────────────────────────────────────────── */
const STATUS_TONE: Record<string, string> = {
  live: "bg-success/12 text-success border-success/30",
  pilot: "bg-accent/12 text-accent-ink border-accent/30",
  prototype: "bg-brand/12 text-brand-ink border-brand/30",
  "in-development": "bg-primary/10 text-primary border-primary/25 dark:bg-white/10 dark:text-fg dark:border-white/20",
};
export function StatusBadge({ status, className = "" }: { status: string; className?: string }) {
  const tone = STATUS_TONE[status] ?? "bg-soft-2 text-muted border-line";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tone} ${className}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function Chips({ items, label, small = false }: { items: string[]; label?: string; small?: boolean }) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label}>
      {items.map((t) => (
        <li key={t} className={`rounded-md border border-line bg-soft text-muted ${small ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"}`}>{t}</li>
      ))}
    </ul>
  );
}

export function CheckList({ items, cols = 1 }: { items: string[]; cols?: 1 | 2 }) {
  return (
    <ul className={`grid gap-3 ${cols === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-muted">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-ink"><Icon name="check" className="size-3.5" strokeWidth={2.4} /></span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function IconTile({ name, tone = "primary", className = "" }: { name: string; tone?: "primary" | "accent" | "brand"; className?: string }) {
  const t = tone === "accent" ? "bg-accent/12 text-accent-ink" : tone === "brand" ? "bg-brand/12 text-brand-ink" : "bg-primary/8 text-primary dark:bg-white/8 dark:text-fg";
  return <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${t} ${className}`}><Icon name={name} className="size-6" /></span>;
}

/**
 * Shown where no real screenshot has been published yet. It is deliberately a
 * plain, labelled placeholder rather than a fake interface.
 */
export function NoScreenshot({ seed, label, compact = false }: { seed: string; label: string; compact?: boolean }) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const initials = label.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const a = 15 + (h % 60);
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-soft-2 text-center" aria-hidden="true">
      <div className="absolute inset-0 opacity-90" style={{ background: `radial-gradient(70% 80% at ${a}% 20%, color-mix(in oklab, var(--kv-accent) 18%, transparent), transparent 70%), radial-gradient(60% 70% at ${100 - a}% 100%, color-mix(in oklab, var(--kv-primary) 14%, transparent), transparent 70%)` }} />
      <div className="kv-dots absolute inset-0 opacity-70" />
      <span className={`relative grid place-items-center rounded-2xl border border-line bg-surface font-display font-bold text-primary shadow-card dark:text-fg ${compact ? "size-14 text-xl" : "size-20 text-3xl"}`}>{initials}</span>
      {!compact && <span className="relative inline-flex items-center gap-1.5 text-xs font-medium text-subtle"><Icon name="image" className="size-3.5" />Screenshots to be published</span>}
    </div>
  );
}
