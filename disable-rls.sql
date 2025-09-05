-- Disable RLS temporarily to fix permission issues
-- Run this in Supabase SQL Editor

-- Disable RLS on blogs table
ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public read published blogs" ON blogs;
DROP POLICY IF EXISTS "Allow authenticated users to manage blogs" ON blogs;
DROP POLICY IF EXISTS "Allow anonymous blog creation" ON blogs;
DROP POLICY IF EXISTS "Allow public to read published blogs" ON blogs;
DROP POLICY IF EXISTS "Allow admins to manage blogs" ON blogs;
DROP POLICY IF EXISTS "Users can view own URL analytics" ON url_analytics;
DROP POLICY IF EXISTS "Allow analytics insertion" ON url_analytics;
