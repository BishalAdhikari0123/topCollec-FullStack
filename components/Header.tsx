import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b-2 border-gray-800 bg-black/80 backdrop-blur-md sticky top-0 z-50 grunge-texture">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-pink-900/10 pointer-events-none"></div>
      <nav className="container mx-auto px-4 py-5 relative">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 animate-float">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <svg className="w-10 h-10 relative text-purple-500 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="text-3xl font-black text-gradient-grunge tracking-tight">
              {SITE_NAME}
            </div>
          </Link>

          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-purple-400 transition-all font-bold tracking-wide relative group text-sm uppercase"
            >
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/tags"
              className="text-gray-300 hover:text-purple-400 transition-all font-bold tracking-wide relative group text-sm uppercase"
            >
              <span className="relative z-10">Tags</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/series"
              className="text-gray-300 hover:text-purple-400 transition-all font-bold tracking-wide relative group flex items-center gap-2 text-sm uppercase"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
              <span className="relative z-10">Series</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/search"
              className="text-gray-300 hover:text-purple-400 transition-all font-bold tracking-wide relative group flex items-center gap-2 text-sm uppercase"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="relative z-10">Search</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {user ? (
              <>
                <Link
                  href="/admin"
                  className="px-5 py-2.5 bg-black/50 hover:bg-black/80 text-purple-400 rounded-lg transition-all border-2 border-purple-900/50 hover:border-purple-500 font-bold tracking-wide text-sm uppercase shadow-lg shadow-purple-900/30 hover:shadow-purple-500/50"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin
                  </span>
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="text-gray-500 hover:text-red-400 transition-all font-bold tracking-wide text-sm uppercase hover:scale-105"
                  >
                    Exit
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 bg-black/50 hover:bg-black/80 text-purple-400 rounded-lg transition-all border-2 border-purple-900/50 hover:border-purple-500 font-bold tracking-wide text-sm uppercase"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-2.5 btn-grunge text-white rounded-lg font-black tracking-wide text-sm uppercase"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
