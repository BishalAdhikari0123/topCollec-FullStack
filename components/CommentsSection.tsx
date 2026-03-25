'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { likeComment, deleteComment, createCommentAction } from '@/lib/actions/comments'
import { formatDistanceToNow } from 'date-fns'

interface Profile {
  display_name: string
  avatar_url: string | null
}

interface Comment {
  id: string
  body: string
  created_at: string
  author_name: string
  author_email?: string
  author_id: string | null
  parent_id: string | null
  profiles: Profile | Profile[] | null
}

interface CommentLike {
  comment_id: string
  is_like: boolean
}

interface CommentsProps {
  postId: string
  postSlug: string
  comments: Comment[]
  likes: CommentLike[]
  userLikes: CommentLike[]
  currentUserId: string | null
  postAuthorId: string | null
}

function CommentItem({
  comment,
  postSlug,
  currentUserId,
  postAuthorId,
  likesCount,
  dislikesCount,
  userLike,
  onReply,
  isReply = false,
}: {
  comment: Comment
  postSlug: string
  currentUserId: string | null
  postAuthorId: string | null
  likesCount: number
  dislikesCount: number
  userLike: boolean | null
  onReply: (commentId: string, authorName: string) => void
  isReply?: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const isAuthor = comment.author_id === currentUserId
  const isPostAuthor = comment.author_id === postAuthorId

  const profile = Array.isArray(comment.profiles) 
    ? comment.profiles[0] 
    : comment.profiles

  const handleLike = (isLike: boolean) => {
    startTransition(async () => {
      await likeComment(comment.id, isLike, postSlug)
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await deleteComment(comment.id, postSlug)
      setShowDeleteConfirm(false)
    })
  }

  return (
    <div className={`${isReply ? 'ml-12' : ''} animate-fadeIn`}>
      <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl relative overflow-hidden group border border-neutral-200 dark:border-neutral-800">
        {/* Author Badge */}
        {isPostAuthor && (
          <div className="absolute top-2 right-2">
            <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider rounded-full border-2 border-neutral-300 dark:border-neutral-700">
              ✨ Author
            </span>
          </div>
        )}

          <div className="flex gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={comment.author_name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full border-2 border-neutral-300 dark:border-neutral-700 group-hover:border-neutral-400 dark:group-hover:border-neutral-600 transition-all"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-black dark:bg-white flex items-center justify-center border-2 border-neutral-300 dark:border-neutral-700 group-hover:border-neutral-400 dark:group-hover:border-neutral-600 transition-all">
                  <span className="text-white dark:text-black font-bold text-lg">
                    {comment.author_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-bold text-black dark:text-white text-lg">
                {profile?.display_name || comment.author_name}
              </h4>
              <span className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>

            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              {comment.body}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Like */}
              <button
                onClick={() => handleLike(true)}
                disabled={isPending || !currentUserId}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all font-bold text-sm ${
                  userLike === true
                    ? 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-600 dark:text-green-400'
                    : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-green-500 hover:text-green-600 dark:hover:text-green-400'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <svg className="w-5 h-5" fill={userLike === true ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>{likesCount}</span>
              </button>

              {/* Dislike */}
              <button
                onClick={() => handleLike(false)}
                disabled={isPending || !currentUserId}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all font-bold text-sm ${
                  userLike === false
                    ? 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-600 dark:text-red-400'
                    : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <svg className="w-5 h-5" fill={userLike === false ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
                <span>{dislikesCount}</span>
              </button>

              {/* Reply */}
              {!isReply && currentUserId && (
                <button
                  onClick={() => onReply(comment.id, profile?.display_name || comment.author_name)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all font-bold text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Reply
                </button>
              )}

              {/* Delete */}
              {isAuthor && !showDeleteConfirm && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all font-bold text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              )}

              {showDeleteConfirm && (
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isPending}
                    className="px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-black dark:text-white font-bold text-sm transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommentsSection({
  postId,
  postSlug,
  comments,
  likes,
  userLikes,
  currentUserId,
  postAuthorId,
}: CommentsProps) {
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null)

  // Organize comments into parent and replies
  const parentComments = comments.filter(c => !c.parent_id)
  const getReplies = (parentId: string) => comments.filter(c => c.parent_id === parentId)

  // Calculate like/dislike counts for a comment
  const getCommentStats = (commentId: string) => {
    const commentLikes = likes.filter(l => l.comment_id === commentId)
    const likesCount = commentLikes.filter(l => l.is_like).length
    const dislikesCount = commentLikes.filter(l => !l.is_like).length
    const userLike = userLikes.find(l => l.comment_id === commentId)?.is_like ?? null
    return { likesCount, dislikesCount, userLike }
  }

  const handleReply = (commentId: string, authorName: string) => {
    setReplyTo({ id: commentId, name: authorName })
    document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="mt-16" id="comments">
      <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-8">
        Comments
        <span className="ml-4 text-2xl text-neutral-500 dark:text-neutral-400">({comments.length})</span>
      </h2>

      {/* Comment Form */}
      {currentUserId ? (
        <div className="mb-12" id="comment-form">
          <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
            {replyTo && (
              <div className="mb-4 flex items-center gap-3">
                <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                  Replying to <span className="text-black dark:text-white font-bold">{replyTo.name}</span>
                </span>
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <form action={createCommentAction} className="space-y-4">
              <input type="hidden" name="postId" value={postId} />
              <input type="hidden" name="postSlug" value={postSlug} />
              {replyTo && <input type="hidden" name="parentId" value={replyTo.id} />}
              
              <textarea
                name="body"
                rows={4}
                required
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white rounded-xl text-black dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 transition-all resize-none"
              />
              
              <button
                type="submit"
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="mb-12">
          <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl text-center border border-neutral-200 dark:border-neutral-800">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              You must be signed in to comment
            </p>
            <a
              href={`/login?redirectTo=/posts/${postSlug}`}
              className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all"
            >
              Sign In to Comment
            </a>
          </div>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="bg-neutral-50 dark:bg-neutral-900 p-12 rounded-xl text-center border border-neutral-200 dark:border-neutral-800">
          <svg className="w-16 h-16 mx-auto mb-4 text-neutral-400 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {parentComments.map((comment) => {
            const stats = getCommentStats(comment.id)
            const replies = getReplies(comment.id)
            
            return (
              <div key={comment.id}>
                <CommentItem
                  comment={comment}
                  postSlug={postSlug}
                  currentUserId={currentUserId}
                  postAuthorId={postAuthorId}
                  {...stats}
                  onReply={handleReply}
                />
                
                {/* Replies */}
                {replies.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {replies.map((reply) => {
                      const replyStats = getCommentStats(reply.id)
                      return (
                        <CommentItem
                          key={reply.id}
                          comment={reply}
                          postSlug={postSlug}
                          currentUserId={currentUserId}
                          postAuthorId={postAuthorId}
                          {...replyStats}
                          onReply={handleReply}
                          isReply
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
