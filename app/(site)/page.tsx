import Link from "next/link";
import { Hero3D } from "@/components/kv/Hero3D";
import { PartnerCTA, ProjectCard } from "@/components/kv/cards";
import { AbstractVisual, ButtonLink, Icon, SectionHeading } from "@/components/kv/ui";
import { getAbout, getPosts, getProducts, getProjects, getResearchInfo, getServices } from "@/lib/content";

export const revalidate = 60;

const CAPABILITIES = [
  { icon: "brain", title: "Artificial Intelligence", text: "Machine learning, computer vision and language technology applied to specific problems.", href: "/services/artificial-intelligence-machine-learning", span: "lg:col-span-2" },
  { icon: "chart", title: "Data Science", text: "From raw data to evidence and dashboards.", href: "/services/data-science-analytics", span: "" },
  { icon: "code", title: "Software & Web", text: "Reliable systems and fast web platforms.", href: "/services/software-development", span: "" },
  { icon: "phone", title: "Mobile", text: "Apps built for everyday devices and patchy networks.", href: "/services/mobile-application-development", span: "" },
  { icon: "chip", title: "Internet of Things", text: "Sensors, edge devices and real-time alerts.", href: "/services/internet-of-things", span: "" },
  { icon: "flask", title: "Research & Innovation", text: "Applied research on African languages, accessibility and intelligent systems.", href: "/research", span: "lg:col-span-2" },
];

