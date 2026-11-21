-- 002: Content management tables for the company website.
-- New tables only (snake_case). Nothing existing is altered.

CREATE TABLE IF NOT EXISTS kv_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kv_services (
  id           TEXT PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  summary      TEXT NOT NULL DEFAULT '',
  intro        TEXT NOT NULL DEFAULT '',
  icon         TEXT NOT NULL DEFAULT 'spark',
  offerings    JSONB NOT NULL DEFAULT '[]',
  technologies JSONB NOT NULL DEFAULT '[]',
  applications JSONB NOT NULL DEFAULT '[]',
  sort_order   INTEGER NOT NULL DEFAULT 0,
  published    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kv_products (
  id           TEXT PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  tagline      TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'concept',
  features     JSONB NOT NULL DEFAULT '[]',
  technologies JSONB NOT NULL DEFAULT '[]',
  image_url    TEXT NOT NULL DEFAULT '',
  website_url  TEXT NOT NULL DEFAULT '',
  sort_order   INTEGER NOT NULL DEFAULT 0,
  published    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kv_projects (
  id           TEXT PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  categories   JSONB NOT NULL DEFAULT '[]',
  status       TEXT NOT NULL DEFAULT 'concept',
  overview     TEXT NOT NULL DEFAULT '',
  problem      TEXT NOT NULL DEFAULT '',
  solution     TEXT NOT NULL DEFAULT '',
  outcomes     TEXT NOT NULL DEFAULT '',
  technologies JSONB NOT NULL DEFAULT '[]',
  image_url    TEXT NOT NULL DEFAULT '',
  demo_url     TEXT NOT NULL DEFAULT '',
  repo_url     TEXT NOT NULL DEFAULT '',
  featured     BOOLEAN NOT NULL DEFAULT false,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  published    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Articles, tutorials and research publications share one table.
CREATE TABLE IF NOT EXISTS kv_posts (
  id           TEXT PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  kind         TEXT NOT NULL DEFAULT 'article',   -- article | tutorial | research
  category     TEXT NOT NULL DEFAULT '',
  title        TEXT NOT NULL,
  excerpt      TEXT NOT NULL DEFAULT '',
  body         TEXT NOT NULL DEFAULT '',          -- Markdown
  cover_url    TEXT NOT NULL DEFAULT '',
  author       TEXT NOT NULL DEFAULT '',
  published    BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS kv_posts_kind_published_idx ON kv_posts (kind, published, published_at DESC);

CREATE TABLE IF NOT EXISTS kv_opportunities (
  id          TEXT PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  type        TEXT NOT NULL,     -- career | internship | student | research | partnership | programme
  summary     TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  location    TEXT NOT NULL DEFAULT '',
  deadline    DATE,
  is_open     BOOLEAN NOT NULL DEFAULT true,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kv_enquiries (
  id            TEXT PRIMARY KEY,
  kind          TEXT NOT NULL DEFAULT 'contact',  -- contact | opportunity
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  organisation  TEXT NOT NULL DEFAULT '',
  subject       TEXT NOT NULL DEFAULT '',
  service       TEXT NOT NULL DEFAULT '',
  opportunity   TEXT NOT NULL DEFAULT '',
  link_url      TEXT NOT NULL DEFAULT '',
  message       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'new',     -- new | read | archived
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS kv_enquiries_status_idx ON kv_enquiries (status, created_at DESC);
