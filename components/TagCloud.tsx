import Link from 'next/link'

interface Tag {
  id: string
  name: string
  slug: string
}

interface TagCloudProps {
  tags: Tag[]
}

export default function TagCloud({ tags }: TagCloudProps) {
  if (tags.length === 0) {
    return <p className="text-neutral-500 text-sm">No tags yet.</p>
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {tags.map((tag, index) => (
        <Link
          key={tag.id}
          href={`/tags/${tag.slug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 dark:hover:bg-neutral-100 dark:hover:text-neutral-900 dark:hover:border-neutral-100 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <svg className="w-3 h-3 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {tag.name}
        </Link>
      ))}
    </div>
  )
}
