// Real SVG icons for each course category
import React from "react";
import type { CourseId } from "@/lib/config";
import type { ComponentType } from "react";

export function ProgrammingIcon({ className = "w-6 h-6", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function WebDevIcon({ className = "w-6 h-6", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

export function AIMLIcon({ className = "w-6 h-6", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

export function DataAnalyticsIcon({ className = "w-6 h-6", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6"  y1="20" x2="6"  y2="14" />
      <line x1="2"  y1="20" x2="22" y2="20" />
    </svg>
  );
}

export function AutomationIcon({ className = "w-6 h-6", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

export function IoTIcon({ className = "w-6 h-6", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
      <path d="M8.5 6.5h7M8.5 10h7" />
    </svg>
  );
}

export function CustomTrainingIcon({ className = "w-6 h-6", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export const COURSE_ICON_MAP: Record<CourseId, ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  "programming":     ProgrammingIcon,
  "web-development": WebDevIcon,
  "ai-ml":           AIMLIcon,
  "data-analytics":  DataAnalyticsIcon,
  "automation":      AutomationIcon,
  "iot-embedded":    IoTIcon,
  "custom":          CustomTrainingIcon,
};

export const COURSE_COLOR_MAP: Record<CourseId, { bg: string; border: string; color: string; glow: string }> = {
  "programming":     { bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.3)",  color: "#818cf8", glow: "rgba(99,102,241,0.4)"  },
  "web-development": { bg: "rgba(14,165,233,0.12)",  border: "rgba(14,165,233,0.3)",  color: "#38bdf8", glow: "rgba(14,165,233,0.4)"  },
  "ai-ml":           { bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.3)",  color: "#c084fc", glow: "rgba(168,85,247,0.4)"  },
  "data-analytics":  { bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)",   color: "#4ade80", glow: "rgba(34,197,94,0.4)"   },
  "automation":      { bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.3)",  color: "#fcd34d", glow: "rgba(251,191,36,0.4)"  },
  "iot-embedded":    { bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",   color: "#f87171", glow: "rgba(239,68,68,0.4)"   },
  "custom":          { bg: "rgba(20,184,166,0.12)",  border: "rgba(20,184,166,0.3)",  color: "#2dd4bf", glow: "rgba(20,184,166,0.4)"  },
};
