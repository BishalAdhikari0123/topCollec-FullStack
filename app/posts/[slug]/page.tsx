import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPostBySlug, getRelatedPosts } from '@/lib/actions/posts'
import { getCommentsByPostId } from '@/lib/actions/comments'
import { getPostSeriesNavigation } from '@/lib/actions/series'
import { isPostBookmarked } from '@/lib/actions/bookmarks'
import { formatDate } from '@/lib/utils'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import CommentsSection from '@/components/CommentsSection'
import SeriesNavigation from '@/components/SeriesNavigation'
import BookmarkButton from '@/components/BookmarkButton'
import ShareButtons from '@/components/ShareButtons'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import BackToTop from '@/components/BackToTop'
import RelatedPosts from '@/components/RelatedPosts'
import NewsletterSubscribe from '@/components/NewsletterSubscribe'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

// --- Types ---
type Profile = {
  id: string
  display_name: string
  avatar_url?: string | null
  bio?: string
}

type Tag = {
  id: string
  name: string
  slug: string
}

type PostTag = {
  tags: Tag
}

type Post = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  featured_image?: string | null
  published_at: string
  updated_at: string
  reading_time?: number | null
  views?: number
  profiles?: Profile
  post_tags?: PostTag[]
}

type SeriesItem = {
  id: string
  title: string
  slug: string
}

type SeriesNavItem = {
  title: string
  slug: string
  series_order: number
}

type SeriesNav = {
  series: SeriesItem[]
  previous: SeriesNavItem | null
  next: SeriesNavItem | null
  currentOrder: number
  currentIndex: number
  totalPosts: number
}

// Raw shape returned by getPostSeriesNavigation
type SeriesNavRaw = {
  series: { id: string | number; title: string; slug: string } | Array<{ id: string | number; title: string; slug: string }>
  previous: { title: string; slug: string; series_order: number } | null
  next: { title: string; slug: string; series_order: number } | null
  currentOrder: number
  currentIndex: number
  totalPosts: number
}

// --- Metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: 'Post Not Found' }
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

// --- Page ---
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post: Post | null = (await getPostBySlug(slug)) as any

  if (!post) notFound()

  // --- Tags ---
  const tags: Tag[] = post.post_tags?.map(pt => pt.tags).filter(Boolean) || []

  // --- Related Posts ---
  const tagIds = tags.map(tag => tag.id)
  const [
    relatedPosts,
    comments,
    isBookmarked,
    seriesNavRaw,
  ] = await Promise.all([
    getRelatedPosts(post.id, tagIds),
    getCommentsByPostId(post.id),
    isPostBookmarked(post.id),
    getPostSeriesNavigation(post.id) as Promise<SeriesNavRaw | null>,
  ])

  const seriesNav: SeriesNav | null = seriesNavRaw
    ? {
        series: (
          Array.isArray(seriesNavRaw.series)
            ? seriesNavRaw.series
            : [seriesNavRaw.series]
        ).map((s) => ({
          id: String(s.id),
          title: String(s.title),
          slug: String(s.slug),
        })),
        previous: seriesNavRaw.previous
          ? {
              title: String(seriesNavRaw.previous.title),
              slug: String(seriesNavRaw.previous.slug),
              series_order: Number(seriesNavRaw.previous.series_order),
            }
          : null,
        next: seriesNavRaw.next
          ? {
              title: String(seriesNavRaw.next.title),
              slug: String(seriesNavRaw.next.slug),
              series_order: Number(seriesNavRaw.next.series_order),
            }
          : null,
        currentOrder: Number(seriesNavRaw.currentOrder),
        currentIndex: Number(seriesNavRaw.currentIndex),
        totalPosts: Number(seriesNavRaw.totalPosts),
      }
    : null

  // --- JSON-LD ---
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
      <ReadingProgressBar />
      <BackToTop />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Series Navigation */}
        {seriesNav && (
          <SeriesNavigation
            series={seriesNav.series[seriesNav.currentIndex]}
            previous={seriesNav.previous}
            next={seriesNav.next}
            currentOrder={seriesNav.currentOrder}
            currentIndex={seriesNav.currentIndex}
            totalPosts={seriesNav.totalPosts}
          />
        )}

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">{post.title}</h1>

          <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400 mb-6">
            {post.profiles && (
              <>
                <Link
                  href={`/authors/${post.profiles.id}`}
                  className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors"
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
                  <span className="font-medium">{post.profiles.display_name || 'Anonymous'}</span>
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
              {tags.map(tag => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="text-sm px-3 py-1 bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors border border-neutral-200 dark:border-neutral-700"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Share & Bookmark */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-800">
            <ShareButtons 
              url={`${SITE_URL}/posts/${post.slug}`}
              title={post.title}
              description={post.excerpt || undefined}
            />
            <BookmarkButton 
              postId={post.id}
              initialBookmarked={isBookmarked}
            />
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image src={post.featured_image} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none mb-12">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        {/* Author Bio */}
        {post.profiles?.bio && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 mb-12">
            <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">About the Author</h3>
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
                  className="text-xl font-semibold text-black dark:text-white hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                >
                  {post.profiles.display_name}
                </Link>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2">{post.profiles.bio}</p>
              </div>
            </div>
          </div>
        )}

        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} />

        {/* Newsletter Subscription */}
        <div className="mt-12 mb-12">
          <NewsletterSubscribe />
        </div>

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
