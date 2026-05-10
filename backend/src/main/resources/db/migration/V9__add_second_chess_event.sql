-- Add a second chess event to demonstrate multiple events can be publicly live
-- This removes the single-event restriction

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

-- Insert ticket tier for the second chess event
INSERT INTO ticket_tiers (
  id, event_id, name, description, price_paise, currency, capacity, sales_start_at, sales_end_at,
  sort_order, created_at, updated_at
) VALUES
  ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440012', 'Tournament Entry', 'Tournament participation with prize eligibility', 80000, 'INR', 30, now(), '2026-06-15 22:00:00+05:30', 0, now(), now())
ON CONFLICT DO NOTHING;
