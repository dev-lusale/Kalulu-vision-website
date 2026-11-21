import Image from "next/image";
import Link from "next/link";
import type { Company, Service } from "@/lib/content-types";
import { Subscribe } from "./Subscribe";
import { Icon } from "./ui";

const SOCIAL_LABELS: Record<string, string> = { linkedin: "LinkedIn", youtube: "YouTube", github: "GitHub", x: "X", facebook: "Facebook", tiktok: "TikTok" };

export function Footer({ company, services }: { company: Company; services: Service[] }) {
  const socials = Object.entries(company.socials ?? {}).filter(([, url]) => url);
  const year = new Date().getFullYear();
  const col = (title: string, links: [string, string][]) => (
    <nav aria-label={title}>
      <h2 className="mb-3 font-display text-sm font-semibold tracking-[0.08em] text-band-fg uppercase">{title}</h2>
      <ul className="grid gap-0.5 text-[0.95rem]">
        {links.map(([h, l]) => <li key={h}><Link href={h} className="inline-flex min-h-9 items-center text-band-muted hover:text-band-fg hover:underline underline-offset-4">{l}</Link></li>)}
      </ul>
    </nav>
  );
  return (
    <footer className="bg-band text-band-fg">
      {/* Stay updated */}
      <div className="border-b border-band-line">
        <div className="container-kv flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Stay updated</h2>
            <p className="mt-1 text-band-muted">Occasional news on our projects, research and new courses. No spam.</p>
          </div>
          <Subscribe invert />
        </div>
      </div>

      <div className="container-kv grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_1fr_1.3fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Kalulu Vision home">
            <Image src="/brand/logo-256.webp" alt="" width={56} height={56} className="size-14" />
            <span className="font-display text-lg font-bold tracking-[0.1em]">KALULU VISION</span>
          </Link>
          <p className="mt-4 max-w-sm text-band-muted">{company.shortDescription}</p>
          <p className="mt-4 font-display text-sm font-semibold tracking-[0.12em] text-brand uppercase">{company.slogan}</p>
          {socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social media">
              {socials.map(([k, url]) => (
                <li key={k}>
                  <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${SOCIAL_LABELS[k] ?? k} (opens in a new tab)`}
                    className="grid size-11 place-items-center rounded-lg border border-band-line text-band-muted transition-colors hover:border-band-fg hover:text-band-fg">
                    <Icon name={k} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {col("Company", [["/about", "About Us"], ["/partnerships", "Partnerships"], ["/opportunities", "Careers & Opportunities"], ["/insights", "Insights"], ["/contact", "Contact"]])}
        {col("Services", services.slice(0, 6).map((s) => [`/services/${s.slug}`, s.title] as [string, string]))}
        {col("Our work", [["/projects", "Projects"], ["/products", "Products"], ["/research", "Research"], ["/training", "Tech Lessons"]])}
        <div>
          <h2 className="mb-3 font-display text-sm font-semibold tracking-[0.08em] text-band-fg uppercase">Contact</h2>
          <ul className="grid gap-3 text-[0.95rem] text-band-muted">
            {company.email && <li><a href={`mailto:${company.email}`} className="inline-flex items-start gap-2.5 hover:text-band-fg"><Icon name="mail" className="mt-0.5 size-4 shrink-0" /><span>{company.email.split("@")[0]}<wbr />@{company.email.split("@")[1]}</span></a></li>}
            {company.phone && <li><a href={`tel:${company.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2.5 hover:text-band-fg"><Icon name="phone" className="size-4 shrink-0" />{company.phone}</a></li>}
            {company.whatsapp && <li><a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 hover:text-band-fg"><Icon name="whatsapp" className="size-4 shrink-0" />WhatsApp<span className="sr-only"> (opens in a new tab)</span></a></li>}
            {company.location && <li className="inline-flex items-center gap-2.5"><Icon name="pin" className="size-4 shrink-0" />{company.location}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-band-line">
        <div className="container-kv flex flex-col gap-3 py-6 text-sm text-band-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {company.name}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li><Link href="/privacy" className="hover:text-band-fg hover:underline underline-offset-4">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-band-fg hover:underline underline-offset-4">Terms of Use</Link></li>
            <li><Link href="/admin" className="hover:text-band-fg hover:underline underline-offset-4">Staff sign-in</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
