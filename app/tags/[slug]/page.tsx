import { getPostsByTag } from '@/lib/actions/posts'
import PostCard from '@/components/PostCard'
import Pagination from '@/components/Pagination'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { tag } = await getPostsByTag(slug, 1)

  if (!tag) {
    return { title: 'Tag Not Found' }
  }

  return {
    title: `Posts tagged with "${tag.name}"`,
    description: `Browse all posts tagged with ${tag.name}`,
  }
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Number(pageParam) || 1
  const { tag, posts, totalPages } = await getPostsByTag(slug, page)

  if (!tag) {
    notFound()
  }

  // Map posts to match PostCardProps type
  type AuthorProfile = { display_name: string; avatar_url: string | null }
  type TagPost = {
    id: string | number
    slug: string
    title: string
    excerpt?: string | null
    featured_image?: string | null
    published_at?: string
    reading_time?: number | null
    views?: number | null
    profiles?: AuthorProfile | AuthorProfile[]
  }

  const mappedPosts = (posts as TagPost[]).map((post) => {
    const profilesArray = post.profiles
      ? (Array.isArray(post.profiles) ? post.profiles : [post.profiles]).map((p) => ({
          display_name: String(p.display_name),
          avatar_url: p.avatar_url ? String(p.avatar_url) : null,
        }))
      : undefined

    return {
      id: String(post.id),
      slug: String(post.slug),
      title: String(post.title),
      excerpt: post.excerpt ? String(post.excerpt) : null,
      featured_image: post.featured_image ? String(post.featured_image) : null,
      published_at: post.published_at ? String(post.published_at) : new Date().toISOString(),
      reading_time: post.reading_time != null ? Number(post.reading_time) : null,
      views: post.views != null ? Number(post.views) : 0,
      profiles: profilesArray,
      // getPostsByTag doesn't include tags list here; omit post_tags
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
        {tag.name}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {posts.length} {posts.length === 1 ? 'post' : 'posts'}
      </p>

      {mappedPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No posts found with this tag.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {mappedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath={`/tags/${slug}`}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
