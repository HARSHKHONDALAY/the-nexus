-- Seed data for platform_events table
-- Multiple chess events can be publicly live
-- Admin controls visibility/status of all events independently

-- Insert platform events
INSERT INTO platform_events (
  id, category_id, slug, title, subtitle, description, status, venue_name, venue_address, city,
  starts_at, ends_at, timezone, capacity, waitlist_enabled, registration_open, allow_walk_ins,
  visibility, published_at, venue_cost_paise, created_at, updated_at
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440011',
    'f483ed7c-83fa-44c5-81ce-ce7202182262',
    'chess-social-night',
    'Chess Social Night',
    'A relaxed evening of chess, conversation, and community',
    'Join us for a casual chess evening perfect for players of all levels. Whether you''re a beginner or an experienced player, come enjoy strategic gameplay in a friendly atmosphere.',
    'PUBLISHED',
    'Bustling Brew',
    'Thane West, Mumbai',
    'Thane',
    '2026-05-30 12:00:00+05:30',
    '2026-05-30 15:00:00+05:30',
    'Asia/Kolkata',
    22,
    true,
    true,
    true,
    'PUBLIC',
    now(),
    31500,
    now(),
    now()
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert a second chess event to demonstrate multiple events can coexist
INSERT INTO platform_events (
  id, category_id, slug, title, subtitle, description, status, venue_name, venue_address, city,
  starts_at, ends_at, timezone, capacity, waitlist_enabled, registration_open, allow_walk_ins,
  visibility, published_at, venue_cost_paise, created_at, updated_at
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440012',
    'f483ed7c-83fa-44c5-81ce-ce7202182262',
    'chess-tournament-night',
    'Chess Tournament Night',
    'Competitive chess tournament with prizes',
    'Test your skills in our monthly chess tournament. Open to all skill levels with cash prizes for top performers.',
    'PUBLISHED',
    'Chess Club Mumbai',
    'Bandra West, Mumbai',
    'Mumbai',
    '2026-06-15 18:00:00+05:30',
    '2026-06-15 22:00:00+05:30',
    'Asia/Kolkata',
    30,
    true,
    true,
    true,
    'PUBLIC',
    now(),
    45000,
    now(),
    now()
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert ticket tiers for both chess events
INSERT INTO ticket_tiers (
  id, event_id, name, description, price_paise, currency, capacity, sales_start_at, sales_end_at,
  sort_order, created_at, updated_at
) VALUES
  ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440011', 'General Entry', 'Standard access to Chess Social Night', 60000, 'INR', 22, now(), '2026-05-30 15:00:00+05:30', 0, now(), now()),
  ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440012', 'Tournament Entry', 'Tournament participation with prize eligibility', 80000, 'INR', 30, now(), '2026-06-15 22:00:00+05:30', 0, now(), now())
ON CONFLICT DO NOTHING;
