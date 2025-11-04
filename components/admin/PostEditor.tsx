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

interface Post {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image?: string | null
  status: 'draft' | 'published' | 'archived'
}

interface PostEditorProps {
  post?: Post
  tags: Tag[]
  selectedTagIds?: string[]
}

export default function PostEditor({ post, tags, selectedTagIds = [] }: PostEditorProps) {
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
    <div className="animate-fadeIn">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            placeholder="Enter your post title..."
            required
          />
        </div>

        {/* Slug */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Slug (URL)
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            placeholder="post-url-slug"
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            URL: /posts/{formData.slug || 'post-url-slug'}
          </p>
        </div>

        {/* Excerpt */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Excerpt
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
            rows={3}
            placeholder="Brief description of your post..."
            required
          />
        </div>

        {/* Content Editor */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-300">
              Content (Markdown)
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
          
          {!showPreview ? (
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none font-mono text-sm"
              rows={20}
              placeholder="Write your post content in Markdown..."
              required
            />
          ) : (
            <div className="prose prose-invert max-w-none bg-slate-900 border border-slate-700 rounded-lg p-6 min-h-[400px]">
              {formData.content || 'Nothing to preview yet...'}
            </div>
          )}
        </div>

        {/* Featured Image */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <ImageUpload
            label="Featured Image"
            currentImage={formData.featured_image}
            onImageUploaded={(url) => setFormData({ ...formData, featured_image: url })}
            aspectRatio="landscape"
          />
        </div>

        {/* Tags */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-primary-600 text-white border-2 border-primary-500'
                      : 'bg-slate-700 text-gray-300 border-2 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  {tag.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 sticky bottom-6 bg-slate-800 border border-slate-700 rounded-xl p-6">
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
