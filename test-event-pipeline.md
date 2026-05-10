# Event Pipeline Test Plan

## Issue Summary
The EventsPage was returning empty arrays instead of actual events due to a database schema mismatch between Prisma and Spring Boot.

## Root Cause Identified
- Prisma schema uses `events` table with fields like `registrationClosed`, `archivedToPast`
- Spring Boot uses `platform_events` table with fields like `visibility`, `publishedAt`
- Prisma seed was populating wrong table

## Fixes Applied

### 1. Backend Repository Query Fix
- Updated `PlatformEventRepository.findByStatusInOrderByStartsAtAscWithCategories()` 
- Added filters: `deletedAt IS NULL` and `visibility = 'PUBLIC'`
- Now queries correct table with proper filters

### 2. Database Seed Fixed
- Created `V4__seed_events.sql` migration
- Populates `platform_events` table with proper data
- Includes event categories and ticket tiers
- Sets required fields: `status = 'PUBLISHED'`, `visibility = 'PUBLIC'`, `publishedAt`

### 3. Frontend Resilience
- Added empty state handling in EventsPage
- Safe event validation and filtering
- "No Events Available" UI state

### 4. API Diagnostics Improved
- Enhanced GlobalExceptionHandler with detailed error messages
- Development mode shows exception types
- Better logging for debugging

## Test Steps

### Step 1: Run Database Migration
```bash
cd backend
./mvnw flyway:migrate
```

### Step 2: Verify Events in Database
```sql
SELECT COUNT(*) FROM platform_events WHERE status = 'PUBLISHED' AND visibility = 'PUBLIC' AND deleted_at IS NULL;
```

### Step 3: Test Backend API
```bash
curl http://localhost:8080/api/events/public
```
Expected: Array of 3 events with proper structure

### Step 4: Test Frontend EventsPage
- Navigate to `/events`
- Should show featured event and upcoming events
- No console errors

### Step 5: Test Homepage
- Navigate to `/`
- Should show featured event from API
- No console errors

## Expected Results
- Backend API returns 3 seeded events
- Frontend renders events properly
- No 500 errors
- Empty state handled gracefully

## Validation Commands
```bash
# Test API directly
curl -i http://localhost:8080/api/events/public

# Check database
psql $DATABASE_URL -c "SELECT slug, title, status, visibility FROM platform_events WHERE status = 'PUBLISHED';"

# Check frontend
npm run dev
# Visit http://localhost:3000/events
```
