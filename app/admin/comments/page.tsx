import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { approveComment } from '@/lib/actions/comments'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Manage Comments',
  description: 'Moderate and manage blog comments',
}

export default async function CommentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin/comments')
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin, id, name')
    .eq('id', user.id)
    .single()

  if (profileError) {
    await supabase
      .from('profiles')
      .insert({ id: user.id, is_admin: false })
    redirect('/')
  }

  if (!profile?.is_admin) {
    redirect('/')
  }

  // Get all comments with post info
  let allComments
  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select(`
      id,
      body,
      created_at,
      author_name,
      is_approved,
      posts (
        id,
        title,
        slug
      ),
      profiles:author_id (
        name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  if (commentsError) {
    const result = await supabase
      .from('comments')
      .select(`
        id,
        body,
        created_at,
        author_name,
        is_approved,
        posts (
          id,
          title,
          slug
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100)
    
    allComments = result.data?.map(c => ({ ...c, profiles: [] })) || []
  } else {
    allComments = comments || []
  }

  // Comment likes count
  let likesData: Array<{ comment_id: string; is_like: boolean }> = []
  try {
    const { data } = await supabase
      .from('comment_likes')
      .select('comment_id, is_like')
    likesData = data || []
  } catch {
    console.warn('comment_likes table not found')
  }

  const getLikeStats = (commentId: string) => {
    const commentLikes = likesData.filter(l => l.comment_id === commentId)
    const likes = commentLikes.filter(l => l.is_like).length
    const dislikes = commentLikes.filter(l => !l.is_like).length
    return { likes, dislikes }
  }

  interface CommentData {
    id: string
    body: string
    created_at: string
    author_name: string
    is_approved: boolean
    posts: Array<{ id: string; title: string; slug: string }>
    profiles: Array<{ name: string; avatar_url: string | null }>
  }

  const pendingComments = allComments.filter((c: CommentData) => !c.is_approved)
  const approvedComments = allComments.filter((c: CommentData) => c.is_approved)

  return (
    <div className="min-h-screen bg-[#121212] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10"></div>
      
      <div className="container mx-auto px-4 py-12 relative">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-gradient-grunge uppercase tracking-tight mb-4">
            Manage Comments
          </h1>
          <p className="text-gray-400 text-lg font-medium">
            Moderate and manage user comments
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/** Total Comments */}
          <div className="card-grunge p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-2">Total Comments</p>
                <p className="text-4xl font-black text-white">{allComments.length}</p>
              </div>
              <div className="p-4 bg-purple-500/20 rounded-xl border-2 border-purple-500/30">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
          </div>

          {/** Pending */}
          <div className="card-grunge p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-2">Pending</p>
                <p className="text-4xl font-black text-white">{pendingComments.length}</p>
              </div>
              <div className="p-4 bg-yellow-500/20 rounded-xl border-2 border-yellow-500/30">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/** Approved */}
          <div className="card-grunge p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-2">Approved</p>
                <p className="text-4xl font-black text-white">{approvedComments.length}</p>
              </div>
              <div className="p-4 bg-green-500/20 rounded-xl border-2 border-green-500/30">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Comments */}
        {pendingComments.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-6">
              Pending Approval
            </h2>
            <div className="space-y-4">
              {pendingComments.map((comment: CommentData) => {
                const { likes, dislikes } = getLikeStats(comment.id)
                const profile = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles
                const post = Array.isArray(comment.posts) ? comment.posts[0] : comment.posts

                return (
                  <div key={comment.id} className="card-grunge p-6 rounded-xl animate-fadeIn">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {profile?.avatar_url ? (
                          <Image
                            src={profile.avatar_url}
                            alt={comment.author_name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full border-2 border-yellow-500/50"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center border-2 border-yellow-500/50">
                            <span className="text-white font-black text-lg">
                              {comment.author_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-black text-white text-lg">
                            {profile?.name || comment.author_name}
                          </h4>
                          <span className="text-gray-500 text-sm font-medium">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                          {post && (
                            <Link
                              href={`/posts/${post.slug}`}
                              className="text-purple-400 hover:text-pink-400 text-sm font-bold transition-colors"
                            >
                              on &quot;{post.title}&quot;
                            </Link>
                          )}
                        </div>

                        <p className="text-gray-300 mb-4 font-medium">{comment.body}</p>

                        <div className="flex items-center gap-4">
                          <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            {likes}
                          </span>
                          <span className="text-red-400 text-sm font-bold flex items-center gap-1">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                            </svg>
                            {dislikes}
                          </span>

                          {/* Fixed form action */}
                          <form
                            action={async () => {
                              'use server'
                              await approveComment(comment.id)
                            }}
                            className="ml-auto"
                          >
                            <button
                              type="submit"
                              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-black uppercase text-sm rounded-lg transition-all"
                            >
                              Approve
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* All Comments */}
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-6">
            All Comments
          </h2>
          {approvedComments.length === 0 ? (
            <div className="card-grunge p-12 rounded-xl text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500 font-medium text-lg">No approved comments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {approvedComments.map((comment: CommentData) => {
                const { likes, dislikes } = getLikeStats(comment.id)
                const profile = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles
                const post = Array.isArray(comment.posts) ? comment.posts[0] : comment.posts

                return (
                  <div key={comment.id} className="card-grunge p-6 rounded-xl animate-fadeIn">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {profile?.avatar_url ? (
                          <Image
                            src={profile.avatar_url}
                            alt={comment.author_name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full border-2 border-purple-500/30"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center border-2 border-purple-500/30">
                            <span className="text-white font-black text-lg">
                              {comment.author_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-black text-white text-lg">
                            {profile?.name || comment.author_name}
                          </h4>
                          <span className="text-gray-500 text-sm font-medium">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                          {post && (
                            <Link
                              href={`/posts/${post.slug}`}
                              className="text-purple-400 hover:text-pink-400 text-sm font-bold transition-colors"
                            >
                              on &quot;{post.title}&quot;
                            </Link>
                          )}
                        </div>

                        <p className="text-gray-300 mb-4 font-medium">{comment.body}</p>

                        <div className="flex items-center gap-4">
                          <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            {likes}
                          </span>
                          <span className="text-red-400 text-sm font-bold flex items-center gap-1">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                            </svg>
                            {dislikes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
