import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-neutral-200 dark:border-neutral-800 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-black mt-20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-neutral-200/30 dark:bg-neutral-800/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-neutral-100/20 dark:bg-neutral-900/30 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                <svg className="w-6 h-6 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neutral-900 group-hover:to-neutral-600 dark:group-hover:from-neutral-50 dark:group-hover:to-neutral-400 transition-all">{SITE_NAME}</h3>
            </Link>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 max-w-md text-base">
              A curated collection of stories, series, and creative writing. 
              Discover new narratives, explore different genres, and immerse yourself in compelling tales.
            </p>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-900 dark:hover:bg-neutral-100 text-neutral-600 dark:text-neutral-400 hover:text-white dark:hover:text-neutral-900 transition-all hover:scale-110 shadow-sm hover:shadow-md">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-900 dark:hover:bg-neutral-100 text-neutral-600 dark:text-neutral-400 hover:text-white dark:hover:text-neutral-900 transition-all hover:scale-110 shadow-sm hover:shadow-md">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-50 mb-5 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors text-sm inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-neutral-400 group-hover:bg-neutral-900 dark:group-hover:bg-neutral-100 transition-colors"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/series" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors text-sm inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-neutral-400 group-hover:bg-neutral-900 dark:group-hover:bg-neutral-100 transition-colors"></span>
                  Series
                </Link>
              </li>
              <li>
                <Link href="/tags" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors text-sm inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-neutral-400 group-hover:bg-neutral-900 dark:group-hover:bg-neutral-100 transition-colors"></span>
                  Tags
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors text-sm inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-neutral-400 group-hover:bg-neutral-900 dark:group-hover:bg-neutral-100 transition-colors"></span>
                  Search
                </Link>
              </li>
              <li>
                <Link href="/rss" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors text-sm inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-neutral-400 group-hover:bg-neutral-900 dark:group-hover:bg-neutral-100 transition-colors"></span>
                  RSS Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-50 mb-5 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/login" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors text-sm inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-neutral-400 group-hover:bg-neutral-900 dark:group-hover:bg-neutral-100 transition-colors"></span>
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors text-sm inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-neutral-400 group-hover:bg-neutral-900 dark:group-hover:bg-neutral-100 transition-colors"></span>
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors text-sm inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-neutral-400 group-hover:bg-neutral-900 dark:group-hover:bg-neutral-100 transition-colors"></span>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-neutral-500 dark:text-neutral-500 font-medium">
              © {currentYear} {SITE_NAME}. Crafted with care.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-medium">
                About
              </Link>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <Link href="/search" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-medium">
                Privacy
              </Link>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <Link href="/search" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-medium">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
