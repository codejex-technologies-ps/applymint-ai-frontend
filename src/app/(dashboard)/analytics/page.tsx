import { Suspense } from 'react'
import { Metadata } from 'next'
import { AnalyticsPageContent } from './analytics-content'

export const metadata: Metadata = {
  title: 'Analytics | ApplyMint AI',
  description: 'Detailed insights into your job search performance and trends.',
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <AnalyticsPageContent />
    </Suspense>
  )
}