import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import DeletePostButton from '@/components/admin/DeletePostButton'

export default async function AdminPostsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin/posts')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/')
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  const postsList = posts ?? []

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50/50 to-white dark:from-neutral-950 dark:via-neutral-900/30 dark:to-neutral-950">
      <div className="container mx-auto px-4 py-12 lg:py-16 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-fade-in">
          <div>
            <h1 className="text-5xl lg:text-6xl font-black text-neutral-900 dark:text-neutral-50 mb-3 tracking-tight">Manage Posts</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-neutral-900 to-neutral-400 dark:from-neutral-100 dark:to-neutral-600 rounded-full mb-3"></div>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">Create and manage your content</p>
          </div>
          <Link
            href="/admin/posts/new"
            className="btn-primary text-base px-6 py-3 inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </Link>
        </div>

        <div className="grid gap-6">
          {postsList.length > 0 ? (
            postsList.map((post, index) => (
              <div
                key={post.id}
                className="card rounded-2xl p-6 lg:p-8 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all animate-slideInLeft group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h2 className="text-xl lg:text-2xl font-black text-neutral-900 dark:text-neutral-50 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neutral-900 group-hover:to-neutral-600 dark:group-hover:from-neutral-100 dark:group-hover:to-neutral-400 transition-all">
                        {post.title}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm ${
                          post.status === 'published'
                            ? 'bg-green-500 text-white'
                            : post.status === 'draft'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-neutral-500 text-white'
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(post.created_at)}
                      </span>
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {post.views} views
                      </span>
                      {post.reading_time && (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {post.reading_time} min
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 lg:gap-3">
                    {post.status === 'published' && (
                      <Link
                        href={`/posts/${post.slug}`}
                        target="_blank"
                        className="p-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-xl transition-all border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md"
                        title="View post"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    )}
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="p-3 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-xl transition-all shadow-sm hover:shadow-md"
                      title="Edit post"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <DeletePostButton postId={post.id} postTitle={post.title} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 lg:py-24 card rounded-3xl bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg animate-fade-in">
              <div className="animate-bounce-slow">
                <svg className="w-24 h-24 lg:w-32 lg:h-32 mx-auto text-neutral-300 dark:text-neutral-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mb-3">No Posts Yet</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8 text-lg">Create your first masterpiece to get started</p>
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
          )}
        </div>
      </div>
    </div>
  )
}
