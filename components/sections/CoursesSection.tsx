"use client";

import { useState } from "react";
import { COURSES } from "@/lib/config";
import type { CourseId, Course, SubTopic } from "@/lib/config";
import { COURSE_ICON_MAP } from "@/components/icons/CourseIcons";

/* Light-theme color set keyed by CourseId */
const LIGHT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "programming":     { bg: "#EEF0FF", border: "#C7CBF8", text: "#4338ca" },
  "web-development": { bg: "#E0F5FF", border: "#BAE3F9", text: "#0369a1" },
  "ai-ml":           { bg: "#F3E8FF", border: "#D8B4FE", text: "#7c3aed" },
  "data-analytics":  { bg: "#DCFCE7", border: "#86EFAC", text: "#15803d" },
  "automation":      { bg: "#FEFCE8", border: "#FDE047", text: "#a16207" },
  "iot-embedded":    { bg: "#FEE2E2", border: "#FCA5A5", text: "#b91c1c" },
  "custom":          { bg: "#CCFBF1", border: "#5EEAD4", text: "#0f766e" },
};

interface CoursesSectionProps {
  onSelectCourse?: (courseId: CourseId, subTopicId?: string) => void;
}

export function CoursesSection({ onSelectCourse }: CoursesSectionProps) {
  const [pickerCourse, setPickerCourse] = useState<Course | null>(null);

  function handleCardEnroll(course: Course) {
    if (course.subTopics && course.subTopics.length > 0) {
      setPickerCourse(course);
    } else {
      onSelectCourse?.(course.id);
    }
  }

  function handleSubTopicSelect(subTopic: SubTopic) {
    if (!pickerCourse) return;
    onSelectCourse?.(pickerCourse.id, subTopic.id);
    setPickerCourse(null);
  }

  return (
    <>
      <section
        id="courses"
        className="relative py-20 sm:py-28 section-gray"
        aria-labelledby="courses-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Header — content frozen */}
          <div className="text-center mb-14">
            <span className="section-label">What We Teach</span>
            <h2
              id="courses-heading"
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: "#10182B" }}
            >
              Available Courses
            </h2>
            <p className="max-w-xl mx-auto text-[15px] leading-relaxed" style={{ color: "#4a5568" }}>
              Choose from our range of practical, industry-relevant technology
              courses designed to build real-world skills fast.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {COURSES.map((course) => {
              const Icon   = COURSE_ICON_MAP[course.id];
              const colors = LIGHT_COLORS[course.id] ?? { bg: "#F5F6F2", border: "#E5E7DF", text: "#10182B" };
              return (
                <div key={course.id} className="kv-card kv-card-lime flex flex-col p-5 group">

                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: colors.bg, border: `1.5px solid ${colors.border}` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: colors.text } as React.CSSProperties} />
                  </div>

                  {/* Title — content frozen */}
                  <h3 className="font-bold text-[15px] leading-snug mb-0.5" style={{ color: "#10182B" }}>
                    {course.title}
                  </h3>
                  <p className="text-[11.5px] font-semibold mb-2.5" style={{ color: colors.text }}>
                    {course.subtitle}
                  </p>

                  {/* Description — content frozen */}
                  <p className="text-[12.5px] leading-relaxed mb-4 flex-1" style={{ color: "#4a5568" }}>
                    {course.description}
                  </p>

                  {/* Topic chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.topics.slice(0, 4).map((topic) => (
                      <span
                        key={topic}
                        className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* CTA — label "Enroll" preserved */}
                  <button
                    type="button"
                    onClick={() => handleCardEnroll(course)}
                    className="w-full flex items-center justify-center gap-1.5 text-[13px] font-bold py-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95"
                    style={{
                      background: "#10182B",
                      color: "#E9FFA3",
                      border: "none",
                      touchAction: "manipulation",
                      WebkitTapHighlightColor: "transparent",
                    } as React.CSSProperties}
                    onMouseEnter={e => (e.currentTarget.style.background = "#063F3A")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#10182B")}
                  >
                    Enroll
                    {course.subTopics ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sub-topic picker — labels/content frozen */}
      {pickerCourse && (
        <SubTopicPicker
          course={pickerCourse}
          onSelect={handleSubTopicSelect}
          onClose={() => setPickerCourse(null)}
        />
      )}
    </>
  );
}

/* ── Sub-topic picker modal ───────────────────────────────── */
function SubTopicPicker({
  course, onSelect, onClose,
}: {
  course: Course;
  onSelect: (sub: SubTopic) => void;
  onClose: () => void;
}) {
  const Icon   = COURSE_ICON_MAP[course.id];
  const colors = LIGHT_COLORS[course.id] ?? { bg: "#F5F6F2", border: "#E5E7DF", text: "#10182B" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(16,24,43,0.55)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="picker-title"
    >
      <div
        className="w-full max-w-md max-h-[88vh] flex flex-col overflow-hidden bg-white"
        style={{ borderRadius: "22px", boxShadow: "0 24px 64px rgba(16,24,43,0.18)", border: "1px solid #E5E7DF" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: "1px solid #E5E7DF" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: colors.bg, border: `1.5px solid ${colors.border}` }}>
              <Icon className="w-5 h-5" style={{ color: colors.text } as React.CSSProperties} />
            </div>
            <div>
              <h2 id="picker-title" className="font-bold text-[15px]" style={{ color: "#10182B" }}>
                {course.title}
              </h2>
              {/* Content frozen: */}
              <p className="text-[11px] mt-0.5" style={{ color: "#7a8394" }}>Choose your programming language</p>
            </div>
          </div>
          <button
            type="button" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-gray-100"
            style={{ color: "#7a8394", border: "none", background: "transparent" }}
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sub-topic list */}
        <div className="overflow-y-auto p-4 space-y-1.5">
          {/* Content frozen: */}
          <p className="text-[12.5px] mb-3 px-1" style={{ color: "#7a8394" }}>
            Select the specific language for your enrollment.
          </p>
          {course.subTopics?.map((sub) => (
            <button
              key={sub.id} type="button" onClick={() => onSelect(sub)}
              className="w-full flex items-center gap-3 text-left p-3.5 rounded-xl transition-all duration-150 cursor-pointer active:scale-[0.98]"
              style={{ background: "#F5F6F2", border: "1.5px solid #E5E7DF", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = colors.bg; (e.currentTarget as HTMLButtonElement).style.borderColor = colors.border; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#F5F6F2"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5E7DF"; }}
            >
              <span className="text-xl shrink-0">{sub.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[13.5px]" style={{ color: "#10182B" }}>{sub.label}</p>
                <p className="text-[11.5px] mt-0.5 truncate" style={{ color: "#7a8394" }}>{sub.description}</p>
              </div>
              <svg className="w-4 h-4 shrink-0" style={{ color: "#7a8394" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
          {/* Content frozen: */}
          <button
            type="button"
            onClick={() => onSelect({ id: "general", label: "General Programming", description: "", icon: "💻" })}
            className="w-full text-center text-[12.5px] py-2.5 cursor-pointer transition-colors hover:text-teal-700"
            style={{ color: "#7a8394", background: "transparent", border: "none" }}
          >
            Not sure yet — enroll in general programming →
          </button>
        </div>
      </div>
    </div>
  );
}
