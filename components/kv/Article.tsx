import Link from "next/link";
import type { Post } from "@/lib/content-types";
import { renderMarkdown } from "@/lib/markdown";
import { Icon } from "./ui";

export function Article({ post, back }: { post: Post; back: { href: string; label: string } }) {
  const date = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;
  const ld = {
    "@context": "https://schema.org", "@type": post.kind === "research" ? "ScholarlyArticle" : "Article",
    headline: post.title, description: post.excerpt, datePublished: post.publishedAt ?? undefined,
    author: post.author ? { "@type": "Person", name: post.author } : { "@type": "Organization", name: "Kalulu Vision" },
    image: post.coverUrl || undefined,
  };
  return (
    <article className="pb-24 pt-[calc(var(--nav-h)+56px)]">
      <div className="container-kv max-w-3xl">
        <Link href={back.href} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-amber hover:text-orange">
          <Icon name="arrowRight" className="size-4 rotate-180" />{back.label}
        </Link>
        <p className="mt-8 text-sm text-amber">{post.category || post.kind} · {post.readingMinutes} min read</p>
        <h1 className="mt-4 text-[clamp(2.1rem,1.5rem+2.6vw,3.6rem)] font-semibold">{post.title}</h1>
        {post.excerpt && <p className="mt-5 text-xl text-muted">{post.excerpt}</p>}
        <p className="mt-6 border-b border-line pb-8 text-sm text-subtle">{[post.author, date].filter(Boolean).join(" · ")}</p>
        {post.coverUrl && <img src={post.coverUrl} alt="" className="mt-10 w-full rounded-[var(--radius-card)] border border-line" />}
        <div className="kv-prose mt-10" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </article>
  );
}
