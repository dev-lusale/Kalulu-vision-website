"use client";

import { useMemo, useState } from "react";
import { PROJECT_CATEGORIES, type Project } from "@/lib/content-types";
import { ProjectCard } from "./cards";

export function ProjectBrowser({ projects }: { projects: Project[] }) {
  const [cat, setCat] = useState<string>("all");
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of projects) for (const c of p.categories) m[c] = (m[c] ?? 0) + 1;
    return m;
  }, [projects]);
  const shown = cat === "all" ? projects : projects.filter((p) => p.categories.includes(cat as Project["categories"][number]));

  return (
    <>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {[{ id: "all", label: "All projects" }, ...PROJECT_CATEGORIES].map((c) => {
          const n = c.id === "all" ? projects.length : counts[c.id] ?? 0;
          const on = cat === c.id;
          return (
            <button key={c.id} type="button" aria-pressed={on} disabled={n === 0} onClick={() => setCat(c.id)}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${on ? "border-transparent bg-gradient-brand text-ink-900" : "border-line-strong text-muted hover:border-orange/60 hover:text-fg"}`}>
              {c.label} <span className={on ? "text-ink-900/70" : "text-subtle"}>{n}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" role="status" aria-live="polite">{shown.length} {shown.length === 1 ? "project" : "projects"} shown</p>
      <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <li key={p.slug} className="animate-[kvIn_500ms_cubic-bezier(0.16,1,0.3,1)_both]"><ProjectCard project={p} /></li>
        ))}
      </ul>
    </>
  );
}
