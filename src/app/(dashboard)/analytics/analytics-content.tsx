'use client'

import { AnalyticsWidget } from '@/components/dashboard'

export function AnalyticsPageContent() {
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