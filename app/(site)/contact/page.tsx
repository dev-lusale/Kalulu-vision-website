import type { Metadata } from "next";
import { EnquiryForm } from "@/components/kv/EnquiryForm";
import { Icon, PageHero } from "@/components/kv/ui";
import { getCompany, getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Contact Kalulu Vision about AI, software, data, IoT and technology training projects.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const [company, services, sp] = await Promise.all([getCompany(), getServices(), searchParams]);
  const pre = typeof sp.service === "string" ? sp.service : "";
  const titles = services.map((s) => s.title);
  const socials = Object.entries(company.socials ?? {}).filter(([, u]) => u);
  return (
    <>
      <PageHero eyebrow="Contact us" title={<>Let&apos;s talk about <span className="text-gradient-brand">what you&apos;re building.</span></>}
        lead="Tell us about your project, question or idea. We read every message." />
      <section className="py-16 sm:py-24">
        <div className="container-kv grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <aside className="grid content-start gap-4">
            {company.email && (
              <a href={`mailto:${company.email}`} className="kv-glow-card flex items-center gap-4 p-5 hover:text-orange">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-orange/10 text-orange"><Icon name="mail" /></span>
                <span><span className="block text-sm text-subtle">Email</span><span className="break-all font-semibold">{company.email}</span></span>
              </a>
            )}
            {company.phone && (
              <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="kv-glow-card flex items-center gap-4 p-5 hover:text-orange">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-orange/10 text-orange"><Icon name="phone" /></span>
                <span><span className="block text-sm text-subtle">Telephone</span><span className="font-semibold">{company.phone}</span></span>
              </a>
            )}
            {company.whatsapp && (
              <a href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="kv-glow-card flex items-center gap-4 p-5 hover:text-orange">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-orange/10 text-orange"><Icon name="whatsapp" /></span>
                <span><span className="block text-sm text-subtle">WhatsApp</span><span className="font-semibold">Chat with us</span><span className="sr-only"> (opens in a new tab)</span></span>
              </a>
            )}
            {company.location && (
              <div className="kv-glow-card flex items-center gap-4 p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-orange/10 text-orange"><Icon name="pin" /></span>
                <span><span className="block text-sm text-subtle">Location</span><span className="font-semibold">{company.location}</span></span>
              </div>
            )}
            {socials.length > 0 && (
              <ul className="flex flex-wrap gap-2 pt-2" aria-label="Social media">
                {socials.map(([k, u]) => (
                  <li key={k}><a href={u} target="_blank" rel="noopener noreferrer" aria-label={`${k} (opens in a new tab)`} className="grid size-11 place-items-center rounded-full border border-line-strong text-muted hover:border-orange hover:text-orange"><Icon name={k} /></a></li>
                ))}
              </ul>
            )}
          </aside>
          <EnquiryForm kind="contact" services={titles} defaultService={titles.includes(pre) ? pre : ""} email={company.email} whatsapp={company.whatsapp.replace(/\D/g, "")} />
        </div>
      </section>
    </>
  );
}
