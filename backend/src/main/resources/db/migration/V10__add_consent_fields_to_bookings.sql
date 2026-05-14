-- Add consent fields to bookings table for registration form compliance
-- These fields are required for the new registration form with privacy and media consent

-- Add privacy consent field (NOT NULL with default false for existing records)
ALTER TABLE bookings 
ADD COLUMN privacy_consent BOOLEAN NOT NULL DEFAULT FALSE;

-- Add media consent field (NOT NULL with default false for existing records)  
ALTER TABLE bookings 
ADD COLUMN media_consent BOOLEAN NOT NULL DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN bookings.privacy_consent IS 'Privacy policy consent status - required for all bookings';
COMMENT ON COLUMN bookings.media_consent IS 'Media consent status - required for all bookings (photography/filming)';
