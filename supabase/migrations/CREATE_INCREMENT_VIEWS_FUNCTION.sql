-- Create or replace the increment_post_views function
-- This function safely increments the view count for a post

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

-- Verify the function was created
SELECT 
  'Function created successfully!' as status,
  routine_name, 
  routine_type
FROM information_schema.routines
WHERE routine_name = 'increment_post_views';
