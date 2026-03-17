import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SeriesEditor from '@/components/admin/SeriesEditor'

export default async function NewSeriesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
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

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-neutral-900 dark:text-neutral-50 mb-2">
            Create New Series
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Organize related posts into a series
          </p>
        </div>

        <SeriesEditor />
      </div>
    </div>
  )
}
