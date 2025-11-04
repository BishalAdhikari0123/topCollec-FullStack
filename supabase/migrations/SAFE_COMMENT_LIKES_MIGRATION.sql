-- Safe migration that checks if objects exist before creating them
-- Run this in Supabase SQL Editor

-- Drop existing policies if they exist (to allow clean recreation)
DROP POLICY IF EXISTS "Comment likes are viewable by everyone" ON comment_likes;
DROP POLICY IF EXISTS "Users can insert their own likes" ON comment_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON comment_likes;

-- Drop table if exists (WARNING: This will delete existing data)
-- Remove the next line if you want to keep existing data
DROP TABLE IF EXISTS comment_likes;

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_like BOOLEAN NOT NULL, -- true for like, false for dislike
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);

-- Enable Row Level Security
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

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

-- Verify the setup
SELECT 'Migration completed successfully!' AS status;
SELECT 'Policies created:' AS info;
SELECT policyname FROM pg_policies WHERE tablename = 'comment_likes';
