import Link from 'next/link'
import Image from 'next/image'

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string | null
  published_at: string
  reading_time: number | null
}

interface RelatedPostsProps {
  posts: RelatedPost[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <div className="mt-16 pt-12 border-t-2 border-neutral-200 dark:border-neutral-800">
      <h2 className="text-3xl font-black text-neutral-900 dark:text-neutral-50 mb-8">
        Related Posts
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="group card rounded-xl p-4 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all hover:-translate-y-1"
          >
            {post.featured_image && (
              <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-2 line-clamp-2 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
              {post.title}
            </h3>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3">
              {post.excerpt}
            </p>

            {post.reading_time && (
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{post.reading_time} min read</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
