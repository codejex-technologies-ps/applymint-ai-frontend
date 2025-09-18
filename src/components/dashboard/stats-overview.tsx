import React from 'react'
import { StatsCard, StatsCardProps } from './stats-card'
import {
  Briefcase,
  Calendar,
  Target,
  TrendingUp,
  Users,
  CheckCircle,
} from 'lucide-react'

export interface DashboardStats {
  jobsApplied: number
  jobsAppliedChange?: StatsCardProps['change']
  interviews: number
  interviewsChange?: StatsCardProps['change']
  matchScore: number
  matchScoreChange?: StatsCardProps['change']
  responseRate: number
  responseRateChange?: StatsCardProps['change']
  offers?: number
  offersChange?: StatsCardProps['change']
  profileViews?: number
  profileViewsChange?: StatsCardProps['change']
}

export interface StatsOverviewProps {
  stats: DashboardStats
  loading?: boolean
  className?: string
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  stats,
  loading = false,
  className,
}) => {
  const statsCards: (StatsCardProps & { key: string })[] = [
    {
      key: 'jobs-applied',
      title: 'Jobs Applied',
      value: stats.jobsApplied,
      change: stats.jobsAppliedChange,
      icon: Briefcase,
    },
    {
      key: 'interviews',
      title: 'Interviews',
      value: stats.interviews,
      change: stats.interviewsChange,
      icon: Calendar,
    },
    {
      key: 'match-score',
      title: 'Match Score',
      value: `${stats.matchScore}%`,
      change: stats.matchScoreChange,
      icon: Target,
    },
    {
      key: 'response-rate',
      title: 'Response Rate',
      value: `${stats.responseRate}%`,
      change: stats.responseRateChange,
      icon: TrendingUp,
    },
  ]

  // Add optional stats if they exist
  if (stats.offers !== undefined) {
    statsCards.push({
      key: 'offers',
      title: 'Job Offers',
      value: stats.offers,
      change: stats.offersChange,
      icon: CheckCircle,
    })
  }

  if (stats.profileViews !== undefined) {
    statsCards.push({
      key: 'profile-views',
      title: 'Profile Views',
      value: stats.profileViews,
      change: stats.profileViewsChange,
      icon: Users,
    })
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ${className}`}>
      {statsCards.map((stat) => (
        <StatsCard
          key={stat.key}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          loading={loading}
        />
      ))}
    </div>
  )
}

// Mock data for development/testing
export const mockDashboardStats: DashboardStats = {
  jobsApplied: 24,
  jobsAppliedChange: {
    value: 3,
    type: 'increase',
    label: 'this week',
  },
  interviews: 5,
  interviewsChange: {
    value: 2,
    type: 'increase',
    label: 'scheduled',
  },
  matchScore: 94,
  matchScoreChange: {
    value: 'Above average',
    type: 'increase',
  },
  responseRate: 68,
  responseRateChange: {
    value: '12%',
    type: 'increase',
    label: 'from last month',
  },
  offers: 2,
  offersChange: {
    value: 1,
    type: 'increase',
    label: 'pending',
  },
  profileViews: 156,
  profileViewsChange: {
    value: 23,
    type: 'increase',
    label: 'this week',
  },
}