import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PartnerCTA, ProjectCard } from "@/components/kv/cards";
import { AbstractVisual, ButtonLink, Chips, PageHero, StatusBadge } from "@/components/kv/ui";
import { getProject, getProjects } from "@/lib/content";
import { PROJECT_CATEGORIES } from "@/lib/content-types";

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return { title: "Project not found" };
  return {
    title: p.title, description: p.overview, alternates: { canonical: `/projects/${p.slug}` },
    openGraph: p.imageUrl ? { images: [p.imageUrl] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();
  const related = all.filter((p) => p.slug !== project.slug && p.categories.some((c) => project.categories.includes(c))).slice(0, 3);
  const cats = project.categories.map((c) => PROJECT_CATEGORIES.find((x) => x.id === c)?.label ?? c);

  return (
    <>
      <PageHero eyebrow={cats.join(" · ") || "Project"} title={project.title} lead={project.overview}>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} />
          {project.demoUrl && <ButtonLink href={project.demoUrl} size="sm" arrow>{project.demoUrl.startsWith("/") ? "Open" : "Live demo"}</ButtonLink>}
          {project.repoUrl && <ButtonLink href={project.repoUrl} size="sm" variant="secondary" arrow>GitHub repository</ButtonLink>}
        </div>
      </PageHero>

      <section className="py-16 sm:py-24">
        <div className="container-kv grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-line lg:order-2 lg:self-start" data-reveal>
            <div className="aspect-[16/11]">
              {project.imageUrl ? <img src={project.imageUrl} alt={`${project.title} preview`} className="h-full w-full object-cover" /> : <AbstractVisual seed={project.slug} label={project.title} />}
            </div>
          </div>
          <div className="grid gap-10 lg:order-1">
            {[["The problem", project.problem], ["Our solution", project.solution], ["Outcomes", project.outcomes]].filter(([, v]) => v).map(([t, v], i) => (
              <div key={t} data-reveal style={{ ["--d" as string]: i }}>
                <h2 className="eyebrow mb-3">{t}</h2>
                <p className="text-lg text-[#D5DBE6]">{v}</p>
              </div>
            ))}
            {project.technologies.length > 0 && (
              <div data-reveal><h2 className="eyebrow mb-4">Technologies</h2><Chips items={project.technologies} label="Technologies" /></div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-y border-line bg-ink-850 py-20" aria-labelledby="rel-title">
          <div className="container-kv">
            <h2 id="rel-title" className="text-3xl font-semibold">Related projects</h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <li key={p.slug}><ProjectCard project={p} /></li>)}
            </ul>
          </div>
        </section>
      )}
      <div className="pt-20"><PartnerCTA /></div>
    </>
  );
}
