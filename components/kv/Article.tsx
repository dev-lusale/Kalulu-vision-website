import Link from "next/link";
import type { Post } from "@/lib/content-types";
import { renderMarkdown } from "@/lib/markdown";
import { Icon, Photo } from "./ui";

export function Article({ post, back }: { post: Post; back: { href: string; label: string } }) {
  const date = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;
  const ld = {
    "@context": "https://schema.org", "@type": post.kind === "research" ? "ScholarlyArticle" : "Article",
    headline: post.title, description: post.excerpt, datePublished: post.publishedAt ?? undefined,
    author: post.author ? { "@type": "Person", name: post.author } : { "@type": "Organization", name: "Kalulu Vision" },
    image: post.coverUrl || undefined,
  };
  return (
    <article>
      <header className="border-b border-line bg-soft">
        <div className="container-kv max-w-3xl py-12 sm:py-16">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
              <li><Link href="/" className="hover:underline underline-offset-4">Home</Link></li>
              <li className="flex items-center gap-1.5"><span aria-hidden="true">/</span><Link href={back.href} className="hover:underline underline-offset-4">{back.label}</Link></li>
            </ol>
          </nav>
          <p className="mt-8 text-xs font-semibold tracking-[0.08em] text-accent-ink uppercase">{post.category || post.kind}</p>
          <h1 className="mt-3 text-[clamp(2rem,1.4rem+2.4vw,3.2rem)] font-bold">{post.title}</h1>
          {post.excerpt && <p className="mt-5 text-xl text-muted">{post.excerpt}</p>}
          <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-subtle">
            {post.author && <span className="inline-flex items-center gap-1.5"><Icon name="users" className="size-4" />{post.author}</span>}
            {date && <span className="inline-flex items-center gap-1.5"><Icon name="calendar" className="size-4" />{date}</span>}
            <span className="inline-flex items-center gap-1.5"><Icon name="clock" className="size-4" />{post.readingMinutes} min read</span>
          </p>
        </div>
      </header>
      <div className="container-kv max-w-3xl pb-24">
        {post.coverUrl && <div className="kv-photo relative mt-10 aspect-[16/9] rounded-[var(--radius-card)] border border-line"><Photo src={post.coverUrl} alt="" priority /></div>}
        <div className="kv-prose mt-10" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
        <div className="mt-14 border-t border-line pt-6">
          <Link href={back.href} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4 dark:text-fg">
            <Icon name="arrowRight" className="size-4 rotate-180" />Back to {back.label.toLowerCase()}
          </Link>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </article>
  );
}
