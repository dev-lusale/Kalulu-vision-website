import type { ReactNode } from "react";
import { PageHero } from "./ui";

/** Shared layout for policy pages: table of contents + readable prose. */
export function LegalPage({ title, updated, intro, sections }: {
  title: string; updated: string; intro: ReactNode; sections: { id: string; title: string; body: ReactNode }[];
}) {
  return (
    <>
      <PageHero eyebrow={title} title={title} lead={<>Last updated {updated}.</>} />
      <div className="container-kv grid gap-10 py-14 lg:grid-cols-[240px_1fr] lg:gap-16">
        <nav aria-label="On this page" className="hidden lg:block">
          <ol className="sticky top-[calc(var(--nav-h)+24px)] grid gap-1 border-l-2 border-line text-sm">
            {sections.map((s) => <li key={s.id}><a href={`#${s.id}`} className="-ml-0.5 block border-l-2 border-transparent py-1.5 pl-4 text-muted hover:border-primary hover:text-fg">{s.title}</a></li>)}
          </ol>
        </nav>
        <div className="kv-prose max-w-3xl">
          <div className="text-lg text-muted">{intro}</div>
          {sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28">
              <h2 id={`${s.id}-h`}>{s.title}</h2>
              {s.body}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
