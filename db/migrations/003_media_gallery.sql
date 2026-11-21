-- 003: image library + screenshot galleries (additive only)

-- Images uploaded from the admin are stored in Postgres so no extra storage
-- service is needed. Served publicly from /api/media/<id>.
CREATE TABLE IF NOT EXISTS kv_media (
  id          TEXT PRIMARY KEY,
  filename    TEXT NOT NULL,
  mime        TEXT NOT NULL,
  size        INTEGER NOT NULL,
  width       INTEGER,
  height      INTEGER,
  alt         TEXT NOT NULL DEFAULT '',
  data        BYTEA NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS kv_media_created_idx ON kv_media (created_at DESC);

-- Additional interface screenshots for case studies and products
ALTER TABLE kv_projects ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE kv_products ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Real screenshots of the live Tech Lessons platform (only if no image was set yet)
UPDATE kv_products SET image_url = '/screens/tech-lessons-courses.webp',
  gallery = '["/screens/tech-lessons-plans.webp", "/screens/tech-lessons-enroll.webp"]'::jsonb
  WHERE slug = 'tech-lessons' AND image_url = '';
UPDATE kv_projects SET image_url = '/screens/tech-lessons-courses.webp',
  gallery = '["/screens/tech-lessons-plans.webp", "/screens/tech-lessons-enroll.webp"]'::jsonb
  WHERE slug = 'tech-lessons-platform' AND image_url = '';
