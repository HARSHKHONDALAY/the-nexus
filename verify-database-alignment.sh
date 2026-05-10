#!/bin/bash

echo "=== Database Alignment Verification ==="
echo ""

# Extract database info from environment
if [ -f ".env" ]; then
    echo "Found .env file"
    DATABASE_URL=$(grep DATABASE_URL .env | cut -d'=' -f2-)
    echo "DATABASE_URL: ${DATABASE_URL:0:50}..."
else
    echo "No .env file found, checking environment variables"
    DATABASE_URL=${DATABASE_URL:-"not set"}
    echo "DATABASE_URL env var: ${DATABASE_URL:0:50}..."
fi

echo ""
echo "=== Prisma Schema Check ==="
if [ -f "prisma/schema.prisma" ]; then
    echo "✓ Prisma schema exists"
    grep -n "datasource db" prisma/schema.prisma
    echo "Prisma provider: $(grep -A1 "datasource db" prisma/schema.prisma | grep provider | cut -d'=' -f2 | tr -d ' ')"
else
    echo "✗ Prisma schema not found"
fi

echo ""
echo "=== Spring Boot Configuration ==="
if [ -f "backend/src/main/resources/application.yml" ]; then
    echo "✓ Spring Boot application.yml exists"
    grep -A2 "datasource:" backend/src/main/resources/application.yml
else
    echo "✗ Spring Boot configuration not found"
fi

echo ""
echo "=== Database Tables Check ==="
# This would require psql to be installed and configured
echo "To verify actual database tables, run:"
echo "psql \"\$DATABASE_URL\" -c \"\\dt\""
echo "psql \"\$DATABASE_URL\" -c \"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;\""

echo ""
echo "=== Key Tables Expected ==="
echo "- platform_events (Spring Boot)"
echo "- events (Prisma - if different)"
echo "- event_categories"
echo "- ticket_tiers"

echo ""
echo "=== Migration Status ==="
if [ -d "backend/src/main/resources/db/migration" ]; then
    echo "✓ Flyway migrations found:"
    ls backend/src/main/resources/db/migration/*.sql | sort -V
else
    echo "✗ No Flyway migrations found"
fi

echo ""
echo "=== Next Steps ==="
echo "1. Ensure DATABASE_URL is the same for both systems"
echo "2. Run Flyway migrations: cd backend && ./mvnw flyway:migrate"
echo "3. Run Prisma migrations: npx prisma migrate deploy"
echo "4. Verify tables exist in database"
echo "5. Run seed data: npx prisma db seed"
