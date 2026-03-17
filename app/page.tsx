import Link from 'next/link'
import { getPublishedPosts, getPopularTags } from '@/lib/actions/posts'
import PostCard from '@/components/PostCard'
import Pagination from '@/components/Pagination'
import TagCloud from '@/components/TagCloud'

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const { posts, totalPages } = await getPublishedPosts(page)
  const popularTags = await getPopularTags(15)

  // Map posts to correct types for PostCard
  const mappedPosts = posts.map(post => ({
    ...post,
    id: String(post.id),
    slug: String(post.slug),
    title: String(post.title),
    excerpt: post.excerpt ? String(post.excerpt) : null,
    featured_image: post.featured_image ? String(post.featured_image) : null,
    published_at: String(post.published_at),
    reading_time: post.reading_time ? Number(post.reading_time) : null,
    views: post.views ? Number(post.views) : 0,
    // profiles can be a single object or an array depending on the join; normalize to array of objects
    profiles: post.profiles
      ? (Array.isArray(post.profiles) ? post.profiles : [post.profiles]).map(
          (p: { display_name: string; avatar_url: string | null }) => ({
            display_name: String(p.display_name),
            avatar_url: p.avatar_url ? String(p.avatar_url) : null,
          })
        )
      : undefined,
    // Normalize tags to an array before mapping
    post_tags: post.post_tags?.map((pt: { tags: Array<{ id: string; name: string; slug: string }> | { id: string; name: string; slug: string } }) => ({
      tags: (Array.isArray(pt.tags) ? pt.tags : [pt.tags]).map((t) => ({
        id: String(t.id),
        name: String(t.name),
        slug: String(t.slug),
      })),
    })),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50/50 to-white dark:from-neutral-950 dark:via-neutral-900/30 dark:to-neutral-950">
      <div className="container mx-auto px-4 py-12 lg:py-20 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-16 lg:mb-20 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neutral-200/30 dark:bg-neutral-800/20 rounded-full blur-3xl -z-10" />
          <h1 className="heading-xl mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-neutral-50 dark:via-neutral-300 dark:to-neutral-50">
            Latest Stories
          </h1>
          <p className="body-lg max-w-2xl mx-auto text-neutral-600 dark:text-neutral-400 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Discover compelling narratives, explore different perspectives, and immerse yourself in the art of storytelling.
          </p>
          <div className="flex justify-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link href="/series" className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg hover:shadow-xl">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
              Explore Series
            </Link>
            <Link href="/tags" className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-xl font-semibold hover:border-neutral-900 dark:hover:border-neutral-100 hover:scale-105 transition-all shadow-md hover:shadow-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Browse Tags
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            {mappedPosts.length === 0 ? (
              <div className="text-center py-20 card">
                <svg className="w-16 h-16 mx-auto text-neutral-300 dark:text-neutral-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="heading-sm mb-2">No Posts Yet</h3>
                <p className="body">
                  Check back soon for new stories
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {mappedPosts.map((post, index: number) => (
                    <div 
                      key={post.id} 
                      className="animate-slide-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-12 animate-fade-in">
                    <Pagination currentPage={page} totalPages={totalPages} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* About Card */}
              <div className="card rounded-2xl p-8 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-neutral-900 dark:bg-neutral-100 rounded-xl shadow-md">
                    <svg className="w-7 h-7 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
                    About
                  </h2>
                </div>
                <div className="h-1 w-16 bg-gradient-to-r from-neutral-900 to-neutral-400 dark:from-neutral-100 dark:to-neutral-600 rounded-full mb-6"></div>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                  A curated collection of <span className="font-bold text-neutral-900 dark:text-neutral-100">short stories</span>, 
                  <span className="font-bold text-neutral-900 dark:text-neutral-100"> fantasy tales</span>, and 
                  <span className="font-bold text-neutral-900 dark:text-neutral-100"> creative writing</span>. 
                  Dive into worlds of imagination and discovery.
                </p>
              </div>

              {/* Tags Card */}
              <div className="card rounded-2xl p-8 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-neutral-900 dark:bg-neutral-100 rounded-xl shadow-md">
                    <svg className="w-7 h-7 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-black text neutral-900 dark:text-neutral-50">
                    Popular Tags
                  </h2>
                </div>
                <div className="h-1 w-16 bg-gradient-to-r from-neutral-900 to-neutral-400 dark:from-neutral-100 dark:to-neutral-600 rounded-full mb-6"></div>
                <TagCloud tags={popularTags} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
