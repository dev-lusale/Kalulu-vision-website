import Link from "next/link";
import type { Product, Project } from "@/lib/content-types";
import { PROJECT_CATEGORIES } from "@/lib/content-types";
import { AbstractVisual, ButtonLink, Chips, Icon, StatusBadge } from "./ui";

const catLabel = (id: string) => PROJECT_CATEGORIES.find((c) => c.id === id)?.label ?? id;

export function ProjectCard({ project: p }: { project: Project }) {
  return (
    <Link href={`/projects/${p.slug}`} className="kv-glow-card group flex h-full flex-col overflow-hidden" data-tilt>
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
        {p.imageUrl
          ? <img src={p.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          : <div className="h-full w-full transition-transform duration-700 group-hover:scale-105"><AbstractVisual seed={p.slug} label={p.title} /></div>}
        <span className="absolute left-4 top-4"><StatusBadge status={p.status} /></span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm text-subtle">{p.categories.map(catLabel).join(" · ")}</p>
        <h3 className="mt-2 text-xl font-semibold transition-colors group-hover:text-orange">{p.title}</h3>
        <p className="mt-2 line-clamp-3 text-muted">{p.overview}</p>
        <span className="mt-auto flex items-center gap-2 pt-6 font-display text-sm font-semibold text-amber">
          View project <Icon name="arrowRight" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function ProductCard({ product: p }: { product: Product }) {
  return (
    <article className="kv-glow-card flex h-full flex-col overflow-hidden lg:flex-row">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line lg:aspect-auto lg:w-[42%] lg:border-r lg:border-b-0">
        {p.imageUrl ? <img src={p.imageUrl} alt={`${p.name} screenshot`} loading="lazy" className="h-full w-full object-cover" /> : <AbstractVisual seed={p.slug} label={p.name} />}
      </div>
      <div className="flex flex-1 flex-col p-7 sm:p-9">
        <div className="flex flex-wrap items-center gap-3"><StatusBadge status={p.status} /></div>
        <h3 className="mt-4 text-2xl font-semibold sm:text-3xl">{p.name}</h3>
        <p className="mt-1 text-amber">{p.tagline}</p>
        <p className="mt-4 text-muted">{p.description}</p>
        {p.features.length > 0 && (
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {p.features.map((f) => (
              <li key={f} className="flex gap-2.5 text-sm text-muted"><Icon name="check" className="mt-0.5 size-4 shrink-0 text-orange" strokeWidth={2.2} />{f}</li>
            ))}
          </ul>
        )}
        {p.technologies.length > 0 && <div className="mt-6"><Chips items={p.technologies} label="Technology stack" /></div>}
        {p.websiteUrl && (
          <div className="mt-8"><ButtonLink href={p.websiteUrl} arrow variant={p.status === "live" ? "primary" : "secondary"}>{p.status === "live" ? "Visit product" : "View project"}</ButtonLink></div>
        )}
      </div>
    </article>
  );
}

export function PartnerCTA() {
  return (
    <section className="pb-24 sm:pb-32" aria-labelledby="cta-title">
      <div className="container-kv">
        <div className="relative isolate overflow-hidden rounded-[28px] border border-orange/30 px-7 py-16 text-center sm:px-16 sm:py-24" data-reveal>
          <div className="kv-aurora absolute -inset-[40%] -z-10 opacity-90" aria-hidden="true" />
          <div className="absolute inset-0 -z-20 bg-ink-850" aria-hidden="true" />
          <p className="eyebrow mb-5 justify-center">Partnership &amp; collaboration</p>
          <h2 id="cta-title" className="mx-auto max-w-3xl text-[clamp(2rem,1.4rem+2.8vw,3.6rem)] font-semibold">Have a challenge worth solving? Let&apos;s build it together.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">We work with organisations, institutions, researchers and innovators. Tell us what you are working on.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact" size="lg" arrow>Start a conversation</ButtonLink>
            <ButtonLink href="/opportunities" size="lg" variant="secondary">Collaborate with us</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
