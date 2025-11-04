# 📸 Image Upload Setup Guide

This guide explains how to set up image uploads from your gallery/device instead of using URLs.

## 🚀 Quick Setup

### 1. Create Storage Bucket in Supabase

**Option A: Using SQL (Recommended)**
1. Open Supabase SQL Editor
2. Run the migration file:
   ```
   supabase/migrations/004_setup_storage.sql
   ```

**Option B: Using Supabase Dashboard**
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Bucket name: `post-images`
4. Make it **Public**
5. Click "Create bucket"

### 2. Set Up Storage Policies

If you used Option B above, run this SQL to set up security policies:

```sql
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

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'post-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### 3. Verify Setup

Check if everything is working:
1. Log in to your app
2. Go to Admin → New Post
3. Look for "Featured Image" section
4. You should see an upload button instead of URL input
5. Click and select an image from your device
6. Image should upload and show preview

## ✨ Features

### Image Upload Component
- **Drag & Drop**: Drop images directly onto the upload area
- **Preview**: See images before uploading
- **Validation**: 
  - Supported formats: JPEG, PNG, WebP, GIF
  - Max file size: 5MB
  - Automatic type checking
- **Progress**: Loading spinner during upload
- **Edit Controls**: Change or remove uploaded images

### Security
- ✅ Only authenticated users can upload
- ✅ Users can only delete their own images
- ✅ Public read access (images are viewable by everyone)
- ✅ File type validation (server + client side)
- ✅ File size limits enforced

### Storage Structure
Images are organized by user:
```
post-images/
  ├── user-id-1/
  │   ├── timestamp-abc123.jpg
  │   └── timestamp-def456.png
  └── user-id-2/
      └── timestamp-ghi789.webp
```

## 🎨 Usage

### In Post Editor
The `ImageUpload` component is now integrated into the post editor:

```tsx
<ImageUpload
  label="Featured Image"
  currentImage={formData.featured_image}
  onImageUploaded={(url) => setFormData({ ...formData, featured_image: url })}
  aspectRatio="landscape"
/>
```

### Aspect Ratios
Choose different aspect ratios for different use cases:
- `landscape` - 16:9 (default for featured images)
- `square` - 1:1 (for avatars, icons)
- `portrait` - 3:4 (for profile photos)
- `auto` - Original aspect ratio

### In Other Components
You can use the ImageUpload component anywhere:

```tsx
import ImageUpload from '@/components/ImageUpload'

function MyComponent() {
  const [imageUrl, setImageUrl] = useState('')

  return (
    <ImageUpload
      label="Upload Photo"
      currentImage={imageUrl}
      onImageUploaded={setImageUrl}
      aspectRatio="square"
    />
  )
}
```

## 🔧 API Endpoint

### POST /api/upload

Handles image uploads with validation:

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'file' field
- Auth: Required (session cookie)

**Response:**
```json
{
  "url": "https://project.supabase.co/storage/v1/object/public/post-images/user-id/filename.jpg"
}
```

**Error Responses:**
```json
{ "error": "Unauthorized" }  // 401
{ "error": "No file provided" }  // 400
{ "error": "Invalid file type..." }  // 400
{ "error": "File too large..." }  // 400
```

## 📋 Supported File Types

- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)
- ✅ GIF (.gif)

## 💾 File Size Limits

- Maximum: **5MB** per file
- Enforced at both client and server level
- Configurable in migration SQL

## 🔒 Security Best Practices

1. **User Isolation**: Images stored in user-specific folders
2. **Type Validation**: Strict MIME type checking
3. **Size Limits**: Prevents abuse with large files
4. **Authentication**: Must be logged in to upload
5. **Public Access**: Images are publicly viewable (CDN-ready)

## 🚨 Troubleshooting

### "Unauthorized" Error
- Make sure you're logged in
- Check if session cookie is present
- Try signing out and back in

### Upload Fails Silently
1. Open browser DevTools → Network tab
2. Look for failed /api/upload request
3. Check response for error message
4. Verify storage bucket exists in Supabase

### Images Not Showing
1. Check if bucket is set to **Public**
2. Verify RLS policies are created
3. Check browser console for CORS errors
4. Ensure URL format is correct

### File Size Error
- Reduce image resolution
- Use image compression tools
- Convert to WebP format (better compression)

## 🎯 Next Steps

After setup:
1. ✅ Upload test image in post editor
2. ✅ Verify image appears in Supabase Storage
3. ✅ Check if image displays in post preview
4. ✅ Try removing and changing images

## 📊 Storage Management

### View Uploaded Images
1. Go to Supabase Dashboard
2. Navigate to Storage → post-images
3. Browse by user folders
4. Click images to view or download

### Delete Images
- Through UI: Click "Change" → "Remove" on uploaded image
- Through Dashboard: Select image → Delete
- Images deleted when post is deleted (optional feature)

### Monitor Storage Usage
1. Supabase Dashboard → Storage
2. View usage statistics
3. Set up alerts for storage limits

## 🔄 Migration from URLs

If you have existing posts with URL images:
1. Old URL images will continue to work
2. New posts can use file uploads
3. Can gradually migrate old images:
   ```sql
   -- Find posts with external URLs
   SELECT id, title, featured_image 
   FROM posts 
   WHERE featured_image NOT LIKE '%supabase%';
   ```

## 💡 Tips

- **Optimize Images**: Use tools like TinyPNG before uploading
- **Consistent Sizing**: Upload images with consistent dimensions
- **WebP Format**: Best compression, modern browsers support it
- **Backup**: Supabase storage is backed up automatically

Happy uploading! 📸✨
