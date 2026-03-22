import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Terms of Service
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
        <p>
          These Terms of Service outline the rules and conditions for using this website and its
          content.
        </p>

        <h2>Use of Content</h2>
        <p>
          All stories, articles, and other content on this site are provided for your personal,
          non‑commercial use unless otherwise stated. You agree not to copy, redistribute, or use
          the content in ways that infringe on our rights or the rights of our contributors.
        </p>

        <h2>User Conduct</h2>
        <p>
          When interacting with our content or submitting comments or messages, you agree not to
          engage in unlawful, hateful, or abusive behavior.
        </p>

        <h2>Disclaimers</h2>
        <p>
          We make reasonable efforts to keep the site available and the information accurate, but we
          do not guarantee that the site will be error‑free or uninterrupted. Your use of the site
          is at your own risk.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. When we do, we will revise the "Last
          updated" date at the bottom of this page. Continued use of the site after changes are
          posted means you accept the updated Terms.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about these Terms, please contact us at
          {' '}
          <a href="mailto:contact@topcollec.example" className="text-blue-600 dark:text-blue-400 underline">
            contact@topcollec.example
          </a>
          .
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          Last updated: {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
