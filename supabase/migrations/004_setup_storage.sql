-- Setup Supabase Storage for Image Uploads
-- Run this in Supabase SQL Editor

-- ============================================================
-- PART 1: CREATE STORAGE BUCKET
-- ============================================================

-- Create the post-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PART 2: SET UP STORAGE POLICIES
-- ============================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'post-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'post-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'post-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================
-- PART 3: SET FILE SIZE LIMITS
-- ============================================================

-- Update bucket to set max file size (5MB)
UPDATE storage.buckets
SET 
  file_size_limit = 5242880,  -- 5MB in bytes
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ]
WHERE id = 'post-images';

-- ============================================================
-- PART 4: VERIFY SETUP
-- ============================================================

-- Check bucket configuration
SELECT 
  '✓ STORAGE BUCKET' as status,
  id,
  name,
  public,
  file_size_limit / 1024 / 1024 as max_size_mb,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'post-images';

-- Check policies
SELECT 
  '✓ STORAGE POLICIES' as status,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

SELECT '✅ Storage setup complete!' as status;
