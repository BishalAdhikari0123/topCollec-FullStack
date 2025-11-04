'use server'

import { createClient } from '@/lib/supabase/server'
import { POSTS_PER_PAGE, RELATED_POSTS_COUNT } from '@/lib/constants'
import { revalidatePath } from 'next/cache'

export async function getPublishedPosts(page: number = 1) {
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
      profiles:author_id (
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
    `, { count: 'exact' })
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching posts:', error)
    return { posts: [], count: 0, totalPages: 0 }
  }

  const totalPages = count ? Math.ceil(count / POSTS_PER_PAGE) : 0

  return { posts: posts || [], count: count || 0, totalPages }
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        id,
        display_name,
        bio,
        avatar_url
      ),
      post_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  // Increment view count
  await supabase.rpc('increment_post_views', { post_id: post.id })

  return post
}

export async function getRelatedPosts(postId: string, tagIds: string[]) {
  const supabase = await createClient()

  if (tagIds.length === 0) {
    return []
  }

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      featured_image,
      published_at,
      reading_time,
      post_tags!inner (
        tag_id
      )
    `)
    .eq('status', 'published')
    .neq('id', postId)
    .in('post_tags.tag_id', tagIds)
    .order('published_at', { ascending: false })
    .limit(RELATED_POSTS_COUNT)

  if (error) {
    console.error('Error fetching related posts:', error)
    return []
  }

  return posts || []
}

export async function getPostsByTag(tagSlug: string, page: number = 1) {
  const supabase = await createClient()
  const from = (page - 1) * POSTS_PER_PAGE
  const to = from + POSTS_PER_PAGE - 1

  // First get the tag
  const { data: tag } = await supabase
    .from('tags')
    .select('id, name, slug')
    .eq('slug', tagSlug)
    .single()

  if (!tag) {
    return { tag: null, posts: [], count: 0, totalPages: 0 }
  }

  // Then get posts with this tag
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
      profiles:author_id (
        display_name,
        avatar_url
      ),
      post_tags!inner (
        tag_id
      )
    `, { count: 'exact' })
    .eq('status', 'published')
    .eq('post_tags.tag_id', tag.id)
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching posts by tag:', error)
    return { tag, posts: [], count: 0, totalPages: 0 }
  }

  const totalPages = count ? Math.ceil(count / POSTS_PER_PAGE) : 0

  return { tag, posts: posts || [], count: count || 0, totalPages }
}

export async function getPostsByAuthor(authorId: string, page: number = 1) {
  const supabase = await createClient()
  const from = (page - 1) * POSTS_PER_PAGE
  const to = from + POSTS_PER_PAGE - 1

  // First get the author
  const { data: author } = await supabase
    .from('profiles')
    .select('id, display_name, bio, avatar_url')
    .eq('id', authorId)
    .single()

  if (!author) {
    return { author: null, posts: [], count: 0, totalPages: 0 }
  }

  // Then get posts by this author
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
      post_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `, { count: 'exact' })
    .eq('status', 'published')
    .eq('author_id', authorId)
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching posts by author:', error)
    return { author, posts: [], count: 0, totalPages: 0 }
  }

  const totalPages = count ? Math.ceil(count / POSTS_PER_PAGE) : 0

  return { author, posts: posts || [], count: count || 0, totalPages }
}

export async function searchPosts(query: string, page: number = 1) {
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
      profiles:author_id (
        display_name,
        avatar_url
      )
    `, { count: 'exact' })
    .eq('status', 'published')
    .textSearch('search_vector', query)
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error searching posts:', error)
    return { posts: [], count: 0, totalPages: 0 }
  }

  const totalPages = count ? Math.ceil(count / POSTS_PER_PAGE) : 0

  return { posts: posts || [], count: count || 0, totalPages, query }
}

export async function getAllTags() {
  const supabase = await createClient()

  const { data: tags, error } = await supabase
    .from('tags')
    .select('id, name, slug')
    .order('name')

  if (error) {
    console.error('Error fetching tags:', error)
    return []
  }

  return tags || []
}

export async function getPopularTags(limit: number = 10) {
  const supabase = await createClient()

  const { data: tags, error } = await supabase
    .from('tags')
    .select(`
      id,
      name,
      slug,
      post_tags!inner(post_id)
    `)
    .limit(limit)

  if (error) {
    console.error('Error fetching popular tags:', error)
    return []
  }

  // Count and sort tags by post count
  const tagsWithCount = (tags || []).map(tag => ({
    ...tag,
    post_count: Array.isArray(tag.post_tags) ? tag.post_tags.length : 0
  }))

  // Sort by post count descending
  return tagsWithCount.sort((a, b) => b.post_count - a.post_count)
}

interface PostData {
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image?: string
  status: string
  tagIds?: string[]
}

export async function createPost(postData: PostData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const { tagIds, ...post } = postData

  // Insert the post
  const { data: newPost, error: postError } = await supabase
    .from('posts')
    .insert({
      ...post,
      author_id: user.id,
    })
    .select()
    .single()

  if (postError) {
    console.error('Error creating post:', postError)
    throw new Error('Failed to create post')
  }

  // Insert post-tag relationships
  if (tagIds && tagIds.length > 0) {
    const postTags = tagIds.map((tagId: string) => ({
      post_id: newPost.id,
      tag_id: tagId,
    }))

    const { error: tagError } = await supabase
      .from('post_tags')
      .insert(postTags)

    if (tagError) {
      console.error('Error adding tags:', tagError)
    }
  }

  revalidatePath('/admin/posts')
  revalidatePath('/')
  return newPost
}

export async function updatePost(postId: string, postData: PostData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const { tagIds, ...post } = postData

  // Update the post
  const { error: postError } = await supabase
    .from('posts')
    .update(post)
    .eq('id', postId)
    .eq('author_id', user.id)

  if (postError) {
    console.error('Error updating post:', postError)
    throw new Error('Failed to update post')
  }

  // Delete existing tag relationships
  await supabase
    .from('post_tags')
    .delete()
    .eq('post_id', postId)

  // Insert new tag relationships
  if (tagIds && tagIds.length > 0) {
    const postTags = tagIds.map((tagId: string) => ({
      post_id: postId,
      tag_id: tagId,
    }))

    const { error: tagError } = await supabase
      .from('post_tags')
      .insert(postTags)

    if (tagError) {
      console.error('Error updating tags:', tagError)
    }
  }

  revalidatePath('/admin/posts')
  revalidatePath(`/posts/${post.slug}`)
  revalidatePath('/')
}

export async function deletePost(postId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', user.id)

  if (error) {
    console.error('Error deleting post:', error)
    throw new Error('Failed to delete post')
  }

  revalidatePath('/admin/posts')
  revalidatePath('/')
}

