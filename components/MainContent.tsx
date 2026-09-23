"use client";

import { useState } from "react";
import type { CourseId, PlanId } from "@/lib/config";
import { HeroSection } from "@/components/sections/HeroSection";
import { CoursesSection } from "@/components/sections/CoursesSection";
import { PlansSection } from "@/components/sections/PlansSection";
import { EnrollmentSection } from "@/components/sections/EnrollmentSection";
import { ContactSection } from "@/components/sections/ContactSection";

/**
 * Client-side wrapper that holds selected course/plan/subTopic state so
 * clicking "Enroll" on a course card or "Get Started" on a plan
 * pre-fills the enrollment form.
 */
export function MainContent() {
  const [selectedCourse, setSelectedCourse] = useState<CourseId | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState<string | null>(null);

  function handleSelectCourse(courseId: CourseId, subTopicId?: string) {
    setSelectedCourse(courseId);
    setSelectedSubTopic(subTopicId ?? null);
    setTimeout(() => {
      const el = document.getElementById("enroll");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 50);
  }

  function handleSelectPlan(planId: PlanId) {
    setSelectedPlan(planId);
    setTimeout(() => {
      const el = document.getElementById("enroll");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 50);
  }

  return (
    <main>
      <HeroSection />
      <CoursesSection onSelectCourse={handleSelectCourse} />
      <PlansSection onSelectPlan={handleSelectPlan} />
      <EnrollmentSection
        selectedCourse={selectedCourse}
        selectedPlan={selectedPlan}
        selectedSubTopic={selectedSubTopic}
      />
      <ContactSection />
    </main>
  );
}
