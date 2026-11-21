"use client";

import { useMemo, useState } from "react";
import { PROJECT_CATEGORIES, STATUS_LABELS, type Project } from "@/lib/content-types";
import { ProjectCard } from "./cards";
import { Icon } from "./ui";

export function ProjectBrowser({ projects }: { projects: Project[] }) {
  const [cat, setCat] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState("");
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of projects) for (const c of p.categories) m[c] = (m[c] ?? 0) + 1;
    return m;
  }, [projects]);
  const statuses = useMemo(() => Array.from(new Set(projects.map((p) => p.status))), [projects]);
  const needle = q.trim().toLowerCase();
  const shown = projects.filter((p) =>
    (cat === "all" || p.categories.includes(cat as Project["categories"][number])) &&
    (status === "all" || p.status === status) &&
    (!needle || `${p.title} ${p.overview} ${p.technologies.join(" ")}`.toLowerCase().includes(needle)));

  return (
    <>
      <div className="grid gap-4 rounded-xl border border-line bg-soft p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
        <div role="group" aria-label="Filter by technology category" className="flex flex-wrap gap-2">
          {[{ id: "all", label: "All" }, ...PROJECT_CATEGORIES].map((c) => {
            const n = c.id === "all" ? projects.length : counts[c.id] ?? 0;
            const on = cat === c.id;
            return (
              <button key={c.id} type="button" aria-pressed={on} disabled={n === 0} onClick={() => setCat(c.id)}
                className={`min-h-10 rounded-lg border px-3.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${on ? "border-primary bg-primary text-on-primary" : "border-line-strong bg-surface text-muted hover:border-primary hover:text-fg"}`}>
                {c.label} <span className={on ? "opacity-75" : "text-subtle"}>{n}</span>
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          <span className="whitespace-nowrap">Stage</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="min-h-10 rounded-lg border border-line-strong bg-surface px-3 text-fg">
            <option value="all">All stages</option>
            {statuses.map((s) => <option key={s} value={s}>{STATUS_LABELS[s] ?? s}</option>)}
          </select>
        </label>
        <label className="relative block">
          <span className="sr-only">Search projects</span>
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects" className="min-h-10 w-full rounded-lg border border-line-strong bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-subtle lg:w-56" />
        </label>
      </div>
      <p className="mt-6 text-sm text-muted" role="status" aria-live="polite">{shown.length} {shown.length === 1 ? "project" : "projects"}</p>
      {shown.length ? (
        <ul className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => <li key={p.slug} className="[animation:kvIn_.35s_ease-out]"><ProjectCard project={p} headingLevel={2} /></li>)}
        </ul>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-line-strong p-10 text-center">
          <p className="font-semibold">No projects match these filters.</p>
          <button type="button" onClick={() => { setCat("all"); setStatus("all"); setQ(""); }} className="mt-3 min-h-11 text-sm font-semibold text-primary underline underline-offset-4 dark:text-fg">Clear filters</button>
        </div>
      )}
    </>
  );
}
