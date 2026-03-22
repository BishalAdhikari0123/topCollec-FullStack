'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'
import ThemeToggle from './ThemeToggle'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
}

export default function ClientHeader() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data, error }) => {
      if (!error && data.user) {
        setUser({ id: data.user.id })
      }
    })
  }, [])
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl shadow-sm">
      <nav className="container mx-auto px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-xl">
              <svg className="w-7 h-7 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-2xl font-black text-neutral-900 dark:text-neutral-50 hidden sm:block group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neutral-900 group-hover:to-neutral-600 dark:group-hover:from-neutral-50 dark:group-hover:to-neutral-400 transition-all">
              {SITE_NAME}
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link href="/" className="hidden md:flex text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all hover:scale-105">
              Home
            </Link>
            <Link href="/about" className="hidden md:flex text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all hover:scale-105">
              About
            </Link>
            <Link href="/contact" className="hidden lg:flex text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all hover:scale-105">
              Contact
            </Link>
            <Link href="/series" className="hidden md:flex items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all group hover:scale-105">
              <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
              Series
            </Link>
            <Link href="/tags" className="hidden md:flex text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all hover:scale-105">
              Tags
            </Link>
            <Link href="/search" className="flex items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all group hover:scale-105">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden lg:inline">Search</span>
            </Link>

            {user && (
              <Link href="/bookmarks" className="hidden md:flex items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all group hover:scale-105">
                <svg className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="hidden lg:inline">Saved</span>
              </Link>
            )}
            
            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
            
            <ThemeToggle />
            
            {user ? (
              <>
                <Link href="/admin" className="btn-primary text-sm px-5 py-2 shadow-md hover:shadow-lg">
                  Dashboard
                </Link>
                <form action="/auth/signout" method="post">
                  <button type="submit" className="text-sm font-semibold text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-all hover:scale-105">
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all hover:scale-105">
                  Sign In
                </Link>
                <Link href="/signup" className="btn-primary text-sm px-5 py-2 shadow-md hover:shadow-lg">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
