import type { Metadata } from "next";
import { PartnerCTA } from "@/components/kv/cards";
import { ProjectBrowser } from "@/components/kv/ProjectBrowser";
import { PageHero } from "@/components/kv/ui";
import { getProjects } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Projects & portfolio",
  description: "Kalulu Vision projects in AI, software, data science, IoT, mobile and research, each labelled with its real status.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <PageHero eyebrow="Projects & portfolio" title={<>Work in progress, <span className="text-gradient-brand">in production and in the field.</span></>}
        lead="Every project shows its honest status, from early concept to live product." />
      <section className="py-16 sm:py-24">
        <div className="container-kv"><ProjectBrowser projects={projects} /></div>
      </section>
      <PartnerCTA />
    </>
  );
}
