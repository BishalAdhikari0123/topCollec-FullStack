import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  post: any
}

export default function PostCard({ post }: PostCardProps) {
  const author = post.profiles
  const tags = post.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || []

  return (
    <article className="group card-grunge rounded-3xl overflow-hidden grunge-texture relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-pink-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <Link href={`/posts/${post.slug}`} className="block relative">
        {post.featured_image && (
          <div className="relative h-72 w-full overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 filter contrast-110 saturate-90"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                {author && (
                  <>
                    <div className="flex items-center gap-2">
                      {author.avatar_url && (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-purple-500/50">
                          <Image
                            src={author.avatar_url}
                            alt={author.display_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span className="font-bold text-purple-300 uppercase tracking-wide text-xs">
                        {author.display_name || 'Anonymous'}
                      </span>
                    </div>
                    <span className="text-gray-600">•</span>
                  </>
                )}
                <time dateTime={post.published_at} className="flex items-center gap-1 text-xs uppercase tracking-wider">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDate(post.published_at)}
                </time>
              </div>
            </div>
          </div>
        )}
      </Link>

      <div className="p-8 relative">
        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-3xl font-black mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all line-clamp-2 uppercase tracking-tight leading-tight">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-gray-400 mb-6 line-clamp-3 leading-relaxed font-light text-lg">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {post.reading_time && (
              <span className="flex items-center gap-2 font-bold uppercase tracking-wide">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {post.reading_time} MIN
              </span>
            )}
            {post.views > 0 && (
              <span className="flex items-center gap-2 font-bold uppercase tracking-wide">
                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.views}
              </span>
            )}
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t-2 border-gray-800/50">
            {tags.slice(0, 4).map((tag: any) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="group/tag relative px-4 py-2 bg-black/30 text-gray-400 rounded-lg hover:text-purple-300 border border-gray-800 hover:border-purple-500/50 transition-all font-bold text-xs uppercase tracking-wider overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover/tag:opacity-100 transition-opacity"></span>
                <span className="relative flex items-center gap-1">
                  <span className="text-purple-500">#</span>
                  {tag.name}
                </span>
              </Link>
            ))}
            {tags.length > 4 && (
              <span className="px-4 py-2 text-gray-600 font-bold text-xs uppercase tracking-wider">
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
