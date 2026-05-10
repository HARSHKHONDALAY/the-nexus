-- Update existing events to match production requirements
-- Only ONE chess event should be live/public

-- Set only Checkmate & Chaos as PUBLISHED + PUBLIC
UPDATE platform_events 
SET status = 'PUBLISHED', visibility = 'PUBLIC'
WHERE slug = 'checkmate-chaos';

-- Set Chess Social Night as DRAFT + PRIVATE  
UPDATE platform_events 
SET status = 'DRAFT', visibility = 'PRIVATE'
WHERE slug = 'chess-social-night';

-- Set Texture Painting Workshop as DRAFT + PRIVATE
UPDATE platform_events 
SET status = 'DRAFT', visibility = 'PRIVATE'
WHERE slug = 'texture-painting';

-- Verify the changes
SELECT slug, title, status, visibility 
FROM platform_events 
ORDER BY created_at;
