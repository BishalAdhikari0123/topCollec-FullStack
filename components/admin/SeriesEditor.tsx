'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSeries, updateSeries, deleteSeries } from '@/lib/actions/series'
import ImageUpload from '@/components/ImageUpload'

interface Series {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image: string | null
  status: string
}

interface SeriesEditorProps {
  series?: Series
}

export default function SeriesEditor({ series }: SeriesEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    title: series?.title || '',
    slug: series?.slug || '',
    description: series?.description || '',
    cover_image: series?.cover_image || '',
    status: series?.status || 'draft',
  })

  const handleTitleChange = (title: string) => {
    setFormData({ 
      ...formData, 
      title,
      slug: series?.id ? formData.slug : title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    })
  }

  const handleSubmit = async (e: React.FormEvent, status?: 'draft' | 'published') => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const fd = new FormData()
      fd.append('title', formData.title)
      fd.append('description', formData.description)
      fd.append('cover_image', formData.cover_image)
      
      if (series?.id) {
        await updateSeries(series.id, fd)
      } else {
        await createSeries(fd)
      }

      router.push('/admin/series')
      router.refresh()
    } catch (error) {
      console.error('Error saving series:', error)
      alert('Failed to save series. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!series?.id) return
    
    if (!confirm('Are you sure you want to delete this series? All posts will be unlinked from this series.')) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteSeries(series.id)
      router.push('/admin/series')
      router.refresh()
    } catch (error) {
      console.error('Error deleting series:', error)
      alert('Failed to delete series. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="card rounded-2xl p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg">
          <label className="block text-sm font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Series Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="input"
            placeholder="Enter series title..."
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
            placeholder="series-url-slug"
            required
            disabled={!!series?.id}
          />
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            URL: /series/{formData.slug || 'series-url-slug'}
          </p>
          {series?.id && (
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Slug cannot be changed after creation
            </p>
          )}
        </div>

        {/* Description */}
        <div className="card rounded-2xl p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg">
          <label className="block text-sm font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="textarea"
            rows={4}
            placeholder="Brief description of this series..."
          />
        </div>

        {/* Cover Image */}
        <div className="card rounded-2xl p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg">
          <ImageUpload
            label="Cover Image"
            currentImage={formData.cover_image}
            onImageUploaded={(url) => setFormData({ ...formData, cover_image: url })}
            aspectRatio="square"
          />
        </div>

        {/* Status */}
        <div className="card rounded-2xl p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg">
          <label className="block text-sm font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="input"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-4 sticky bottom-6 card rounded-2xl p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-xl">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
            disabled={isSubmitting || isDeleting}
          >
            Cancel
          </button>
          
          {series?.id && (
            <button
              type="button"
              onClick={handleDelete}
              className="btn-danger flex items-center gap-2"
              disabled={isSubmitting || isDeleting}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
          
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={isSubmitting || isDeleting}
          >
            {isSubmitting ? 'Saving...' : series?.id ? 'Update Series' : 'Create Series'}
          </button>
        </div>
      </form>
    </div>
  )
}