export default async function HomePage() {
  const [about, services, projects, products, research, posts] = await Promise.all([
    getAbout(), getServices(), getProjects(), getProducts(), getResearchInfo(), getPosts("insights"),
  ]);
  const featured = (projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, 3);
  const training = products.find((p) => p.slug === "tech-lessons");

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden pt-[var(--nav-h)]" aria-labelledby="hero-title">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="kv-aurora absolute -inset-[25%]" />
          <div className="kv-grid-bg absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-900" />
        </div>
        <div className="container-kv grid min-h-[calc(100svh-var(--nav-h))] items-center gap-4 py-8 lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:py-0">
          <div className="relative z-10 order-2 lg:order-1">
            <p className="eyebrow mb-6" data-reveal><span className="size-1.5 rounded-full bg-orange" aria-hidden="true" />AI &amp; technology company · Zambia</p>
            <h1 id="hero-title" className="text-[clamp(2.7rem,1.6rem+5vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.035em]" data-reveal style={{ ["--d" as string]: 1 }}>
              Intelligence Meets <span className="text-gradient-brand">Innovation.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl" data-reveal style={{ ["--d" as string]: 2 }}>
              We engineer intelligent digital solutions, transform ideas into technology, and build innovations that address real-world challenges.
            </p>
            <div className="mt-9 flex flex-wrap gap-3" data-reveal style={{ ["--d" as string]: 3 }}>
              <ButtonLink href="/services" size="lg" arrow>Explore Our Solutions</ButtonLink>
              <ButtonLink href="/about" size="lg" variant="secondary">Discover Kalulu Vision</ButtonLink>
            </div>
            <p className="mt-12 font-display text-sm font-medium tracking-[0.2em] text-subtle uppercase" data-reveal style={{ ["--d" as string]: 4 }}>
              See Beyond. Build the Future.
            </p>
          </div>
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <Hero3D />
          </div>
        </div>
      </section>

      {/* ═══ INTRODUCTION ═══ */}
      <section className="py-24 sm:py-32" aria-labelledby="intro-title">
        <div className="container-kv grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-5" data-reveal><span className="h-px w-6 bg-amber/70" aria-hidden="true" />Who we are</p>
            <h2 id="intro-title" className="text-[clamp(1.45rem,1.15rem+1.3vw,2.25rem)] font-medium leading-[1.25] text-white/90" data-reveal style={{ ["--d" as string]: 1 }}>
              {about.overview}
            </h2>
            <div className="mt-8" data-reveal style={{ ["--d" as string]: 2 }}>
              <ButtonLink href="/about" variant="secondary" arrow>Our story</ButtonLink>
            </div>
          </div>
          <aside className="kv-glow-card self-start p-7 sm:p-8" data-reveal style={{ ["--d" as string]: 2 }}>
            <p className="font-display text-sm font-semibold tracking-[0.16em] text-amber uppercase">Kalulu · /ka-lu-lu/</p>
            <p className="mt-3 font-display text-2xl font-semibold">The clever hare of Zambian folklore.</p>
            <p className="mt-4 text-muted">Small, curious and adaptable, kalulu always finds a way through difficult ground. We build technology in the same spirit: intelligent, resourceful and made for real conditions.</p>
          </aside>
        </div>
      </section>

      {/* ═══ CAPABILITIES ═══ */}
      <section className="relative border-y border-line bg-ink-850 py-24 sm:py-32" aria-labelledby="cap-title">
        <div className="container-kv">
          <SectionHeading id="cap-title" eyebrow="Core capabilities" title={<>Six disciplines, <span className="text-gradient-brand">one team.</span></>} lead="We combine AI, data, software and hardware so a solution can go from idea to the field without changing hands." />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((c, i) => (
              <li key={c.title} className={c.span} data-reveal style={{ ["--d" as string]: i }}>
                <Link href={c.href} className="kv-glow-card group flex h-full min-h-56 flex-col p-7" data-tilt>
                  <span className="grid size-12 place-items-center rounded-xl border border-line bg-white/[0.03] text-orange transition-all duration-500 group-hover:scale-110 group-hover:border-orange/50 group-hover:shadow-[0_0_30px_-6px_rgb(255_138_0/0.7)]">
                    <Icon name={c.icon} className="size-6" />
                  </span>
                  <h3 className="mt-auto pt-10 text-xl font-semibold">{c.title}</h3>
                  <p className="mt-2 text-muted">{c.text}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ FEATURED SERVICES ═══ */}
      <section className="py-24 sm:py-32" aria-labelledby="svc-title">
        <div className="container-kv">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading id="svc-title" eyebrow="Services" title="What we do for our clients" />
            <ButtonLink href="/services" variant="secondary" arrow>All {services.length} services</ButtonLink>
          </div>
          <ol className="mt-14 border-t border-line">
            {services.slice(0, 5).map((s, i) => (
              <li key={s.slug} data-reveal style={{ ["--d" as string]: i }}>
                <Link href={`/services/${s.slug}`} className="group grid items-center gap-4 border-b border-line py-7 transition-colors sm:grid-cols-[64px_1fr_1.2fr_auto] sm:gap-8">
                  <span className="font-display text-sm text-subtle">0{i + 1}</span>
                  <span className="font-display text-2xl font-semibold transition-colors group-hover:text-orange sm:text-[1.65rem]">{s.title}</span>
                  <span className="text-muted">{s.summary}</span>
                  <span className="hidden size-12 place-items-center rounded-full border border-line-strong transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-orange group-hover:bg-orange group-hover:text-ink-900 sm:grid">
                    <Icon name="arrowRight" className="size-5" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ FEATURED PROJECTS ═══ */}
      <section className="border-y border-line bg-ink-850 py-24 sm:py-32" aria-labelledby="proj-title">
        <div className="container-kv">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading id="proj-title" eyebrow="Featured projects" title="Built for real problems" lead="Each project shows its honest status, from concept to live." />
            <ButtonLink href="/projects" variant="secondary" arrow>View portfolio</ButtonLink>
          </div>
          <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <li key={p.slug} data-reveal style={{ ["--d" as string]: i }}><ProjectCard project={p} /></li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ RESEARCH ═══ */}
      <section className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="res-title">
        <div className="pointer-events-none absolute right-[-20%] top-1/2 -z-10 size-[700px] -translate-y-1/2 rounded-full bg-orange/[0.07] blur-3xl" aria-hidden="true" />
        <div className="container-kv grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading id="res-title" eyebrow="Research & innovation" title={<>Questions worth <span className="text-gradient-brand">answering.</span></>} lead={research.intro} />
            <div className="mt-8" data-reveal><ButtonLink href="/research" arrow>Explore our research</ButtonLink></div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {research.areas.slice(0, 4).map((a, i) => (
              <li key={a.title} className="kv-glow-card p-7" data-reveal style={{ ["--d" as string]: i }}>
                <span className="font-display text-sm text-amber">R{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-xl font-semibold">{a.title}</h3>
                <p className="mt-2 text-muted">{a.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ WHY ═══ */}
      <section className="border-y border-line bg-ink-850 py-24 sm:py-32" aria-labelledby="why-title">
        <div className="container-kv">
          <SectionHeading id="why-title" eyebrow="Why Kalulu Vision" title="How we work, and what you can expect" align="center" lead={about.philosophy} />
          <ol className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {about.approach.map((a, i) => (
              <li key={a.title} className="bg-ink-850 p-8 transition-colors hover:bg-ink-800" data-reveal style={{ ["--d" as string]: i }}>
                <span className="grid size-10 place-items-center rounded-full bg-gradient-brand font-display text-sm font-bold text-ink-900">{i + 1}</span>
                <h3 className="mt-8 text-xl font-semibold">{a.title}</h3>
                <p className="mt-2 text-muted">{a.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ INSIGHTS / LEARNING ═══ */}
      <section className="py-24 sm:py-32" aria-labelledby="ins-title">
        <div className="container-kv">
          {posts.length > 0 ? (
            <>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <SectionHeading id="ins-title" eyebrow="Insights" title="Technology insights and articles" />
                <ButtonLink href="/insights" variant="secondary" arrow>All insights</ButtonLink>
              </div>
              <ul className="mt-14 grid gap-5 md:grid-cols-3">
                {posts.slice(0, 3).map((p, i) => (
                  <li key={p.slug} data-reveal style={{ ["--d" as string]: i }}>
                    <Link href={`/insights/${p.slug}`} className="kv-glow-card group flex h-full flex-col overflow-hidden">
                      <div className="aspect-[16/9] overflow-hidden border-b border-line">
                        {p.coverUrl ? <img src={p.coverUrl} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" /> : <AbstractVisual seed={p.slug} />}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <p className="text-sm text-amber">{p.category || p.kind} · {p.readingMinutes} min read</p>
                        <h3 className="mt-3 text-xl font-semibold group-hover:text-orange">{p.title}</h3>
                        <p className="mt-2 line-clamp-3 text-muted">{p.excerpt}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="kv-glow-card grid gap-10 overflow-hidden p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center" data-reveal>
              <div>
                <p className="eyebrow mb-4"><Icon name="book" className="size-4" />Knowledge sharing</p>
                <h2 id="ins-title" className="text-[clamp(1.8rem,1.3rem+2vw,2.8rem)] font-semibold">Learn practical technology with us.</h2>
                <p className="mt-4 max-w-xl text-muted">{training?.description ?? "Hands-on courses in programming, AI, data and IoT."} Articles and tutorials are coming to our Insights hub.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href="/training" arrow>Explore Tech Lessons</ButtonLink>
                  <ButtonLink href="/insights" variant="secondary">Visit Insights</ButtonLink>
                </div>
              </div>
              <ul className="grid grid-cols-2 gap-3 text-sm">
                {["Programming", "Web Development", "AI & ML", "Data Analytics", "Automation", "IoT & Embedded"].map((c) => (
                  <li key={c} className="rounded-xl border border-line bg-white/[0.03] px-4 py-3 font-medium">{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <PartnerCTA />
    </>
  );
}
