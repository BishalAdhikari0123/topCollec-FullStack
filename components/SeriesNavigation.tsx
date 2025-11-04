'use client'

import Link from 'next/link'
import { useState } from 'react'

interface SeriesNavigationProps {
  series: {
    id: string
    title: string
    slug: string
  }
  previous: {
    title: string
    slug: string
    series_order: number
  } | null
  next: {
    title: string
    slug: string
    series_order: number
  } | null
  currentOrder: number
  currentIndex: number
  totalPosts: number
}

export default function SeriesNavigation({
  series,
  previous,
  next,
  currentOrder,
  currentIndex,
  totalPosts
}: SeriesNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const progressPercentage = (currentIndex / totalPosts) * 100

  return (
    <div className="card-grunge rounded-xl p-6 mb-8 animate-fadeIn">
      {/* Series Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4.41 0-8-3.59-8-8V8.5l8-4.5 8 4.5V12c0 4.41-3.59 8-8 8z"/>
              <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            <span className="text-gray-400 text-sm font-bold uppercase tracking-wide">
              Part {currentIndex} of {totalPosts}
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-400 hover:text-pink-400 transition-colors"
            aria-label={isExpanded ? 'Collapse series' : 'Expand series'}
          >
            <svg 
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <Link
          href={`/series/${series.slug}`}
          className="text-xl font-black text-white hover:text-gradient-grunge transition-all inline-block"
        >
          {series.title}
        </Link>

        {/* Progress Bar */}
        <div className="mt-3 relative h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      {!isExpanded && (
        <div className="flex gap-3">
          {previous ? (
            <Link
              href={`/posts/${previous.slug}`}
              className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
            >
              <svg className="w-5 h-5 text-purple-400 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="flex-1 text-left">
                <div className="text-xs text-gray-500 font-bold uppercase">Previous</div>
                <div className="text-sm text-white font-medium truncate">{previous.title}</div>
              </div>
            </Link>
          ) : (
            <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-900/50 rounded-lg opacity-50 cursor-not-allowed">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="flex-1 text-left">
                <div className="text-xs text-gray-600 font-bold uppercase">Previous</div>
                <div className="text-sm text-gray-600 font-medium">First chapter</div>
              </div>
            </div>
          )}

          {next ? (
            <Link
              href={`/posts/${next.slug}`}
              className="flex-1 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all group"
            >
              <div className="flex-1 text-right">
                <div className="text-xs text-purple-100 font-bold uppercase">Next</div>
                <div className="text-sm text-white font-medium truncate">{next.title}</div>
              </div>
              <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-900/50 rounded-lg opacity-50 cursor-not-allowed">
              <div className="flex-1 text-right">
                <div className="text-xs text-gray-600 font-bold uppercase">Next</div>
                <div className="text-sm text-gray-600 font-medium">Last chapter</div>
              </div>
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* View All Series Link */}
      {isExpanded && (
        <Link
          href={`/series/${series.slug}`}
          className="block w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-center rounded-lg transition-colors uppercase tracking-wide"
        >
          View All {totalPosts} Chapters →
        </Link>
      )}
    </div>
  )
}
