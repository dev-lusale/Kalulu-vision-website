import type { Metadata } from "next";
import Image from "next/image";
import { PartnerCTA } from "@/components/kv/cards";
import { PageHero } from "@/components/kv/ui";
import { getAbout } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "About us",
  description: "Kalulu Vision's story, mission, vision, values and approach to building technology for real-world challenges in Africa.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const a = await getAbout();
  return (
    <>
      <PageHero eyebrow="About Kalulu Vision" title={<>Intelligent, resourceful, <span className="text-gradient-brand">made for real conditions.</span></>} lead={a.overview} />

      <section className="py-20 sm:py-28" aria-labelledby="story-title">
        <div className="container-kv grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-md" data-reveal>
            <div className="absolute inset-[10%] rounded-full bg-orange/20 blur-[80px]" aria-hidden="true" />
            <Image src="/brand/logo-640.webp" alt="The Kalulu Vision logo" width={640} height={640} className="relative w-full drop-shadow-[0_30px_60px_rgb(255_98_0/0.35)]" />
          </div>
          <div>
            <p className="eyebrow mb-4" data-reveal>Our story</p>
            <h2 id="story-title" className="text-[clamp(1.8rem,1.3rem+2vw,2.8rem)] font-semibold" data-reveal style={{ ["--d" as string]: 1 }}>Named after the clever hare.</h2>
            <p className="mt-6 text-lg text-muted" data-reveal style={{ ["--d" as string]: 2 }}>{a.story}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-ink-850 py-20 sm:py-28" aria-label="Mission and vision">
        <div className="container-kv grid gap-5 md:grid-cols-2">
          {[["Our mission", a.mission], ["Our vision", a.vision]].map(([t, v], i) => (
            <div key={t} className="kv-glow-card p-8 sm:p-10" data-reveal style={{ ["--d" as string]: i }}>
              <h2 className="eyebrow">{t}</h2>
              <p className="mt-5 font-display text-2xl font-medium leading-snug sm:text-[1.75rem]">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-28" aria-labelledby="values-title">
        <div className="container-kv">
          <p className="eyebrow mb-4" data-reveal>Core values</p>
          <h2 id="values-title" className="text-[clamp(1.8rem,1.3rem+2vw,2.8rem)] font-semibold" data-reveal>What guides our work</h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {a.values.map((v, i) => (
              <li key={v.title} className="bg-ink-900 p-8 transition-colors hover:bg-ink-850" data-reveal style={{ ["--d" as string]: i % 3 }}>
                <span className="font-display text-sm text-amber">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-xl font-semibold">{v.title}</h3>
                <p className="mt-2 text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-line bg-ink-850 py-20 sm:py-28" aria-labelledby="phil-title">
        <div className="container-kv grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow mb-4" data-reveal>Philosophy</p>
            <h2 id="phil-title" className="text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] font-medium leading-snug" data-reveal style={{ ["--d" as string]: 1 }}>{a.philosophy}</h2>
          </div>
          <div>
            <h3 className="eyebrow mb-6" data-reveal>Our approach to innovation</h3>
            <ol className="grid gap-4">
              {a.approach.map((s, i) => (
                <li key={s.title} className="kv-glow-card flex gap-5 p-6" data-reveal style={{ ["--d" as string]: i }}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-brand font-display text-sm font-bold text-ink-900">{i + 1}</span>
                  <div><h4 className="text-lg font-semibold">{s.title}</h4><p className="mt-1 text-muted">{s.text}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28" aria-labelledby="africa-title">
        <div className="container-kv max-w-4xl text-center">
          <p className="eyebrow mb-4 justify-center" data-reveal>Our commitment</p>
          <h2 id="africa-title" className="text-[clamp(1.8rem,1.3rem+2vw,2.8rem)] font-semibold" data-reveal>Advancing technology in Africa, <span className="text-gradient-brand">from Africa.</span></h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-muted" data-reveal style={{ ["--d" as string]: 1 }}>{a.africa}</p>
        </div>
      </section>
      <PartnerCTA />
    </>
  );
}
