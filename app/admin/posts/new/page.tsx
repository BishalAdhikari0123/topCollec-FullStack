import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PostEditor } from '@/components/admin'

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin/posts/new')
  }

  // Get all tags for the editor
  const { data: tags } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  return (
    <div className="min-h-screen bg-[#121212] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-pink-900/5"></div>
      <div className="container mx-auto px-4 py-12 max-w-6xl relative">
        <div className="mb-10 animate-fadeIn">
          <h1 className="text-5xl font-black text-gradient-grunge mb-3 uppercase tracking-tighter">Create Post</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 mb-4"></div>
          <p className="text-gray-400 text-lg font-light">Write and publish your masterpiece</p>
        </div>
        <PostEditor tags={tags || []} />
      </div>
    </div>
  )
}
