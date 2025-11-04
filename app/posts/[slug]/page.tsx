import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPostBySlug, getRelatedPosts, getAllTags } from '@/lib/actions/posts'
import { getCommentsByPostId } from '@/lib/actions/comments'
import { getPostSeriesNavigation } from '@/lib/actions/series'
import { formatDate } from '@/lib/utils'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import CommentsSection from '@/components/CommentsSection'
import SeriesNavigation from '@/components/SeriesNavigation'

// Force dynamic rendering to always check authentication
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.profiles?.display_name || 'Unknown'],
      images: post.featured_image ? [post.featured_image] : [],
      url: `${SITE_URL}/posts/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: post.featured_image ? [post.featured_image] : [],
    },
  }
}

export async function generateStaticParams() {
  // Generate static params for top posts
  // In production, you might want to limit this
  return []
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const tags = post.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || []
  const tagIds = tags.map((tag: any) => tag.id)
  const relatedPosts = await getRelatedPosts(post.id, tagIds)
  const comments = await getCommentsByPostId(post.id)
  const seriesNav = await getPostSeriesNavigation(post.id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.featured_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.profiles?.display_name || 'Unknown',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    description: post.excerpt,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Series Navigation */}
        {seriesNav && (
          <SeriesNavigation
            series={seriesNav.series}
            previous={seriesNav.previous}
            next={seriesNav.next}
            currentOrder={seriesNav.currentOrder}
            currentIndex={seriesNav.currentIndex}
            totalPosts={seriesNav.totalPosts}
          />
        )}

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-400 mb-6">
            {post.profiles && (
              <>
                <Link
                  href={`/authors/${post.profiles.id}`}
                  className="flex items-center gap-2 hover:text-purple-400 transition-colors"
                >
                  {post.profiles.avatar_url && (
                    <Image
                      src={post.profiles.avatar_url}
                      alt={post.profiles.display_name || 'Author'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <span className="font-medium">
                    {post.profiles.display_name || 'Anonymous'}
                  </span>
                </Link>
                <span>•</span>
              </>
            )}
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            {post.reading_time && (
              <>
                <span>•</span>
                <span>{post.reading_time} min read</span>
              </>
            )}
            <span>•</span>
            <span>{post.views || 0} views</span>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag: any) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="text-sm px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full hover:bg-purple-800/50 transition-colors border border-purple-700/30"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        {/* Author Bio */}
        {post.profiles && post.profiles.bio && (
          <div className="border-t border-gray-800 pt-8 mb-12">
            <h3 className="text-2xl font-bold mb-4 text-white">
              About the Author
            </h3>
            <div className="flex gap-4">
              {post.profiles.avatar_url && (
                <Image
                  src={post.profiles.avatar_url}
                  alt={post.profiles.display_name || 'Author'}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              )}
              <div>
                <Link
                  href={`/authors/${post.profiles.id}`}
                  className="text-xl font-semibold text-purple-400 hover:text-pink-400 transition-colors"
                >
                  {post.profiles.display_name}
                </Link>
                <p className="text-gray-400 mt-2">{post.profiles.bio}</p>
              </div>
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-gray-800 pt-8 mb-12">
            <h3 className="text-2xl font-bold mb-6 text-white uppercase tracking-tight">
              Related Posts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost: any) => (
                <Link
                  key={relatedPost.id}
                  href={`/posts/${relatedPost.slug}`}
                  className="group"
                >
                  {relatedPost.featured_image && (
                    <div className="relative h-32 w-full mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                    {relatedPost.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <CommentsSection
          postId={post.id}
          postSlug={post.slug}
          comments={comments.comments}
          likes={comments.likes}
          userLikes={comments.userLikes}
          currentUserId={comments.currentUserId}
          postAuthorId={comments.postAuthorId}
        />
      </article>
    </>
  )
}
