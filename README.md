# Kalulu Vision — company website & platform

> **See Beyond. Build the Future.**

The website for Kalulu Vision, an African technology and innovation company. It includes:

- a company site with an institutional light design (inspired by the CPHIA website), a ChatGPT-style dark theme, a Light / Dark / System switcher and a subtle three.js presentation of the official logo
- a Tech Lessons training platform at `/training`: courses, plans, enrollment and payment verification (the original site, kept working)
- an admin area at `/admin` for managing projects, products, services, articles and research, opportunities, enquiries, company information, website photos, an image library and training enrollments

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, three.js and PostgreSQL through node-postgres (`pg`).

---

## Pages

| Route | What it is |
|---|---|
| `/` | Home: photo hero with subtle 3D logo, "How can we help you?" pathways, company overview, capabilities, featured projects (tabs), products, research, insights, partnerships, contact form |
| `/about` | Overview, story, mission, vision, values, philosophy, approach, commitment to Africa |
| `/services`, `/services/[slug]` | Eight services, each with offerings, technologies, applications, related projects and a contact CTA |
| `/products` | Products with their real status (Tech Lessons is live; Educom AI is a prototype) |
| `/projects`, `/projects/[slug]` | Portfolio with category filters and project detail pages |
| `/research`, `/research/[slug]` | Research areas, experimental projects and research publications |
| `/insights`, `/insights/[slug]` | Knowledge hub with search, category filters and reading time |
| `/opportunities` | Careers & opportunities, with open/closed status and an application form |
| `/partnerships` | Partner types, ways of working and a partnership enquiry form |
| `/privacy`, `/terms` | Privacy Policy and Terms of Use |
| `/contact` | Contact details and a validated enquiry form |
| `/training` | Tech Lessons enrollment platform (old links such as `/#enroll` redirect here) |
| `/admin` | Content management (sign-in required) |

Every page has its own metadata and Open Graph tags. The site also generates `sitemap.xml`, `robots.txt` and Organization/Article structured data.

---

## Architecture decisions

- **No Prisma.** Prisma downloads its engine binaries at install time, and that host was blocked in the environment where this redesign was built, so the code could not be tested against a real database. The data layer now uses plain SQL through `pg`. It uses the **same tables and columns** Prisma created (`enrollments`, `payments`, `subscriptions`, `admins`), so existing production data keeps working with no changes.
- **Design system:** colour tokens are CSS variables in `app/globals.css`, switched by `<html data-theme>`. See [`docs/design-reference.md`](docs/design-reference.md) for the CPHIA audit, tokens, contrast ratios and photography policy.
- **Images:** uploads from the admin are stored in Postgres (`kv_media`) and served from `/api/media/<id>` with long-term caching, so no extra storage service is needed. Only PNG, JPEG, WebP and GIF are accepted (checked by file content, max 4 MB); SVG is refused because it can carry scripts.
- **SQL migrations** live in `db/migrations/*.sql`. `scripts/migrate.mjs` applies them in order inside transactions and records each one in `kv_migrations`. Migration 001 is written with `IF NOT EXISTS` and matches the old Prisma tables exactly, so it does nothing on the existing database. Migration 002 only **adds** new `kv_*` content tables. Migration 003 adds the image library and screenshot galleries. Nothing existing is altered or dropped.
- **Starting content** is in `db/seed/content.json`. It is loaded into the database once (`seed-content-v1`) and is never re-applied over your edits. If no database is configured, public pages fall back to this file, so the site never breaks.
- **Caching:** public pages are statically generated and refresh every 60 seconds. Every admin save also triggers an immediate refresh.
- **3D hero:** plain three.js (no React Three Fiber, to keep the bundle small), loaded only on devices that can run it. The front face is the untouched logo PNG; the depth comes from stacked, darkened copies of the same silhouette behind it. Reduced-motion users, devices without WebGL, devices with little memory and Data Saver users get a lightweight layered-image version instead.
- **Animation:** CSS and IntersectionObserver rather than Framer Motion, so there is no extra dependency. Content is fully visible without JavaScript or with reduced motion.

---

## Environment variables

