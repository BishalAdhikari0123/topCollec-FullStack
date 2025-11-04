import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

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

  const totalViews = viewsData?.reduce((sum, post) => sum + (post.views || 0), 0) || 0

  return (
    <div className="min-h-screen bg-[#121212] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-pink-900/5"></div>
      <div className="container mx-auto px-4 py-12 max-w-7xl relative">
        {/* Header */}
        <div className="mb-16 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-6xl font-black text-gradient-grunge mb-3 uppercase tracking-tighter">
                Dashboard
              </h1>
              <p className="text-xl text-gray-400 font-light">Welcome back, <span className="text-purple-400 font-bold">{profile?.display_name || 'Author'}</span>! 🚀</p>
            </div>
            <Link
              href="/admin/posts/new"
              className="btn-grunge text-white rounded-xl font-black tracking-wide text-sm uppercase px-8 py-4 inline-flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Create Post
            </Link>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse-glow"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="card-grunge rounded-2xl p-8 animate-fadeIn grunge-texture overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl group-hover:blur-3xl transition-all"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-purple-500/20 rounded-xl border-2 border-purple-500/30 animate-pulse-glow">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xs font-black text-gray-600 uppercase tracking-wider">Total</span>
              </div>
              <p className="text-5xl font-black text-white mb-2">{postsCount || 0}</p>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-bold">Posts</p>
            </div>
          </div>

          <div className="card-grunge rounded-2xl p-8 animate-fadeIn grunge-texture overflow-hidden relative group" style={{ animationDelay: '0.1s' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-600/10 rounded-full blur-2xl group-hover:blur-3xl transition-all"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-green-500/20 rounded-xl border-2 border-green-500/30 animate-pulse-glow">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-black text-gray-600 uppercase tracking-wider">Live</span>
              </div>
              <p className="text-5xl font-black text-white mb-2">{publishedCount || 0}</p>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-bold">Published</p>
            </div>
          </div>

          <div className="card-grunge rounded-2xl p-8 animate-fadeIn grunge-texture overflow-hidden relative group" style={{ animationDelay: '0.2s' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-600/10 rounded-full blur-2xl group-hover:blur-3xl transition-all"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-yellow-500/20 rounded-xl border-2 border-yellow-500/30 animate-pulse-glow">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-black text-gray-600 uppercase tracking-wider">Drafts</span>
              </div>
              <p className="text-5xl font-black text-white mb-2">{draftCount || 0}</p>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-bold">In Progress</p>
            </div>
          </div>

          <div className="card-grunge rounded-2xl p-8 animate-fadeIn grunge-texture overflow-hidden relative group" style={{ animationDelay: '0.3s' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl group-hover:blur-3xl transition-all"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-blue-500/20 rounded-xl border-2 border-blue-500/30 animate-pulse-glow">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="text-xs font-black text-gray-600 uppercase tracking-wider">Views</span>
              </div>
              <p className="text-5xl font-black text-white mb-2">{totalViews.toLocaleString()}</p>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-bold">Total Views</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link
            href="/admin/posts"
            className="group card-grunge rounded-2xl p-8 animate-slideIn grunge-texture overflow-hidden relative hover:scale-105 transition-transform"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl group-hover:blur-3xl transition-all"></div>
            <div className="flex items-start gap-4 relative">
              <div className="p-4 bg-purple-500/20 rounded-xl border-2 border-purple-500/30 group-hover:border-purple-400 transition-all">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2 group-hover:text-gradient-grunge uppercase tracking-tight">
                  Manage Posts
                </h3>
                <p className="text-gray-400 text-sm font-medium">
                  Create, edit, and organize your blog posts
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/comments"
            className="group card-grunge rounded-2xl p-8 animate-slideIn grunge-texture overflow-hidden relative hover:scale-105 transition-transform"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/20 rounded-full blur-2xl group-hover:blur-3xl transition-all"></div>
            <div className="flex items-start gap-4 relative">
              <div className="p-4 bg-pink-500/20 rounded-xl border-2 border-pink-500/30 group-hover:border-pink-400 transition-all">
                <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2 group-hover:text-gradient-grunge uppercase tracking-tight">
                  Comments
                  {commentsCount && commentsCount > 0 && (
                    <span className="ml-2 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30 font-bold">
                      {commentsCount} pending
                    </span>
                  )}
                </h3>
                <p className="text-gray-400 text-sm font-medium">
                  Moderate and respond to comments
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="group card-grunge rounded-2xl p-8 animate-slideIn grunge-texture overflow-hidden relative hover:scale-105 transition-transform"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/20 rounded-full blur-2xl group-hover:blur-3xl transition-all"></div>
            <div className="flex items-start gap-4 relative">
              <div className="p-4 bg-green-500/20 rounded-xl border-2 border-green-500/30 group-hover:border-green-400 transition-all">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2 group-hover:text-gradient-grunge uppercase tracking-tight">
                  View Site
                </h3>
                <p className="text-gray-400 text-sm font-medium">
                  See your blog as visitors do
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

