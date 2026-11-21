import Link from "next/link";
import { Hero3D } from "@/components/kv/Hero3D";
import { EnquiryForm } from "@/components/kv/EnquiryForm";
import { PostCard, ProductCard } from "@/components/kv/cards";
import { ProjectTabs } from "@/components/kv/ProjectTabs";
import { ArrowLink, ButtonLink, Figure, Icon, IconTile, Photo, SectionHeading } from "@/components/kv/ui";
import { getAbout, getCompany, getPosts, getProducts, getProjects, getResearchInfo, getServices, getSiteImages } from "@/lib/content";
import { PARTNER_TYPES } from "@/lib/content-types";

export const revalidate = 60;

const CAPABILITIES = [
  { icon: "brain", title: "Artificial Intelligence & Machine Learning", text: "Computer vision, language technology and predictive models applied to specific, real problems.", href: "/services/artificial-intelligence-machine-learning" },
  { icon: "code", title: "Software Engineering", text: "Reliable systems, APIs and business platforms engineered to be maintained for years.", href: "/services/software-development" },
  { icon: "chart", title: "Data Science & Analytics", text: "From raw records to evidence: pipelines, analysis and decision dashboards.", href: "/services/data-science-analytics" },
  { icon: "phone", title: "Web & Mobile Development", text: "Fast web platforms and apps designed for everyday devices and patchy networks.", href: "/services/web-application-development" },
  { icon: "chip", title: "Internet of Things", text: "Sensors, edge devices and real-time monitoring and alerts for the field.", href: "/services/internet-of-things" },
  { icon: "flask", title: "Research & Innovation", text: "Applied research on African languages, accessibility and intelligent systems.", href: "/research" },
];

const PATHWAYS = [
  { icon: "layers", label: "I want a technology solution", href: "/services" },
  { icon: "handshake", label: "I want to partner with you", href: "/partnerships" },
  { icon: "book", label: "I want to learn tech skills", href: "/training" },
  { icon: "briefcase", label: "I want to join or intern", href: "/opportunities" },
  { icon: "flask", label: "I want to collaborate on research", href: "/research" },
];

