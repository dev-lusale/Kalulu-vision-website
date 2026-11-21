import type { Metadata } from "next";
import Link from "next/link";
import { PartnerCTA } from "@/components/kv/cards";
import { ButtonLink, Icon, IconTile, PageHero } from "@/components/kv/ui";
import { getServices } from "@/lib/content";

export const revalidate = 86400; // admin edits refresh pages instantly via revalidatePath
export const metadata: Metadata = {
  title: "Our Services",
  description: "AI and machine learning, software, web and mobile development, data science, IoT, digital transformation and technology consulting from Kalulu Vision.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero eyebrow="Our Services" title="Technology services built around outcomes."
        lead={`${services.length} ways we help organisations turn ideas and data into working technology, from first prototype to deployment.`}>
        <ButtonLink href="/contact" arrow>Discuss a project</ButtonLink>
      </PageHero>

      <section className="section-y">
        <div className="container-kv grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
          {/* Index */}
          <nav aria-label="Services on this page" className="hidden lg:block">
            <div className="sticky top-[calc(var(--nav-h)+24px)] rounded-xl border border-line bg-soft p-3">
              <p className="px-3 pb-2 pt-1 text-xs font-semibold tracking-[0.1em] text-subtle uppercase">Services</p>
              <ol className="grid">
                {services.map((s, i) => (
                  <li key={s.slug}><a href={`#${s.slug}`} className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm text-muted hover:bg-surface hover:text-fg"><span className="font-display text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span>{s.title}</a></li>
                ))}
              </ol>
            </div>
          </nav>

          <ol className="grid gap-6">
            {services.map((s, i) => (
              <li key={s.slug} id={s.slug} className="kv-card grid gap-6 p-7 sm:p-9 md:grid-cols-[auto_1fr]" data-reveal>
                <IconTile name={s.icon} tone={i % 2 ? "accent" : "primary"} className="size-14" />
                <div>
                  <p className="font-display text-sm font-semibold text-subtle">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="mt-1 text-2xl font-bold">{s.title}</h2>
                  <p className="mt-2 max-w-3xl text-muted">{s.summary}</p>
                  <ul className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    {s.offerings.slice(0, 4).map((o) => (
                      <li key={o} className="flex gap-2.5 text-sm text-muted"><Icon name="check" className="mt-0.5 size-4 shrink-0 text-accent-ink" strokeWidth={2.2} />{o}</li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <ButtonLink href={`/services/${s.slug}`} size="sm" arrow>Explore {s.title}</ButtonLink>
                    <Link href={`/contact?service=${encodeURIComponent(s.title)}`} className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-primary hover:underline underline-offset-4 dark:text-fg">Request this service</Link>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <PartnerCTA />
    </>
  );
}
