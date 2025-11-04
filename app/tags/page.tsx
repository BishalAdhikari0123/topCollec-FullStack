import { getAllTags } from '@/lib/actions/posts'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Tags',
  description: 'Browse all tags and topics',
}

export const revalidate = 3600

export default async function TagsPage() {
  const tags = await getAllTags()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        All Tags
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tags/${tag.slug}`}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
              {tag.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
