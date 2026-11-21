import type { Metadata } from "next";
import Link from "next/link";
import { PartnerCTA } from "@/components/kv/cards";
import { Icon, PageHero } from "@/components/kv/ui";
import { getServices } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Services",
  description: "AI and machine learning, software, web and mobile development, data science, IoT, digital transformation and technology consulting from Kalulu Vision.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero eyebrow="Services" title={<>Technology services, <span className="text-gradient-brand">built around outcomes.</span></>}
        lead="Eight ways we help organisations turn ideas and data into working technology." />
      <section className="py-20 sm:py-28">
        <ul className="container-kv grid gap-5 md:grid-cols-2">
          {services.map((s, i) => (
            <li key={s.slug} data-reveal style={{ ["--d" as string]: i % 4 }}>
              <Link href={`/services/${s.slug}`} className="kv-glow-card group flex h-full flex-col p-7 sm:p-9" data-tilt>
                <div className="flex items-start justify-between gap-6">
                  <span className="grid size-14 place-items-center rounded-2xl border border-line bg-white/[0.03] text-orange transition-all duration-500 group-hover:border-orange/50 group-hover:shadow-[0_0_30px_-6px_rgb(255_138_0/0.7)]">
                    <Icon name={s.icon} className="size-7" />
                  </span>
                  <span className="font-display text-sm text-subtle">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h2 className="mt-8 text-2xl font-semibold transition-colors group-hover:text-orange">{s.title}</h2>
                <p className="mt-3 text-muted">{s.summary}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {s.offerings.slice(0, 3).map((o) => <li key={o} className="rounded-full border border-line px-3 py-1 text-sm text-muted">{o}</li>)}
                </ul>
                <span className="mt-auto flex items-center gap-2 pt-8 font-display text-sm font-semibold text-amber">
                  Learn more <Icon name="arrowRight" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <PartnerCTA />
    </>
  );
}
