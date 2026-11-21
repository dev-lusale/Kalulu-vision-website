import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/kv/EnquiryForm";
import { ButtonLink, Figure, IconTile, PageHero, SectionHeading } from "@/components/kv/ui";
import { getCompany, getSiteImages } from "@/lib/content";
import { PARTNER_TYPES } from "@/lib/content-types";

export const metadata: Metadata = {
  title: "Partnerships",
  description: "Partner with Kalulu Vision: corporate organisations, universities, government, research institutions, technology companies and innovation ecosystems.",
  alternates: { canonical: "/partnerships" },
};

const WAYS = [
  { title: "Co-develop a solution", text: "Bring a problem; we scope, prototype and build it with your team." },
  { title: "Pilot a product", text: "Test one of our products with your users and shape how it develops." },
  { title: "Research together", text: "Joint research, data partnerships and student projects on applied problems." },
  { title: "Train and grow talent", text: "Practical technology training for your staff, students or community." },
];
const STEPS = [
  { title: "Tell us about your organisation", text: "Send the enquiry form below with a short description of what you have in mind." },
  { title: "An introductory conversation", text: "We set up a call to understand your goals, constraints and timelines." },
  { title: "A clear proposal", text: "We agree scope, responsibilities and how we will measure success, in writing." },
];

export default async function PartnershipsPage({ searchParams }: PageProps<"/partnerships">) {
  const [company, images, sp] = await Promise.all([getCompany(), getSiteImages(), searchParams]);
  const pre = PARTNER_TYPES.find((p) => p.id === sp.type)?.label ?? "";
  return (
    <>
      <PageHero eyebrow="Partnerships" crumbs={[{ href: "/about", label: "About Us" }]} title="Partner with Kalulu Vision."
        lead="We collaborate with organisations that want useful, locally relevant technology, and with the people building Africa's innovation ecosystem."
        aside={<Figure image={images.partnerships} ratio="aspect-[4/3]" sizes="(min-width: 1024px) 45vw, 100vw" priority />}>
        <ButtonLink href="#enquiry" arrow>Make a partnership enquiry</ButtonLink>
      </PageHero>

      <section className="section-y" aria-labelledby="who-title">
        <div className="container-kv">
          <SectionHeading id="who-title" eyebrow="Who we partner with" title="Six kinds of partners, one goal" lead="Choose the description closest to your organisation to start an enquiry." />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNER_TYPES.map((p, i) => (
              <li key={p.id} data-reveal style={{ ["--d" as string]: i % 3 }}>
                <Link href={`/partnerships?type=${p.id}#enquiry`} className="kv-card group flex h-full flex-col p-7">
                  <IconTile name={p.icon} tone={i % 2 ? "accent" : "primary"} />
                  <h3 className="mt-5 text-xl font-bold">{p.label}</h3>
                  <p className="mt-2 text-muted">{p.text}</p>
                  <span className="mt-auto pt-5 text-sm font-semibold text-primary group-hover:underline underline-offset-4 dark:text-fg">Start an enquiry <span aria-hidden="true">→</span><span className="sr-only"> as {p.label}</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y border-y border-line bg-soft" aria-labelledby="ways-title">
        <div className="container-kv grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading id="ways-title" eyebrow="Ways to work together" title="How partnerships take shape" />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {WAYS.map((w, i) => (
                <li key={w.title} className="kv-card p-6" data-reveal style={{ ["--d" as string]: i }}>
                  <h3 className="font-display text-lg font-bold">{w.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] text-muted">{w.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="What happens next" title="From enquiry to agreement" />
            <ol className="mt-10 grid gap-6">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-5" data-reveal style={{ ["--d" as string]: i }}>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary font-display font-bold text-on-primary">{i + 1}</span>
                  <span><span className="block font-display text-lg font-bold">{s.title}</span><span className="mt-1 block text-muted">{s.text}</span></span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="enquiry" className="section-y scroll-mt-24" aria-labelledby="enq-title">
        <div className="container-kv grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading id="enq-title" eyebrow="Partnership enquiry" title="Start the conversation" lead="We reply to every partnership enquiry by email." />
          <EnquiryForm key={pre} kind="partnership" partnerTypes={PARTNER_TYPES.map((p) => p.label)} defaultPartnerType={pre} email={company.email} whatsapp={company.whatsapp.replace(/\D/g, "")} />
        </div>
      </section>
    </>
  );
}
