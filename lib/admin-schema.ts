/** Field definitions for the admin content editor. Shared by the client editor and server validation. */
import { OPPORTUNITY_TYPES, PROJECT_CATEGORIES, STATUS_LABELS } from "./content-types";

export type FieldKind = "text" | "textarea" | "markdown" | "list" | "select" | "multiselect" | "bool" | "number" | "url" | "date" | "datetime" | "slug" | "image" | "images";
export interface FieldDef {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  max?: number;
  help?: string;
  options?: { value: string; label: string }[];
  from?: string; // slug source field
}
export interface EntitySchema { name: string; singular: string; plural: string; titleKey: string; publicPath?: (row: Record<string, unknown>) => string | null; fields: FieldDef[] }

const IMG_URL = /^(https?:\/\/[^\s]+|\/[^\s/][^\s]*)$/i;
const statusOpts = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));
const ICON_OPTS = ["brain", "code", "browser", "phone", "chart", "chip", "arrows", "compass", "spark", "flask", "globe", "shield", "layers", "users", "book"].map((v) => ({ value: v, label: v }));

export const SCHEMAS: Record<string, EntitySchema> = {
  projects: {
    name: "projects", singular: "Project", plural: "Projects", titleKey: "title",
    publicPath: (r) => (r.published ? `/projects/${r.slug}` : null),
    fields: [
      { key: "title", label: "Title", kind: "text", required: true, max: 140 },
      { key: "slug", label: "URL slug", kind: "slug", required: true, from: "title", help: "Lowercase letters, numbers and hyphens. Used in the page address." },
      { key: "categories", label: "Categories", kind: "multiselect", required: true, options: PROJECT_CATEGORIES.map((c) => ({ value: c.id, label: c.label })) },
      { key: "status", label: "Status", kind: "select", required: true, options: statusOpts },
      { key: "overview", label: "Overview", kind: "textarea", required: true, max: 400 },
      { key: "problem", label: "Problem statement", kind: "textarea", max: 2000 },
      { key: "solution", label: "Solution", kind: "textarea", max: 2000 },
      { key: "outcomes", label: "Outcomes", kind: "textarea", max: 2000, help: "Only verified results. Leave empty if there are none yet." },
      { key: "technologies", label: "Technologies", kind: "list", help: "One per line." },
      { key: "imageUrl", label: "Main screenshot", kind: "image", help: "Upload a real interface screenshot, or paste an image address." },
      { key: "gallery", label: "More screenshots", kind: "images", help: "Additional real screenshots shown on the project page." },
      { key: "demoUrl", label: "Live demo URL", kind: "url" },
      { key: "repoUrl", label: "GitHub repository URL", kind: "url" },
      { key: "featured", label: "Feature on the homepage", kind: "bool" },
      { key: "sortOrder", label: "Sort order", kind: "number", help: "Lower numbers appear first." },
      { key: "published", label: "Published", kind: "bool" },
    ],
  },
  products: {
    name: "products", singular: "Product", plural: "Products", titleKey: "name",
    publicPath: (r) => (r.published ? "/products" : null),
    fields: [
      { key: "name", label: "Name", kind: "text", required: true, max: 120 },
      { key: "slug", label: "Slug", kind: "slug", required: true, from: "name" },
      { key: "status", label: "Status", kind: "select", required: true, options: statusOpts },
      { key: "tagline", label: "Tagline", kind: "text", max: 160 },
      { key: "description", label: "Description", kind: "textarea", required: true, max: 2000 },
      { key: "features", label: "Key features", kind: "list", help: "One per line." },
      { key: "technologies", label: "Technology stack", kind: "list", help: "One per line." },
      { key: "imageUrl", label: "Product image", kind: "image", help: "A real product screenshot or logo." },
      { key: "gallery", label: "More screenshots", kind: "images" },
      { key: "websiteUrl", label: "Product website or demo URL", kind: "url" },
      { key: "sortOrder", label: "Sort order", kind: "number" },
      { key: "published", label: "Published", kind: "bool" },
    ],
  },
  services: {
    name: "services", singular: "Service", plural: "Services", titleKey: "title",
    publicPath: (r) => (r.published ? `/services/${r.slug}` : null),
    fields: [
      { key: "title", label: "Title", kind: "text", required: true, max: 120 },
      { key: "slug", label: "Slug", kind: "slug", required: true, from: "title" },
      { key: "icon", label: "Icon", kind: "select", options: ICON_OPTS },
      { key: "summary", label: "Summary", kind: "textarea", required: true, max: 240 },
      { key: "intro", label: "Introduction", kind: "textarea", required: true, max: 1200 },
      { key: "offerings", label: "What we offer", kind: "list", help: "One per line." },
      { key: "technologies", label: "Technologies and capabilities", kind: "list", help: "One per line." },
      { key: "applications", label: "Practical applications", kind: "list", help: "One per line." },
      { key: "sortOrder", label: "Sort order", kind: "number" },
      { key: "published", label: "Published", kind: "bool" },
    ],
  },
  posts: {
    name: "posts", singular: "Article", plural: "Articles & research", titleKey: "title",
    publicPath: (r) => (r.published ? `/${r.kind === "research" ? "research" : "insights"}/${r.slug}` : null),
    fields: [
      { key: "title", label: "Title", kind: "text", required: true, max: 180 },
      { key: "slug", label: "Slug", kind: "slug", required: true, from: "title" },
      { key: "kind", label: "Type", kind: "select", required: true, options: [{ value: "article", label: "Article (Insights)" }, { value: "tutorial", label: "Tutorial (Insights)" }, { value: "research", label: "Research publication" }] },
      { key: "category", label: "Category", kind: "text", max: 60, help: "e.g. AI & ML, Data Science, Programming guides, African tech stories" },
      { key: "excerpt", label: "Excerpt", kind: "textarea", required: true, max: 400 },
      { key: "body", label: "Body (Markdown)", kind: "markdown", required: true, max: 100000, help: "## Heading, **bold**, *italic*, [link](https://…), - lists, ``` code ```" },
      { key: "coverUrl", label: "Cover image", kind: "image" },
      { key: "author", label: "Author", kind: "text", max: 120 },
      { key: "publishedAt", label: "Publish date", kind: "datetime", help: "Set automatically the first time you publish." },
      { key: "published", label: "Published", kind: "bool" },
    ],
  },
  opportunities: {
    name: "opportunities", singular: "Opportunity", plural: "Opportunities", titleKey: "title",
    publicPath: (r) => (r.isOpen ? "/opportunities" : null),
    fields: [
      { key: "title", label: "Title", kind: "text", required: true, max: 160 },
      { key: "slug", label: "Slug", kind: "slug", required: true, from: "title" },
      { key: "type", label: "Type", kind: "select", required: true, options: OPPORTUNITY_TYPES.map((t) => ({ value: t.id, label: t.label })) },
      { key: "summary", label: "Summary", kind: "textarea", required: true, max: 400 },
      { key: "description", label: "Full description", kind: "textarea", max: 8000 },
      { key: "location", label: "Location", kind: "text", max: 120, help: "e.g. Remote, Kitwe, Lusaka" },
      { key: "deadline", label: "Application deadline", kind: "date" },
      { key: "isOpen", label: "Open for applications", kind: "bool" },
      { key: "sortOrder", label: "Sort order", kind: "number" },
    ],
  },
};

