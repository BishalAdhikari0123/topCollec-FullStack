import { getAuthorById, getAuthorPosts, getAuthorStats } from '@/lib/actions/authors'
import { notFound } from 'next/navigation'
import PostCard from '@/components/PostCard'
import Pagination from '@/components/Pagination'
import Image from 'next/image'
import { normalizePostForCard } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const author = await getAuthorById(resolvedParams.id)
  
  if (!author) {
    return {
      title: 'Author Not Found'
    }
  }

  return {
    title: `${author.display_name} - Author`,
    description: author.bio || `Posts by ${author.display_name}`,
  }
}

export default async function AuthorPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  const page = Number(resolvedSearchParams.page) || 1
  const author = await getAuthorById(resolvedParams.id)

  if (!author) {
    notFound()
  }

  const { posts, totalPages } = await getAuthorPosts(resolvedParams.id, page)
  const mappedPosts = posts.map(post => normalizePostForCard(post))
  const stats = await getAuthorStats(resolvedParams.id)

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Author Header */}
        <div className="card rounded-2xl p-8 lg:p-12 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {author.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt={author.display_name}
                  className="w-32 h-32 rounded-full border-4 border-neutral-200 dark:border-neutral-800 shadow-lg object-cover"
                  width={128}
                  height={128}
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-neutral-200 dark:bg-neutral-800 border-4 border-neutral-300 dark:border-neutral-700 flex items-center justify-center">
                  <svg className="w-16 h-16 text-neutral-400 dark:text-neutral-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-black text-neutral-900 dark:text-neutral-50 mb-3">
                {author.display_name}
              </h1>
              
              {author.username && (
                <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-4">
                  @{author.username}
                </p>
              )}

              {author.bio && (
                <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                  {author.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-bold text-neutral-900 dark:text-neutral-50">
                    {stats.postsCount}
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {stats.postsCount === 1 ? 'post' : 'posts'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="font-bold text-neutral-900 dark:text-neutral-50">
                    {stats.totalViews.toLocaleString()}
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    total views
                  </span>
                </div>

                {stats.seriesCount > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="font-bold text-neutral-900 dark:text-neutral-50">
                      {stats.seriesCount}
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {stats.seriesCount === 1 ? 'series' : 'series'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-neutral-900 dark:text-neutral-50 mb-6">
            Published Posts
          </h2>
        </div>

        {mappedPosts && mappedPosts.length > 0 ? (
          <>
            <div className="grid gap-8 mb-12">
              {mappedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination currentPage={page} totalPages={totalPages} />
            )}
          </>
        ) : (
          <div className="card rounded-2xl p-12 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 text-center">
            <svg className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              No posts yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {author.display_name} hasn&apos;t published any posts yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
