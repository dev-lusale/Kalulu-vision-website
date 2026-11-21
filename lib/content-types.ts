/** Shared content types (safe to import from client components). */

export type ProjectCategory = "ai" | "software" | "data" | "iot" | "mobile" | "research";

export const PROJECT_CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: "ai", label: "AI & Machine Learning" },
  { id: "software", label: "Software Engineering" },
  { id: "data", label: "Data Science" },
  { id: "iot", label: "IoT" },
  { id: "mobile", label: "Mobile Applications" },
  { id: "research", label: "Research & Innovation" },
];

export const STATUS_LABELS: Record<string, string> = {
  live: "Live",
  prototype: "Prototype",
  "in-development": "In development",
  research: "Research",
  concept: "Concept",
  pilot: "Pilot",
  archived: "Archived",
};

export const OPPORTUNITY_TYPES: { id: string; label: string }[] = [
  { id: "career", label: "Careers" },
  { id: "internship", label: "Internships" },
  { id: "student", label: "Student opportunities" },
  { id: "research", label: "Research collaborations" },
  { id: "partnership", label: "Technology partnerships" },
  { id: "programme", label: "Innovation programmes" },
];

export const POST_KINDS = ["article", "tutorial", "research"] as const;
export type PostKind = (typeof POST_KINDS)[number];

export interface Company {
  name: string;
  slogan: string;
  shortDescription: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  socials: Record<string, string>;
}

export interface TitledText { title: string; text: string }

export interface About {
  overview: string;
  story: string;
  mission: string;
  vision: string;
  values: TitledText[];
  philosophy: string;
  approach: TitledText[];
  africa: string;
}

export interface ResearchInfo { intro: string; areas: TitledText[] }

export interface Service {
  id: string;
  slug: string;
  title: string;
  summary: string;
  intro: string;
  icon: string;
  offerings: string[];
  technologies: string[];
  applications: string[];
  sortOrder: number;
  published: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  features: string[];
  technologies: string[];
  imageUrl: string;
  websiteUrl: string;
  sortOrder: number;
  published: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  categories: ProjectCategory[];
  status: string;
  overview: string;
  problem: string;
  solution: string;
  outcomes: string;
  technologies: string[];
  imageUrl: string;
  demoUrl: string;
  repoUrl: string;
  featured: boolean;
  sortOrder: number;
  published: boolean;
}

export interface Post {
  id: string;
  slug: string;
  kind: PostKind;
  category: string;
  title: string;
  excerpt: string;
  body: string;
  coverUrl: string;
  author: string;
  published: boolean;
  publishedAt: string | null;
  readingMinutes: number;
}

export interface Opportunity {
  id: string;
  slug: string;
  title: string;
  type: string;
  summary: string;
  description: string;
  location: string;
  deadline: string | null;
  isOpen: boolean;
  sortOrder: number;
}

export interface Enquiry {
  id: string;
  kind: "contact" | "opportunity";
  name: string;
  email: string;
  organisation: string;
  subject: string;
  service: string;
  opportunity: string;
  linkUrl: string;
  message: string;
  status: "new" | "read" | "archived";
  createdAt: string;
}

export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function slugify(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
