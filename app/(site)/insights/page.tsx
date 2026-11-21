import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/kv/cards";
import { InsightsBrowser } from "@/components/kv/InsightsBrowser";
import { Subscribe } from "@/components/kv/Subscribe";
import { ButtonLink, Icon, PageHero, Photo } from "@/components/kv/ui";
import { getPosts } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Insights & Publications",
  description: "Articles, tutorials and programming guides on AI research, software development, data science and African innovation from Kalulu Vision.",
  alternates: { canonical: "/insights" },
};

const TOPICS = ["Technology articles", "AI research insights", "Software development", "Data science", "African innovation"];

export default async function InsightsPage() {
  const posts = await getPosts("insights");
  const [lead, ...rest] = posts;
  return (
    <>
      <PageHero eyebrow="Insights & Publications" title="Ideas, guides and lessons learned."
        lead="Articles and tutorials on AI, software, data science and building technology in Africa.">
        <ul className="flex flex-wrap gap-2" aria-label="Topics we cover">
          {TOPICS.map((t) => <li key={t} className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-muted">{t}</li>)}
        </ul>
      </PageHero>

      {lead ? (
        <>
          {/* Featured article */}
          <section className="container-kv pt-12" aria-labelledby="featured-title">
            <h2 id="featured-title" className="sr-only">Latest article</h2>
            <article className="kv-card is-link group relative grid overflow-hidden lg:grid-cols-[1.2fr_1fr]">
              <div className="kv-photo relative aspect-[16/9] lg:aspect-auto lg:min-h-80">
                {lead.coverUrl ? <Photo src={lead.coverUrl} alt="" /> : <div className="absolute inset-0 grid place-items-center bg-soft-2"><Icon name="book" className="size-16 text-subtle" /></div>}
              </div>
              <div className="flex flex-col p-7 sm:p-10">
                <p className="text-xs font-semibold tracking-[0.08em] text-accent-ink uppercase">Latest · {lead.category || "Article"}</p>
                <h3 className="mt-3 text-2xl font-bold sm:text-3xl"><Link href={`/insights/${lead.slug}`} className="after:absolute after:inset-0">{lead.title}</Link></h3>
                <p className="mt-3 text-muted">{lead.excerpt}</p>
                <p className="mt-auto pt-6 text-sm text-subtle">{lead.readingMinutes} min read</p>
              </div>
            </article>
          </section>
          <section className="section-y">
            <div className="container-kv">
              {rest.length ? <InsightsBrowser posts={posts} /> : <ul className="grid gap-5 md:grid-cols-3"><li><PostCard post={lead} /></li></ul>}
            </div>
          </section>
        </>
      ) : (
        <section className="section-y">
          <div className="container-kv grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="kv-card p-8 sm:p-10">
              <span className="grid size-14 place-items-center rounded-xl bg-accent/12 text-accent-ink"><Icon name="book" className="size-7" /></span>
              <h2 className="mt-6 text-2xl font-bold">Our first articles are on the way.</h2>
              <p className="mt-3 text-muted">We are preparing practical articles and tutorials. Until then, learn hands-on with our Tech Lessons courses, or suggest a topic you would like us to cover.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/training" arrow>Explore Tech Lessons</ButtonLink>
                <ButtonLink href="/contact" variant="secondary">Suggest a topic</ButtonLink>
              </div>
            </div>
            <div className="kv-card bg-band p-8 text-band-fg sm:p-10">
              <h2 className="text-2xl font-bold">Get new articles by email</h2>
              <p className="mt-2 text-band-muted">One short email when something new is published.</p>
              <div className="mt-6"><Subscribe invert /></div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
