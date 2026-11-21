/**
 * Website content repository.
 *
 * Public pages call the get* functions. With a database they read the kv_* tables;
 * without one (or if a query fails) they fall back to db/seed/content.json so the
 * public site never breaks. Admin writes go through the entity helpers at the bottom.
 */
import "server-only";
import crypto from "node:crypto";
import seed from "@/db/seed/content.json";
import { hasDatabase, query, queryOne } from "./server/pool";
import {
  readingMinutes,
  type About, type Company, type Enquiry, type Opportunity, type Post, type Product,
  type Project, type ProjectCategory, type ResearchInfo, type Service,
} from "./content-types";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─────────────────────────────────────────────────────────────
//  Entity definitions (camelCase field ↔ snake_case column)
// ─────────────────────────────────────────────────────────────
type FieldType = "text" | "json" | "bool" | "int" | "date" | "timestamp";
interface EntityDef { table: string; order: string; fields: Record<string, [string, FieldType]> }

export const ENTITIES = {
  services: {
    table: "kv_services", order: "sort_order ASC, title ASC",
    fields: {
      slug: ["slug", "text"], title: ["title", "text"], summary: ["summary", "text"], intro: ["intro", "text"],
      icon: ["icon", "text"], offerings: ["offerings", "json"], technologies: ["technologies", "json"],
      applications: ["applications", "json"], sortOrder: ["sort_order", "int"], published: ["published", "bool"],
    },
  },
  products: {
    table: "kv_products", order: "sort_order ASC, name ASC",
    fields: {
      slug: ["slug", "text"], name: ["name", "text"], tagline: ["tagline", "text"], description: ["description", "text"],
      status: ["status", "text"], features: ["features", "json"], technologies: ["technologies", "json"],
      imageUrl: ["image_url", "text"], websiteUrl: ["website_url", "text"], sortOrder: ["sort_order", "int"],
      published: ["published", "bool"],
    },
  },
  projects: {
    table: "kv_projects", order: "sort_order ASC, title ASC",
    fields: {
      slug: ["slug", "text"], title: ["title", "text"], categories: ["categories", "json"], status: ["status", "text"],
      overview: ["overview", "text"], problem: ["problem", "text"], solution: ["solution", "text"], outcomes: ["outcomes", "text"],
      technologies: ["technologies", "json"], imageUrl: ["image_url", "text"], demoUrl: ["demo_url", "text"],
      repoUrl: ["repo_url", "text"], featured: ["featured", "bool"], sortOrder: ["sort_order", "int"], published: ["published", "bool"],
    },
  },
  posts: {
    table: "kv_posts", order: "COALESCE(published_at, created_at) DESC",
    fields: {
      slug: ["slug", "text"], kind: ["kind", "text"], category: ["category", "text"], title: ["title", "text"],
      excerpt: ["excerpt", "text"], body: ["body", "text"], coverUrl: ["cover_url", "text"], author: ["author", "text"],
      published: ["published", "bool"], publishedAt: ["published_at", "timestamp"],
    },
  },
  opportunities: {
    table: "kv_opportunities", order: "is_open DESC, sort_order ASC, created_at DESC",
    fields: {
      slug: ["slug", "text"], title: ["title", "text"], type: ["type", "text"], summary: ["summary", "text"],
      description: ["description", "text"], location: ["location", "text"], deadline: ["deadline", "date"],
      isOpen: ["is_open", "bool"], sortOrder: ["sort_order", "int"],
    },
  },
} satisfies Record<string, EntityDef>;

export type EntityName = keyof typeof ENTITIES;

function fromRow(def: EntityDef, r: any): any {
  const o: any = { id: r.id };
  for (const [k, [col, t]] of Object.entries(def.fields)) {
    const v = r[col];
    if (t === "json") o[k] = Array.isArray(v) ? v : [];
    else if (t === "bool") o[k] = !!v;
    else if (t === "int") o[k] = Number(v ?? 0);
    else if (t === "date") o[k] = v ? (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10)) : null;
    else if (t === "timestamp") o[k] = v ? (v instanceof Date ? v.toISOString() : String(v)) : null;
    else o[k] = v ?? "";
  }
  if (r.updated_at) o.updatedAt = r.updated_at instanceof Date ? r.updated_at.toISOString() : r.updated_at;
  return o;
}

