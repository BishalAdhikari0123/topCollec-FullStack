import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { PostEditor } from '@/components/admin'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin/posts')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/')
  }

  // Get the post
  const { data: post } = await supabase
    .from('posts')
    .select('*, post_tags(tag_id)')
    .eq('id', id)
    .eq('author_id', user.id)
    .single()

  if (!post) {
    notFound()
  }

  // Get all tags
  const { data: tags } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  // Get all series by this author
  const { data: series } = await supabase
    .from('series')
    .select('id, title, slug, status')
    .eq('author_id', user.id)
    .order('title')

  // Extract selected tag IDs
  const selectedTagIds = post.post_tags?.map((pt: { tag_id: string }) => pt.tag_id) || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50/50 to-white dark:from-neutral-950 dark:via-neutral-900/30 dark:to-neutral-950">
      <div className="container mx-auto px-4 py-12 lg:py-16 max-w-6xl">
        <div className="mb-10 lg:mb-12 animate-fade-in">
          <h1 className="text-5xl lg:text-6xl font-black text-neutral-900 dark:text-neutral-50 mb-3 tracking-tight">Edit Post</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-neutral-900 to-neutral-400 dark:from-neutral-100 dark:to-neutral-600 rounded-full mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">Make changes to your masterpiece</p>
        </div>
        <PostEditor 
          post={post} 
          tags={tags || []} 
          series={series || []}
          selectedTagIds={selectedTagIds}
        />
      </div>
    </div>
  )
}
