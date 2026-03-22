import { getPostsByTag } from '@/lib/actions/posts'
import PostCard from '@/components/PostCard'
import Pagination from '@/components/Pagination'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { normalizePostForCard } from '@/lib/utils'

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

  const mappedPosts = posts.map(post => normalizePostForCard(post))

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
