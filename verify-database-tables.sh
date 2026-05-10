#!/bin/bash

echo "=== Database Table Verification ==="
echo ""

# Check which tables exist
echo "Checking for Prisma 'events' table:"
psql "$DATABASE_URL" -c "\dt events" 2>/dev/null && echo "✓ events table exists" || echo "✗ events table NOT FOUND"

echo ""
echo "Checking for Spring Boot 'platform_events' table:"
psql "$DATABASE_URL" -c "\dt platform_events" 2>/dev/null && echo "✓ platform_events table exists" || echo "✗ platform_events table NOT FOUND"

echo ""
echo "Checking for event_categories table:"
psql "$DATABASE_URL" -c "\dt event_categories" 2>/dev/null && echo "✓ event_categories table exists" || echo "✗ event_categories table NOT FOUND"

echo ""
echo "=== All Event-Related Tables ==="
psql "$DATABASE_URL" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND (table_name LIKE '%event%' OR table_name LIKE '%platform%') ORDER BY table_name;"

echo ""
echo "=== Data in Each Table ==="
echo "Events in 'events' table (Prisma):"
psql "$DATABASE_URL" -c "SELECT COUNT(*) as count FROM events;" 2>/dev/null || echo "Table doesn't exist"

echo ""
echo "Events in 'platform_events' table (Spring Boot):"
psql "$DATABASE_URL" -c "SELECT COUNT(*) as count FROM platform_events;" 2>/dev/null || echo "Table doesn't exist"

echo ""
echo "Categories in 'event_categories' table:"
psql "$DATABASE_URL" -c "SELECT COUNT(*) as count FROM event_categories;" 2>/dev/null || echo "Table doesn't exist"
