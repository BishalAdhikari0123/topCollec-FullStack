import Link from 'next/link'
import { signIn } from '@/lib/actions/auth'
import { SITE_NAME } from '@/lib/constants'

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your TopCollec account',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ signup?: string; error?: string }>
}) {
  const params = await searchParams
  const showSignupMessage = params.signup === 'success'
  const errorMessage = params.error

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px- sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-black dark:to-neutral-900">
      {/* Background effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-neutral-200/40 dark:bg-neutral-800/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-neutral-100/30 dark:bg-neutral-900/30 rounded-full blur-3xl" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in">
          <Link href="/" className="inline-block mb-8 group">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-neutral-900 dark:bg-neutral-100 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all">
                  <svg className="w-9 h-9 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-black text-neutral-900 dark:text-neutral-50 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neutral-900 group-hover:to-neutral-600 dark:group-hover:from-neutral-50 dark:group-hover:to-neutral-400 transition-all">{SITE_NAME}</h1>
            </div>
          </Link>
          <h2 className="text-4xl font-black text-neutral-900 dark:text-neutral-50 mb-3">
            Welcome Back
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            Sign in to access your account
          </p>
        </div>

        {showSignupMessage && (
          <div className="card p-5 border-2 border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-950/30 animate-scale-in shadow-lg">
            <p className="text-green-700 dark:text-green-400 text-sm font-semibold text-center flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Account created successfully! Please sign in.
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="card p-5 border-2 border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-950/30 animate-scale-in shadow-lg">
            <p className="text-red-700 dark:text-red-400 text-sm font-semibold text-center flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {errorMessage}
            </p>
          </div>
        )}

        <div className="card p-8 lg:p-10 shadow-2xl border-2 border-neutral-200 dark:border-neutral-800 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <form action={signIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                className="btn-primary w-full py-3.5 text-base shadow-lg hover:shadow-xl"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-bold text-neutral-900 dark:text-neutral-100 hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Link href="/" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors text-sm font-semibold inline-flex items-center gap-2 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
