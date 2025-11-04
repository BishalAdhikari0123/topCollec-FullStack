import { getAllSeries } from '@/lib/actions/series'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Story Series',
  description: 'Browse all story series and collections',
}

export default async function SeriesPage() {
  const allSeries = await getAllSeries()

  return (
    <div className="min-h-screen bg-[#121212] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10"></div>
      
      <div className="container mx-auto px-4 py-12 relative">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-gradient-grunge uppercase tracking-tight mb-4">
            Story Series
          </h1>
          <p className="text-gray-400 text-lg font-medium">
            Explore our collection of serialized stories and multi-part narratives
          </p>
        </div>

        {/* Series Grid */}
        {allSeries.length === 0 ? (
          <div className="card-grunge p-12 rounded-xl text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No Series Yet</h3>
            <p className="text-gray-400">Check back soon for new story series!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allSeries.map((series: {id: string; slug: string; title: string; description: string | null; cover_image: string | null; post_count: number}) => (
              <Link
                key={series.id}
                href={`/series/${series.slug}`}
                className="group card-grunge rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                {/* Cover Image */}
                {series.cover_image ? (
                  <div className="relative h-48 w-full">
                    <Image
                      src={series.cover_image}
                      alt={series.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                    <svg className="w-16 h-16 text-purple-400/50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4.41 0-8-3.59-8-8V8.5l8-4.5 8 4.5V12c0 4.41-3.59 8-8 8z"/>
                    </svg>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-black text-white group-hover:text-gradient-grunge transition-colors mb-2">
                    {series.title}
                  </h2>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {series.description || 'A captivating story series'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                      </svg>
                      <span className="text-sm font-bold text-gray-300">
                        {series.post_count} {series.post_count === 1 ? 'Chapter' : 'Chapters'}
                      </span>
                    </div>

                    <span className="text-purple-400 group-hover:text-pink-400 font-bold text-sm flex items-center gap-1">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
