import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Contact Us
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>
          Have a question, feedback, or a story idea to share? We&apos;d love to hear from you.
        </p>

        <p>
          You can reach us directly by email at
          {' '}
          <a href="mailto:contact@topcollec.example" className="text-blue-600 dark:text-blue-400 underline">
            contact@topcollec.example
          </a>
          .
        </p>

        <h2>Contact Form</h2>
        <p>
          Prefer using a form? Fill out the fields below and we&apos;ll get back to you as soon as we can.
        </p>

        <form className="mt-6 space-y-4 max-w-xl">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
              placeholder="How can we help?"
            />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            This demo form does not send data yet. You can update it later to connect to your preferred email or backend service.
          </p>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 text-white px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
