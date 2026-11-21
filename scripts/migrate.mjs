#!/usr/bin/env node
/**
 * Applies pending SQL migrations in db/migrations (in filename order).
 * Each migration runs in a transaction and is recorded in kv_migrations.
 *
 *   node scripts/migrate.mjs            run pending migrations
 *   node scripts/migrate.mjs --if-db    same, but exit quietly when no DB URL is set
 *                                       (used by the Vercel build)
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import pg from "pg";
import { resolveDatabaseUrl, sslFor } from "./db-url.mjs";

const optional = process.argv.includes("--if-db");
const url = resolveDatabaseUrl({ direct: true });
if (!url) {
  if (optional) { console.log("[migrate] No database URL set; skipping migrations."); process.exit(0); }
  console.error("[migrate] Set DATABASE_URL (or DATABASE_URL_UNPOOLED) first."); process.exit(1);
}

const dir = path.join(process.cwd(), "db", "migrations");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
const client = new pg.Client({ connectionString: url, ssl: sslFor(url) });

try {
  await client.connect();
  await client.query(`CREATE TABLE IF NOT EXISTS kv_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
  const done = new Set((await client.query("SELECT name FROM kv_migrations")).rows.map((r) => r.name));
  let applied = 0;
  for (const f of files) {
    if (done.has(f)) continue;
    const sql = fs.readFileSync(path.join(dir, f), "utf8");
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO kv_migrations (name) VALUES ($1)", [f]);
      await client.query("COMMIT");
      console.log(`[migrate] applied ${f}`);
      applied++;
    } catch (e) {
      await client.query("ROLLBACK");
      throw new Error(`${f}: ${e.message}`);
    }
  }
  console.log(applied ? `[migrate] ${applied} migration(s) applied.` : "[migrate] Database is up to date.");

  // One-time seed of starting website content (never overwrites edits).
  const SEED = "seed-content-v1";
  if (!done.has(SEED)) {
    const c = JSON.parse(fs.readFileSync(path.join(process.cwd(), "db", "seed", "content.json"), "utf8"));
    const j = (v) => JSON.stringify(v ?? []);
    await client.query("BEGIN");
    try {
      for (const [key, value] of Object.entries(c.settings)) {
        await client.query(`INSERT INTO kv_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`, [key, JSON.stringify(value)]);
      }
      for (const s of c.services) {
        await client.query(
          `INSERT INTO kv_services (id, slug, title, summary, intro, icon, offerings, technologies, applications, sort_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (slug) DO NOTHING`,
          [crypto.randomUUID(), s.slug, s.title, s.summary, s.intro, s.icon, j(s.offerings), j(s.technologies), j(s.applications), s.sort_order]);
      }
      for (const p of c.products) {
        await client.query(
          `INSERT INTO kv_products (id, slug, name, tagline, description, status, features, technologies, image_url, website_url, sort_order, gallery)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT (slug) DO NOTHING`,
          [crypto.randomUUID(), p.slug, p.name, p.tagline, p.description, p.status, j(p.features), j(p.technologies), p.image_url, p.website_url, p.sort_order, j(p.gallery ?? [])]);
      }
      for (const p of c.projects) {
        await client.query(
          `INSERT INTO kv_projects (id, slug, title, categories, status, overview, problem, solution, outcomes, technologies, image_url, demo_url, repo_url, featured, sort_order, gallery)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) ON CONFLICT (slug) DO NOTHING`,
          [crypto.randomUUID(), p.slug, p.title, j(p.categories), p.status, p.overview, p.problem, p.solution, p.outcomes, j(p.technologies), p.image_url, p.demo_url, p.repo_url, p.featured, p.sort_order, j(p.gallery ?? [])]);
      }
      await client.query("INSERT INTO kv_migrations (name) VALUES ($1)", [SEED]);
      await client.query("COMMIT");
      console.log("[migrate] seeded starting website content.");
    } catch (e) {
      await client.query("ROLLBACK");
      throw new Error(`content seed: ${e.message}`);
    }
  }
} catch (e) {
  console.error("[migrate] FAILED:", e.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
