# Database Migration and Verification Commands

## Step 1: Run Flyway Migrations (Spring Boot Schema)
```bash
cd backend
./mvnw flyway:migrate
```

## Step 2: Verify Spring Boot Tables
```bash
psql "$DATABASE_URL" -c "\dt"
psql "$DATABASE_URL" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%event%' ORDER BY table_name;"
```

## Step 3: Run Seed Data
```bash
cd backend
./mvnw flyway:migrate -Dflyway.placeholders=env=local
```

## Step 4: Verify Seed Data
```bash
psql "$DATABASE_URL" -c "SELECT slug, title, status, visibility FROM platform_events WHERE status = 'PUBLISHED' ORDER BY created_at;"
psql "$DATABASE_URL" -c "SELECT COUNT(*) as total_events FROM platform_events WHERE status = 'PUBLISHED' AND visibility = 'PUBLIC' AND deleted_at IS NULL;"
```

## Step 5: Test Backend API
```bash
curl -i http://localhost:8080/api/events/public
```

Expected Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "categorySlug": "chess-nexus",
      "slug": "checkmate-chaos",
      "title": "Checkmate & Chaos",
      "status": "PUBLISHED",
      ...
    }
  ]
}
```

## Step 6: Test Frontend
```bash
cd frontend
npm run dev
```
Visit: http://localhost:3000/events

## Troubleshooting

### If API still returns 500:
1. Check Spring Boot logs for specific exception
2. Verify database connection
3. Check if all required columns exist:
   ```bash
   psql "$DATABASE_URL" -c "\d platform_events"
   ```

### If no events returned:
1. Check if seed data was inserted
2. Verify event status and visibility
3. Check if events meet filter criteria

### Column Mapping Issues:
The Spring Boot entity should map to these database columns:
- `startsAt` → `starts_at`
- `endsAt` → `ends_at`  
- `deletedAt` → `deleted_at`
- `visibility` → `visibility`

### Required Event Properties:
- `status = 'PUBLISHED'`
- `visibility = 'PUBLIC'`
- `deleted_at IS NULL`
- `category_id` must reference valid category
