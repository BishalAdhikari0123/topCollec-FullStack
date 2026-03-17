import { searchPosts } from '@/lib/actions/posts'
import PostCard from '@/components/PostCard'
import Pagination from '@/components/Pagination'
import Link from 'next/link'

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const params = await searchParams
  const query = params.q || ''
  const page = Number(params.page) || 1
  const { posts, totalPages } = await searchPosts(query, page)

  // Types reflecting the searchPosts selection
  type AuthorProfile = { display_name: string; avatar_url: string | null }
  type SearchPost = {
    id: string | number
    slug: string
    title: string
    excerpt?: string | null
    featured_image?: string | null
    published_at?: string
    reading_time?: number | null
    views?: number | null
    profiles?: AuthorProfile | AuthorProfile[]
  }

  // Map posts to PostCard input while normalizing shapes (profiles can be object or array)
  const mappedPosts = (posts as SearchPost[]).map((post) => {
    const profilesArray = post.profiles
      ? (Array.isArray(post.profiles) ? post.profiles : [post.profiles]).map((p) => ({
          display_name: String(p.display_name),
          avatar_url: p.avatar_url ? String(p.avatar_url) : null,
        }))
      : undefined

    return {
      id: String(post.id),
      slug: String(post.slug),
      title: String(post.title),
      excerpt: post.excerpt ? String(post.excerpt) : null,
      featured_image: post.featured_image ? String(post.featured_image) : null,
      published_at: post.published_at ? String(post.published_at) : new Date().toISOString(),
      reading_time: post.reading_time != null ? Number(post.reading_time) : null,
      views: post.views != null ? Number(post.views) : 0,
      profiles: profilesArray,
      // searchPosts does not return tags; omit post_tags
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50/50 to-white dark:from-neutral-950 dark:via-neutral-900/30 dark:to-neutral-950">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Search
          </Link>
          <h1 className="text-5xl lg:text-6xl font-black text-neutral-900 dark:text-neutral-50 mb-3 tracking-tight">
            Search Results
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-neutral-900 to-neutral-400 dark:from-neutral-100 dark:to-neutral-600 rounded-full mb-3"></div>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            {posts.length} {posts.length === 1 ? 'result' : 'results'} for &quot;{query}&quot;
          </p>
        </div>

        {mappedPosts.length === 0 ? (
          <div className="card rounded-2xl p-12 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-neutral-400 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              No posts found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              No posts found matching your search.
            </p>
            <Link
              href="/search"
              className="btn-primary inline-flex items-center gap-2"
            >
              Try a different search
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {mappedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath={`/search/results?q=${encodeURIComponent(query)}`}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
