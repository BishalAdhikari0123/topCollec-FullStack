'use client'

import { useState } from 'react'

export default function FontSizeControl() {
  const [fontSize, setFontSize] = useState(100)

  const adjustFontSize = (delta: number) => {
    setFontSize(prev => {
      const newSize = Math.min(150, Math.max(75, prev + delta))
      document.documentElement.style.fontSize = `${newSize}%`
      localStorage.setItem('fontSize', String(newSize))
      return newSize
    })
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 card rounded-lg">
      <button
        onClick={() => adjustFontSize(-10)}
        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
        aria-label="Decrease font size"
        title="Decrease font size"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <span className="text-sm font-medium min-w-[3rem] text-center">{fontSize}%</span>
      <button
        onClick={() => adjustFontSize(10)}
        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
        aria-label="Increase font size"
        title="Increase font size"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}
