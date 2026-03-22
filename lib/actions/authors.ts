'use server'

import { createClient } from '@/lib/supabase/server'
import { POSTS_PER_PAGE } from '@/lib/constants'

export async function getAuthorByUsername(username: string) {
  const supabase = await createClient()
  
  const { data: author, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error) {
    console.error('Error fetching author:', error)
    return null
  }

  return author
}

export async function getAuthorById(id: string) {
  const supabase = await createClient()
  
  const { data: author, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single<{
      id: string;
      username: string;
      display_name: string;
      avatar_url: string;
      bio: string;
    }>()

  if (error) {
    console.error('Error fetching author:', error)
    return null
  }

  return author
}

export async function getAuthorPosts(authorId: string, page: number = 1) {
  const supabase = await createClient()
  const from = (page - 1) * POSTS_PER_PAGE
  const to = from + POSTS_PER_PAGE - 1

  const { data: posts, error, count } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      featured_image,
      published_at,
      reading_time,
      views,
      post_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `, { count: 'exact' })
    .eq('author_id', authorId)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching author posts:', error)
    return { posts: [], count: 0, totalPages: 0 }
  }

  const totalPages = count ? Math.ceil(count / POSTS_PER_PAGE) : 0

  return { posts: posts || [], count: count || 0, totalPages }
}

export async function getAuthorStats(authorId: string) {
  const supabase = await createClient()

  // Get post count
  const { count: postsCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', authorId)
    .eq('status', 'published')

  // Get total views
  const { data: viewsData } = await supabase
    .from('posts')
    .select('views')
    .eq('author_id', authorId)
    .eq('status', 'published')

  const totalViews = (viewsData as any[])?.reduce((sum, post) => sum + (post.views as number || 0), 0) || 0

  // Get series count
  const { count: seriesCount } = await supabase
    .from('series')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', authorId)
    .eq('status', 'published')

  return {
    postsCount: postsCount || 0,
    totalViews,
    seriesCount: seriesCount || 0
  }
}
