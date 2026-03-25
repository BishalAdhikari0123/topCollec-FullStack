import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function getBaseUrl(request: Request) {
  const requestOrigin = new URL(request.url).origin

  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    requestOrigin
  )
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const baseUrl = getBaseUrl(request)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  })

  if (error) {
    console.error('Error signing in with Google:', error)

    const errorMessage =
      (error as any)?.message?.toLowerCase()?.includes('provider is not enabled')
        ? 'Google login is not enabled yet. Please enable Google provider in Supabase Auth settings.'
        : 'Could not authenticate with Google'

    redirect(`/login?error=${encodeURIComponent(errorMessage)}`)
  }

  if (data.url) {
    redirect(data.url)
  }
}
