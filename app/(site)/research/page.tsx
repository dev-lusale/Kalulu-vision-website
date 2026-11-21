import type { Metadata } from "next";
import { PartnerCTA, ProjectCard } from "@/components/kv/cards";
import { InsightsBrowser } from "@/components/kv/InsightsBrowser";
import { PageHero } from "@/components/kv/ui";
import { getPosts, getProjects, getResearchInfo } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Research & innovation",
  description: "Kalulu Vision's applied research in AI, African language technology, accessibility, intelligent automation and emerging technologies.",
  alternates: { canonical: "/research" },
};

export default async function ResearchPage() {
  const [info, publications, projects] = await Promise.all([getResearchInfo(), getPosts("research"), getProjects()]);
  const experiments = projects.filter((p) => p.categories.includes("research"));
  return (
    <>
      <PageHero eyebrow="Research & innovation" title={<>Applied research, <span className="text-gradient-brand">tested in the field.</span></>} lead={info.intro} />

      <section className="py-20 sm:py-28" aria-labelledby="areas-title">
        <div className="container-kv">
          <h2 id="areas-title" className="text-3xl font-semibold" data-reveal>Research areas</h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {info.areas.map((a, i) => (
              <li key={a.title} className="bg-ink-900 p-8 transition-colors hover:bg-ink-850" data-reveal style={{ ["--d" as string]: i % 3 }}>
                <span className="font-display text-sm text-amber">R{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-xl font-semibold">{a.title}</h3>
                <p className="mt-2 text-muted">{a.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {experiments.length > 0 && (
        <section className="border-y border-line bg-ink-850 py-20 sm:py-28" aria-labelledby="exp-title">
          <div className="container-kv">
            <h2 id="exp-title" className="text-3xl font-semibold" data-reveal>Experimental projects</h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {experiments.map((p, i) => <li key={p.slug} data-reveal style={{ ["--d" as string]: i }}><ProjectCard project={p} /></li>)}
            </ul>
          </div>
        </section>
      )}

      <section className="py-20 sm:py-28" aria-labelledby="pub-title">
        <div className="container-kv">
          <h2 id="pub-title" className="text-3xl font-semibold" data-reveal>Publications &amp; technical notes</h2>
          {publications.length ? (
            <div className="mt-10"><InsightsBrowser posts={publications} basePath="/research" /></div>
          ) : (
            <p className="mt-6 max-w-2xl text-muted">Research write-ups and technical demonstrations will be published here as our projects reach milestones.</p>
          )}
        </div>
      </section>
      <PartnerCTA />
    </>
  );
}
