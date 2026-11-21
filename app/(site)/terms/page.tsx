import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/kv/LegalPage";
import { getCompany } from "@/lib/content";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that apply when you use the Kalulu Vision website and Tech Lessons enrolment.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const c = await getCompany();
  return (
    <LegalPage
      title="Terms of Use"
      updated="21 November 2026"
      intro={<p>By using this website you agree to these terms. If you do not agree, please do not use the site.</p>}
      sections={[
        { id: "content", title: "Website content", body: <p>The content on this website is provided for general information about {c.name}, our services, products, projects and research. Project and product statuses describe their stage of development at the time of publishing; we update them as work progresses but do not guarantee that every page is current at all times.</p> },
        { id: "ip", title: "Intellectual property", body: <p>The {c.name} name, logo and website content are owned by {c.name} unless stated otherwise. You may share links to our pages, but you may not copy, modify or reuse our logo or content for commercial purposes without written permission. Some photographs show events organised by third parties and are used to illustrate our work.</p> },
        { id: "submissions", title: "Messages and applications", body: <p>When you send us a message, application or partnership enquiry you confirm that the information is accurate and that you are entitled to share it. Sending an enquiry does not create a contract; any engagement is agreed separately in writing. See our <Link href="/privacy">Privacy Policy</Link> for how we handle your information.</p> },
        { id: "training", title: "Tech Lessons enrolment and payment", body: <p>Course access starts once your payment has been manually verified by our team. Prices and plan durations are shown on the <Link href="/training">Tech Lessons page</Link>. If you have a question about a payment, contact us before making a second payment.</p> },
        { id: "use", title: "Acceptable use", body: <p>Do not misuse the website: do not attempt to gain unauthorised access, interfere with its operation, submit spam or harmful content, or impersonate others.</p> },
        { id: "links", title: "Links to other websites", body: <p>Our pages may link to external sites such as code repositories or partner pages. We are not responsible for the content or practices of those sites.</p> },
        { id: "liability", title: "Liability", body: <p>We take care to keep this website accurate and available, but it is provided &ldquo;as is&rdquo;. To the extent permitted by law, {c.name} is not liable for losses arising from use of the website.</p> },
        { id: "contact", title: "Contact", body: <p>Questions about these terms can be sent to {c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : <Link href="/contact">our contact page</Link>}.</p> },
      ]}
    />
  );
}
