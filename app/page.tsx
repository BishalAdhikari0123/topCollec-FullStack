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
    <div className="min-h-screen bg-[#121212] relative">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Hero Section with Grunge Style */}
        <div className="mb-20 text-center animate-fadeIn relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 blur-3xl"></div>
          <div className="relative">
            <h1 className="text-7xl md:text-8xl font-black mb-6 text-gradient-grunge tracking-tighter leading-none">
              LATEST STORIES
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mb-6 animate-pulse-glow"></div>
            <p className="text-2xl text-gray-400 font-light tracking-wide uppercase">
              Explore • Discover • Immerse
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            {mappedPosts.length === 0 ? (
              <div className="text-center py-32 card-grunge rounded-3xl animate-fadeIn grunge-texture">
                <div className="animate-float">
                  <svg className="w-32 h-32 mx-auto text-purple-900/50 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-500 mb-3 uppercase tracking-wider">No Content Found</h3>
                <p className="text-gray-600 text-lg">
                  Stay tuned for new stories and adventures
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-8">
                  {mappedPosts.map((post, index: number) => (
                    <div 
                      key={post.id} 
                      className="animate-slideIn"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-16 animate-fadeIn">
                    <Pagination currentPage={page} totalPages={totalPages} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-8">
              <div className="card-grunge rounded-2xl p-8 animate-slideInRight grunge-texture overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-purple-500/20 rounded-xl border-2 border-purple-500/30 animate-pulse-glow">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                      About
                    </h2>
                  </div>
                  <div className="h-0.5 w-16 bg-gradient-to-r from-purple-500 to-transparent mb-4"></div>
                  <p className="text-gray-400 leading-relaxed font-light">
                    A curated collection of <span className="text-purple-400 font-bold">short stories</span>, 
                    <span className="text-pink-400 font-bold"> fantasy tales</span>, and 
                    <span className="text-blue-400 font-bold"> interesting lists</span>. 
                    Dive into worlds of imagination and discovery. ✨
                  </p>
                </div>
              </div>

              <div className="card-grunge rounded-2xl p-8 animate-slideInRight grunge-texture overflow-hidden relative" style={{ animationDelay: '0.2s' }}>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-600/10 rounded-full blur-3xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-pink-500/20 rounded-xl border-2 border-pink-500/30 animate-pulse-glow">
                      <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                      Tags
                    </h2>
                  </div>
                  <div className="h-0.5 w-16 bg-gradient-to-r from-pink-500 to-transparent mb-4"></div>
                  <TagCloud tags={popularTags} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
