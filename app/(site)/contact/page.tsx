import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/kv/EnquiryForm";
import { Icon, IconTile, PageHero } from "@/components/kv/ui";
import { getCompany, getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Kalulu Vision about AI, software, data, IoT and technology training projects.",
  alternates: { canonical: "/contact" },
};

const SOCIAL_LABELS: Record<string, string> = { linkedin: "LinkedIn", youtube: "YouTube", github: "GitHub", x: "X", facebook: "Facebook", tiktok: "TikTok" };

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const [company, services, sp] = await Promise.all([getCompany(), getServices(), searchParams]);
  const pre = typeof sp.service === "string" ? sp.service : "";
  const titles = services.map((s) => s.title);
  const socials = Object.entries(company.socials ?? {}).filter(([, u]) => u);
  const channels = [
    company.email && { icon: "mail", label: "Email", value: company.email, href: `mailto:${company.email}`, note: "Best for project enquiries" },
    company.phone && { icon: "phone", label: "Telephone", value: company.phone, href: `tel:${company.phone.replace(/\s/g, "")}`, note: "Working hours, Zambia time" },
    company.whatsapp && { icon: "whatsapp", label: "WhatsApp", value: "Chat with us", href: `https://wa.me/${company.whatsapp.replace(/\D/g, "")}`, note: "Fastest for quick questions", external: true },
  ].filter(Boolean) as { icon: string; label: string; value: string; href: string; note: string; external?: boolean }[];

  return (
    <>
      <PageHero eyebrow="Contact Us" title="Let's talk about what you're building." lead="Tell us about your project, question or idea. We read every message and reply by email." />

      {/* Channels strip */}
      <section className="border-b border-line" aria-label="Ways to reach us">
        <ul className="container-kv grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {channels.map((c) => (
            <li key={c.label}>
              <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex items-center gap-4 py-6 sm:px-6 sm:first:pl-0">
                <IconTile name={c.icon} tone={c.icon === "whatsapp" ? "accent" : "primary"} />
                <span className="min-w-0">
                  <span className="block text-sm text-muted">{c.label}</span>
                  <span className="block break-all font-semibold group-hover:underline underline-offset-4">{c.value}{c.external && <span className="sr-only"> (opens in a new tab)</span>}</span>
                  <span className="block text-xs text-subtle">{c.note}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="section-y bg-soft">
        <div className="container-kv grid gap-10 lg:grid-cols-[1.4fr_0.8fr] lg:gap-14">
          <div>
            <h2 className="mb-6 text-2xl font-bold">Send us a message</h2>
            <EnquiryForm kind="contact" services={titles} defaultService={titles.includes(pre) ? pre : ""} email={company.email} whatsapp={company.whatsapp.replace(/\D/g, "")} />
          </div>
          <aside className="grid content-start gap-5">
            {company.location && (
              <div className="kv-card p-6">
                <h2 className="flex items-center gap-2 font-display font-bold"><Icon name="pin" className="size-5 text-accent-ink" />Location</h2>
                <p className="mt-2 text-muted">{company.location}</p>
                <p className="mt-1 text-sm text-subtle">We work with clients remotely and on site.</p>
              </div>
            )}
            <div className="kv-card p-6">
              <h2 className="font-display font-bold">Looking for something specific?</h2>
              <ul className="mt-3 grid gap-1 text-[0.95rem]">
                {[["/partnerships", "Partnership enquiries"], ["/opportunities", "Careers & internships"], ["/training", "Tech Lessons enrolment"]].map(([h, l]) => (
                  <li key={h}><Link href={h} className="flex min-h-10 items-center justify-between text-primary hover:underline underline-offset-4 dark:text-fg">{l}<Icon name="arrowRight" className="size-4" /></Link></li>
                ))}
              </ul>
            </div>
            {socials.length > 0 && (
              <div className="kv-card p-6">
                <h2 className="font-display font-bold">Follow us</h2>
                <ul className="mt-3 flex flex-wrap gap-2" aria-label="Social media">
                  {socials.map(([k, u]) => (
                    <li key={k}><a href={u} target="_blank" rel="noopener noreferrer" aria-label={`${SOCIAL_LABELS[k] ?? k} (opens in a new tab)`} className="grid size-11 place-items-center rounded-lg border border-line-strong text-muted hover:border-primary hover:text-fg"><Icon name={k} /></a></li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
