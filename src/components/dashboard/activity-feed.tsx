import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDistanceToNow } from 'date-fns'
import { RecentActivity } from '@/types'
import {
  Briefcase,
  Calendar,
  User,
  Star,
  Eye,
  Clock,
  AlertCircle,
} from 'lucide-react'

export interface ActivityFeedProps {
  activities: RecentActivity[]
  loading?: boolean
  className?: string
  maxItems?: number
}

const getActivityIcon = (type: RecentActivity['type']) => {
  switch (type) {
    case 'APPLICATION_SUBMITTED':
      return Briefcase
    case 'INTERVIEW_SCHEDULED':
      return Calendar
    case 'PROFILE_UPDATED':
      return User
    case 'JOB_SAVED':
      return Star
    default:
      return AlertCircle
  }
}

const getActivityColor = (type: RecentActivity['type']) => {
  switch (type) {
    case 'APPLICATION_SUBMITTED':
      return 'text-chart-1'
    case 'INTERVIEW_SCHEDULED':
      return 'text-chart-2'
    case 'PROFILE_UPDATED':
      return 'text-chart-3'
    case 'JOB_SAVED':
      return 'text-chart-4'
    default:
      return 'text-muted-foreground'
  }
}

const getActivityBadgeColor = (type: RecentActivity['type']) => {
  switch (type) {
    case 'APPLICATION_SUBMITTED':
      return 'bg-chart-1/10 text-chart-1 border-chart-1/20'
    case 'INTERVIEW_SCHEDULED':
      return 'bg-chart-2/10 text-chart-2 border-chart-2/20'
    case 'PROFILE_UPDATED':
      return 'bg-chart-3/10 text-chart-3 border-chart-3/20'
    case 'JOB_SAVED':
      return 'bg-chart-4/10 text-chart-4 border-chart-4/20'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

const formatActivityType = (type: RecentActivity['type']) => {
  switch (type) {
    case 'APPLICATION_SUBMITTED':
      return 'Application'
    case 'INTERVIEW_SCHEDULED':
      return 'Interview'
    case 'PROFILE_UPDATED':
      return 'Profile Update'
    case 'JOB_SAVED':
      return 'Saved Job'
    default:
      return 'Activity'
  }
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  loading = false,
  className,
  maxItems = 10,
}) => {
  const displayActivities = activities.slice(0, maxItems)

  if (loading) {
    return (
      <Card className={`bg-card text-card-foreground border border-border ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (displayActivities.length === 0) {
    return (
      <Card className={`bg-card text-card-foreground border border-border ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Eye className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Recent Activity</h3>
            <p className="text-muted-foreground text-sm">
              Your job search activities will appear here once you start applying to jobs.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-card text-card-foreground border border-border ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type)
            const iconColor = getActivityColor(activity.type)
            const badgeColor = getActivityBadgeColor(activity.type)
            
            return (
              <div key={activity.id}>
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 p-2 rounded-full bg-background border border-border`}>
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={`px-2 py-0.5 text-xs font-medium border ${badgeColor}`}>
                        {formatActivityType(activity.type)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm font-medium text-foreground mb-1">
                      {activity.title}
                    </p>
                    
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 text-right">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                
                {index < displayActivities.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Mock data for development/testing
export const mockActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'APPLICATION_SUBMITTED',
    title: 'Applied to Software Engineer at TechCorp',
    description: 'Your application has been submitted successfully',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    type: 'INTERVIEW_SCHEDULED',
    title: 'Interview scheduled with DataFlow Inc.',
    description: 'Technical interview scheduled for tomorrow at 2:00 PM',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '3',
    type: 'PROFILE_UPDATED',
    title: 'Profile updated successfully',
    description: 'Added new skills and updated work experience',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '4',
    type: 'JOB_SAVED',
    title: 'Saved Frontend Developer position',
    description: 'Job saved at AI Solutions for later review',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: '5',
    type: 'APPLICATION_SUBMITTED',
    title: 'Applied to Full Stack Developer at StartupXYZ',
    description: 'Application submitted with optimized resume',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
]