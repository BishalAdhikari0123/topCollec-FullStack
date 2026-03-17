'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { POSTS_PER_PAGE } from '@/lib/constants'

export async function toggleBookmark(postId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Check if bookmark exists
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  if (existing) {
    // Remove bookmark
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', existing.id)

    if (error) {
      console.error('Error removing bookmark:', error)
      throw new Error('Failed to remove bookmark')
    }

    revalidatePath('/bookmarks')
    return { bookmarked: false }
  } else {
    // Add bookmark
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: user.id,
        post_id: postId
      })

    if (error) {
      console.error('Error adding bookmark:', error)
      throw new Error('Failed to add bookmark')
    }

    revalidatePath('/bookmarks')
    return { bookmarked: true }
  }
}

export async function isPostBookmarked(postId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return false
  }

  const { data } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  return !!data
}

export async function getUserBookmarks(page: number = 1) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { posts: [], count: 0, totalPages: 0 }
  }

  const from = (page - 1) * POSTS_PER_PAGE
  const to = from + POSTS_PER_PAGE - 1

  const { data: bookmarks, error, count } = await supabase
    .from('bookmarks')
    .select(`
      created_at,
      posts (
        id,
        title,
        slug,
        excerpt,
        featured_image,
        published_at,
        reading_time,
        views,
        profiles:author_id (
          id,
          display_name,
          avatar_url
        ),
        post_tags (
          tags (
            id,
            name,
            slug
          )
        )
      )
    `, { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching bookmarks:', error)
    return { posts: [], count: 0, totalPages: 0 }
  }

  // Extract posts from bookmarks
  const posts = (bookmarks || [])
    .map(b => b.posts)
    .filter(p => p !== null)

  const totalPages = count ? Math.ceil(count / POSTS_PER_PAGE) : 0

  return { posts, count: count || 0, totalPages }
}
