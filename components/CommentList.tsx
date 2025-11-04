import Image from 'next/image'
import { formatDate } from '@/lib/utils'

interface CommentData {
  id: string
  body: string
  created_at: string
  author_name: string | null
  profiles?: {
    display_name: string
    avatar_url: string | null
  }[] | null
}

interface CommentListProps {
  comments: CommentData[]
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
        No comments yet. Be the first to comment!
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => {
        const profile = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles
        
        return (
          <div
            key={comment.id}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
          >
            <div className="flex items-start gap-4">
              {profile?.avatar_url && (
                <Image
                  src={profile.avatar_url}
                  alt={profile.display_name || 'User'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {profile?.display_name || comment.author_name || 'Anonymous'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.body}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
