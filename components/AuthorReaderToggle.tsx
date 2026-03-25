'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

const AuthorReaderToggle = () => {
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const isAuthorMode = theme === 'author'

  const toggleMode = () => {
    setTheme(isAuthorMode ? 'light' : 'author')
  }

  return (
    <button
      onClick={toggleMode}
      className="px-4 py-2 rounded-md text-white bg-gray-800 hover:bg-gray-700"
    >
      {isAuthorMode ? 'Switch to Reader Mode' : 'Switch to Author Mode'}
    </button>
  )
}

export default AuthorReaderToggle
