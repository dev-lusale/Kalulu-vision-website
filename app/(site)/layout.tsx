import { Effects } from "@/components/kv/Effects";
import { Footer } from "@/components/kv/Footer";
import { Navbar } from "@/components/kv/Navbar";
import { getCompany, getServices } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [company, services] = await Promise.all([getCompany(), getServices()]);
  const socials = Object.values(company.socials ?? {}).filter(Boolean);
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    slogan: company.slogan,
    description: company.shortDescription,
    url: siteUrl(),
    logo: `${siteUrl()}/brand/logo-512.png`,
    email: company.email || undefined,
    telephone: company.phone || undefined,
    address: company.location ? { "@type": "PostalAddress", addressCountry: company.location } : undefined,
    sameAs: socials.length ? socials : undefined,
  };
  return (
    <>
      <Navbar services={services.map(({ slug, title, summary, icon }) => ({ slug, title, summary, icon }))} />
      <main id="main" tabIndex={-1} className="outline-none">{children}</main>
      <Footer company={company} services={services} />
      <Effects />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