function toParam(t: FieldType, v: any): any {
  if (t === "json") return JSON.stringify(Array.isArray(v) ? v : []);
  if (t === "bool") return !!v;
  if (t === "int") return Number.isFinite(Number(v)) ? Math.trunc(Number(v)) : 0;
  if (t === "date" || t === "timestamp") return v ? v : null;
  return typeof v === "string" ? v : "";
}

// ─────────────────────────────────────────────────────────────
//  Fallback content (no database)
// ─────────────────────────────────────────────────────────────
const S: any = seed;
const fallback = {
  services: (S.services as any[]).map((s, i) => ({ id: `seed-s${i}`, published: true, sortOrder: s.sort_order, ...s })) as Service[],
  products: (S.products as any[]).map((p, i) => ({
    id: `seed-p${i}`, published: true, sortOrder: p.sort_order, imageUrl: p.image_url, websiteUrl: p.website_url, ...p,
  })) as Product[],
  projects: (S.projects as any[]).map((p, i) => ({
    id: `seed-j${i}`, published: true, sortOrder: p.sort_order, imageUrl: p.image_url, demoUrl: p.demo_url, repoUrl: p.repo_url, ...p,
  })) as Project[],
};

async function safe<T>(label: string, fn: () => Promise<T>, fb: T): Promise<T> {
  if (!hasDatabase()) return fb;
  try { return await fn(); } catch (e) {
    console.error(`[content] ${label} failed, using fallback:`, (e as Error).message);
    return fb;
  }
}

// ─────────────────────────────────────────────────────────────
//  Public reads
// ─────────────────────────────────────────────────────────────
async function getSetting<T>(key: string): Promise<T> {
  const fb = S.settings[key] as T;
  return safe(`setting ${key}`, async () => {
    const r = await queryOne<{ value: T }>(`SELECT value FROM kv_settings WHERE key = $1`, [key]);
    return r ? { ...(fb as any), ...(r.value as any) } : fb;
  }, fb);
}
export const getCompany = () => getSetting<Company>("company");
export const getAbout = () => getSetting<About>("about");
export const getResearchInfo = () => getSetting<ResearchInfo>("research");

export async function getServices(): Promise<Service[]> {
  return safe("services", async () =>
    (await query(`SELECT * FROM kv_services WHERE published ORDER BY ${ENTITIES.services.order}`)).map((r) => fromRow(ENTITIES.services, r)),
  fallback.services);
}
export async function getService(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((s) => s.slug === slug);
}

export async function getProducts(): Promise<Product[]> {
  return safe("products", async () =>
    (await query(`SELECT * FROM kv_products WHERE published ORDER BY ${ENTITIES.products.order}`)).map((r) => fromRow(ENTITIES.products, r)),
  fallback.products);
}

export async function getProjects(): Promise<Project[]> {
  return safe("projects", async () =>
    (await query(`SELECT * FROM kv_projects WHERE published ORDER BY ${ENTITIES.projects.order}`)).map((r) => fromRow(ENTITIES.projects, r)),
  fallback.projects);
}
export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.slug === slug);
}

/** Map a service to the project categories it relates to (for "project examples"). */
export function serviceCategories(slug: string): ProjectCategory[] {
  const s = (S.services as any[]).find((x) => x.slug === slug);
  return (s?.categories ?? []) as ProjectCategory[];
}

function withReading(p: any): Post {
  return { ...p, readingMinutes: readingMinutes(p.body || "") };
}
export async function getPosts(kind?: "insights" | "research"): Promise<Post[]> {
  return safe("posts", async () => {
    const where = kind === "research" ? `AND kind = 'research'` : kind === "insights" ? `AND kind <> 'research'` : "";
    const rows = await query(`SELECT * FROM kv_posts WHERE published ${where} ORDER BY ${ENTITIES.posts.order}`);
    return rows.map((r) => withReading(fromRow(ENTITIES.posts, r)));
  }, []);
}
export async function getPost(slug: string): Promise<Post | undefined> {
  return safe("post", async () => {
    const r = await queryOne(`SELECT * FROM kv_posts WHERE published AND slug = $1`, [slug]);
    return r ? withReading(fromRow(ENTITIES.posts, r)) : undefined;
  }, undefined);
}

export async function getOpportunities(): Promise<Opportunity[]> {
  return safe("opportunities", async () =>
    (await query(`SELECT * FROM kv_opportunities ORDER BY ${ENTITIES.opportunities.order}`))
      .map((r) => fromRow(ENTITIES.opportunities, r))
      .filter((o: Opportunity) => o.isOpen && (!o.deadline || o.deadline >= new Date().toISOString().slice(0, 10))),
  []);
}

