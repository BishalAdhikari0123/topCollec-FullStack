'use server'

// Series management server actions
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getAllSeries() {
  const supabase = await createClient()

  const { data: series, error } = await supabase
    .from('series')
    .select(
      `
      id,
      title,
      slug,
      description,
      cover_image,
      status,
      created_at,
      profiles:author_id (
        id,
        display_name,
        avatar_url
      )
    `
    )
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching series:', error)
    return []
  }

  // Get post count for each series
  const seriesWithCounts = await Promise.all(
    (series || []).map(async s => {
      const { count } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('series_id', s.id)
        .eq('status', 'published')

      return {
        ...s,
        post_count: count || 0,
      }
    })
  )

  return seriesWithCounts
}

export async function getSeriesBySlug(slug: string) {
  const supabase = await createClient()

  const { data: series, error } = await supabase
    .from('series')
    .select(
      `
      id,
      title,
      slug,
      description,
      cover_image,
      status,
      created_at,
      updated_at,
      profiles:author_id (
        id,
        display_name,
        bio,
        avatar_url
      )
    `
    )
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching series:', error)
    return null
  }

  return series
}

export async function getSeriesPosts(seriesId: string) {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      featured_image,
      published_at,
      series_order,
      reading_time,
      views
    `
    )
    .eq('series_id', seriesId)
    .eq('status', 'published')
    .order('series_order', { ascending: true })

  if (error) {
    console.error('Error fetching series posts:', error)
    return []
  }

  return posts || []
}

export async function getPostSeriesNavigation(postId: string) {
  const supabase = await createClient()

  // Get current post's series info
  const { data: post } = await supabase
    .from('posts')
    .select('series_id, series_order, series:series_id(id, title, slug)')
    .eq('id', postId)
    .single()

  if (!post?.series_id) {
    return null
  }

  // Get previous post
  const { data: previousPost } = await supabase
    .rpc('get_previous_post_in_series', { current_post_id: postId })
    .single()

  // Get next post
  const { data: nextPost } = await supabase
    .rpc('get_next_post_in_series', { current_post_id: postId })
    .single()

  // Get all posts in series for progress
  const { data: allPosts } = await supabase
    .from('posts')
    .select('id, series_order')
    .eq('series_id', post.series_id)
    .eq('status', 'published')
    .order('series_order', { ascending: true })

  const currentIndex = allPosts?.findIndex(p => p.id === postId) ?? -1
  const totalPosts = allPosts?.length ?? 0

  return {
    series: post.series,
    previous: previousPost,
    next: nextPost,
    currentOrder: post.series_order,
    currentIndex: currentIndex + 1,
    totalPosts,
  }
}

export async function createSeries(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const coverImage = formData.get('cover_image') as string

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const { data: series, error } = await supabase
    .from('series')
    .insert({
      author_id: user.id,
      title,
      slug,
      description,
      cover_image: coverImage || null,
      status: 'published',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating series:', error)
    throw new Error('Failed to create series')
  }

  revalidatePath('/series')
  return series
}

export async function updateSeries(seriesId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const coverImage = formData.get('cover_image') as string

  const { error } = await supabase
    .from('series')
    .update({
      title,
      description,
      cover_image: coverImage || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', seriesId)
    .eq('author_id', user.id)

  if (error) {
    console.error('Error updating series:', error)
    throw new Error('Failed to update series')
  }

  revalidatePath('/series')
}

export async function deleteSeries(seriesId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('series')
    .delete()
    .eq('id', seriesId)
    .eq('author_id', user.id)

  if (error) {
    console.error('Error deleting series:', error)
    throw new Error('Failed to delete series')
  }

  revalidatePath('/series')
}