Copy `.env.example` to `.env.local` for local development. On Vercel, set these under **Project → Settings → Environment Variables**.

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes (production) | Pooled Postgres URL. Vercel's Neon integration provides `kaluluvision_POSTGRES_PRISMA_URL`, which is also accepted. |
| `DATABASE_URL_UNPOOLED` | Recommended | Direct URL used for migrations (`kaluluvision_POSTGRES_URL_NON_POOLING` is also accepted). |
| `SESSION_SECRET` | **Yes** | At least 32 random characters, used to sign admin sessions. Without it, admins cannot sign in in production. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First run | Used once to create the first admin (see below). The password must be at least 10 characters. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL for sitemaps and social previews, e.g. `https://kalulu-vision-website.vercel.app` |

> **Important:** the previous version accepted the default password `admin123` and used `SESSION_SECRET` itself as the cookie value. Both are gone. Set a strong `SESSION_SECRET` before deploying.

---

## Database setup

1. Create a Postgres database (Neon through Vercel Storage is what production already uses).
2. Set `DATABASE_URL` (and `DATABASE_URL_UNPOOLED`).
3. Run the migrations:
   ```bash
   npm run db:migrate
   ```
   The Vercel build also runs this automatically (`npm run build` → `scripts/migrate.mjs --if-db`). It is safe to run repeatedly.

## Administrator setup

Use either option:

- **Environment bootstrap:** set `ADMIN_EMAIL` and `ADMIN_PASSWORD`, deploy, then sign in at `/admin` with them. That first sign-in creates the account, with the password stored as a bcrypt hash. Afterwards you can remove `ADMIN_PASSWORD` from the environment.
- **Command line:** `npm run admin:create -- you@example.com 'a-long-password'` (this also resets the password of an existing admin).

Change your password at any time under **Admin → Account**. Sessions last 8 hours. Repeated failed sign-ins are rate-limited.

---

## Development

```bash
npm install
cp .env.example .env.local    # then fill in the values
npm run db:migrate            # if you have a database
npm run dev                   # http://localhost:3000
```

Without `DATABASE_URL`, the public site uses the built-in content. Enrollments are saved to JSON files in `/data`, and the admin accepts `ADMIN_PASSWORD` (default `admin123`) in development only.

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Runs migrations (if a DB is set) and builds for production |
| `npm start` | Serves the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates route types and runs the TypeScript checker |
| `npm run db:migrate` | Applies pending migrations and the one-time content seed |
| `npm run admin:create -- <email> <password>` | Creates or resets an admin |

---

## Deploying to Vercel

The project is already connected to Vercel (`kalulu-vision-website.vercel.app`).

1. Add `SESSION_SECRET`, plus `ADMIN_EMAIL` and `ADMIN_PASSWORD` for the first admin, and `NEXT_PUBLIC_SITE_URL`, to the **Production** and **Preview** environments. The database variables from the Neon integration are already there.
2. Push to a branch to get a preview deployment, or merge to `main` for production. The build command (`npm run build`, set in `vercel.json`) applies the database migrations before building.
3. Sign in at `/admin` and review the content.

**Images:** upload images in **Admin → Media library**, or directly from any image field ("Upload" / "Choose from library"). You can also paste an `https://…` address or a path under `/public`. Website photo slots (hero, overview, research, partnerships, careers, recognition) are edited in **Admin → Company info → Website photos**.

---

## Content that needs your input

The starting content contains only verified information. Please review it in the admin:

- the mission, vision and values, which are proposed brand statements
- social media links (none are set yet; add your YouTube, LinkedIn and others under **Company info**)
- real interface screenshots for Educom AI, SignBridge, TalkZed and MINEGUARD AI (a labelled "Screenshots to be published" placeholder is shown until you add them). Tech Lessons already uses real screenshots of the live platform
- the website photos are from your own portfolio (events and your workspace). Check that the captions are accurate and replace any you prefer
- articles, research publications and opportunities, which start empty

---

## Security notes

- Admin pages and APIs check a signed, httpOnly, `SameSite=Strict` session cookie. Admin write requests from other sites are rejected.
- Passwords are stored as bcrypt hashes in the `admins` table.
- All form input is validated on the server. The contact form has a honeypot field and per-IP rate limiting.
- Article Markdown is rendered with everything HTML-escaped first, so authors cannot inject scripts.
- Payment status is only ever changed by an admin, never automatically.

© Kalulu Vision. All rights reserved.
