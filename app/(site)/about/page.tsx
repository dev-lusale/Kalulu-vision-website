import type { Metadata } from "next";
import Image from "next/image";
import { PartnerCTA } from "@/components/kv/cards";
import { ButtonLink, Figure, Icon, PageHero, SectionHeading } from "@/components/kv/ui";
import { getAbout, getSiteImages } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "About Us",
  description: "Kalulu Vision's story, mission, vision, values and approach to building technology for real-world challenges in Africa.",
  alternates: { canonical: "/about" },
};

const VALUE_ICONS = ["spark", "brain", "shield", "target", "users", "heart"];

export default async function AboutPage() {
  const [a, images] = await Promise.all([getAbout(), getSiteImages()]);
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Intelligent, resourceful and made for real conditions."
        lead={a.overview}
        aside={
          <div className="relative mx-auto w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-lift">
            <Image src="/brand/logo-640.webp" alt="The Kalulu Vision logo: an orange, three-dimensional hare" width={640} height={640} className="mx-auto w-3/4" priority />
            <p className="mt-4 text-center font-display text-lg font-bold tracking-[0.1em]">KALULU VISION</p>
            <p className="text-center text-sm font-semibold tracking-[0.12em] text-brand-ink uppercase">See beyond. Build the future.</p>
          </div>
        }
      />

      {/* Story — editorial two-column */}
      <section className="section-y" aria-labelledby="story-title">
        <div className="container-kv grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading id="story-title" eyebrow="Our story" title="Named after the clever hare." />
            <p className="mt-8 text-lg leading-relaxed text-muted first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.9] first-letter:text-primary dark:first-letter:text-fg" data-reveal>{a.story}</p>
          </div>
          <Figure image={images.overview} ratio="aspect-[4/5]" className="mx-auto w-full max-w-sm lg:max-w-none" sizes="(min-width: 1024px) 35vw, 90vw" />
        </div>
      </section>

      {/* Mission & vision — navy band */}
      <section className="bg-band text-band-fg" aria-label="Mission and vision">
        <div className="container-kv grid divide-y divide-band-line md:grid-cols-2 md:divide-x md:divide-y-0">
          {[["Our mission", a.mission, "target"], ["Our vision", a.vision, "eye"]].map(([t, v, icon], i) => (
            <div key={t} className={`py-14 sm:py-16 ${i ? "md:pl-12" : "md:pr-12"}`} data-reveal style={{ ["--d" as string]: i }}>
              <h2 className="inline-flex items-center gap-2.5 font-display text-sm font-semibold tracking-[0.14em] text-band-muted uppercase"><Icon name={icon} className="size-5 text-brand" />{t}</h2>
              <p className="mt-5 font-display text-2xl font-semibold leading-snug sm:text-[1.9rem]">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section-y" aria-labelledby="values-title">
        <div className="container-kv">
          <SectionHeading id="values-title" eyebrow="Core values" title="What guides our work" align="center" />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {a.values.map((v, i) => (
              <li key={v.title} className="kv-card p-7" data-reveal style={{ ["--d" as string]: i % 3 }}>
                <span className={`grid size-12 place-items-center rounded-full ${i % 2 ? "bg-accent/12 text-accent-ink" : "bg-primary/8 text-primary dark:bg-white/8 dark:text-fg"}`}><Icon name={VALUE_ICONS[i % VALUE_ICONS.length]} className="size-6" /></span>
                <h3 className="mt-5 text-xl font-bold">{v.title}</h3>
                <p className="mt-2 text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Approach — timeline */}
      <section className="section-y border-y border-line bg-soft" aria-labelledby="approach-title">
        <div className="container-kv grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading id="approach-title" eyebrow="Our approach" title="How we work" lead={a.philosophy} />
          <ol className="relative grid gap-8 border-l-2 border-line pl-8">
            {a.approach.map((s, i) => (
              <li key={s.title} className="relative" data-reveal style={{ ["--d" as string]: i }}>
                <span className="absolute -left-[49px] grid size-8 place-items-center rounded-full border-2 border-soft bg-primary font-display text-sm font-bold text-on-primary">{i + 1}</span>
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="mt-1.5 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Africa + recognition */}
      <section className="section-y" aria-labelledby="africa-title">
        <div className="container-kv grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Figure image={images.recognition} ratio="aspect-[16/10]" sizes="(min-width: 1024px) 50vw, 100vw" />
          <div>
            <SectionHeading id="africa-title" eyebrow="Built in Africa, for Africa" title="Technology Africa builds and owns" lead={a.africa} />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/projects" arrow>See our projects</ButtonLink>
              <ButtonLink href="/opportunities" variant="secondary">Careers &amp; opportunities</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <PartnerCTA />
    </>
  );
}
