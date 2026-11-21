-- 004: use the founder's profile portrait for the overview photo, unless it was already changed in the admin
UPDATE kv_settings
   SET value = jsonb_set(value, '{overview}', '{"url":"/photos/founder-portrait.webp","alt":"Portrait of Bernard Lusale, founder of Kalulu Vision, in a burgundy blazer and glasses","caption":"Bernard Lusale, Founder of Kalulu Vision."}'::jsonb),
       updated_at = now()
 WHERE key = 'images' AND value->'overview'->>'url' = '/photos/founder-workspace.webp';
