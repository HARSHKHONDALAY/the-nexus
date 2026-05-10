# Run Migrations and Schema Synchronization

## Current Situation
- **Root Cause Identified**: Prisma populates `events` table, but Spring Boot queries `platform_events` table
- **Solution**: Run Spring Boot Flyway migrations to populate `platform_events` table
- **Files Ready**: V4__seed_events.sql already exists with correct data

## Step-by-Step Fix

### Step 1: Run Flyway Migrations
```bash
cd backend
./mvnw flyway:migrate
```

**Expected Output:**
```
[INFO] Flyway migration successful
[INFO] Schema history table: flyway_schema_history
[INFO] Current version of schema: 4
[INFO] Schema successfully updated
```

### Step 2: Verify Migration Success
```bash
# Check if V4 migration was applied
psql "$DATABASE_URL" -c "SELECT version, description, installed_on FROM flyway_schema_history WHERE version = '4';"

# Verify platform_events table has data
psql "$DATABASE_URL" -c "SELECT COUNT(*) as total_events FROM platform_events;"

# Check if events meet API criteria
psql "$DATABASE_URL" -c "
SELECT COUNT(*) as public_events 
FROM platform_events 
WHERE status = 'PUBLISHED' 
AND visibility = 'PUBLIC' 
AND deleted_at IS NULL;
"
```

### Step 3: Test Backend API
```bash
# Test the exact endpoint that's failing
curl -i http://localhost:8080/api/events/public

# Expected: HTTP 200 with JSON response
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

### Step 4: Test Frontend Integration
```bash
# Start frontend
npm run dev

# Visit in browser
http://localhost:3000/events

# Expected: Events render correctly, no console errors
```

## Troubleshooting

### If Migration Fails:
```bash
# Check Flyway configuration
cat backend/src/main/resources/application.yml | grep -A5 flyway

# Check migration files exist
ls -la backend/src/main/resources/db/migration/

# Manually run SQL if needed
psql "$DATABASE_URL" -f backend/src/main/resources/db/migration/V4__seed_events.sql
```

### If API Still Returns 500:
```bash
# Check Spring Boot logs for specific exception
tail -f backend/logs/application.log | grep -E "(ERROR|Exception)"

# Test database query directly
psql "$DATABASE_URL" -c "
SELECT e.*, c.slug as category_slug 
FROM platform_events e 
LEFT JOIN event_categories c ON e.category_id = c.id 
WHERE e.status IN ('PUBLISHED', 'LIVE', 'SOLD_OUT') 
AND e.deleted_at IS NULL 
AND e.visibility = 'PUBLIC' 
ORDER BY e.starts_at ASC;
"
```

### If Database Connection Issues:
```bash
# Verify DATABASE_URL
echo "DATABASE_URL: ${DATABASE_URL:0:50}..."

# Test connection
psql "$DATABASE_URL" -c "SELECT version();"

# Check if tables exist
psql "$DATABASE_URL" -c "\dt platform_events"
psql "$DATABASE_URL" -c "\dt event_categories"
```

## Expected Results After Fix

### Database State:
- `platform_events` table: 3 events with PUBLISHED status
- `event_categories` table: 2 categories (chess-nexus, art-nexus)
- `ticket_tiers` table: 3 ticket tiers for events

### API Response:
- HTTP 200 status code
- Array of 3 EventResponse objects
- Proper category mapping
- No exceptions in logs

### Frontend Rendering:
- Events page shows featured event
- Upcoming events grid populated
- No console errors
- No retry warnings

## Validation Commands

```bash
# Complete validation script
echo "=== Post-Fix Validation ==="

# 1. Check migrations
echo "1. Migration status:"
psql "$DATABASE_URL" -c "SELECT version, description FROM flyway_schema_history ORDER BY installed_on DESC;"

# 2. Check data
echo "2. Data verification:"
psql "$DATABASE_URL" -c "
SELECT 
    COUNT(*) as total_events,
    COUNT(CASE WHEN status = 'PUBLISHED' AND visibility = 'PUBLIC' AND deleted_at IS NULL THEN 1 END) as public_events
FROM platform_events;
"

# 3. Test API
echo "3. API test:"
curl -s http://localhost:8080/api/events/public | jq '.success, (.data | length)'

# 4. Check logs
echo "4. Recent errors:"
tail -10 backend/logs/application.log | grep ERROR || echo "No recent errors"
```

## Success Criteria

✅ **Migration Applied**: V4__seed_events.sql executed successfully  
✅ **Data Populated**: 3 events in platform_events table  
✅ **API Working**: /events/public returns HTTP 200  
✅ **Frontend Working**: Events render without errors  
✅ **No Exceptions**: Clean Spring Boot logs  

## Next Steps After Success

1. **Monitor**: Keep an eye on error logs
2. **Test**: Verify all event-related functionality
3. **Document**: Update any relevant documentation
4. **Deploy**: Ensure migrations run in production
