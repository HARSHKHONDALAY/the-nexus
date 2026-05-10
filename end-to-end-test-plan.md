# End-to-End Event Pipeline Test Plan

## Pipeline Flow
Prisma Seed → Database → Spring Repository → Spring Service → Spring Controller → API Response → Frontend Fetch → Frontend Rendering

## Step 1: Database Verification
```bash
# Check if events exist with correct properties
psql "$DATABASE_URL" -c "
SELECT 
    slug, 
    title, 
    status, 
    visibility, 
    deleted_at,
    published_at,
    starts_at
FROM platform_events 
WHERE status = 'PUBLISHED' 
AND visibility = 'PUBLIC' 
AND deleted_at IS NULL 
ORDER BY created_at;
"

# Expected: 3 events with PUBLISHED status and PUBLIC visibility
```

## Step 2: Backend API Test
```bash
# Test the exact endpoint that frontend calls
curl -v http://localhost:8080/api/events/public

# Expected: HTTP 200 with JSON response containing events array
# Check response structure:
{
  "success": true,
  "data": [
    {
      "id": "...",
      "categorySlug": "chess-nexus",
      "slug": "checkmate-chaos",
      "title": "Checkmate & Chaos",
      "status": "PUBLISHED",
      ...
    }
  ]
}
```

## Step 3: Frontend API Integration Test
```bash
# Test frontend fetch directly
cd frontend
npm run dev

# In browser console, test API call:
fetch('/api/events/public')
  .then(r => r.json())
  .then(console.log);
```

## Step 4: Frontend Rendering Test
```bash
# Visit events page in browser
http://localhost:3000/events

# Expected:
- Featured event displayed
- Upcoming events grid
- No console errors
- No 500 API errors
```

## Step 5: Homepage Integration Test
```bash
# Visit homepage
http://localhost:3000/

# Expected:
- Featured event from API
- No console errors
- No retry warnings
```

## Validation Checklist

### Database Layer ✅
- [ ] platform_events table exists
- [ ] 3 events with PUBLISHED status
- [ ] All events have PUBLIC visibility
- [ ] All events have deleted_at = NULL
- [ ] All events have valid category_id

### Backend Layer ✅
- [ ] /events/public endpoint returns 200
- [ ] Response contains events array
- [ ] Each event has required fields
- [ ] No Spring Boot exceptions in logs

### Frontend Layer ✅
- [ ] API fetch succeeds
- [ ] Events mapped correctly
- [ ] Featured event renders
- [ ] Upcoming events render
- [ ] No console errors

### Integration Layer ✅
- [ ] Proxy configuration works
- [ ] CORS headers correct
- [ ] Error handling works
- [ ] Empty state handled

## Expected Results After Fix

### API Response Example
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "categorySlug": "chess-nexus",
      "slug": "checkmate-chaos",
      "title": "Checkmate & Chaos",
      "subtitle": "An intense chess tournament combined with strategic chaos challenges",
      "description": "Experience the ultimate chess challenge...",
      "status": "PUBLISHED",
      "venueName": "Coast & Bloom",
      "venueAddress": "Dadar West, Mumbai",
      "city": "Mumbai",
      "startsAt": "2026-05-23T09:30:00Z",
      "endsAt": "2026-05-23T12:30:00Z",
      "timezone": "Asia/Kolkata",
      "capacity": 22,
      "waitlistEnabled": true,
      "registrationOpen": true,
      "allowWalkIns": true,
      "visibility": "PUBLIC",
      "publishedAt": "2026-05-10T..."
    }
  ]
}
```

### Frontend Rendering
- Featured event: "Checkmate & Chaos"
- Upcoming events: "Chess Social Night", "Texture Painting Workshop"
- No 500 errors
- No console warnings
- Proper image loading
- Functional navigation

## Troubleshooting Guide

### If API still returns 500:
1. Check Spring Boot logs for specific exception
2. Verify database column mappings
3. Test query directly in database
4. Check entity field mappings

### If API returns empty array:
1. Verify seed data was inserted
2. Check filter criteria
3. Verify event status values
4. Check visibility settings

### If frontend shows errors:
1. Check browser console
2. Verify API response format
3. Check event mapping logic
4. Verify component props
