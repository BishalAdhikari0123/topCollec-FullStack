import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Types
type ProfileRow = {
  is_admin: boolean | null
}

type SeriesRow = {
  id: string
  title: string
  slug: string
  description?: string | null
  cover_image?: string | null
  status: string
  created_at: string
  updated_at: string
  author_id?: string | null
  profiles?: {
    display_name?: string | null
  } | null
  post_count?: number
}

export default async function AdminSeriesPage() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Admin check
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  const profile = profileData as ProfileRow | null

  if (profileError || !profile?.is_admin) {
    redirect('/')
  }

  // Fetch all series
  const { data: seriesData } = await supabase
    .from('series')
    .select(`
      id,
      title,
      slug,
      description,
      cover_image,
      status,
      created_at,
      updated_at,
      profiles:author_id (
        display_name
      )
    `)
    .order('created_at', { ascending: false })

  const series = (seriesData ?? []) as SeriesRow[]

  // Get post count for each series
  const seriesWithCounts = await Promise.all(
    series.map(async (s) => {
      const { count } = await (supabase as any)
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('series_id', s.id)

      return {
        ...s,
        post_count: count || 0,
      }
    })
  )

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-neutral-900 dark:text-neutral-50 mb-2">
              Manage Series
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Create and organize post series
            </p>
          </div>
          <Link
            href="/admin/series/new"
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Series
          </Link>
        </div>

        {/* Series List */}
        {seriesWithCounts.length > 0 ? (
          <div className="grid gap-6">
            {seriesWithCounts.map((s) => (
              <div
                key={s.id}
                className="card rounded-2xl p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-6">
                  {/* Cover Image */}
                  {s.cover_image ? (
                    <img
                      src={s.cover_image}
                      alt={s.title}
                      className="w-32 h-32 object-cover rounded-xl border-2 border-neutral-200 dark:border-neutral-800"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                      <svg className="w-12 h-12 text-neutral-400 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}

                  {/* Series Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
                          {s.title}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          /{s.slug}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          s.status === 'published' 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                            : s.status === 'draft'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                    </div>

                    {s.description && (
                      <p className="text-neutral-700 dark:text-neutral-300 mb-4 line-clamp-2">
                        {s.description}
                      </p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {s.post_count} {s.post_count === 1 ? 'post' : 'posts'}
                      </span>
                      <span>
                        By {s.profiles?.display_name || 'Unknown'}
                      </span>
                      <span>
                        Created {new Date(s.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-4">
                      <Link
                        href={`/series/${s.slug}`}
                        className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                      >
                        View Series →
                      </Link>
                      <Link
                        href={`/admin/series/${s.id}/edit`}
                        className="btn-secondary btn-sm flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card rounded-2xl p-12 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 text-center">
            <svg className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              No series yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Create your first series to organize related posts
            </p>
            <Link href="/admin/series/new" className="btn-primary inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Series
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}