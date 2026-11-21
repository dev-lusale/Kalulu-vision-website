import type { Metadata } from "next";
import { EnquiryForm } from "@/components/kv/EnquiryForm";
import { ButtonLink, Figure, Icon, IconTile, PageHero, SectionHeading } from "@/components/kv/ui";
import { getCompany, getOpportunities, getSiteImages } from "@/lib/content";
import { OPPORTUNITY_TYPES } from "@/lib/content-types";

export const revalidate = 86400; // admin edits refresh pages instantly via revalidatePath
export const metadata: Metadata = {
  title: "Careers & Opportunities",
  description: "Careers, internships, student opportunities, research collaborations, technology partnerships and innovation programmes at Kalulu Vision.",
  alternates: { canonical: "/opportunities" },
};

const TYPE_ICON: Record<string, string> = { career: "briefcase", internship: "spark", student: "book", research: "flask", partnership: "handshake", programme: "layers" };
const GENERAL = [
  { slug: "general-talent", title: "Join our talent pool", text: "Developers, data scientists and designers interested in future roles or internships.", icon: "users" },
  { slug: "general-research", title: "Research collaboration", text: "Students and researchers working on AI, African languages, accessibility or IoT.", icon: "flask" },
  { slug: "general-student", title: "Student projects", text: "Final-year and capstone projects connected to our real-world problems.", icon: "book" },
];
const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function OpportunitiesPage() {
  const [openings, company, images] = await Promise.all([getOpportunities(), getCompany(), getSiteImages()]);
  const choices = [...openings.filter((o) => o.isOpen).map((o) => ({ slug: o.slug, title: o.title })), ...GENERAL.map((g) => ({ slug: g.slug, title: g.title }))];
  return (
    <>
      <PageHero eyebrow="Careers & Opportunities" title="Build the future with us."
        lead="Careers, internships, student opportunities, research collaborations and innovation programmes."
        aside={<Figure image={images.careers} ratio="aspect-[3/2]" sizes="(min-width: 1024px) 45vw, 100vw" priority />}>
        <ButtonLink href="#apply" arrow>Apply or express interest</ButtonLink>
      </PageHero>

      <section className="section-y" aria-labelledby="open-title">
        <div className="container-kv">
          <SectionHeading id="open-title" eyebrow="Openings" title="Current opportunities" />
          {openings.length ? (
            <ul className="mt-10 grid gap-5 md:grid-cols-2">
              {openings.map((o) => (
                <li key={o.slug} className="kv-card flex flex-col p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <IconTile name={TYPE_ICON[o.type] ?? "spark"} />
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${o.isOpen ? "bg-success/12 text-success" : "bg-soft-2 text-muted"}`}>{o.isOpen ? "Applications open" : "Closed"}</span>
                  </div>
                  <p className="mt-5 text-xs font-semibold tracking-[0.08em] text-accent-ink uppercase">{OPPORTUNITY_TYPES.find((t) => t.id === o.type)?.label ?? o.type}</p>
                  <h3 className="mt-1 text-xl font-bold">{o.title}</h3>
                  <p className="mt-2 text-muted">{o.summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-subtle">
                    {o.location && <li className="inline-flex items-center gap-1.5"><Icon name="pin" className="size-4" />{o.location}</li>}
                    {o.deadline && <li className="inline-flex items-center gap-1.5"><Icon name="calendar" className="size-4" />Apply by {fmt(o.deadline)}</li>}
                  </ul>
                  {o.description && <details className="mt-3 text-muted"><summary className="min-h-11 cursor-pointer py-2 font-semibold text-fg">Full details</summary><p className="whitespace-pre-line">{o.description}</p></details>}
                  {o.isOpen && <div className="mt-auto pt-5"><ButtonLink href="#apply" size="sm" variant="secondary" arrow>Apply</ButtonLink></div>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 max-w-2xl rounded-lg border border-dashed border-line-strong bg-soft p-6 text-muted">There are no specific openings right now. We are always glad to hear from people who want to collaborate, so tell us about yourself below.</p>
          )}

          <h3 className="mt-14 font-display text-lg font-bold">Always open</h3>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {GENERAL.map((g, i) => (
              <li key={g.slug} className="kv-card flex gap-4 p-6" data-reveal style={{ ["--d" as string]: i }}>
                <IconTile name={g.icon} tone="accent" />
                <span><span className="block font-display text-lg font-bold">{g.title}</span><span className="mt-1 block text-[0.95rem] text-muted">{g.text}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="apply" className="section-y border-t border-line bg-soft" aria-labelledby="apply-title">
        <div className="container-kv grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading id="apply-title" eyebrow="Apply" title="Apply or express interest" lead="Tell us who you are and what you would like to work on. Add a link to your CV, portfolio or proposal if you have one." />
          </div>
          <EnquiryForm kind="opportunity" opportunities={choices} email={company.email} whatsapp={company.whatsapp.replace(/\D/g, "")} />
        </div>
      </section>
    </>
  );
}
