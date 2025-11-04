import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import DeletePostButton from '@/components/admin/DeletePostButton'

export default async function AdminPostsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin/posts')
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#121212] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-pink-900/5"></div>
      <div className="container mx-auto px-4 py-12 max-w-7xl relative">
        <div className="flex justify-between items-center mb-12 animate-fadeIn">
          <div>
            <h1 className="text-5xl font-black text-gradient-grunge mb-3 uppercase tracking-tighter">Manage Posts</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 mb-3"></div>
            <p className="text-gray-400 text-lg font-light">Create and manage your content</p>
          </div>
          <Link
            href="/admin/posts/new"
            className="btn-grunge text-white rounded-xl font-black tracking-wide text-sm uppercase px-8 py-4 inline-flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </Link>
        </div>

        <div className="grid gap-6">
          {posts && posts.length > 0 ? (
            posts.map((post, index) => (
              <div
                key={post.id}
                className="card-grunge rounded-2xl p-8 animate-slideIn grunge-texture relative overflow-hidden group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl group-hover:blur-3xl transition-all"></div>
                <div className="flex items-start justify-between gap-6 relative">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h2 className="text-2xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all uppercase tracking-tight">{post.title}</h2>
                      <span
                        className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${
                          post.status === 'published'
                            ? 'bg-green-500/20 text-green-400 border-2 border-green-500/30'
                            : post.status === 'draft'
                            ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-2 border-gray-500/30'
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4 line-clamp-2 font-light">{post.excerpt}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500 font-bold uppercase tracking-wide">
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(post.created_at)}
                      </span>
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {post.views} views
                      </span>
                      {post.reading_time && (
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {post.reading_time} min
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {post.status === 'published' && (
                      <Link
                        href={`/posts/${post.slug}`}
                        target="_blank"
                        className="p-3 bg-black/30 hover:bg-black/50 text-purple-400 rounded-xl transition-all border-2 border-purple-900/30 hover:border-purple-500/50"
                        title="View post"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    )}
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="p-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-xl transition-all border-2 border-purple-500/30 hover:border-purple-500/50"
                      title="Edit post"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <DeletePostButton postId={post.id} postTitle={post.title} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 card-grunge rounded-3xl animate-fadeIn grunge-texture">
              <div className="animate-float">
                <svg className="w-32 h-32 mx-auto text-purple-900/30 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-500 mb-3 uppercase tracking-wider">No Posts Yet</h3>
              <p className="text-gray-600 mb-8 text-lg">Create your first masterpiece to get started</p>
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
          )}
        </div>
      </div>
    </div>
  )
}
