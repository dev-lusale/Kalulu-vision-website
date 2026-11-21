import Image from "next/image";
import Link from "next/link";
import type { Company, Service } from "@/lib/content-types";
import { Icon } from "./ui";

export function Footer({ company, services }: { company: Company; services: Service[] }) {
  const socials = Object.entries(company.socials ?? {}).filter(([, url]) => url);
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-950">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-orange/10 blur-3xl" aria-hidden="true" />
      <div className="container-kv relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Kalulu Vision home">
            <Image src="/brand/logo-256.webp" alt="" width={56} height={56} className="size-14" />
            <span className="font-display text-lg font-bold tracking-[0.14em]">KALULU<span className="font-medium text-muted"> VISION</span></span>
          </Link>
          <p className="mt-5 max-w-sm text-muted">{company.shortDescription}</p>
          <p className="mt-6 font-display text-xl font-semibold">
            <span className="text-gradient-brand">{company.slogan}</span>
          </p>
        </div>

        <nav aria-label="Company">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.14em] text-white">Company</h2>
          <ul className="grid gap-1 text-muted">
            {[["/about", "About us"], ["/projects", "Projects"], ["/products", "Products"], ["/research", "Research"], ["/insights", "Insights"], ["/opportunities", "Opportunities"], ["/training", "Tech Lessons"]].map(([h, l]) => (
              <li key={h}><Link href={h} className="inline-flex min-h-10 items-center hover:text-amber">{l}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.14em] text-white">Services</h2>
          <ul className="grid gap-1 text-muted">
            {services.map((s) => (
              <li key={s.slug}><Link href={`/services/${s.slug}`} className="inline-flex min-h-10 items-center hover:text-amber">{s.title}</Link></li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.14em] text-white">Get in touch</h2>
          <ul className="grid gap-3 text-muted">
            {company.email && (
              <li><a href={`mailto:${company.email}`} className="flex min-h-10 items-center gap-3 break-all hover:text-amber"><Icon name="mail" className="size-5 shrink-0 text-orange" />{company.email}</a></li>
            )}
            {company.phone && (
              <li><a href={`tel:${company.phone.replace(/\s/g, "")}`} className="flex min-h-10 items-center gap-3 hover:text-amber"><Icon name="phone" className="size-5 shrink-0 text-orange" />{company.phone}</a></li>
            )}
            {company.whatsapp && (
              <li><a href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex min-h-10 items-center gap-3 hover:text-amber"><Icon name="whatsapp" className="size-5 shrink-0 text-orange" />WhatsApp<span className="sr-only"> (opens in a new tab)</span></a></li>
            )}
            {company.location && (
              <li className="flex min-h-10 items-center gap-3"><Icon name="pin" className="size-5 shrink-0 text-orange" />{company.location}</li>
            )}
          </ul>
          {socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social media">
              {socials.map(([k, url]) => (
                <li key={k}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="grid size-11 place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-orange hover:text-orange" aria-label={`${k} (opens in a new tab)`}>
                    <Icon name={k} className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="container-kv relative flex flex-col gap-3 border-t border-line py-6 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} {company.name}. All rights reserved.</p>
        <p>AI · Software · Data · IoT · Technology education</p>
      </div>
    </footer>
  );
}
