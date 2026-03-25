'use server'

// Comment system server actions
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getCommentsByPostId(postId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Try with profiles join first
  let { data: comments, error } = await supabase
    .from('comments')
    .select(
      `
      id,
      body,
      created_at,
      author_name,
      author_id,
      is_approved,
      parent_id,
      profiles:author_id (
        display_name,
        avatar_url
      )
    `
    )
    .eq('post_id', postId)
    .eq('is_approved', true)
    .order('created_at', { ascending: true })

  // If profiles join fails, try without it
  if (error) {
    console.warn(
      'Profiles join failed, fetching comments without profiles:',
      error.message
    )
    const result = await supabase
      .from('comments')
      .select(
        `
        id,
        body,
        created_at,
        author_name,
        author_id,
        is_approved,
        parent_id
      `
      )
      .eq('post_id', postId)
      .eq('is_approved', true)
      .order('created_at', { ascending: true })

    // Add empty profiles array to match expected type
    comments = result.data?.map(comment => ({ ...comment, profiles: [] })) || []
    error = result.error

    if (error) {
      console.error('Error fetching comments:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      return {
        comments: [],
        likes: [],
        userLikes: [],
        currentUserId: null,
        postAuthorId: null,
      }
    }
  }

  // Get like counts for all comments
  const commentIds = comments?.map(c => c.id) || []
  let likes: Array<{ comment_id: string; is_like: boolean }> = []
  let userLikes: Array<{ comment_id: string; is_like: boolean }> = []

  // Only fetch likes if comment_likes table exists (graceful fallback)
  try {
    const { data: likesData } = await supabase
      .from('comment_likes')
      .select('comment_id, is_like')
      .in('comment_id', commentIds)
    likes = likesData || []

    // Get current user's likes
    if (user && commentIds.length > 0) {
      const { data: userLikesData } = await supabase
        .from('comment_likes')
        .select('comment_id, is_like')
        .in('comment_id', commentIds)
        .eq('user_id', user.id)
      userLikes = userLikesData || []
    }
  } catch {
    console.warn(
      'comment_likes table not found - likes feature disabled. Run migration to enable.'
    )
  }

  // Get post author ID to highlight their comments
  const { data: post } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', postId)
    .single()

  return {
    comments: comments || [],
    likes: likes,
    userLikes: userLikes,
    currentUserId: user?.id || null,
    postAuthorId: post?.author_id || null,
  }
}

export async function createCommentAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const postId = formData.get('postId') as string
  const body = formData.get('body') as string
  const parentId = formData.get('parentId') as string | null
  const postSlug = formData.get('postSlug') as string

  if (!body || body.trim().length === 0) {
    redirect(`/posts/${postSlug}?error=Comment cannot be empty`)
  }

  if (!user) {
    redirect(`/login?redirectTo=/posts/${postSlug}`)
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()

  const { error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      author_id: user.id,
      author_name: profile?.display_name || 'Anonymous',
      author_email: user.email,
      body: body.trim(),
      parent_id: parentId || null,
      is_approved: true,
    })

  if (error) {
    console.error('Comment creation error:', error)
    redirect(`/posts/${postSlug}?error=Failed to post comment`)
  }

  revalidatePath(`/posts/${postSlug}`)
  redirect(`/posts/${postSlug}#comments`)
}

export async function likeComment(commentId: string, isLike: boolean, postSlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Must be logged in to like comments' }
  }

  try {
    // Check if user already liked/disliked
    const { data: existing } = await supabase
      .from('comment_likes')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', user.id)
      .single()

    if (existing) {
      // If clicking the same reaction, remove it
      if (existing.is_like === isLike) {
        await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id)
      } else {
        // If switching reaction, update it
        await supabase
          .from('comment_likes')
          .update({ is_like: isLike })
          .eq('comment_id', commentId)
          .eq('user_id', user.id)
      }
    } else {
      // Create new like/dislike
      await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: user.id,
          is_like: isLike,
        })
    }

    revalidatePath(`/posts/${postSlug}`)
    return { success: true }
  } catch (error) {
    console.error('Like comment error (table may not exist):', error)
    return { error: 'Likes feature not available. Please run database migration.' }
  }
}

export async function deleteComment(commentId: string, postSlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Must be logged in' }
  }

  // Check if user owns the comment or is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  const { data: comment } = await supabase
    .from('comments')
    .select('author_id')
    .eq('id', commentId)
    .single()

  if (comment?.author_id !== user.id && !profile?.is_admin) {
    return { error: 'Not authorized' }
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    return { error: 'Failed to delete comment' }
  }

  revalidatePath(`/posts/${postSlug}`)
  return { success: true }
}

export async function getPendingComments() {
  const supabase = await createClient()

  const { data: comments, error } = await supabase
    .from('comments')
    .select(`
      id,
      body,
      created_at,
      author_name,
      author_email,
      is_approved,
      posts (
        title,
        slug
      ),
      profiles:author_id (
        name,
        avatar_url
      )
    `)
    .eq('is_approved', false)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pending comments:', error)
    return []
  }

  return comments || []
}

export async function approveComment(commentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Must be logged in' }
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return { error: 'Not authorized' }
  }

  const { error } = await supabase
    .from('comments')
    .update({ is_approved: true })
    .eq('id', commentId)

  if (error) {
    return { error: 'Failed to approve comment' }
  }

  revalidatePath('/admin/comments')
  return { success: true }
}
