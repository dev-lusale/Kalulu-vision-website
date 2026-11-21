"use client";

import { useId, useRef, useState } from "react";
import type { Project } from "@/lib/content-types";
import { PROJECT_CATEGORIES } from "@/lib/content-types";
import { ProjectCard } from "./cards";

/** Homepage project showcase with accessible category tabs (arrow keys move between tabs). */
export function ProjectTabs({ projects }: { projects: Project[] }) {
  const cats = PROJECT_CATEGORIES.filter((c) => projects.some((p) => p.categories.includes(c.id)));
  const tabs = [{ id: "all", label: "All projects" }, ...cats];
  const [tab, setTab] = useState("all");
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const shown = (tab === "all" ? projects : projects.filter((p) => p.categories.includes(tab as Project["categories"][number]))).slice(0, 3);

  function onKey(e: React.KeyboardEvent, i: number) {
    const n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
    if (n === null) return;
    e.preventDefault();
    const j = (n + tabs.length) % tabs.length;
    setTab(tabs[j].id); refs.current[j]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Filter projects by category" className="-mx-1 flex gap-1 overflow-x-auto border-b border-line px-1 [scrollbar-width:none]">
        {tabs.map((t, i) => {
          const on = tab === t.id;
          return (
            <button key={t.id} ref={(el) => { refs.current[i] = el; }} role="tab" type="button" id={`${base}-t-${t.id}`} aria-selected={on} aria-controls={`${base}-panel`} tabIndex={on ? 0 : -1}
              onClick={() => setTab(t.id)} onKeyDown={(e) => onKey(e, i)}
              className={`relative min-h-12 shrink-0 px-4 text-sm font-semibold whitespace-nowrap transition-colors ${on ? "text-primary dark:text-fg" : "text-muted hover:text-fg"}`}>
              {t.label}
              {on && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t bg-primary dark:bg-fg" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-t-${tab}`} className="mt-8">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => <li key={p.slug} className="[animation:kvIn_.35s_ease-out]"><ProjectCard project={p} /></li>)}
        </ul>
      </div>
    </div>
  );
}
