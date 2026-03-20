import { getUserBookmarks } from '@/lib/actions/bookmarks'
import PostCard from '@/components/PostCard'
import Pagination from '@/components/Pagination'
import Link from 'next/link'

export const metadata = {
  title: 'Saved Posts - Bookmarks',
  description: 'Your saved posts for later reading',
}

export default async function BookmarksPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string }> 
}) {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const { posts, count, totalPages } = await getUserBookmarks(page)

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl lg:text-6xl font-black text-neutral-900 dark:text-neutral-50 mb-4">
            Saved Posts
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {count > 0 ? `${count} ${count === 1 ? 'post' : 'posts'} saved for later` : 'No saved posts yet'}
          </p>
        </div>

        {posts && posts.length > 0 ? (
          <>
            <div className="grid gap-8 mb-12">
              {posts.map((post) => (
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              No bookmarks yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Save posts to read later by clicking the bookmark icon
            </p>
            <Link
              href="/"
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Browse Posts
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