export function emptyRecord(schema: EntitySchema): Record<string, unknown> {
  const o: Record<string, unknown> = {};
  for (const f of schema.fields) {
    o[f.key] = f.kind === "list" || f.kind === "multiselect" || f.kind === "images" ? [] : f.kind === "bool" ? f.key !== "featured" : f.kind === "number" ? 0
      : f.kind === "select" ? f.options?.[0]?.value ?? "" : f.kind === "date" || f.kind === "datetime" ? null : "";
  }
  if ("published" in o && schema.name === "posts") o.published = false;
  return o;
}

/** Server-side validation & normalisation. Returns [clean data, errors]. */
export function validateRecord(schema: EntitySchema, input: Record<string, unknown>): [Record<string, unknown>, Record<string, string>] {
  const out: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  for (const f of schema.fields) {
    const v = input[f.key];
    switch (f.kind) {
      case "bool": out[f.key] = v === true || v === "true" || v === "on"; break;
      case "number": { const n = Number(v); out[f.key] = Number.isFinite(n) ? Math.trunc(n) : 0; break; }
      case "list": {
        const arr = Array.isArray(v) ? v : typeof v === "string" ? v.split("\n") : [];
        out[f.key] = arr.map((x) => String(x).trim()).filter(Boolean).slice(0, 40).map((x) => x.slice(0, 200));
        break;
      }
      case "multiselect": {
        const allowed = new Set(f.options?.map((o) => o.value));
        out[f.key] = (Array.isArray(v) ? v : []).map(String).filter((x) => allowed.has(x));
        if (f.required && !(out[f.key] as string[]).length) errors[f.key] = `Choose at least one ${f.label.toLowerCase()}.`;
        break;
      }
      case "select": {
        const s = String(v ?? "");
        if (f.options && s && !f.options.some((o) => o.value === s)) errors[f.key] = `Invalid ${f.label.toLowerCase()}.`;
        out[f.key] = s;
        if (f.required && !s) errors[f.key] = `${f.label} is required.`;
        break;
      }
      case "date": {
        const s = String(v ?? "").trim();
        if (s && !/^\d{4}-\d{2}-\d{2}$/.test(s)) errors[f.key] = "Use the format YYYY-MM-DD.";
        out[f.key] = s || null;
        break;
      }
      case "datetime": {
        const s = String(v ?? "").trim();
        if (s && Number.isNaN(Date.parse(s))) errors[f.key] = "Invalid date.";
        out[f.key] = s ? new Date(s).toISOString() : null;
        break;
      }
      case "images": {
        const arr = Array.isArray(v) ? v : typeof v === "string" ? v.split("\n") : [];
        const list = arr.map((x) => String(x).trim()).filter(Boolean).slice(0, 12);
        if (list.some((x) => !IMG_URL.test(x))) errors[f.key] = "Each image must be a full https:// address or a site path starting with /.";
        out[f.key] = list.map((x) => x.slice(0, 500));
        break;
      }
      case "image":
      case "url": {
        const s = String(v ?? "").trim();
        if (s && !IMG_URL.test(s)) errors[f.key] = "Use a full https:// address or a site path starting with /.";
        out[f.key] = s.slice(0, 500);
        break;
      }
      case "slug": {
        const s = String(v ?? "").trim().toLowerCase();
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) errors[f.key] = "Use lowercase letters, numbers and single hyphens only.";
        out[f.key] = s.slice(0, 80);
        break;
      }
      default: {
        const s = String(v ?? "").replace(/\r\n?/g, "\n");
        const trimmed = f.kind === "markdown" ? s : s.trim();
        if (f.required && !trimmed.trim()) errors[f.key] = `${f.label} is required.`;
        if (f.max && trimmed.length > f.max) errors[f.key] = `${f.label} must be ${f.max} characters or fewer.`;
        out[f.key] = trimmed.slice(0, f.max ?? 10000);
      }
    }
  }
  return [out, errors];
}
