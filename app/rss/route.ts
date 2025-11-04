import { createClient } from '@/lib/supabase/server'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/constants'

export async function GET() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      published_at,
      profiles:author_id (
        display_name
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50)

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml" />
    ${
      posts
        ?.map(
          (post: {title: string; slug: string; excerpt: string | null; content: string; published_at: string; profiles?: Array<{display_name: string}>}) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/posts/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/posts/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || post.content.substring(0, 200)}]]></description>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
      <author>${post.profiles?.[0]?.display_name || 'Unknown'}</author>
    </item>
    `
        )
        .join('') || ''
    }
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
