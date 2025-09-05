-- Fix RLS policies for blogs table
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public to read published blogs" ON blogs;
DROP POLICY IF EXISTS "Allow admins to manage blogs" ON blogs;

-- Create simpler policies that don't reference auth.users
CREATE POLICY "Allow public read published blogs" ON blogs 
  FOR SELECT USING (published = true);

CREATE POLICY "Allow authenticated users to manage blogs" ON blogs 
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Also allow anonymous inserts for testing
CREATE POLICY "Allow anonymous blog creation" ON blogs 
  FOR INSERT WITH CHECK (true);
