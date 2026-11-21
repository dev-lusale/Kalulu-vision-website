import type { Metadata } from "next";
import { PartnerCTA, ProductCard } from "@/components/kv/cards";
import { PageHero, StatusBadge } from "@/components/kv/ui";
import { getProducts } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Products & Solutions",
  description: "Products built by Kalulu Vision, including the Tech Lessons training platform and Educom AI.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const products = await getProducts();
  const live = products.filter((p) => p.status === "live");
  const building = products.filter((p) => p.status !== "live");
  return (
    <>
      <PageHero eyebrow="Products & Solutions" title="Products we build and run."
        lead="Each product carries its real status, so you know exactly what is available today and what is still being built."
        aside={
          <dl className="grid grid-cols-2 gap-4">
            <div className="kv-card p-6"><dt className="text-sm text-muted">Live today</dt><dd className="mt-1 font-display text-4xl font-bold">{live.length}</dd></div>
            <div className="kv-card p-6"><dt className="text-sm text-muted">In progress</dt><dd className="mt-1 font-display text-4xl font-bold">{building.length}</dd></div>
            <div className="col-span-2 flex flex-wrap items-center gap-2 text-sm text-muted">Status labels: <StatusBadge status="live" /><StatusBadge status="pilot" /><StatusBadge status="prototype" /><StatusBadge status="in-development" /></div>
          </dl>
        } />

      {live.length > 0 && (
        <section className="section-y" aria-labelledby="live-title">
          <div className="container-kv">
            <h2 id="live-title" className="text-2xl font-bold">Available now</h2>
            <ul className="mt-8 grid gap-8">
              {live.map((p, i) => <li key={p.slug} data-reveal><ProductCard product={p} reverse={i % 2 === 1} /></li>)}
            </ul>
          </div>
        </section>
      )}
      {building.length > 0 && (
        <section className={`section-y ${live.length ? "border-t border-line bg-soft" : ""}`} aria-labelledby="build-title">
          <div className="container-kv">
            <h2 id="build-title" className="text-2xl font-bold">In development</h2>
            <p className="mt-2 max-w-2xl text-muted">Prototypes and products we are actively building. Interested in piloting one? Get in touch.</p>
            <ul className="mt-8 grid gap-8">
              {building.map((p, i) => <li key={p.slug} data-reveal><ProductCard product={p} reverse={i % 2 === 0} /></li>)}
            </ul>
          </div>
        </section>
      )}
      <PartnerCTA title="Want to pilot one of our products?" text="We work with schools, organisations and institutions to test and adapt our products for their needs." />
    </>
  );
}
