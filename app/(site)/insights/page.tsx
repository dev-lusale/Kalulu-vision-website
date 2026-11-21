import type { Metadata } from "next";
import { InsightsBrowser } from "@/components/kv/InsightsBrowser";
import { ButtonLink, Icon, PageHero } from "@/components/kv/ui";
import { getPosts } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Insights & knowledge hub",
  description: "Articles, tutorials and programming guides on AI, data science and African technology from Kalulu Vision.",
  alternates: { canonical: "/insights" },
};

export default async function InsightsPage() {
  const posts = await getPosts("insights");
  return (
    <>
      <PageHero eyebrow="Insights & knowledge hub" title={<>Ideas, guides and <span className="text-gradient-brand">lessons learned.</span></>}
        lead="Articles, tutorials and programming guides on AI, data science and building technology in Africa." />
      <section className="py-16 sm:py-24">
        <div className="container-kv">
          {posts.length ? <InsightsBrowser posts={posts} basePath="/insights" /> : (
            <div className="kv-glow-card mx-auto max-w-2xl p-10 text-center">
              <Icon name="book" className="mx-auto size-10 text-orange" />
              <h2 className="mt-6 text-2xl font-semibold">Our first articles are on the way.</h2>
              <p className="mt-3 text-muted">In the meantime, learn hands-on with our Tech Lessons courses.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/training" arrow>Explore Tech Lessons</ButtonLink>
                <ButtonLink href="/contact" variant="secondary">Suggest a topic</ButtonLink>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
