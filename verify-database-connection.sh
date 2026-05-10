#!/bin/bash

echo "=== Database Connection Verification ==="
echo ""

# Extract database info from DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo "Database URL (sanitized): ${DATABASE_URL:0:50}..."

# Extract database host and name for verification
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's|.*/\([^?]*\).*|\1|p')

echo "Database Host: $DB_HOST"
echo "Database Name: $DB_NAME"
echo ""

# Test database connectivity
echo "Testing database connection..."
if psql "$DATABASE_URL" -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    echo "Please check DATABASE_URL and database accessibility"
    exit 1
fi

echo ""
echo "=== Schema Verification ==="

# Check which schemas/tables exist
echo "Checking for Spring Boot tables:"
TABLES=$(psql "$DATABASE_URL" -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('platform_events', 'event_categories', 'ticket_tiers') ORDER BY table_name;" 2>/dev/null | tr -d ' ')

if echo "$TABLES" | grep -q "platform_events"; then
    echo "✅ platform_events table exists"
else
    echo "❌ platform_events table missing"
fi

if echo "$TABLES" | grep -q "event_categories"; then
    echo "✅ event_categories table exists"
else
    echo "❌ event_categories table missing"
fi

if echo "$TABLES" | grep -q "ticket_tiers"; then
    echo "✅ ticket_tiers table exists"
else
    echo "❌ ticket_tiers table missing"
fi

echo ""
echo "Checking for Prisma tables:"
if echo "$TABLES" | grep -q "events"; then
    echo "⚠️  events table exists (Prisma schema)"
else
    echo "ℹ️  events table not found (Prisma schema)"
fi

echo ""
echo "=== Data Verification ==="

# Check data in Spring Boot tables
echo "Data in platform_events:"
PLATFORM_EVENTS_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM platform_events;" 2>/dev/null | tr -d ' ')
echo "Total events: $PLATFORM_EVENTS_COUNT"

if [ "$PLATFORM_EVENTS_COUNT" -gt 0 ]; then
    PUBLISHED_EVENTS_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM platform_events WHERE status = 'PUBLISHED' AND visibility = 'PUBLIC' AND deleted_at IS NULL;" 2>/dev/null | tr -d ' ')
    echo "Published public events: $PUBLISHED_EVENTS_COUNT"
    
    if [ "$PUBLISHED_EVENTS_COUNT" -gt 0 ]; then
        echo "✅ Events available for public API"
    else
        echo "⚠️  No events meet public API criteria"
    fi
else
    echo "❌ No events in platform_events table"
fi

echo ""
echo "Data in event_categories:"
CATEGORIES_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM event_categories;" 2>/dev/null | tr -d ' ')
echo "Total categories: $CATEGORIES_COUNT"

echo ""
echo "=== Migration Status ==="
# Check Flyway migration history
FLYWAY_TABLES=$(psql "$DATABASE_URL" -t -c "SELECT table_name FROM information_schema.tables WHERE table_name = 'flyway_schema_history';" 2>/dev/null | tr -d ' ')

if [ -n "$FLYWAY_TABLES" ]; then
    echo "✅ Flyway schema history table exists"
    
    MIGRATIONS=$(psql "$DATABASE_URL" -t -c "SELECT version, installed_on FROM flyway_schema_history ORDER BY installed_on DESC;" 2>/dev/null | head -5)
    echo "Recent migrations:"
    echo "$MIGRATIONS" | while read line; do
        echo "  - $line"
    done
else
    echo "❌ Flyway schema history table missing"
fi

echo ""
echo "=== Summary ==="
echo "Database Host: $DB_HOST"
echo "Database Name: $DB_NAME"
echo "Spring Boot Tables: $(echo "$TABLES" | grep -E "(platform_events|event_categories|ticket_tiers)" | wc -l | tr -d ' ')/3"
echo "Published Events: $PUBLISHED_EVENTS_COUNT"
echo "Categories: $CATEGORIES_COUNT"

if [ "$PUBLISHED_EVENTS_COUNT" -gt 0 ] && [ "$CATEGORIES_COUNT" -gt 0 ]; then
    echo "✅ Database is ready for Spring Boot API"
else
    echo "⚠️  Database needs migrations or seed data"
fi
