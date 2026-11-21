"use client";

import { useMemo, useState } from "react";
import type { Post } from "@/lib/content-types";
import { PostCard } from "./cards";
import { Icon } from "./ui";

/** Search + category filter for articles and research publications. */
export function InsightsBrowser({ posts, label = "articles" }: { posts: Post[]; label?: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const catOf = (p: Post) => p.category || (p.kind === "tutorial" ? "Tutorials" : p.kind === "research" ? "Research" : "Articles");
  const categories = useMemo(() => Array.from(new Set(posts.map(catOf))).sort(), [posts]);
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = posts.filter((p) => {
    if (cat !== "all" && catOf(p) !== cat) return false;
    const hay = `${p.title} ${p.excerpt} ${p.body} ${p.category}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });

  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border border-line bg-soft p-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-sm">
          <span className="sr-only">Search {label}</span>
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-subtle" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${label}`}
            className="min-h-11 w-full rounded-lg border border-line-strong bg-surface pl-11 pr-4 text-fg placeholder:text-subtle focus:border-primary focus:outline-none" />
        </label>
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {["all", ...categories].map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}
              className={`min-h-10 rounded-lg border px-3.5 text-sm font-medium transition-colors ${cat === c ? "border-primary bg-primary text-on-primary" : "border-line-strong bg-surface text-muted hover:text-fg"}`}>
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-6 text-sm text-muted" role="status" aria-live="polite">{shown.length} {shown.length === 1 ? "result" : "results"}</p>
      {shown.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-line-strong p-10 text-center">
          <p className="font-semibold">Nothing matches your search.</p>
          <button type="button" onClick={() => { setQ(""); setCat("all"); }} className="mt-3 min-h-11 text-sm font-semibold text-primary underline underline-offset-4 dark:text-fg">Clear search</button>
        </div>
      ) : (
        <ul className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => <li key={p.slug}><PostCard post={p} /></li>)}
        </ul>
      )}
    </>
  );
}
