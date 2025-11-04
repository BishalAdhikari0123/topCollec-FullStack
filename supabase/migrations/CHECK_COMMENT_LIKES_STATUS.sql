-- Check what already exists in your database
-- Run this first to see the current state

-- Check if table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'comment_likes')
    THEN 'comment_likes table EXISTS ✓'
    ELSE 'comment_likes table DOES NOT EXIST ✗'
  END AS table_status;

-- Check existing policies
SELECT 
  'Existing policies:' AS info,
  policyname, 
  cmd AS command_type
FROM pg_policies 
WHERE tablename = 'comment_likes';

-- Check existing indexes
SELECT 
  'Existing indexes:' AS info,
  indexname
FROM pg_indexes 
WHERE tablename = 'comment_likes';

-- Check if RLS is enabled
SELECT 
  'RLS Status:' AS info,
  CASE WHEN relrowsecurity THEN 'ENABLED ✓' ELSE 'DISABLED ✗' END AS rls_status
FROM pg_class 
WHERE relname = 'comment_likes';

-- Check existing data count (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'comment_likes') THEN
    EXECUTE 'SELECT ''Existing rows:'' AS info, COUNT(*)::text || '' likes/dislikes'' AS count FROM comment_likes';
  END IF;
END $$;
