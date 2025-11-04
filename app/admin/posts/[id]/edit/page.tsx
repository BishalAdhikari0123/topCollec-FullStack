import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { PostEditor } from '@/components/admin'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin/posts')
  }

  // Get the post
  const { data: post } = await supabase
    .from('posts')
    .select('*, post_tags(tag_id)')
    .eq('id', params.id)
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

  // Extract selected tag IDs
  const selectedTagIds = post.post_tags?.map((pt: any) => pt.tag_id) || []

  return (
    <div className="min-h-screen bg-[#121212] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-pink-900/5"></div>
      <div className="container mx-auto px-4 py-12 max-w-6xl relative">
        <div className="mb-10 animate-fadeIn">
          <h1 className="text-5xl font-black text-gradient-grunge mb-3 uppercase tracking-tighter">Edit Post</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 mb-4"></div>
          <p className="text-gray-400 text-lg font-light">Make changes to your masterpiece</p>
        </div>
        <PostEditor 
          post={post} 
          tags={tags || []} 
          selectedTagIds={selectedTagIds}
        />
      </div>
    </div>
  )
}
