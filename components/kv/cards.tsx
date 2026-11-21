import Link from "next/link";
import type { Post, Product, Project } from "@/lib/content-types";
import { PROJECT_CATEGORIES } from "@/lib/content-types";
import { ArrowLink, ButtonLink, Chips, Icon, NoScreenshot, Photo, StatusBadge } from "./ui";

export const catLabel = (id: string) => PROJECT_CATEGORIES.find((c) => c.id === id)?.label ?? id;

export function ProjectCard({ project: p, headingLevel = 3 }: { project: Project; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <article className="kv-card is-link group relative flex h-full flex-col overflow-hidden">
      <div className="kv-photo relative aspect-[16/10] border-b border-line">
        {p.imageUrl
          ? <Photo src={p.imageUrl} alt={`${p.title} interface screenshot`} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-top transition-transform duration-700 group-hover:scale-[1.03]" />
          : <NoScreenshot seed={p.slug} label={p.title} />}
        <StatusBadge status={p.status} className="absolute left-3 top-3 bg-surface/95 backdrop-blur" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold tracking-[0.08em] text-accent-ink uppercase">{p.categories.map(catLabel).join(" · ")}</p>
        <H className="mt-2 text-xl font-bold">
          <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 hover:text-primary dark:hover:text-fg">{p.title}</Link>
        </H>
        <p className="mt-2 line-clamp-3 text-[0.95rem] text-muted">{p.overview}</p>
        {p.technologies.length > 0 && <div className="mt-4"><Chips items={p.technologies.slice(0, 4)} label="Technologies" small /></div>}
        <span className="mt-auto flex items-center gap-1.5 pt-5 font-display text-sm font-semibold text-primary dark:text-fg">
          View project <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}

export function ProductCard({ product: p, reverse = false }: { product: Product; reverse?: boolean }) {
  return (
    <article className="kv-card grid overflow-hidden lg:grid-cols-2">
      <div className={`kv-photo relative aspect-[16/10] border-b border-line lg:aspect-auto lg:min-h-[420px] lg:border-b-0 ${reverse ? "lg:order-2 lg:border-l" : "lg:border-r"}`}>
        {p.imageUrl ? <Photo src={p.imageUrl} alt={`${p.name} screenshot`} className="object-top" /> : <NoScreenshot seed={p.slug} label={p.name} />}
      </div>
      <div className="flex flex-col p-7 sm:p-10">
        <StatusBadge status={p.status} className="self-start" />
        <h3 className="mt-4 text-2xl font-bold sm:text-3xl">{p.name}</h3>
        {p.tagline && <p className="mt-1 font-medium text-accent-ink">{p.tagline}</p>}
        <p className="mt-4 text-muted">{p.description}</p>
        {p.features.length > 0 && (
          <>
            <h4 className="mt-6 font-display text-sm font-semibold tracking-[0.08em] text-fg uppercase">Key features</h4>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm text-muted"><Icon name="check" className="mt-0.5 size-4 shrink-0 text-accent-ink" strokeWidth={2.2} />{f}</li>
              ))}
            </ul>
          </>
        )}
        {p.technologies.length > 0 && <div className="mt-6"><Chips items={p.technologies} label="Technology" small /></div>}
        {p.websiteUrl && (
          <div className="mt-auto pt-8">
            <ButtonLink href={p.websiteUrl} arrow variant={p.status === "live" ? "primary" : "secondary"}>
              {p.status === "live" ? "Open live product" : "View source & documentation"}
            </ButtonLink>
          </div>
        )}
      </div>
    </article>
  );
}

export function PostCard({ post: p }: { post: Post }) {
  const href = `/${p.kind === "research" ? "research" : "insights"}/${p.slug}`;
  const date = p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
  return (
    <article className="kv-card is-link group relative flex h-full flex-col overflow-hidden">
      <div className="kv-photo relative aspect-[16/9] border-b border-line">
        {p.coverUrl ? <Photo src={p.coverUrl} alt="" sizes="(min-width: 768px) 33vw, 100vw" className="transition-transform duration-700 group-hover:scale-[1.03]" /> : <NoScreenshot seed={p.slug} label={p.category || p.title} compact />}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold tracking-[0.08em] text-accent-ink uppercase">{p.category || p.kind}</p>
        <h3 className="mt-2 text-lg font-bold leading-snug"><Link href={href} className="after:absolute after:inset-0 hover:text-primary dark:hover:text-fg">{p.title}</Link></h3>
        <p className="mt-2 line-clamp-3 text-[0.95rem] text-muted">{p.excerpt}</p>
        <p className="mt-auto flex items-center gap-3 pt-5 text-sm text-subtle">
          {date && <span className="inline-flex items-center gap-1.5"><Icon name="calendar" className="size-4" />{date}</span>}
          <span className="inline-flex items-center gap-1.5"><Icon name="clock" className="size-4" />{p.readingMinutes} min read</span>
        </p>
      </div>
    </article>
  );
}

export function PartnerCTA({ title = "Have a challenge worth solving? Let's build it together.", text = "We work with organisations, institutions, researchers and innovators. Tell us what you are working on." }: { title?: string; text?: string }) {
  return (
    <section className="bg-band text-band-fg" aria-labelledby="cta-title">
      <div className="container-kv grid gap-8 py-16 sm:py-20 lg:grid-cols-[1.4fr_auto] lg:items-center">
        <div data-reveal>
          <p className="eyebrow mb-3 !text-band-muted">Partnership &amp; collaboration</p>
          <h2 id="cta-title" className="max-w-3xl text-[clamp(1.8rem,1.3rem+2vw,2.8rem)] font-bold">{title}</h2>
          <p className="mt-4 max-w-2xl text-lg text-band-muted">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3" data-reveal style={{ ["--d" as string]: 1 }}>
          <ButtonLink href="/partnerships" variant="brand" size="lg" arrow>Partner with us</ButtonLink>
          <ButtonLink href="/contact" variant="light" size="lg">Contact us</ButtonLink>
        </div>
      </div>
    </section>
  );
}

export { ArrowLink };