// ─────────────────────────────────────────────────────────────
//  Enquiries
// ─────────────────────────────────────────────────────────────
export async function saveEnquiry(e: Omit<Enquiry, "id" | "status" | "createdAt">): Promise<string> {
  const id = crypto.randomUUID();
  await query(
    `INSERT INTO kv_enquiries (id, kind, name, email, organisation, subject, service, opportunity, link_url, message)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [id, e.kind, e.name, e.email, e.organisation, e.subject, e.service, e.opportunity, e.linkUrl, e.message]
  );
  return id;
}

export async function listEnquiries(): Promise<Enquiry[]> {
  const rows = await query(`SELECT * FROM kv_enquiries ORDER BY created_at DESC LIMIT 500`);
  return rows.map((r: any) => ({
    id: r.id, kind: r.kind, name: r.name, email: r.email, organisation: r.organisation, subject: r.subject,
    service: r.service, opportunity: r.opportunity, linkUrl: r.link_url, message: r.message, status: r.status,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
  }));
}

export async function setEnquiryStatus(id: string, status: Enquiry["status"]): Promise<void> {
  await query(`UPDATE kv_enquiries SET status = $1 WHERE id = $2`, [status, id]);
}
export async function deleteEnquiry(id: string): Promise<void> {
  await query(`DELETE FROM kv_enquiries WHERE id = $1`, [id]);
}

// ─────────────────────────────────────────────────────────────
//  Admin CRUD (all rows, including unpublished)
// ─────────────────────────────────────────────────────────────
export async function adminList(entity: EntityName): Promise<any[]> {
  const def: EntityDef = ENTITIES[entity];
  return (await query(`SELECT * FROM ${def.table} ORDER BY ${def.order}`)).map((r) => {
    const o = fromRow(def, r);
    return entity === "posts" ? withReading(o) : o;
  });
}

export async function adminSave(entity: EntityName, id: string | null, data: Record<string, any>): Promise<string> {
  const def: EntityDef = ENTITIES[entity];
  const keys = Object.keys(def.fields).filter((k) => k in data);
  const cols = keys.map((k) => def.fields[k][0]);
  const vals = keys.map((k) => toParam(def.fields[k][1], data[k]));
  if (id) {
    const sets = cols.map((c, i) => `${c} = $${i + 1}`).join(", ");
    const updated = await query(`UPDATE ${def.table} SET ${sets}, updated_at = now() WHERE id = $${cols.length + 1} RETURNING id`, [...vals, id]);
    if (!updated.length) throw new Error("NOT_FOUND");
    return id;
  }
  const newId = crypto.randomUUID();
  const ph = cols.map((_, i) => `$${i + 2}`).join(", ");
  await query(`INSERT INTO ${def.table} (id, ${cols.join(", ")}) VALUES ($1, ${ph})`, [newId, ...vals]);
  return newId;
}

export async function adminDelete(entity: EntityName, id: string): Promise<void> {
  await query(`DELETE FROM ${ENTITIES[entity].table} WHERE id = $1`, [id]);
}

export async function adminGetSettings(): Promise<{ company: Company; about: About; research: ResearchInfo }> {
  const [company, about, research] = await Promise.all([getCompany(), getAbout(), getResearchInfo()]);
  return { company, about, research };
}

export async function adminSaveSetting(key: "company" | "about" | "research", value: unknown): Promise<void> {
  await query(
    `INSERT INTO kv_settings (key, value, updated_at) VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [key, JSON.stringify(value)]
  );
}

export async function adminCounts(): Promise<Record<string, number>> {
  const r = await queryOne<Record<string, string>>(`SELECT
    (SELECT count(*) FROM kv_enquiries WHERE status = 'new')::text AS "newEnquiries",
    (SELECT count(*) FROM kv_projects)::text AS projects,
    (SELECT count(*) FROM kv_products)::text AS products,
    (SELECT count(*) FROM kv_services)::text AS services,
    (SELECT count(*) FROM kv_posts)::text AS posts,
    (SELECT count(*) FROM kv_opportunities WHERE is_open)::text AS "openOpportunities",
    (SELECT count(*) FROM "payments" WHERE "status" = 'PENDING_VERIFICATION')::text AS "pendingPayments"`);
  return Object.fromEntries(Object.entries(r ?? {}).map(([k, v]) => [k, Number(v)]));
}
