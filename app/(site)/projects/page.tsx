import type { Metadata } from "next";
import { PartnerCTA } from "@/components/kv/cards";
import { ProjectBrowser } from "@/components/kv/ProjectBrowser";
import { PageHero } from "@/components/kv/ui";
import { getProjects } from "@/lib/content";
import { STATUS_LABELS } from "@/lib/content-types";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Projects & Case Studies",
  description: "Kalulu Vision projects in AI, software, data science, IoT, mobile and research, each labelled with its real development stage.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const byStage = Object.entries(projects.reduce<Record<string, number>>((m, p) => ({ ...m, [p.status]: (m[p.status] ?? 0) + 1 }), {}));
  return (
    <>
      <PageHero eyebrow="Projects & Case Studies" title="Our work, at every stage."
        lead="From early concepts and research to live platforms. Each case study states its real development stage and only verified results."
        aside={
          <div className="kv-card p-6">
            <p className="text-sm font-semibold text-muted">Portfolio by stage</p>
            <ul className="mt-4 grid gap-3">
              {byStage.map(([s, n]) => (
                <li key={s} className="flex items-center gap-3">
                  <span className="w-28 text-sm">{STATUS_LABELS[s] ?? s}</span>
                  <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-soft-2"><span className="block h-full rounded-full bg-accent" style={{ width: `${(n / projects.length) * 100}%` }} /></span>
                  <span className="w-6 text-right font-display font-bold">{n}</span>
                </li>
              ))}
            </ul>
          </div>
        } />
      <section className="section-y">
        <div className="container-kv"><ProjectBrowser projects={projects} /></div>
      </section>
      <PartnerCTA />
    </>
  );
}
