import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | ApplyMint AI',
  description: 'Learn how ApplyMint AI protects your privacy and handles your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-4 text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information We Collect
            </h2>
            <p className="text-gray-600 mb-4">
              At ApplyMint AI, we collect information to provide you with the best possible 
              job search experience. This includes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Personal information you provide (name, email, phone number)</li>
              <li>Professional information (resume, work experience, skills)</li>
              <li>Job preferences and search history</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-600 mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Match you with relevant job opportunities</li>
              <li>Improve our AI recommendations</li>
              <li>Send you job alerts and notifications</li>
              <li>Provide customer support</li>
              <li>Improve our services</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information Sharing
            </h2>
            <p className="text-gray-600 mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Employers when you apply for jobs</li>
              <li>Service providers who help us operate our platform</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Security
            </h2>
            <p className="text-gray-600">
              We implement industry-standard security measures to protect your personal 
              information from unauthorized access, disclosure, alteration, and destruction.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Rights
            </h2>
            <p className="text-gray-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@applymint.ai" className="text-blue-600 hover:text-blue-800">
                privacy@applymint.ai
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
