"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Post } from "@/lib/content-types";
import { AbstractVisual, Icon } from "./ui";

export function InsightsBrowser({ posts, basePath }: { posts: Post[]; basePath: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const categories = useMemo(() => Array.from(new Set(posts.map((p) => p.category || (p.kind === "tutorial" ? "Tutorials" : "Articles")))).sort(), [posts]);
  const label = (p: Post) => p.category || (p.kind === "tutorial" ? "Tutorials" : "Articles");
  const shown = posts.filter((p) => {
    if (cat !== "all" && label(p) !== cat) return false;
    if (!q.trim()) return true;
    const hay = `${p.title} ${p.excerpt} ${p.body} ${p.category}`.toLowerCase();
    return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
  });

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-sm">
          <span className="sr-only">Search articles</span>
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-subtle" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles and tutorials"
            className="min-h-12 w-full rounded-full border border-line-strong bg-white/[0.03] pl-12 pr-4 text-fg placeholder:text-subtle focus:border-orange focus:outline-none" />
        </label>
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {["all", ...categories].map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${cat === c ? "border-transparent bg-gradient-brand text-ink-900" : "border-line-strong text-muted hover:text-fg"}`}>
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{shown.length} results</p>
      {shown.length === 0 ? (
        <p className="mt-16 text-center text-muted">No articles match your search.</p>
      ) : (
        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={p.slug}>
              <Link href={`${basePath}/${p.slug}`} className="kv-glow-card group flex h-full flex-col overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden border-b border-line">
                  {p.coverUrl ? <img src={p.coverUrl} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <AbstractVisual seed={p.slug} />}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm text-amber">{label(p)} · {p.readingMinutes} min read</p>
                  <h2 className="mt-3 text-xl font-semibold group-hover:text-orange">{p.title}</h2>
                  <p className="mt-2 line-clamp-3 text-muted">{p.excerpt}</p>
                  {p.publishedAt && <p className="mt-auto pt-6 text-sm text-subtle">{new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
