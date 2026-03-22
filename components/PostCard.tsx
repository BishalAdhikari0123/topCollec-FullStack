import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  post: {
    id: string
    slug: string
    title: string
    excerpt: string | null
    featured_image: string | null
    published_at: string
    reading_time: number | null
    views: number
    profiles?: Array<{
      display_name: string
      avatar_url: string | null
    }>
    post_tags?: Array<{
      tags: Array<{
        id: string
        name: string
        slug: string
      }>
    }>
  }
}

interface PostCardComponentProps extends PostCardProps {
  /**
   * Marks this card as containing the LCP image on the page.
   * When true, the featured image will be eagerly loaded with
   * higher priority for better LCP.
   */
  isLcpCandidate?: boolean
}

export default function PostCard({ post, isLcpCandidate = false }: PostCardComponentProps) {
  const author = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
  const tags = post.post_tags?.flatMap((pt) => pt.tags).filter(Boolean) || []

  return (
    <article className="card card-hover overflow-hidden group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300">
      {post.featured_image && (
        <Link href={`/posts/${post.slug}`} className="block relative overflow-hidden">
          <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[0.3] group-hover:grayscale-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={isLcpCandidate}
              fetchPriority={isLcpCandidate ? 'high' : 'auto'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
      )}

      <div className="p-6 lg:p-8">
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-4">
          {author && (
            <>
              <div className="flex items-center gap-2 group/author">
                {author.avatar_url && (
                  <div className="relative w-7 h-7 rounded-full overflow-hidden ring-2 ring-neutral-200 dark:ring-neutral-700 group-hover/author:ring-neutral-400 dark:group-hover/author:ring-neutral-500 transition-all">
                    <Image
                      src={author.avatar_url}
                      alt={author.display_name}
                      fill
                      className="object-cover grayscale group-hover/author:grayscale-0 transition-all"
                    />
                  </div>
                )}
                <span className="font-semibold text-neutral-700 dark:text-neutral-300 group-hover/author:text-neutral-900 dark:group-hover/author:text-neutral-100 transition-colors">
                  {author.display_name || 'Anonymous'}
                </span>
              </div>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
            </>
          )}
          <time dateTime={post.published_at} className="font-medium">
            {formatDate(post.published_at)}
          </time>
          {post.reading_time && (
            <>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {post.reading_time} min
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <Link href={`/posts/${post.slug}`} className="group/title">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-50 group-hover/title:text-transparent group-hover/title:bg-clip-text group-hover/title:bg-gradient-to-r group-hover/title:from-neutral-900 group-hover/title:to-neutral-600 dark:group-hover/title:from-neutral-50 dark:group-hover/title:to-neutral-400 line-clamp-2 leading-tight transition-all duration-300">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 line-clamp-3 leading-relaxed text-base">
            {post.excerpt}
          </p>
        )}

        {/* Tags & Stats */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag: {id: string; name: string; slug: string}) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="badge hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-100 dark:hover:text-neutral-900 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
          
          {post.views > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{post.views}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
