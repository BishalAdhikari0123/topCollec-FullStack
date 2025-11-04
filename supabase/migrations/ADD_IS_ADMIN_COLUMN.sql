-- Add is_admin column to profiles table
-- Run this in Supabase SQL Editor

-- Step 1: Check what columns exist in profiles table
SELECT 
  'PROFILES TABLE STRUCTURE:' as info,
  column_name, 
  data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Step 2: Add the is_admin column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false NOT NULL;
    RAISE NOTICE 'Added is_admin column to profiles table';
  ELSE
    RAISE NOTICE 'is_admin column already exists';
  END IF;
END $$;

-- Step 3: Add name column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN name TEXT;
    RAISE NOTICE 'Added name column to profiles table';
  ELSE
    RAISE NOTICE 'name column already exists';
  END IF;
END $$;

-- Step 4: Add email column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;
    RAISE NOTICE 'Added email column to profiles table';
  ELSE
    RAISE NOTICE 'email column already exists';
  END IF;
END $$;

-- Step 5: Add avatar_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    RAISE NOTICE 'Added avatar_url column to profiles table';
  ELSE
    RAISE NOTICE 'avatar_url column already exists';
  END IF;
END $$;

-- Step 6: Show all users with whatever columns exist
SELECT 
  'Current users:' as info,
  *
FROM profiles
ORDER BY created_at DESC;

-- Step 7: Make the first user admin automatically
UPDATE profiles 
SET is_admin = true 
WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1);

-- Step 8: Verify the update
SELECT 
  'Admin users:' as info,
  *
FROM profiles
WHERE is_admin = true;
