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
    return <p className="text-gray-500 text-sm">No tags yet.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/tags/${tag.slug}`}
          className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  )
}
