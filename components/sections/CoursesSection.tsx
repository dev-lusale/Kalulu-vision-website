"use client";

import { useState } from "react";
import { COURSES } from "@/lib/config";
import type { CourseId, Course, SubTopic } from "@/lib/config";
import { COURSE_ICON_MAP, COURSE_COLOR_MAP } from "@/components/icons/CourseIcons";

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
        className="relative py-20 sm:py-28 dot-bg overflow-hidden"
        style={{ background: "var(--bg-base)" }}
        aria-labelledby="courses-heading"
      >
        <div className="glow-top-right" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="section-label">What We Teach</span>
            <h2
              id="courses-heading"
              className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4"
            >
              Available Courses
            </h2>
            <p className="max-w-xl mx-auto text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Choose from our range of practical, industry-relevant technology
              courses designed to build real-world skills fast.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {COURSES.map((course) => {
              const Icon   = COURSE_ICON_MAP[course.id];
              const colors = COURSE_COLOR_MAP[course.id];
              return (
                <div
                  key={course.id}
                  className="glass glass-hover flex flex-col p-5 group cursor-default"
                >
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      boxShadow: `0 0 0 0 ${colors.glow}`,
                    }}
                  >
                    <Icon
                      className="w-5 h-5 transition-all duration-300"
                      style={{ color: colors.color }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-white text-[15px] leading-snug mb-0.5">
                    {course.title}
                  </h3>
                  <p
                    className="text-[11.5px] font-semibold mb-2.5"
                    style={{ color: colors.color }}
                  >
                    {course.subtitle}
                  </p>

                  {/* Description */}
                  <p
                    className="text-[12.5px] leading-relaxed mb-4 flex-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {course.description}
                  </p>

                  {/* Topic chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.topics.slice(0, 4).map((topic) => (
                      <span
                        key={topic}
                        className="text-[10.5px] font-medium px-2 py-0.5 rounded-md"
                        style={{
                          background: colors.bg,
                          border: `1px solid ${colors.border}`,
                          color: colors.color,
                          opacity: 0.85,
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    onClick={() => handleCardEnroll(course)}
                    className="w-full flex items-center justify-center gap-1.5 text-[13px] font-semibold py-3 rounded-xl transition-all duration-200 cursor-pointer active:scale-95"
                    style={{
                      background:  colors.bg,
                      border:      `1px solid ${colors.border}`,
                      color:       colors.color,
                      touchAction: "manipulation",
                    }}
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

      {/* Sub-topic picker */}
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

/* ── Sub-topic picker ─────────────────────────────────────── */
function SubTopicPicker({
  course, onSelect, onClose,
}: {
  course: Course;
  onSelect: (sub: SubTopic) => void;
  onClose: () => void;
}) {
  const Icon   = COURSE_ICON_MAP[course.id];
  const colors = COURSE_COLOR_MAP[course.id];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(4,7,14,0.88)", backdropFilter: "blur(8px)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="picker-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md max-h-[88vh] flex flex-col overflow-hidden"
        style={{
          background: "rgba(10,17,32,0.98)",
          border: `1px solid ${colors.border}`,
          borderRadius: "20px",
          boxShadow: `0 0 60px ${colors.glow}, 0 24px 64px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
            >
              <Icon className="w-5 h-5" style={{ color: colors.color }} />
            </div>
            <div>
              <h2 id="picker-title" className="font-bold text-white text-[15px]">{course.title}</h2>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                Choose your programming language
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-white/5"
            style={{ color: "var(--text-muted)" }}
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-4 space-y-1.5">
          <p className="text-[12.5px] px-1 mb-3" style={{ color: "var(--text-muted)" }}>
            Select the specific language for your enrollment.
          </p>

          {course.subTopics?.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSelect(sub)}
              className="w-full flex items-center gap-3 text-left p-3.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98]"
              style={{
                background:  "rgba(255,255,255,0.03)",
                border:      `1px solid ${colors.border}`,
                touchAction: "manipulation",
              }}
            >
              <span className="text-xl shrink-0">{sub.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-[13.5px]">{sub.label}</p>
                <p className="text-[11.5px] mt-0.5 leading-relaxed truncate" style={{ color: "var(--text-muted)" }}>
                  {sub.description}
                </p>
              </div>
              <svg className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}

          <button
            type="button"
            onClick={() => onSelect({ id: "general", label: "General Programming", description: "", icon: "💻" })}
            className="w-full mt-2 text-center text-[12.5px] py-2.5 transition-colors cursor-pointer hover:text-white"
            style={{ color: "var(--text-muted)" }}
          >
            Not sure yet — enroll in general programming →
          </button>
        </div>
      </div>
    </div>
  );
}
