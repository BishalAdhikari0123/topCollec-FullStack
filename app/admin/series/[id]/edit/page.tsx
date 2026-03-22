import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import SeriesEditor from '@/components/admin/SeriesEditor'

export default async function EditSeriesPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const resolvedParams = await params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user!.id)
    .single<{ is_admin: boolean | null }>()

  if (!profile?.is_admin) {
    redirect('/')
  }

  // Fetch the series
  const { data: series, error } = await supabase
    .from('series')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !series) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-neutral-900 dark:text-neutral-50 mb-2">
            Edit Series
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Update series information
          </p>
        </div>

        <SeriesEditor series={series} />
      </div>
    </div>
  )
}
