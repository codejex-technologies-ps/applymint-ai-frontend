'use client'

import { Suspense } from 'react'
import { 
  DashboardLayout,
  StatsOverview,
  ActivityFeed,
  QuickActions,
  JobRecommendations,
  mockDashboardStats,
  mockActivities,
} from '@/components/dashboard'

function DashboardPageContent() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your AI-powered job search progress.
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={mockDashboardStats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Takes 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <QuickActions />
          
          {/* Activity Feed */}
          <ActivityFeed activities={mockActivities} />
        </div>

        {/* Right Column - Takes 1/3 width on large screens */}
        <div className="space-y-6">
          {/* Job Recommendations */}
          <JobRecommendations />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <DashboardPageContent />
      </Suspense>
    </DashboardLayout>
  )
}