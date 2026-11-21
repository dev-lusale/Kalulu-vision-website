import type { Metadata } from "next";
import { PartnerCTA, ProductCard } from "@/components/kv/cards";
import { PageHero } from "@/components/kv/ui";
import { getProducts } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Products & solutions",
  description: "Products built by Kalulu Vision, including the Tech Lessons training platform and Educom AI.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <>
      <PageHero eyebrow="Products & solutions" title={<>Products we build <span className="text-gradient-brand">and run.</span></>}
        lead="Each product is labelled with its real status, so you know exactly what is available today." />
      <section className="py-16 sm:py-24">
        <ul className="container-kv grid gap-6">
          {products.map((p, i) => <li key={p.slug} data-reveal style={{ ["--d" as string]: i }}><ProductCard product={p} /></li>)}
        </ul>
      </section>
      <PartnerCTA />
    </>
  );
}
