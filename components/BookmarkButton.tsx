'use client'

import { useState, useTransition } from 'react'
import { toggleBookmark } from '@/lib/actions/bookmarks'

interface BookmarkButtonProps {
  postId: string
  initialBookmarked: boolean
  variant?: 'default' | 'minimal'
}

export default function BookmarkButton({ postId, initialBookmarked, variant = 'default' }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      try {
        const result = await toggleBookmark(postId)
        setIsBookmarked(result.bookmarked)
      } catch (error) {
        console.error('Failed to toggle bookmark:', error)
      }
    })
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleToggle}
        disabled={isPending}
        className="p-2 rounded-lg transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800"
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        <svg 
          className={`w-5 h-5 transition-colors ${
            isBookmarked 
              ? 'fill-neutral-900 dark:fill-neutral-100 text-neutral-900 dark:text-neutral-100' 
              : 'fill-none text-neutral-600 dark:text-neutral-400'
          } ${isPending ? 'opacity-50' : ''}`}
          stroke="currentColor" 
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
        isBookmarked
          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200'
          : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border-2 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isPending ? (
        <div className="w-5 h-5 spinner" />
      ) : (
        <svg 
          className={`w-5 h-5 transition-all ${
            isBookmarked ? 'fill-current' : 'fill-none'
          }`}
          stroke="currentColor" 
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )}
      <span>{isPending ? 'Saving...' : isBookmarked ? 'Saved' : 'Save for later'}</span>
    </button>
  )
}
