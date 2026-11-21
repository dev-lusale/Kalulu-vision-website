-- 005: use the founder photo chosen by the owner, unless the slot was changed in the admin
UPDATE kv_settings
   SET value = jsonb_set(value, '{overview}', '{"url":"/photos/founder-bernard.webp","alt":"Bernard Lusale, founder of Kalulu Vision, in a burgundy blazer with arms folded, in front of greenery","caption":"Bernard Lusale, Founder of Kalulu Vision."}'::jsonb),
       updated_at = now()
 WHERE key = 'images'
   AND value->'overview'->>'url' IN ('/photos/founder-workspace.webp', '/photos/founder-portrait.webp');
