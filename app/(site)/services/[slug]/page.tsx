import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PartnerCTA, ProjectCard } from "@/components/kv/cards";
import { ButtonLink, CheckList, Chips, Icon, PageHero } from "@/components/kv/ui";
import { getProjects, getService, getServices, serviceCategories } from "@/lib/content";

export const revalidate = 60;

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
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <>
      <PageHero eyebrow="Service" title={service.title} lead={service.intro}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`/contact?service=${encodeURIComponent(service.title)}`} arrow>Discuss your project</ButtonLink>
          <ButtonLink href="/services" variant="secondary">All services</ButtonLink>
        </div>
      </PageHero>

      <section className="py-20 sm:py-28">
        <div className="container-kv grid gap-6 lg:grid-cols-3">
          <div className="kv-glow-card p-8" data-reveal>
            <h2 className="flex items-center gap-3 text-xl font-semibold"><Icon name="layers" className="size-5 text-orange" />What we offer</h2>
            <div className="mt-6"><CheckList items={service.offerings} /></div>
          </div>
          <div className="kv-glow-card p-8" data-reveal style={{ ["--d" as string]: 1 }}>
            <h2 className="flex items-center gap-3 text-xl font-semibold"><Icon name="code" className="size-5 text-orange" />Technologies &amp; capabilities</h2>
            <div className="mt-6"><Chips items={service.technologies} label="Technologies" /></div>
          </div>
          <div className="kv-glow-card p-8" data-reveal style={{ ["--d" as string]: 2 }}>
            <h2 className="flex items-center gap-3 text-xl font-semibold"><Icon name="spark" className="size-5 text-orange" />Practical applications</h2>
            <div className="mt-6"><CheckList items={service.applications} /></div>
          </div>
        </div>
      </section>

      {examples.length > 0 && (
        <section className="border-y border-line bg-ink-850 py-20 sm:py-28" aria-labelledby="ex-title">
          <div className="container-kv">
            <h2 id="ex-title" className="text-3xl font-semibold" data-reveal>Related project examples</h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {examples.map((p, i) => <li key={p.slug} data-reveal style={{ ["--d" as string]: i }}><ProjectCard project={p} /></li>)}
            </ul>
          </div>
        </section>
      )}

      <section className="py-20 sm:py-24" aria-labelledby="other-title">
        <div className="container-kv">
          <h2 id="other-title" className="text-2xl font-semibold" data-reveal>Other services</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="kv-glow-card flex h-full items-center gap-3 p-5 hover:text-orange">
                  <Icon name={s.icon} className="size-5 shrink-0 text-orange" /><span className="font-medium">{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <PartnerCTA />
    </>
  );
}
