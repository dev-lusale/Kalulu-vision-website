import type { Metadata } from "next";
import { EnquiryForm } from "@/components/kv/EnquiryForm";
import { Icon, PageHero } from "@/components/kv/ui";
import { getCompany, getOpportunities } from "@/lib/content";
import { OPPORTUNITY_TYPES } from "@/lib/content-types";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Opportunities",
  description: "Careers, internships, student opportunities, research collaborations, technology partnerships and innovation programmes at Kalulu Vision.",
  alternates: { canonical: "/opportunities" },
};

const TYPE_ICON: Record<string, string> = { career: "users", internship: "spark", student: "book", research: "flask", partnership: "globe", programme: "layers" };
const GENERAL = [
  { slug: "general-research", title: "Research collaboration", text: "Universities, researchers and students working on AI, African languages, accessibility or IoT." },
  { slug: "general-partnership", title: "Technology partnership", text: "Organisations that want to co-develop, pilot or deploy a solution with us." },
  { slug: "general-talent", title: "Join our talent pool", text: "Developers, data scientists and designers interested in future roles or internships." },
];

export default async function OpportunitiesPage() {
  const [openings, company] = await Promise.all([getOpportunities(), getCompany()]);
  const choices = [...openings.map((o) => ({ slug: o.slug, title: o.title })), ...GENERAL.map((g) => ({ slug: g.slug, title: g.title }))];
  return (
    <>
      <PageHero eyebrow="Opportunities" title={<>Build the future <span className="text-gradient-brand">with us.</span></>}
        lead="Careers, internships, student opportunities, research collaborations, technology partnerships and innovation programmes." />

      <section className="py-16 sm:py-24" aria-labelledby="open-title">
        <div className="container-kv">
          <h2 id="open-title" className="text-3xl font-semibold" data-reveal>Current openings</h2>
          {openings.length ? (
            <ul className="mt-8 grid gap-4">
              {openings.map((o) => (
                <li key={o.slug} className="kv-glow-card grid gap-4 p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-7">
                  <span className="grid size-12 place-items-center rounded-xl bg-orange/10 text-orange"><Icon name={TYPE_ICON[o.type] ?? "spark"} /></span>
                  <div>
                    <p className="text-sm text-amber">{OPPORTUNITY_TYPES.find((t) => t.id === o.type)?.label ?? o.type}{o.location ? ` · ${o.location}` : ""}{o.deadline ? ` · Apply by ${new Date(o.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : ""}</p>
                    <h3 className="mt-1 text-xl font-semibold">{o.title}</h3>
                    <p className="mt-1 text-muted">{o.summary}</p>
                    {o.description && <details className="mt-3 text-muted"><summary className="min-h-11 cursor-pointer py-2 font-semibold text-fg">Full details</summary><p className="whitespace-pre-line">{o.description}</p></details>}
                  </div>
                  <a href="#apply" className="inline-flex min-h-11 items-center justify-center rounded-full border border-line-strong px-5 text-sm font-semibold hover:border-orange hover:text-orange">Apply</a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 max-w-2xl text-muted" data-reveal>There are no specific openings right now. We&apos;re always glad to hear from people who want to collaborate, so tell us about yourself below.</p>
          )}

          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {GENERAL.map((g, i) => (
              <li key={g.slug} className="kv-glow-card p-7" data-reveal style={{ ["--d" as string]: i }}>
                <h3 className="text-xl font-semibold">{g.title}</h3>
                <p className="mt-2 text-muted">{g.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="apply" className="border-t border-line bg-ink-850 py-16 sm:py-24" aria-labelledby="apply-title">
        <div className="container-kv grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <h2 id="apply-title" className="text-3xl font-semibold">Apply or express interest</h2>
            <p className="mt-4 text-muted">Tell us who you are and what you&apos;d like to work on. Add a link to your CV, portfolio or proposal if you have one.</p>
          </div>
          <EnquiryForm kind="opportunity" opportunities={choices} email={company.email} whatsapp={company.whatsapp.replace(/\D/g, "")} />
        </div>
      </section>
    </>
  );
}
