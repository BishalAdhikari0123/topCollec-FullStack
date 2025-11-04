import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t-2 border-gray-800 bg-black/90 mt-20 grunge-texture relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/5 via-transparent to-transparent"></div>
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6 group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <svg className="w-12 h-12 relative text-purple-500 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-gradient-grunge">{SITE_NAME}</h3>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 font-light max-w-md">
              A curated collection of <span className="text-purple-400 font-bold">short stories</span>, 
              <span className="text-pink-400 font-bold"> fantasy tales</span>, and 
              <span className="text-blue-400 font-bold"> interesting lists</span>. 
              Explore worlds of imagination. ✨
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 className="p-3 bg-black/50 hover:bg-purple-600/20 text-gray-400 hover:text-purple-400 rounded-xl transition-all border-2 border-gray-800 hover:border-purple-500/50">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                 className="p-3 bg-black/50 hover:bg-purple-600/20 text-gray-400 hover:text-purple-400 rounded-xl transition-all border-2 border-gray-800 hover:border-purple-500/50">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </a>
              <a href="/rss" target="_blank"
                 className="p-3 bg-black/50 hover:bg-purple-600/20 text-gray-400 hover:text-purple-400 rounded-xl transition-all border-2 border-gray-800 hover:border-purple-500/50">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors font-medium flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-purple-500 group-hover:w-4 transition-all"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tags" className="text-gray-400 hover:text-purple-400 transition-colors font-medium flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-purple-500 group-hover:w-4 transition-all"></span>
                  Tags
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-400 hover:text-purple-400 transition-colors font-medium flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-purple-500 group-hover:w-4 transition-all"></span>
                  Search
                </Link>
              </li>
              <li>
                <Link href="/rss" className="text-gray-400 hover:text-purple-400 transition-colors font-medium flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-purple-500 group-hover:w-4 transition-all"></span>
                  RSS Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Account</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/login" className="text-gray-400 hover:text-purple-400 transition-colors font-medium flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-purple-500 group-hover:w-4 transition-all"></span>
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-400 hover:text-purple-400 transition-colors font-medium flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-purple-500 group-hover:w-4 transition-all"></span>
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-purple-400 transition-colors font-medium flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-purple-500 group-hover:w-4 transition-all"></span>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-2 border-gray-900">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm font-medium">
              © {currentYear} <span className="text-purple-400 font-black">{SITE_NAME}</span>. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-purple-400 transition-colors font-medium">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-purple-400 transition-colors font-medium">
                Terms
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-purple-400 transition-colors font-medium">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
