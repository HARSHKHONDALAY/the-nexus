# Database Schema Mismatch Fix

## Root Cause Identified

**Critical Issue**: Prisma and Spring Boot are using completely different database tables:

- **Prisma**: Uses `events` table with schema from `prisma/schema.prisma`
- **Spring Boot**: Uses `platform_events` table with schema from Flyway migrations

**Result**: Prisma seed populates `events` table, but Spring Boot queries `platform_events` table → No events found → 500 error

## Solution Strategy

### Option 1: Use Spring Boot Schema (Recommended)
- Keep Spring Boot using `platform_events` table
- Ensure Flyway migrations run properly
- Use V4__seed_events.sql for data
- Update Prisma to match Spring Boot schema

### Option 2: Use Prisma Schema
- Update Spring Boot entities to match Prisma `events` table
- Change repository queries to use `events` table
- Keep Prisma seed as-is

## Recommended: Option 1 (Spring Boot Schema)

### Why:
1. Spring Boot already has proper entity mappings
2. Flyway migrations are more maintainable for production
3. V4__seed_events.sql already exists and is correct
4. Prisma can be updated to match

### Implementation Steps:

#### Step 1: Run Flyway Migrations
```bash
cd backend
./mvnw flyway:migrate
```

#### Step 2: Verify Data
```bash
psql "$DATABASE_URL" -c "
SELECT COUNT(*) as platform_events_count 
FROM platform_events 
WHERE status = 'PUBLISHED' 
AND visibility = 'PUBLIC' 
AND deleted_at IS NULL;
"
```

#### Step 3: Update Prisma Schema (Optional)
If Prisma is still needed, update it to match Spring Boot schema:

```prisma
model PlatformEvent {
  id                 String              @id @default(cuid())
  categoryId         String              @map("category_id")
  slug               String              @unique
  title              String
  subtitle           String?
  description         String
  status             EventStatus         @default(DRAFT)
  venueName          String              @map("venue_name")
  venueAddress       String?             @map("venue_address")
  city               String
  startsAt           DateTime            @map("starts_at")
  endsAt             DateTime            @map("ends_at")
  timezone           String              @default("Asia/Kolkata")
  bannerUrl          String?             @map("banner_url")
  heroMediaUrl       String?             @map("hero_media_url")
  capacity           Int
  waitlistEnabled    Boolean             @default(true) @map("waitlist_enabled")
  registrationOpen   Boolean             @default(true) @map("registration_open")
  allowWalkIns       Boolean             @default(true) @map("allow_walk_ins")
  visibility          String              @default("PUBLIC")
  seoTitle           String?             @map("seo_title")
  seoDescription     String?             @map("seo_description")
  venueCostPaise     BigInt              @default(0) @map("venue_cost_paise")
  publishedAt        DateTime?           @map("published_at")
  createdBy          String?             @map("created_by")
  updatedBy          String?             @map("updated_by")
  deletedAt          DateTime?           @map("deleted_at")
  createdAt          DateTime            @default(now()) @map("created_at")
  updatedAt          DateTime            @updatedAt @map("updated_at")

  @@map("platform_events")
}
```

#### Step 4: Update Prisma Seed
Update or replace Prisma seed to use the correct table.

## Immediate Fix

The fastest solution is to ensure the Spring Boot migrations run:

```bash
# 1. Run all Flyway migrations
cd backend
./mvnw flyway:migrate

# 2. Verify platform_events has data
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM platform_events;"

# 3. Test the API
curl -i http://localhost:8080/api/events/public
```

## Expected Result

After running migrations:
- `platform_events` table will have 3 seeded events
- Spring Boot query will find events
- API will return HTTP 200 with events data
- Frontend will render events correctly

## Verification Commands

```bash
# Check if migrations were applied
psql "$DATABASE_URL" -c "SELECT version, description FROM flyway_schema_history ORDER BY installed_on DESC;"

# Check if events exist
psql "$DATABASE_URL" -c "
SELECT slug, title, status, visibility 
FROM platform_events 
WHERE status = 'PUBLISHED' 
AND visibility = 'PUBLIC' 
ORDER BY created_at;
"

# Test API
curl -i http://localhost:8080/api/events/public
```
