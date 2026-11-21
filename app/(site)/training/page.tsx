import type { Metadata } from "next";
import { MainContent } from "@/components/MainContent";
import { ButtonLink, PageHero } from "@/components/kv/ui";
import { COURSES, PLANS } from "@/lib/config";

export const metadata: Metadata = {
  title: "Tech Lessons: practical technology training",
  description: "Practical technology training in programming, web development, AI and machine learning, data analytics, automation and IoT. Weekly, monthly and one-on-one plans.",
  alternates: { canonical: "/training" },
};

export default function TrainingPage() {
  return (
    <>
      <PageHero eyebrow="Tech Lessons" crumbs={[{ href: "/products", label: "Products" }]} title="Practical technology skills, taught hands-on."
        lead="Learn programming, web development, AI, data analytics, automation and IoT through real projects, online, in person or one-on-one.">
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="#enroll" arrow>Enroll now</ButtonLink>
          <ButtonLink href="#courses" variant="secondary">Browse courses</ButtonLink>
          <p className="w-full pt-2 text-sm text-subtle sm:w-auto sm:pl-3 sm:pt-0">{COURSES.length} course tracks · {PLANS.length} plans from K{Math.min(...PLANS.map((p) => p.price))}</p>
        </div>
      </PageHero>
      <MainContent />
    </>
  );
}
