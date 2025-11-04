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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/search"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Back to Search
        </Link>
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          Search Results
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? 'result' : 'results'} for &quot;{query}&quot;
        </p>
      </div>

      {mappedPosts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No posts found matching your search.
          </p>
          <Link
            href="/search"
            className="text-primary-600 hover:text-primary-700 underline"
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
  )
}
