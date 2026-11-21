import type { Metadata } from "next";
import { PartnerCTA, ProjectCard } from "@/components/kv/cards";
import { InsightsBrowser } from "@/components/kv/InsightsBrowser";
import { ButtonLink, Figure, PageHero, SectionHeading } from "@/components/kv/ui";
import { getPosts, getProjects, getResearchInfo, getSiteImages } from "@/lib/content";

export const revalidate = 86400; // admin edits refresh pages instantly via revalidatePath
export const metadata: Metadata = {
  title: "Research & Innovation",
  description: "Kalulu Vision's applied research in AI, African language technology, accessibility, intelligent automation and emerging technologies.",
  alternates: { canonical: "/research" },
};

export default async function ResearchPage() {
  const [info, publications, projects, images] = await Promise.all([getResearchInfo(), getPosts("research"), getProjects(), getSiteImages()]);
  const experiments = projects.filter((p) => p.categories.includes("research") || ["research", "concept", "prototype"].includes(p.status));
  return (
    <>
      <PageHero eyebrow="Research & Innovation" title="Applied research for African technology challenges." lead={info.intro} tone="band"
        aside={<Figure image={images.research} ratio="aspect-[4/3]" className="[&_figcaption]:text-band-muted" sizes="(min-width: 1024px) 45vw, 100vw" priority />}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/partnerships?type=research#enquiry" variant="brand" arrow>Collaborate on research</ButtonLink>
          <ButtonLink href="#publications" variant="light">Publications</ButtonLink>
        </div>
      </PageHero>

      <section className="section-y" aria-labelledby="areas-title">
        <div className="container-kv">
          <SectionHeading id="areas-title" eyebrow="Focus areas" title="What we research" />
          <ol className="mt-12 grid gap-0 border-t border-line">
            {info.areas.map((a, i) => (
              <li key={a.title} className="grid gap-3 border-b border-line py-7 sm:grid-cols-[90px_1fr_1.4fr] sm:gap-8" data-reveal style={{ ["--d" as string]: i % 3 }}>
                <span className="font-display text-3xl font-bold text-accent-ink">R{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-bold">{a.title}</h3>
                <p className="text-muted">{a.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {experiments.length > 0 && (
        <section className="section-y border-y border-line bg-soft" aria-labelledby="exp-title">
          <div className="container-kv">
            <SectionHeading id="exp-title" eyebrow="Technical work" title="Experimental solutions" lead="Concepts, prototypes and research projects under active investigation." />
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {experiments.map((p, i) => <li key={p.slug} data-reveal style={{ ["--d" as string]: i }}><ProjectCard project={p} /></li>)}
            </ul>
          </div>
        </section>
      )}

      <section id="publications" className="section-y" aria-labelledby="pub-title">
        <div className="container-kv">
          <SectionHeading id="pub-title" eyebrow="Publications" title="Publications & technical notes" />
          {publications.length ? (
            <div className="mt-10"><InsightsBrowser posts={publications} label="research publications" /></div>
          ) : (
            <p className="mt-8 max-w-2xl rounded-lg border border-dashed border-line-strong bg-soft p-6 text-muted">Research write-ups and technical demonstrations will be published here as our projects reach milestones.</p>
          )}
        </div>
      </section>
      <PartnerCTA title="Researching something we should work on together?" text="We collaborate with universities, research institutions and innovators on applied problems." />
    </>
  );
}
