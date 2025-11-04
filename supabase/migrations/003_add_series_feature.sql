-- Add Series Feature for Blog Posts
-- This allows grouping posts into series (like book chapters)

-- ============================================================
-- PART 1: CREATE SERIES TABLE
-- ============================================================

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

-- Enable RLS
ALTER TABLE series ENABLE ROW LEVEL SECURITY;

-- Series policies
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

-- ============================================================
-- PART 2: ADD SERIES FIELDS TO POSTS TABLE
-- ============================================================

-- Add series relationship to posts
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'series_id'
  ) THEN
    ALTER TABLE posts ADD COLUMN series_id UUID REFERENCES series(id) ON DELETE SET NULL;
    RAISE NOTICE '✓ Added series_id column to posts';
  ELSE
    RAISE NOTICE '→ series_id column already exists';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'series_order'
  ) THEN
    ALTER TABLE posts ADD COLUMN series_order INTEGER;
    RAISE NOTICE '✓ Added series_order column to posts';
  ELSE
    RAISE NOTICE '→ series_order column already exists';
  END IF;
END $$;

-- Create index for faster series queries
CREATE INDEX IF NOT EXISTS idx_posts_series_id ON posts(series_id);
CREATE INDEX IF NOT EXISTS idx_posts_series_order ON posts(series_id, series_order);

-- ============================================================
-- PART 3: CREATE HELPER FUNCTIONS
-- ============================================================

-- Function to get post count in a series
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

-- Function to get next post in series
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
  -- Get current post's series and order
  SELECT posts.series_id, posts.series_order
  INTO current_series_id, current_order
  FROM posts
  WHERE posts.id = current_post_id;
  
  -- If not in a series, return nothing
  IF current_series_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Get next post
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

-- Function to get previous post in series
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
  -- Get current post's series and order
  SELECT posts.series_id, posts.series_order
  INTO current_series_id, current_order
  FROM posts
  WHERE posts.id = current_post_id;
  
  -- If not in a series, return nothing
  IF current_series_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Get previous post
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
-- PART 4: CREATE INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_series_slug ON series(slug);
CREATE INDEX IF NOT EXISTS idx_series_author ON series(author_id);
CREATE INDEX IF NOT EXISTS idx_series_status ON series(status);

-- ============================================================
-- PART 5: VERIFY INSTALLATION
-- ============================================================

-- Show series table structure
SELECT 
  '✓ SERIES TABLE STRUCTURE' as status,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'series'
ORDER BY ordinal_position;

-- Show posts columns related to series
SELECT 
  '✓ POSTS SERIES COLUMNS' as status,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'posts' 
  AND column_name IN ('series_id', 'series_order');

-- Show created functions
SELECT 
  '✓ SERIES FUNCTIONS' as status,
  routine_name
FROM information_schema.routines
WHERE routine_name LIKE '%series%';

-- Success message
SELECT '✅ Series feature installed successfully!' as status;