export default async function HomePage() {
  const [company, about, services, projects, products, research, posts, images] = await Promise.all([
    getCompany(), getAbout(), getServices(), getProjects(), getProducts(), getResearchInfo(), getPosts("insights"), getSiteImages(),
  ]);
  const showcase = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <>
      {/* ═══ B · HERO ═══ */}
      <section className="relative overflow-hidden border-b border-line bg-soft" aria-labelledby="hero-title">
        <div className="kv-dots pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(100deg,#000_10%,transparent_55%)]" aria-hidden="true" />
        <div className="container-kv relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:py-20">
          <div>
            <p className="eyebrow mb-5" data-reveal><span className="size-2 rounded-full bg-brand" aria-hidden="true" />African technology &amp; innovation company</p>
            <h1 id="hero-title" className="text-[clamp(2.5rem,1.5rem+4.2vw,4.6rem)] font-bold leading-[1.02] tracking-[-0.03em]" data-reveal style={{ ["--d" as string]: 1 }}>
              Engineering Intelligence. <span className="text-primary dark:text-accent">Building Possibilities.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl" data-reveal style={{ ["--d" as string]: 2 }}>
              We develop intelligent digital solutions through artificial intelligence, software engineering, data science and emerging technologies to address real-world challenges.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" data-reveal style={{ ["--d" as string]: 3 }}>
              <ButtonLink href="/services" size="lg" arrow>Explore Our Solutions</ButtonLink>
              <ButtonLink href="/projects" size="lg" variant="secondary">Discover Our Work</ButtonLink>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-line rounded-xl border border-line bg-surface shadow-card" data-reveal style={{ ["--d" as string]: 4 }}>
              {[[String(services.length), "Service areas"], [String(projects.length), "Projects"], [String(products.filter((p) => p.status === "live").length), "Live product" + (products.filter((p) => p.status === "live").length === 1 ? "" : "s")]].map(([n, l]) => (
                <div key={l} className="px-4 py-3.5">
                  <dt className="text-xs text-muted">{l}</dt>
                  <dd className="font-display text-2xl font-bold text-fg">{n}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative" data-reveal style={{ ["--d" as string]: 2 }}>
            <figure>
              <div className="kv-photo aspect-[16/11] rounded-2xl border border-line shadow-lift">
                <div className="absolute inset-0" data-parallax="0.05"><Photo src={images.hero.url} alt={images.hero.alt} priority sizes="(min-width: 1024px) 50vw, 100vw" /></div>
              </div>
              {images.hero.caption && <figcaption className="mt-3 text-sm text-subtle lg:pr-48">{images.hero.caption}</figcaption>}
            </figure>
            {/* Subtle 3D logo presentation */}
            <div className="absolute -bottom-6 right-4 hidden w-44 rounded-2xl border border-line bg-surface/95 p-3 shadow-lift backdrop-blur sm:block lg:-right-4 lg:w-52">
              <Hero3D className="w-full" />
              <p className="mt-1 text-center font-display text-[0.7rem] font-semibold tracking-[0.14em] text-muted uppercase">{company.slogan}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pathways (audience selector) */}
      <section aria-labelledby="paths-title" className="border-b border-line bg-bg">
        <div className="container-kv py-10">
          <h2 id="paths-title" className="font-display text-lg font-bold">How can we help you?</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PATHWAYS.map((p, i) => (
              <li key={p.href} data-reveal style={{ ["--d" as string]: i }}>
                <Link href={p.href} className="kv-card group flex h-full min-h-20 items-center gap-3 p-4">
                  <IconTile name={p.icon} tone={i % 2 ? "accent" : "primary"} className="size-11" />
                  <span className="text-[0.95rem] font-semibold leading-snug">{p.label}</span>
                  <Icon name="arrowRight" className="ml-auto size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-fg" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ C · COMPANY OVERVIEW ═══ */}
      <section className="section-y" aria-labelledby="overview-title">
        <div className="container-kv grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <div className="relative mx-auto w-full max-w-md lg:max-w-none" data-reveal>
            <Figure image={images.overview} ratio="aspect-[4/5]" sizes="(min-width: 1024px) 40vw, 90vw" />
            <div className="absolute -left-3 bottom-14 hidden rounded-xl bg-band px-5 py-4 text-band-fg shadow-lift sm:block">
              <p className="font-display text-xs font-semibold tracking-[0.14em] text-band-muted uppercase">Kalulu · /ka-lu-lu/</p>
              <p className="mt-1 max-w-[15rem] font-display font-semibold leading-snug">The clever hare of Zambian folklore</p>
            </div>
          </div>
          <div>
            <SectionHeading id="overview-title" eyebrow="Company overview" title="Technology that works in the conditions people actually live in." />
            <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {[
                ["Who we are", about.overview],
                ["What we do", `${services.slice(0, 6).map((s) => s.title).join(", ")}, and practical technology training through Tech Lessons.`],
                ["Our approach", about.philosophy],
                ["Our commitment", about.africa],
              ].map(([t, d], i) => (
                <div key={t} className="border-t-2 border-line pt-5" data-reveal style={{ ["--d" as string]: i }}>
                  <dt className="font-display text-lg font-bold">{t}</dt>
                  <dd className="mt-2 text-muted">{d}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10"><ButtonLink href="/about" variant="secondary" arrow>More about Kalulu Vision</ButtonLink></div>
          </div>
        </div>
      </section>

      {/* ═══ D · CAPABILITIES ═══ */}
      <section className="section-y border-y border-line bg-soft" aria-labelledby="cap-title">
        <div className="container-kv">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading id="cap-title" eyebrow="Our technology capabilities" title="Six disciplines under one roof" lead="AI, data, software and hardware in one team, so a solution can go from idea to the field without changing hands." />
            <ButtonLink href="/services" variant="secondary" arrow>All {services.length} services</ButtonLink>
          </div>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c, i) => (
              <li key={c.title} data-reveal style={{ ["--d" as string]: i }}>
                <Link href={c.href} className="kv-card group flex h-full flex-col p-7">
                  <div className="flex items-start justify-between">
                    <IconTile name={c.icon} tone={i % 3 === 1 ? "accent" : "primary"} />
                    <span className="font-display text-3xl font-bold text-line-strong" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold">{c.title}</h3>
                  <p className="mt-2 text-muted">{c.text}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-primary dark:text-fg">Learn more<Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ E · FEATURED PROJECTS ═══ */}
      <section className="section-y" aria-labelledby="proj-title">
        <div className="container-kv">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading id="proj-title" eyebrow="Featured projects" title="Real projects, honest status" lead="Every project shows where it really is, from concept and research to live." />
            <ButtonLink href="/projects" variant="secondary" arrow>View all projects</ButtonLink>
          </div>
          <div className="mt-10"><ProjectTabs projects={showcase} /></div>
        </div>
      </section>

      {/* ═══ F · PRODUCTS ═══ */}
      {products.length > 0 && (
        <section className="section-y border-y border-line bg-soft" aria-labelledby="prod-title">
          <div className="container-kv">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading id="prod-title" eyebrow="Products & solutions" title="What we have built" />
              <ButtonLink href="/products" variant="secondary" arrow>All products</ButtonLink>
            </div>
            <div className="mt-12 grid gap-8">
              {products.slice(0, 2).map((p, i) => <div key={p.slug} data-reveal><ProductCard product={p} reverse={i % 2 === 1} /></div>)}
            </div>
          </div>
        </section>
      )}

      {/* ═══ G · RESEARCH ═══ */}
      <section className="section-y" aria-labelledby="res-title">
        <div className="container-kv grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading id="res-title" eyebrow="Research & innovation" title="Practical research for African technology challenges" lead={research.intro} />
            <Figure image={images.research} ratio="aspect-[16/11]" className="mt-10 hidden lg:block" sizes="40vw" />
          </div>
          <div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {research.areas.map((a, i) => (
                <li key={a.title} className="kv-card p-6" data-reveal style={{ ["--d" as string]: i }}>
                  <span className="font-display text-sm font-bold text-accent-ink">R{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-lg font-bold">{a.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] text-muted">{a.text}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8"><ButtonLink href="/research" arrow>Explore our research</ButtonLink></div>
          </div>
        </div>
      </section>

      {/* ═══ H · INSIGHTS ═══ */}
      <section className="section-y border-y border-line bg-soft" aria-labelledby="ins-title">
        <div className="container-kv">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading id="ins-title" eyebrow="Insights" title="Technology insights & publications" lead="Articles on AI research, software development, data science and African innovation." />
            {posts.length > 0 && <ButtonLink href="/insights" variant="secondary" arrow>All insights</ButtonLink>}
          </div>
          {posts.length > 0 ? (
            <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((p, i) => <li key={p.slug} data-reveal style={{ ["--d" as string]: i }}><PostCard post={p} /></li>)}
            </ul>
          ) : (
            <div className="kv-card mt-12 grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center" data-reveal>
              <div>
                <h3 className="text-2xl font-bold">Our first articles are being written.</h3>
                <p className="mt-3 max-w-xl text-muted">Insights will cover AI research, software development, data science and African innovation. Subscribe at the bottom of this page to hear when they are published, or learn with us now through Tech Lessons.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href="/training" arrow>Explore Tech Lessons</ButtonLink>
                  <ButtonLink href="/insights" variant="secondary">Visit Insights</ButtonLink>
                </div>
              </div>
              <ul className="grid grid-cols-2 gap-2.5 text-sm">
                {["AI research", "Software development", "Data science", "African innovation", "Tutorials", "Case studies"].map((c) => (
                  <li key={c} className="rounded-lg border border-line bg-soft px-4 py-3 font-medium">{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ═══ I · PARTNERSHIPS ═══ */}
      <section className="section-y" aria-labelledby="partner-title">
        <div className="container-kv">
          <SectionHeading id="partner-title" eyebrow="Partnerships" title="Work with us" lead="We welcome collaboration with organisations that share our commitment to useful, locally relevant technology." align="center" />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNER_TYPES.map((p, i) => (
              <li key={p.id} data-reveal style={{ ["--d" as string]: i }}>
                <Link href={`/partnerships?type=${p.id}#enquiry`} className="kv-card group flex h-full gap-4 p-6">
                  <IconTile name={p.icon} tone={i % 2 ? "accent" : "primary"} />
                  <span>
                    <span className="block font-display text-lg font-bold">{p.label}</span>
                    <span className="mt-1 block text-[0.95rem] text-muted">{p.text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center"><ButtonLink href="/partnerships#enquiry" arrow>Make a partnership enquiry</ButtonLink></div>
        </div>
      </section>

      {/* ═══ J · CONTACT ═══ */}
      <section id="get-in-touch" className="section-y bg-soft" aria-labelledby="contact-title">
        <div className="container-kv grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading id="contact-title" eyebrow="Contact" title="Let's talk about your project" lead="Send us a message and we will reply by email. For quick questions, WhatsApp is fastest." />
            <ul className="mt-10 grid gap-4">
              {company.email && <li><a href={`mailto:${company.email}`} className="kv-card flex items-center gap-4 p-5"><IconTile name="mail" /><span><span className="block text-sm text-muted">Email</span><span className="font-semibold break-all">{company.email}</span></span></a></li>}
              {company.phone && <li><a href={`tel:${company.phone.replace(/\s/g, "")}`} className="kv-card flex items-center gap-4 p-5"><IconTile name="phone" tone="accent" /><span><span className="block text-sm text-muted">Phone</span><span className="font-semibold">{company.phone}</span></span></a></li>}
              {company.whatsapp && <li><a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer" className="kv-card flex items-center gap-4 p-5"><IconTile name="whatsapp" tone="accent" /><span><span className="block text-sm text-muted">WhatsApp</span><span className="font-semibold">Chat with us<span className="sr-only"> (opens in a new tab)</span></span></span></a></li>}
              {company.location && <li className="kv-card flex items-center gap-4 p-5"><IconTile name="pin" /><span><span className="block text-sm text-muted">Location</span><span className="font-semibold">{company.location}</span></span></li>}
            </ul>
            <p className="mt-6"><ArrowLink href="/contact">Open the full contact page</ArrowLink></p>
          </div>
          <EnquiryForm kind="contact" services={services.map((s) => s.title)} email={company.email} whatsapp={company.whatsapp} />
        </div>
      </section>
    </>
  );
}
