-- Comprehensive database status check
-- Run this in Supabase SQL Editor to diagnose issues

-- 1. Check if tables exist
SELECT 
  'TABLES STATUS' as check_type,
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') 
    THEN '✓ profiles' ELSE '✗ profiles MISSING' END as profiles,
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'comments') 
    THEN '✓ comments' ELSE '✗ comments MISSING' END as comments,
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'comment_likes') 
    THEN '✓ comment_likes' ELSE '✗ comment_likes MISSING' END as comment_likes,
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'posts') 
    THEN '✓ posts' ELSE '✗ posts MISSING' END as posts;

-- 2. Check profiles table structure
SELECT 
  'PROFILES COLUMNS' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Check if there are any admin users
SELECT 
  'ADMIN USERS' as check_type,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE is_admin = true) as admin_count
FROM profiles;

-- 4. Check comments table structure
SELECT 
  'COMMENTS COLUMNS' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;

-- 5. Check for foreign key relationships
SELECT
  'FOREIGN KEYS' as check_type,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('comments', 'comment_likes', 'profiles');

-- 6. Check RLS policies
SELECT
  'RLS POLICIES' as check_type,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('comments', 'comment_likes', 'profiles', 'posts')
ORDER BY tablename, policyname;

-- 7. Check sample data counts
SELECT 
  'DATA COUNTS' as check_type,
  (SELECT COUNT(*) FROM profiles) as profiles_count,
  (SELECT COUNT(*) FROM posts) as posts_count,
  (SELECT COUNT(*) FROM comments) as comments_count,
  (SELECT COUNT(*) FROM comment_likes WHERE 1=0) as comment_likes_count; -- Will error if table doesn't exist

-- 8. Show recent users (profiles)
SELECT 
  'RECENT PROFILES' as check_type,
  id,
  name,
  email,
  is_admin,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 5;
