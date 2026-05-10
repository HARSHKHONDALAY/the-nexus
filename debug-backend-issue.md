# Backend 500 Error Debug Plan

## Current Status Analysis

### ✅ Backend Components Verified:
1. **EventController**: Calls `eventService.publicEvents()` correctly
2. **EventService**: Has proper error handling and validation
3. **Repository Query**: Uses correct JPQL with proper field mappings
4. **Entity Mappings**: All fields have correct `@Column` annotations
5. **DTO Mapping**: EventResponse has safe null handling
6. **Database Schema**: All required columns exist in migrations

### 🔍 Potential Root Causes:
1. **Migrations Not Applied**: V3 migration (visibility column) may not be running
2. **Database Connection Issues**: Spring Boot may not be connecting to correct database
3. **Empty Database**: No events exist that meet the filter criteria
4. **Category Relationship Issues**: Events may have missing or invalid category_id
5. **Enum Mismatches**: EventStatus enum values may not match database constraints

## Debug Steps

### Step 1: Verify Database Connection
```bash
# Check if Spring Boot is connecting to database
psql "$DATABASE_URL" -c "SELECT version();"

# Check if platform_events table exists
psql "$DATABASE_URL" -c "\d platform_events"

# Check if visibility column exists
psql "$DATABASE_URL" -c "\d platform_events | grep visibility"
```

### Step 2: Verify Migrations Applied
```bash
# Check Flyway schema history
psql "$DATABASE_URL" -c "SELECT * FROM flyway_schema_history ORDER BY installed_on DESC;"

# Expected: V1, V2, V3, V4 migrations should be applied
```

### Step 3: Check Data Existence
```bash
# Check if any events exist
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM platform_events;"

# Check if events meet filter criteria
psql "$DATABASE_URL" -c "
SELECT COUNT(*) 
FROM platform_events e 
LEFT JOIN event_categories c ON e.category_id = c.id 
WHERE e.status IN ('PUBLISHED', 'LIVE', 'SOLD_OUT') 
AND e.deleted_at IS NULL 
AND e.visibility = 'PUBLIC';
"

# Check specific event data
psql "$DATABASE_URL" -c "
SELECT e.slug, e.title, e.status, e.visibility, e.deleted_at, c.slug as category_slug
FROM platform_events e 
LEFT JOIN event_categories c ON e.category_id = c.id 
ORDER BY e.created_at DESC 
LIMIT 5;
"
```

### Step 4: Test Query Directly
```bash
# Test the exact JPQL query logic
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

### Step 5: Check Spring Boot Logs
```bash
# Look for specific exception patterns
tail -f backend/logs/application.log | grep -E "(ERROR|Exception|Column not found|SQLGrammar)"
```

## Expected Issues & Solutions

### Issue 1: Visibility Column Missing
**Symptom**: `Column "visibility" not found`
**Solution**: Run V3 migration: `./mvnw flyway:migrate`

### Issue 2: No Events Meet Criteria
**Symptom**: Query returns empty results
**Solution**: Run V4 seed data or update existing events

### Issue 3: Category Relationship Issues
**Symptom**: Events with null/invalid category_id
**Solution**: Ensure event_categories exist and events reference valid categories

### Issue 4: Database Connection Issues
**Symptom**: Connection refused or authentication errors
**Solution**: Verify DATABASE_URL and database accessibility

## Immediate Actions

1. **Add Request Logging**: Enhanced GlobalExceptionHandler will show exact exception
2. **Test Database State**: Verify migrations and data existence
3. **Run Seed Data**: Ensure V4 migration populates events
4. **Verify Query Results**: Test SQL directly against database

## Next Steps After Diagnosis

Based on the specific exception found:
- If SQL error: Fix schema/migration issues
- If empty results: Fix seed data or filters
- If connection error: Fix database configuration
- If mapping error: Fix entity relationships
