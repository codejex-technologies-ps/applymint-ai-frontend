import { Suspense } from 'react'
import { Metadata } from 'next'
import { DashboardPageContent } from './dashboard-content'

export const metadata: Metadata = {
  title: 'Dashboard | ApplyMint AI',
  description: 'Your AI-powered job search dashboard.',
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <DashboardPageContent />
    </Suspense>
  )
}