import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/kv/Gallery";
import { PartnerCTA, ProjectCard, catLabel } from "@/components/kv/cards";
import { ButtonLink, Chips, Icon, NoScreenshot, PageHero, Photo, StatusBadge } from "@/components/kv/ui";
import { getProject, getProjects } from "@/lib/content";
import { STATUS_LABELS } from "@/lib/content-types";

export const revalidate = 86400; // admin edits refresh pages instantly via revalidatePath

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
  const shots = [project.imageUrl, ...project.gallery].filter(Boolean);
  const sections = [
    { id: "overview", title: "Project overview", body: project.overview },
    { id: "problem", title: "Problem statement", body: project.problem },
    { id: "solution", title: "Solution", body: project.solution },
  ].filter((s) => s.body);
  const demoIsInternal = project.demoUrl.startsWith("/");

  return (
    <>
      <PageHero eyebrow={project.title} crumbs={[{ href: "/projects", label: "Projects" }]} title={project.title} lead={project.overview}>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} />
          {project.demoUrl && <ButtonLink href={project.demoUrl} size="sm" arrow>{demoIsInternal ? "Open the platform" : "Live demonstration"}</ButtonLink>}
          {project.repoUrl && <ButtonLink href={project.repoUrl} size="sm" variant="secondary" arrow>Repository</ButtonLink>}
        </div>
      </PageHero>

      {/* Lead screenshot */}
      <section className="container-kv -mb-4 pt-10 sm:pt-14">
        <div className="kv-photo relative aspect-[16/8] rounded-2xl border border-line shadow-lift" data-reveal>
          {project.imageUrl ? <Photo src={project.imageUrl} alt={`${project.title} interface`} priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-top" /> : <NoScreenshot seed={project.slug} label={project.title} />}
        </div>
      </section>

      <section className="section-y">
        <div className="container-kv grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
          <article className="grid gap-10">
            {sections.map((s, i) => (
              <section key={s.id} aria-labelledby={`cs-${s.id}`} className={i ? "border-t border-line pt-10" : ""} data-reveal>
                <h2 id={`cs-${s.id}`} className="text-2xl font-bold">{s.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">{s.body}</p>
              </section>
            ))}

            <section aria-labelledby="cs-results" className="border-t border-line pt-10" data-reveal>
              <h2 id="cs-results" className="text-2xl font-bold">Documented results</h2>
              {project.outcomes
                ? <p className="mt-4 text-lg leading-relaxed text-muted">{project.outcomes}</p>
                : <p className="mt-4 rounded-lg border border-dashed border-line-strong bg-soft p-5 text-muted">No verified results have been published for this project yet. We will document outcomes here once they are measured.</p>}
            </section>

            <section aria-labelledby="cs-shots" className="border-t border-line pt-10">
              <h2 id="cs-shots" className="text-2xl font-bold">Interface screenshots</h2>
              {shots.length
                ? <div className="mt-6"><Gallery images={shots} title={project.title} /></div>
                : <p className="mt-4 text-muted">Screenshots will be published as the interface is finalised.</p>}
            </section>
          </article>

          <aside className="grid content-start gap-5 lg:sticky lg:top-[calc(var(--nav-h)+24px)] lg:self-start">
            <div className="kv-card p-6">
              <h2 className="font-display text-sm font-semibold tracking-[0.1em] text-subtle uppercase">Project facts</h2>
              <dl className="mt-4 grid gap-4 text-sm">
                <div><dt className="text-muted">Development stage</dt><dd className="mt-1"><StatusBadge status={project.status} /> <span className="sr-only">{STATUS_LABELS[project.status]}</span></dd></div>
                <div><dt className="text-muted">Categories</dt><dd className="mt-1 font-medium">{project.categories.map(catLabel).join(", ")}</dd></div>
                {project.technologies.length > 0 && <div><dt className="text-muted">Technologies</dt><dd className="mt-2"><Chips items={project.technologies} small /></dd></div>}
                <div>
                  <dt className="text-muted">Demonstration</dt>
                  <dd className="mt-1">{project.demoUrl ? <a href={project.demoUrl} className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4 dark:text-fg" {...(demoIsInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}>{demoIsInternal ? "Open platform" : "View live demo"}<Icon name={demoIsInternal ? "arrowRight" : "arrowUpRight"} className="size-3.5" /></a> : <span className="text-subtle">Not available yet</span>}</dd>
                </div>
                <div>
                  <dt className="text-muted">Repository</dt>
                  <dd className="mt-1">{project.repoUrl ? <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4 dark:text-fg"><Icon name="github" className="size-4" />View source<span className="sr-only"> (opens in a new tab)</span></a> : <span className="text-subtle">Private or not published</span>}</dd>
                </div>
              </dl>
            </div>
            <div className="kv-card bg-band p-6 text-band-fg">
              <p className="font-display font-bold">Interested in this project?</p>
              <p className="mt-1 text-sm text-band-muted">Partner, pilot or collaborate with us on it.</p>
              <ButtonLink href={`/contact?service=${encodeURIComponent(project.title)}`} variant="brand" size="sm" className="mt-4 w-full" arrow>Get in touch</ButtonLink>
            </div>
            <Link href="/projects" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-fg"><Icon name="arrowRight" className="size-4 rotate-180" />All projects</Link>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-y border-t border-line bg-soft" aria-labelledby="rel-title">
          <div className="container-kv">
            <h2 id="rel-title" className="text-3xl font-bold">Related projects</h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <li key={p.slug}><ProjectCard project={p} /></li>)}
            </ul>
          </div>
        </section>
      )}
      <PartnerCTA />
    </>
  );
}
