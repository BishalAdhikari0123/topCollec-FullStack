import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSeriesBySlug, getSeriesPosts } from '@/lib/actions/series'
import { formatDate } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const series = await getSeriesBySlug(slug)

  if (!series) {
    return {
      title: 'Series Not Found',
    }
  }

  return {
    title: series.title,
    description: series.description || undefined,
  }
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const series = await getSeriesBySlug(slug)

  if (!series) {
    notFound()
  }

  const posts = await getSeriesPosts(series.id)

  return (
    <div className="min-h-screen bg-[#121212] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10"></div>
      
      <div className="container mx-auto px-4 py-12 relative max-w-5xl">
        {/* Series Header */}
        <div className="card-grunge rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover Image */}
            {series.cover_image && (
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="relative h-80 w-full rounded-lg overflow-hidden">
                  <Image
                    src={series.cover_image}
                    alt={series.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Series Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                {series.title}
              </h1>

              {series.description && (
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  {series.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                {series.profiles && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span className="text-gray-400 font-medium">
                      By {series.profiles.display_name || 'Anonymous'}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                  </svg>
                  <span className="text-gray-400 font-medium">
                    {posts.length} {posts.length === 1 ? 'Chapter' : 'Chapters'}
                  </span>
                </div>
              </div>

              {posts.length > 0 && (
                <Link
                  href={`/posts/${posts[0].slug}`}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all uppercase tracking-wide"
                >
                  Start Reading
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-6">
            All Chapters
          </h2>

          {posts.length === 0 ? (
            <div className="card-grunge p-8 rounded-xl text-center">
              <p className="text-gray-400">No chapters published yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post: any, index: number) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="block card-grunge p-6 rounded-xl hover:scale-[1.02] transition-transform group"
                >
                  <div className="flex gap-4">
                    {/* Chapter Number */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <span className="text-white font-black text-2xl">
                          {post.series_order || index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Chapter Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-black text-white group-hover:text-gradient-grunge transition-colors mb-2">
                        {post.title}
                      </h3>
                      
                      {post.excerpt && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {post.published_at && (
                          <span>{formatDate(post.published_at)}</span>
                        )}
                        {post.reading_time && (
                          <>
                            <span>•</span>
                            <span>{post.reading_time} min read</span>
                          </>
                        )}
                        {post.views > 0 && (
                          <>
                            <span>•</span>
                            <span>{post.views} views</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0 flex items-center">
                      <svg 
                        className="w-6 h-6 text-purple-400 group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
