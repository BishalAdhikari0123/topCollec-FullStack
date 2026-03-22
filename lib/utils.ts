import slugify from 'slugify'

export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  })
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + '...'
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Normalized post shape used by PostCard and listing pages
export interface NormalizedPostForCard {
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

// Helper to normalize Supabase post rows into the shape expected by PostCard
export function normalizePostForCard(raw: any): NormalizedPostForCard {
  const profilesRaw = raw?.profiles

  const profiles = profilesRaw
    ? (Array.isArray(profilesRaw) ? profilesRaw : [profilesRaw]).map(
        (p: { display_name: unknown; avatar_url: unknown }) => ({
          display_name: String(p.display_name ?? ''),
          avatar_url: p.avatar_url != null ? String(p.avatar_url) : null,
        }),
      )
    : undefined

  const postTagsRaw = raw?.post_tags as
    | Array<{ tags: any }>
    | undefined

  const post_tags = postTagsRaw?.map(pt => {
    const tagsRaw = pt.tags
    const tagsArray = Array.isArray(tagsRaw) ? tagsRaw : tagsRaw ? [tagsRaw] : []

    return {
      tags: tagsArray.map(t => ({
        id: String(t.id),
        name: String(t.name),
        slug: String(t.slug),
      })),
    }
  })

  return {
    ...raw,
    id: String(raw.id),
    slug: String(raw.slug),
    title: String(raw.title),
    excerpt: raw.excerpt != null ? String(raw.excerpt) : null,
    featured_image: raw.featured_image != null ? String(raw.featured_image) : null,
    published_at: String(raw.published_at),
    reading_time:
      raw.reading_time != null && !Number.isNaN(Number(raw.reading_time))
        ? Number(raw.reading_time)
        : null,
    views:
      raw.views != null && !Number.isNaN(Number(raw.views))
        ? Number(raw.views)
        : 0,
    profiles,
    post_tags,
  }
}
