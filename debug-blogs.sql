-- Debug: Check if blog posts exist in database
SELECT id, title, slug, published, created_at, author_id FROM blogs;

-- Check if there are any blogs at all
SELECT COUNT(*) as total_blogs FROM blogs;

-- Check published blogs only
SELECT COUNT(*) as published_blogs FROM blogs WHERE published = true;
