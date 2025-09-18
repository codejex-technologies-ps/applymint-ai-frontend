'use client'

import { Suspense } from 'react'
import { DashboardLayout, AnalyticsWidget } from '@/components/dashboard'

function AnalyticsPageContent() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed insights into your job search performance and trends.
        </p>
      </div>

      {/* Analytics Widgets */}
      <AnalyticsWidget />
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <AnalyticsPageContent />
      </Suspense>
    </DashboardLayout>
  )
}