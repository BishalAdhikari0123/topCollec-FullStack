import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        About TopCollec
      </h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>
          TopCollec is a curated collection of short stories, fantasy tales, and fascinating
          lists. We believe in the power of storytelling and the joy of discovery.
        </p>

        <h2>Our Mission</h2>
        <p>
          To create a space where imagination thrives and curiosity is rewarded. Whether you're
          here for a quick escape into a fantasy world or to explore intriguing lists and facts,
          we've got something for you.
        </p>

        <h2>What We Publish</h2>
        <ul>
          <li><strong>Short Stories</strong> - Bite-sized fiction that fits your coffee break</li>
          <li><strong>Fantasy Tales</strong> - Epic adventures in magical worlds</li>
          <li><strong>Curated Lists</strong> - Fascinating facts and collections</li>
          <li><strong>Writing Tips</strong> - Advice for aspiring storytellers</li>
        </ul>

        <h2>Get Involved</h2>
        <p>
          We're always looking for talented writers and contributors. If you have a story to tell
          or a list to share, we'd love to hear from you.
        </p>
      </div>
    </div>
  )
}
