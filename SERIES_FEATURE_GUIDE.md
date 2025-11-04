# 📚 Series Feature Guide

The series feature allows you to group related posts into collections (like chapters of a story or multi-part tutorials).

## 🚀 Setup

### 1. Run Database Migration
Open Supabase SQL Editor and run:
```
supabase/migrations/003_add_series_feature.sql
```

This creates:
- ✅ `series` table for managing series
- ✅ `series_id` and `series_order` columns in `posts` table
- ✅ Helper functions for navigation
- ✅ RLS policies for security

## 📖 How to Use

### Create a Series
1. Go to your Supabase dashboard
2. Navigate to Table Editor → `series`
3. Insert a new row:
   - **title**: "My Story Series"
   - **slug**: "my-story-series"
   - **description**: "An epic adventure in multiple parts"
   - **status**: "published"
   - **author_id**: Your user ID

### Add Posts to Series
1. Edit a post in the `posts` table
2. Set **series_id** to your series ID
3. Set **series_order** to the chapter number (1, 2, 3, etc.)
4. Repeat for all chapters

### Alternative: Create Series via SQL
```sql
-- Create a series
INSERT INTO series (author_id, title, slug, description, status)
VALUES (
  'your-user-id-here',
  'The Dark Tower Chronicles',
  'dark-tower-chronicles',
  'An epic fantasy adventure spanning multiple volumes',
  'published'
)
RETURNING id;

-- Add posts to the series (use the returned series ID)
UPDATE posts 
SET series_id = 'series-id-here', series_order = 1
WHERE slug = 'dark-tower-chapter-1';

UPDATE posts 
SET series_id = 'series-id-here', series_order = 2
WHERE slug = 'dark-tower-chapter-2';
```

## ✨ Features

### For Readers
- **Series Navigation**: Previous/Next chapter buttons on each post
- **Progress Bar**: Visual indication of reading progress
- **Chapter List**: View all chapters in order at `/series/[slug]`
- **Series Browse**: Discover all series at `/series`

### For Authors
- **Organize Content**: Group related posts together
- **Chapter Ordering**: Control the sequence with `series_order`
- **Cover Images**: Add custom series cover art
- **Descriptions**: Provide series overview and context

## 🎨 UI Components

### SeriesNavigation
Shows on individual post pages when post is part of a series:
- Series title with link to full series page
- Progress bar showing current position
- Previous/Next chapter buttons
- Expandable to show "View All Chapters"

### Series List Page (`/series`)
- Grid layout of all series
- Shows cover image, title, description
- Chapter count indicator

### Series Detail Page (`/series/[slug]`)
- Series header with cover and description
- Complete chapter list in order
- Quick "Start Reading" button

## 🔧 Customization

### Add Series Cover Image
```sql
UPDATE series 
SET cover_image = 'https://your-image-url.com/cover.jpg'
WHERE slug = 'your-series-slug';
```

### Change Chapter Order
```sql
-- Reorder chapters
UPDATE posts SET series_order = 1 WHERE slug = 'chapter-one';
UPDATE posts SET series_order = 2 WHERE slug = 'chapter-two';
UPDATE posts SET series_order = 3 WHERE slug = 'chapter-three';
```

### Remove Post from Series
```sql
UPDATE posts 
SET series_id = NULL, series_order = NULL
WHERE slug = 'post-slug';
```

## 📱 Navigation Links

The header now includes a "Series" link that takes readers to `/series` to browse all available series.

## 🎯 Use Cases

Perfect for:
- **Fiction Stories**: Multi-chapter novels or short stories
- **Tutorial Series**: Step-by-step guides
- **Course Content**: Educational series
- **Blog Series**: Connected blog posts on a topic
- **Travel Logs**: Multi-part travel diaries
- **Case Studies**: Extended case study analysis

## 🔍 Technical Details

### Database Schema
```sql
series:
  - id (UUID, primary key)
  - author_id (UUID, foreign key to profiles)
  - title (text)
  - slug (text, unique)
  - description (text)
  - cover_image (text, optional)
  - status (draft/published/archived)
  - created_at, updated_at

posts (new columns):
  - series_id (UUID, foreign key to series, nullable)
  - series_order (integer, nullable)
```

### Helper Functions
- `get_series_post_count(series_id)`: Returns number of published posts
- `get_next_post_in_series(post_id)`: Returns next chapter
- `get_previous_post_in_series(post_id)`: Returns previous chapter

## 🚀 Next Steps

After running the migration:
1. Create your first series via Supabase
2. Add posts to the series
3. Visit `/series` to see your series
4. View a post that's part of a series to see the navigation

Happy serializing! 📚✨
