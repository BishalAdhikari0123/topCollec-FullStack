import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Privacy Policy
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
        <p>
          This Privacy Policy explains how we collect, use, and protect your information when you
          visit and use this website.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We may collect basic usage data such as your IP address, browser type, pages visited, and
          the time and date of your visit. If you choose to contact us, we may also collect your
          name, email address, and any information you include in your message.
        </p>

        <h2>Cookies and Analytics</h2>
        <p>
          We may use cookies and similar technologies to improve your experience on the site,
          remember your preferences (such as theme), and understand how visitors use our content.
        </p>

        <h2>Advertising and Google AdSense</h2>
        <p>
          This website may display ads served by Google or other third‑party ad networks.
          These partners may use cookies or similar technologies to serve personalized ads based on
          your visits to this and other websites.
        </p>
        <p>
          You can learn more about how Google uses data from partner sites and how to manage your ad
          settings by visiting Google&apos;s Ads Settings and Privacy pages.
        </p>

        <h2>Third‑Party Links</h2>
        <p>
          Our content may include links to external websites. We are not responsible for the privacy
          practices or content of those third‑party sites.
        </p>

        <h2>Data Retention</h2>
        <p>
          We keep personal information only for as long as necessary to provide our services or as
          required by law. When data is no longer needed, we take reasonable steps to delete or
          anonymize it.
        </p>

        <h2>Your Choices</h2>
        <ul>
          <li>You can adjust your browser settings to refuse cookies or alert you when cookies are being used.</li>
          <li>You can opt out of personalized advertising through Google&apos;s Ads Settings or industry opt‑out pages.</li>
        </ul>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we will revise the
          "Last updated" date at the bottom of this page.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or how your data is handled, please
          contact us at
          {' '}
          <a href="mailto:privacy@topcollec.example" className="text-blue-600 dark:text-blue-400 underline">
            privacy@topcollec.example
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
