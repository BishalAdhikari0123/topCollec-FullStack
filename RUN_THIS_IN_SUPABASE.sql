-- ============================================================
-- SERIES FEATURE SETUP - Run this in Supabase SQL Editor
-- ============================================================
-- Instructions:
-- 1. Go to your Supabase project dashboard
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New query"
-- 4. Paste this entire script
-- 5. Click "Run" or press Ctrl+Enter
-- ============================================================

-- Create series table
CREATE TABLE IF NOT EXISTS series (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE series ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid duplicates)
DROP POLICY IF EXISTS "Published series are viewable by everyone" ON series;
DROP POLICY IF EXISTS "Authors can create series" ON series;
DROP POLICY IF EXISTS "Authors can update own series" ON series;
DROP POLICY IF EXISTS "Authors can delete own series" ON series;

-- Create policies
CREATE POLICY "Published series are viewable by everyone"
  ON series FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Authors can create series"
  ON series FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own series"
  ON series FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own series"
  ON series FOR DELETE
  USING (auth.uid() = author_id);

-- Add series_id and series_order columns to posts table
ALTER TABLE posts 
  ADD COLUMN IF NOT EXISTS series_id UUID REFERENCES series(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS series_order INTEGER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_series_id ON posts(series_id);
CREATE INDEX IF NOT EXISTS idx_posts_series_order ON posts(series_id, series_order);
CREATE INDEX IF NOT EXISTS idx_series_status ON series(status);
CREATE INDEX IF NOT EXISTS idx_series_author ON series(author_id);

-- Helper function: Get post count in a series
CREATE OR REPLACE FUNCTION get_series_post_count(series_id_param UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  post_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO post_count
  FROM posts
  WHERE series_id = series_id_param AND status = 'published';
  
  RETURN COALESCE(post_count, 0);
END;
$$;

-- Helper function: Get next post in series
CREATE OR REPLACE FUNCTION get_next_post_in_series(current_post_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  series_order INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_series_id UUID;
  current_order INTEGER;
BEGIN
  -- Get current post's series info
  SELECT posts.series_id, posts.series_order
  INTO current_series_id, current_order
  FROM posts
  WHERE posts.id = current_post_id;

  -- Return next post in series
  RETURN QUERY
  SELECT posts.id, posts.title, posts.slug, posts.series_order
  FROM posts
  WHERE posts.series_id = current_series_id
    AND posts.series_order > current_order
    AND posts.status = 'published'
  ORDER BY posts.series_order ASC
  LIMIT 1;
END;
$$;

-- Helper function: Get previous post in series
CREATE OR REPLACE FUNCTION get_previous_post_in_series(current_post_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  series_order INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_series_id UUID;
  current_order INTEGER;
BEGIN
  -- Get current post's series info
  SELECT posts.series_id, posts.series_order
  INTO current_series_id, current_order
  FROM posts
  WHERE posts.id = current_post_id;

  -- Return previous post in series
  RETURN QUERY
  SELECT posts.id, posts.title, posts.slug, posts.series_order
  FROM posts
  WHERE posts.series_id = current_series_id
    AND posts.series_order < current_order
    AND posts.status = 'published'
  ORDER BY posts.series_order DESC
  LIMIT 1;
END;
$$;

-- ============================================================
-- VERIFICATION QUERIES (uncomment to test)
-- ============================================================
-- SELECT * FROM series;
-- SELECT id, title, series_id, series_order FROM posts WHERE series_id IS NOT NULL;
-- SELECT table_name, column_name FROM information_schema.columns 
-- WHERE table_name = 'posts' AND column_name IN ('series_id', 'series_order');
