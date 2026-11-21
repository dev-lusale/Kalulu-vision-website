import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PartnerCTA, ProjectCard } from "@/components/kv/cards";
import { ButtonLink, CheckList, Chips, Icon, IconTile, PageHero } from "@/components/kv/ui";
import { getProjects, getService, getServices, serviceCategories } from "@/lib/content";

export const revalidate = 86400; // admin edits refresh pages instantly via revalidatePath

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) return { title: "Service not found" };
  return { title: s.title, description: s.summary, alternates: { canonical: `/services/${s.slug}` } };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [service, services, projects] = await Promise.all([getService(slug), getServices(), getProjects()]);
  if (!service) notFound();
  const cats = serviceCategories(service.slug);
  const examples = projects.filter((p) => p.categories.some((c) => cats.includes(c))).slice(0, 3);

  return (
    <>
      <PageHero eyebrow={service.title} crumbs={[{ href: "/services", label: "Services" }]} title={service.title} lead={service.intro}
        aside={<div className="hidden justify-end lg:flex"><span className="grid size-40 place-items-center rounded-3xl border border-line bg-surface text-primary shadow-lift dark:text-fg"><Icon name={service.icon} className="size-20" strokeWidth={1.2} /></span></div>}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`/contact?service=${encodeURIComponent(service.title)}`} arrow>Discuss your project</ButtonLink>
          <ButtonLink href="/services" variant="secondary">All services</ButtonLink>
        </div>
      </PageHero>

      <section className="section-y">
        <div className="container-kv grid gap-10 lg:grid-cols-[1fr_300px] lg:gap-14">
          <div className="grid gap-10">
            <div data-reveal>
              <h2 className="flex items-center gap-3 text-2xl font-bold"><IconTile name="layers" className="size-10" />What we offer</h2>
              <div className="mt-6"><CheckList items={service.offerings} cols={2} /></div>
            </div>
            <div className="border-t border-line pt-10" data-reveal>
              <h2 className="flex items-center gap-3 text-2xl font-bold"><IconTile name="code" tone="accent" className="size-10" />Technologies &amp; capabilities</h2>
              <div className="mt-6"><Chips items={service.technologies} label="Technologies" /></div>
            </div>
            <div className="border-t border-line pt-10" data-reveal>
              <h2 className="flex items-center gap-3 text-2xl font-bold"><IconTile name="spark" tone="brand" className="size-10" />Practical applications</h2>
              <div className="mt-6"><CheckList items={service.applications} cols={2} /></div>
            </div>
          </div>

          <aside className="grid content-start gap-5">
            <div className="kv-card bg-band p-6 text-band-fg">
              <h2 className="font-display text-lg font-bold">Start a conversation</h2>
              <p className="mt-2 text-sm text-band-muted">Tell us about the problem. We reply by email, usually within two working days.</p>
              <ButtonLink href={`/contact?service=${encodeURIComponent(service.title)}`} variant="brand" size="sm" className="mt-5 w-full" arrow>Contact us</ButtonLink>
            </div>
            <nav aria-label="Other services" className="kv-card p-3">
              <p className="px-3 pb-2 pt-1 text-xs font-semibold tracking-[0.1em] text-subtle uppercase">All services</p>
              <ul>
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} aria-current={s.slug === service.slug ? "page" : undefined}
                      className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm ${s.slug === service.slug ? "bg-primary/8 font-semibold text-primary dark:bg-white/10 dark:text-fg" : "text-muted hover:bg-soft hover:text-fg"}`}>
                      <Icon name={s.icon} className="size-4 shrink-0" />{s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>

      {examples.length > 0 && (
        <section className="section-y border-t border-line bg-soft" aria-labelledby="ex-title">
          <div className="container-kv">
            <h2 id="ex-title" className="text-3xl font-bold" data-reveal>Related projects</h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {examples.map((p, i) => <li key={p.slug} data-reveal style={{ ["--d" as string]: i }}><ProjectCard project={p} /></li>)}
            </ul>
          </div>
        </section>
      )}
      <PartnerCTA />
    </>
  );
}
