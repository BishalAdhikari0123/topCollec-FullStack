import Link from 'next/link'
import { signIn } from '@/lib/actions/auth'
import { SITE_NAME } from '@/lib/constants'

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your TopCollec account',
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { signup?: string; error?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fadeIn">
          <Link href="/" className="inline-block mb-6 group">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <svg className="w-16 h-16 relative text-purple-500 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="text-4xl font-black text-gradient-grunge">{SITE_NAME}</h1>
            </div>
          </Link>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400">
            Sign in to access your account
          </p>
        </div>

        {searchParams.signup === 'success' && (
          <div className="card-grunge p-4 border-2 border-green-500/50 bg-green-500/10 animate-slideIn">
            <p className="text-green-400 text-sm font-bold text-center">
              ✓ Account created! Please sign in.
            </p>
          </div>
        )}

        {searchParams.error && (
          <div className="card-grunge p-4 border-2 border-red-500/50 bg-red-500/10 animate-slideIn">
            <p className="text-red-400 text-sm font-bold text-center">
              ⚠ {searchParams.error}
            </p>
          </div>
        )}

        <div className="card-grunge p-8 animate-slideIn">
          <form action={signIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-black text-gray-300 mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-grunge w-full px-4 py-3 bg-black/50 border-2 border-gray-800 focus:border-purple-500 rounded-xl text-white placeholder-gray-500 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-black text-gray-300 mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-grunge w-full px-4 py-3 bg-black/50 border-2 border-gray-800 focus:border-purple-500 rounded-xl text-white placeholder-gray-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                className="btn-grunge w-full py-3 px-4 text-white font-black uppercase tracking-wider text-sm"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-purple-400 hover:text-pink-400 font-bold transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-gray-500 hover:text-purple-400 transition-colors text-sm font-medium">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
