'use client'

import { useState, useEffect } from 'react';
import { 
  StatsOverview,
  ActivityFeed,
  QuickActions,
  JobRecommendations,
} from '@/components/dashboard'
import { DashboardTour } from '@/components/dashboard/dashboard-tour';
import { DashboardEmptyState } from '@/components/dashboard/empty-state';
import { useAuth } from '@/components/auth/auth-provider';
import { dashboardService } from '@/lib/services/dashboard-service';
import type { DashboardStats } from '@/components/dashboard/stats-overview';
import type { RecentActivity } from '@/types';

export function DashboardPageContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [recommendations, setRecommendations] = useState<Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: { min: number; max: number; currency: string };
    matchScore: number;
    postedAt: Date;
    isRemote: boolean;
    tags: string[];
    description: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Load dashboard data
  useEffect(() => {
    if (!user?.id) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Check if user is first-time and should see tour
        const isFirstTimeUser = await dashboardService.isFirstTimeUser(user.id);
        setIsFirstTime(isFirstTimeUser);
        
        // Load dashboard data
        const [dashboardStats, recentActivity, jobRecommendations] = await Promise.all([
          dashboardService.getDashboardStats(user.id),
          dashboardService.getRecentActivity(user.id),
          dashboardService.getJobRecommendations(user.id),
        ]);

        setStats(dashboardStats);
        setActivities(recentActivity);
        setRecommendations(jobRecommendations);

        // Show tour for first-time users (with a small delay)
        if (isFirstTimeUser) {
          setTimeout(() => setShowTour(true), 1000);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Fallback to empty state
        setIsFirstTime(true);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  const handleTourComplete = () => {
    setShowTour(false);
    // Save tour completion status
    localStorage.setItem('dashboard-tour-completed', 'true');
    // Simulate user becoming active after tour
    if (user?.id) {
      dashboardService.markUserAsActive(user.id);
    }
  };

  const handleTourClose = () => {
    setShowTour(false);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Show empty state for first-time users
  if (isFirstTime && stats && stats.jobsApplied === 0) {
    return (
      <>
        <div className="p-6">
          <div className="dashboard-header space-y-2 mb-6">
            <h1 className="text-3xl font-bold text-primary">
              Welcome to ApplyMint AI! 👋
            </h1>
            <p className="text-muted-foreground">
              Let&apos;s get started on your AI-powered job search journey.
            </p>
          </div>
          
          <DashboardEmptyState />
        </div>
        
        <DashboardTour
          isOpen={showTour}
          onClose={handleTourClose}
          onComplete={handleTourComplete}
        />
      </>
    );
  }

  // Show regular dashboard with data
  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="dashboard-header space-y-2">
          <h1 className="text-3xl font-bold text-primary">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your AI-powered job search progress.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <StatsOverview stats={stats || {
            jobsApplied: 0,
            interviews: 0,
            matchScore: 0,
            responseRate: 0,
          }} loading={!stats} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Takes 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="quick-actions">
              <QuickActions />
            </div>
            
            {/* Activity Feed */}
            <div className="activity-feed">
              <ActivityFeed activities={activities} loading={!activities.length && loading} />
            </div>
          </div>

          {/* Right Column - Takes 1/3 width on large screens */}
          <div className="space-y-6">
            {/* Job Recommendations */}
            <div className="job-recommendations">
              <JobRecommendations 
                recommendations={recommendations} 
                loading={!recommendations.length && loading} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Tour */}
      <DashboardTour
        isOpen={showTour}
        onClose={handleTourClose}
        onComplete={handleTourComplete}
      />
    </>
  )
}