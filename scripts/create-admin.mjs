#!/usr/bin/env node
/**
 * Create or reset an admin account.
 *   node scripts/create-admin.mjs you@example.com 'a-long-password'
 */
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import pg from "pg";
import { resolveDatabaseUrl, sslFor } from "./db-url.mjs";

const [email, password] = process.argv.slice(2);
if (!email || !password) { console.error("Usage: node scripts/create-admin.mjs <email> <password>"); process.exit(1); }
if (password.length < 10) { console.error("Password must be at least 10 characters."); process.exit(1); }
const url = resolveDatabaseUrl({ direct: true });
if (!url) { console.error("Set DATABASE_URL first."); process.exit(1); }

const client = new pg.Client({ connectionString: url, ssl: sslFor(url) });
await client.connect();
const hash = await bcrypt.hash(password, 12);
await client.query(
  `INSERT INTO "admins" ("id","email","passwordHash") VALUES ($1,$2,$3)
   ON CONFLICT ("email") DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash"`,
  [crypto.randomUUID(), email.trim().toLowerCase(), hash]
);
await client.end();
console.log(`Admin ready: ${email.trim().toLowerCase()}`);
