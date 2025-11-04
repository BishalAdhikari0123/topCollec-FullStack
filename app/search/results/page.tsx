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

      {posts.length === 0 ? (
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
            {posts.map((post: any) => (
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
