'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost, updatePost } from '@/lib/actions/posts'
import { generateSlug, calculateReadingTime } from '@/lib/utils'
import ImageUpload from '@/components/ImageUpload'

interface Tag {
  id: string
  name: string
  slug: string
}

interface Series {
  id: string
  title: string
  slug: string
  status: string
}

interface Post {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image?: string | null
  status: 'draft' | 'published' | 'archived'
  series_id?: string | null
  series_order?: number | null
}

interface PostEditorProps {
  post?: Post
  tags: Tag[]
  series: Series[]
  selectedTagIds?: string[]
}

export default function PostEditor({ post, tags, series, selectedTagIds = [] }: PostEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    featured_image: post?.featured_image || '',
    status: post?.status || 'draft',
    series_id: post?.series_id || null,
    series_order: post?.series_order || null,
    tagIds: selectedTagIds,
  })

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent, status?: 'draft' | 'published') => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const readingTime = calculateReadingTime(formData.content)
      const postData = {
        ...formData,
        status: status || formData.status,
        reading_time: readingTime,
        published_at: status === 'published' ? new Date().toISOString() : null,
      }

      if (post?.id) {
        await updatePost(post.id, postData)
      } else {
        await createPost(postData)
      }

      router.push('/admin/posts')
      router.refresh()
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="card rounded-2xl p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg">
          <label className="block text-sm font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="input"
            placeholder="Enter your post title..."
            required
          />
        </div>

        {/* Slug */}
        <div className="card rounded-2xl p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg">
          <label className="block text-sm font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Slug (URL)
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="input"
            placeholder="post-url-slug"
            required
          />
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            URL: /posts/{formData.slug || 'post-url-slug'}
          </p>
        </div>

        {/* Excerpt */}
        <div className="card rounded-2xl p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg">
          <label className="block text-sm font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Excerpt
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="textarea"
            rows={3}
            placeholder="Brief description of your post..."
            required
          />
        </div>

        {/* Content Editor */}
        <div className="card rounded-2xl p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-bold text-neutral-900 dark:text-neutral-50">
              Content (Markdown)
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
          
          {!showPreview ? (
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="textarea font-mono text-sm"
              rows={20}
              placeholder="Write your post content in Markdown..."
              required
            />
          ) : (
            <div className="prose prose-neutral dark:prose-invert max-w-none bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-lg p-6 min-h-[400px]">
              {formData.content || 'Nothing to preview yet...'}
            </div>
          )}
        </div>

        {/* Featured Image */}
        <div className="card rounded-2xl p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg">
          <ImageUpload
            label="Featured Image"
            currentImage={formData.featured_image}
            onImageUploaded={(url) => setFormData({ ...formData, featured_image: url })}
            aspectRatio="landscape"
          />
        </div>

        {/* Tags */}
        <div className="card rounded-2xl p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg">
          <label className="block text-sm font-bold text-neutral-900 dark:text-neutral-50 mb-3">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isSelected = formData.tagIds.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      tagIds: isSelected
                        ? prev.tagIds.filter(id => id !== tag.id)
                        : [...prev.tagIds, tag.id]
                    }))
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                    isSelected
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-2 border-neutral-900 dark:border-neutral-100'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-2 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                  }`}
                >
                  {tag.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Series Selection */}
        <div className="card rounded-2xl p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg">
          <label className="block text-sm font-bold text-neutral-900 dark:text-neutral-50 mb-3">
            Series (Optional)
          </label>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Add this post to a series to group related content together
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Select Series
              </label>
              <select
                value={formData.series_id || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  series_id: e.target.value || null,
                  series_order: e.target.value ? formData.series_order : null
                })}
                className="input w-full"
              >
                <option value="">None (Standalone Post)</option>
                {series.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} {s.status === 'draft' ? '(Draft)' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            {formData.series_id && (
              <div className="animate-fade-in">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Order in Series
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.series_order || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    series_order: e.target.value ? parseInt(e.target.value) : null
                  })}
                  className="input w-full"
                  placeholder="e.g., 1, 2, 3..."
                />
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                  Position of this post in the series (e.g., Episode 1, Chapter 2)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 sticky bottom-6 card rounded-2xl p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-xl">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            className="btn-secondary flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'published')}
            className="btn-primary flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : post?.id ? 'Update & Publish' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  )
}
