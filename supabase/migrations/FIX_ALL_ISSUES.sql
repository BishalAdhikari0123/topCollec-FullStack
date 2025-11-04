-- COMPREHENSIVE FIX FOR ALL ISSUES
-- Run this entire script in Supabase SQL Editor

-- ============================================================
-- PART 1: FIX PROFILES TABLE
-- ============================================================

-- Add missing columns to profiles table
DO $$ 
BEGIN
  -- Add is_admin column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false NOT NULL;
    RAISE NOTICE '✓ Added is_admin column';
  ELSE
    RAISE NOTICE '→ is_admin column already exists';
  END IF;

  -- Add name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN name TEXT;
    RAISE NOTICE '✓ Added name column';
  ELSE
    RAISE NOTICE '→ name column already exists';
  END IF;

  -- Add avatar_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    RAISE NOTICE '✓ Added avatar_url column';
  ELSE
    RAISE NOTICE '→ avatar_url column already exists';
  END IF;

  -- Add created_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE '✓ Added created_at column';
  ELSE
    RAISE NOTICE '→ created_at column already exists';
  END IF;
END $$;

-- ============================================================
-- PART 2: CREATE INCREMENT VIEWS FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE posts
  SET views = COALESCE(views, 0) + 1
  WHERE id = post_id;
END;
$$;

RAISE NOTICE '✓ Created/updated increment_post_views function';

-- ============================================================
-- PART 3: CREATE COMMENT_LIKES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_like BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);

-- Enable RLS
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Comment likes are viewable by everyone" ON comment_likes;
DROP POLICY IF EXISTS "Users can insert their own likes" ON comment_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON comment_likes;

-- Create RLS policies
CREATE POLICY "Comment likes are viewable by everyone"
ON comment_likes FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own likes"
ON comment_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
ON comment_likes FOR DELETE
USING (auth.uid() = user_id);

RAISE NOTICE '✓ Created comment_likes table with policies';

-- ============================================================
-- PART 4: MAKE FIRST USER ADMIN
-- ============================================================

-- Make the oldest user an admin
UPDATE profiles 
SET is_admin = true 
WHERE id = (
  SELECT id 
  FROM profiles 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- ============================================================
-- PART 5: VERIFY EVERYTHING
-- ============================================================

-- Show all users and their admin status
SELECT 
  '✓ USERS AND ADMIN STATUS' as status,
  id,
  name,
  is_admin,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- Show admin users only
SELECT 
  '✓ ADMIN USERS' as status,
  id,
  name,
  is_admin
FROM profiles
WHERE is_admin = true;

-- Show table structure
SELECT 
  '✓ PROFILES TABLE STRUCTURE' as status,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Show functions
SELECT 
  '✓ FUNCTIONS' as status,
  routine_name
FROM information_schema.routines
WHERE routine_name = 'increment_post_views';

-- Show comment_likes table exists
SELECT 
  '✓ COMMENT_LIKES TABLE' as status,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'comment_likes')
    THEN 'EXISTS'
    ELSE 'MISSING'
  END as table_status;
