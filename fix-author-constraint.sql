-- Fix foreign key constraint for blogs table
-- Run this in Supabase SQL Editor

-- Drop the foreign key constraint
ALTER TABLE blogs DROP CONSTRAINT IF EXISTS blogs_author_id_fkey;

-- Make author_id nullable and remove the constraint
ALTER TABLE blogs ALTER COLUMN author_id DROP NOT NULL;
