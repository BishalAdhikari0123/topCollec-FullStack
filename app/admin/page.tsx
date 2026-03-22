import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin')
  }

  // Get user profile (explicit row type to satisfy TypeScript)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, email, is_admin, display_name')
    .eq('id', user.id)
    .single<{ id: string; username: string | null; email: string | null; is_admin: boolean; display_name: string | null }>()

  // Get user stats
  const { count: postsCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', user.id)

  const { count: publishedCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', user.id)
    .eq('status', 'published')

  const { count: draftCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', user.id)
    .eq('status', 'draft')

  const { count: commentsCount } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('is_approved', false)

  // Get total views
  const { data: viewsData } = await supabase
    .from('posts')
    .select('views')
    .eq('author_id', user.id)

  // Help TypeScript understand the shape of the views rows even if the
  // generated Database type doesn't explicitly define the posts table.
  const viewsRows = (viewsData ?? []) as Array<{ views: number | null }>
  const totalViews = viewsRows.reduce((sum, post) => sum + (post.views ?? 0), 0)

  // Get recent popular posts
  const { data: popularPosts } = await supabase
    .from('posts')
    .select('id, title, slug, views, published_at')
    .eq('author_id', user.id)
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(5)

  const typedPopularPosts = (popularPosts ?? []) as Array<{
    id: string
    title: string
    slug: string
    views: number | null
    published_at: string | null
  }>

  // Get all post IDs for this author once, and reuse for comment/bookmark counts
  const { data: authorPosts } = await supabase
    .from('posts')
    .select('id')
    .eq('author_id', user.id)

  const authorPostIds = (authorPosts ?? []).map((p: any) => p.id as string)

  // Get total comment count across all posts
  const { count: allCommentsCount } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .in('post_id', authorPostIds)

  // Get bookmark count for user's posts
  const { count: bookmarksCount } = await supabase
    .from('bookmarks')
    .select('*', { count: 'exact', head: true })
    .in('post_id', authorPostIds)

  // Get series count
  const { count: seriesCount } = await supabase
    .from('series')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', user.id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50/50 to-white dark:from-neutral-950 dark:via-neutral-900/30 dark:to-neutral-950">
      <div className="container mx-auto px-4 py-12 lg:py-16 max-w-7xl">
        {/* Header */}
        <div className="mb-12 lg:mb-16 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl lg:text-6xl font-black text-neutral-900 dark:text-neutral-50 mb-3 tracking-tight">
                Dashboard
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">Welcome back, <span className="font-bold text-neutral-900 dark:text-neutral-100">{profile?.display_name || 'Author'}</span>!</p>
            </div>
            <Link
              href="/admin/posts/new"
              className="btn-primary text-base px-6 py-3 inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Post
            </Link>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-neutral-900 to-neutral-400 dark:from-neutral-100 dark:to-neutral-600 rounded-full"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 lg:mb-16">
          <div className="card rounded-2xl p-6 lg:p-8 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all animate-fade-in group">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-neutral-900 dark:bg-neutral-100 rounded-xl shadow-md">
                <svg className="w-7 h-7 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Total</span>
            </div>
            <p className="text-4xl lg:text-5xl font-black text-neutral-900 dark:text-neutral-50 mb-2">{postsCount || 0}</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-semibold">Posts</p>
          </div>

          <div className="card rounded-2xl p-6 lg:p-8 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all animate-fade-in group" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-green-600 dark:bg-green-500 rounded-xl shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Live</span>
            </div>
            <p className="text-4xl lg:text-5xl font-black text-neutral-900 dark:text-neutral-50 mb-2">{publishedCount || 0}</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-semibold">Published</p>
          </div>

          <div className="card rounded-2xl p-6 lg:p-8 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all animate-fade-in group" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-yellow-600 dark:bg-yellow-500 rounded-xl shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Drafts</span>
            </div>
            <p className="text-4xl lg:text-5xl font-black text-neutral-900 dark:text-neutral-50 mb-2">{draftCount || 0}</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-semibold">In Progress</p>
          </div>

          <div className="card rounded-2xl p-6 lg:p-8 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all animate-fade-in group" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-blue-600 dark:bg-blue-500 rounded-xl shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Views</span>
            </div>
            <p className="text-4xl lg:text-5xl font-black text-neutral-900 dark:text-neutral-50 mb-2">{totalViews.toLocaleString()}</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-semibold">Total Views</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link
            href="/admin/posts"
            className="group card rounded-2xl p-6 lg:p-8 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-2xl transition-all hover:scale-105 animate-slideInLeft"
          >
            <div className="flex items-start gap-4">
              <div className="p-4 bg-neutral-900 dark:bg-neutral-100 rounded-xl shadow-md group-hover:shadow-lg transition-all">
                <svg className="w-7 h-7 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-50 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neutral-900 group-hover:to-neutral-600 dark:group-hover:from-neutral-100 dark:group-hover:to-neutral-400 transition-all">
                  Manage Posts
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">
                  Create, edit, and organize your blog posts
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/comments"
            className="group card rounded-2xl p-6 lg:p-8 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-2xl transition-all hover:scale-105 animate-slideInLeft"
            style={{ animationDelay: '0.05s' }}
          >
            <div className="flex items-start gap-4">
              <div className="p-4 bg-neutral-900 dark:bg-neutral-100 rounded-xl shadow-md group-hover:shadow-lg transition-all">
                <svg className="w-7 h-7 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-50 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neutral-900 group-hover:to-neutral-600 dark:group-hover:from-neutral-100 dark:group-hover:to-neutral-400 transition-all">
                  Comments
                  {commentsCount && commentsCount > 0 && (
                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold shadow-sm">
                      {commentsCount} pending
                    </span>
                  )}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">
                  Moderate and respond to comments
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/series"
            className="group card rounded-2xl p-6 lg:p-8 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-2xl transition-all hover:scale-105 animate-slideInLeft"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex items-start gap-4">
              <div className="p-4 bg-neutral-900 dark:bg-neutral-100 rounded-xl shadow-md group-hover:shadow-lg transition-all">
                <svg className="w-7 h-7 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-50 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neutral-900 group-hover:to-neutral-600 dark:group-hover:from-neutral-100 dark:group-hover:to-neutral-400 transition-all">
                  Series
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">
                  Organize posts into series
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="group card rounded-2xl p-6 lg:p-8 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-2xl transition-all hover:scale-105 animate-slideInLeft"
            style={{ animationDelay: '0.15s' }}
          >
            <div className="flex items-start gap-4">
              <div className="p-4 bg-neutral-900 dark:bg-neutral-100 rounded-xl shadow-md group-hover:shadow-lg transition-all">
                <svg className="w-7 h-7 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-50 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neutral-900 group-hover:to-neutral-600 dark:group-hover:from-neutral-100 dark:group-hover:to-neutral-400 transition-all">
                  View Site
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">
                  See your blog as visitors do
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Enhanced Analytics Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-6">Analytics Overview</h2>
          
          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-neutral-600 dark:text-neutral-400 uppercase">Comments</h3>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white mb-1">{allCommentsCount || 0}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total engagement</p>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-neutral-600 dark:text-neutral-400 uppercase">Bookmarks</h3>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white mb-1">{bookmarksCount || 0}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Posts saved by readers</p>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-neutral-600 dark:text-neutral-400 uppercase">Series</h3>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white mb-1">{seriesCount || 0}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Content collections</p>
            </div>
          </div>

          {/* Popular Posts */}
          {typedPopularPosts.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Top Performing Posts
              </h3>
              <div className="space-y-3">
                {typedPopularPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-600 dark:text-neutral-400 group-hover:bg-black group-hover:dark:bg-white group-hover:text-white group-hover:dark:text-black transition-colors">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-black dark:text-white font-medium truncate group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                          {post.title}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString()
                            : 'Unpublished'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="font-bold">{post.views?.toLocaleString() || 0}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

