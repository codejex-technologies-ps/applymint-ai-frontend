import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  User,
  Upload,
  Settings,
  BookOpen,
  Target,
  PlusCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: string
  gradient?: string
}

export interface QuickActionsProps {
  actions?: QuickAction[]
  loading?: boolean
  className?: string
}

const defaultActions: QuickAction[] = [
  {
    id: 'search-jobs',
    title: 'Search Jobs',
    description: 'Find AI-matched job opportunities',
    icon: Search,
    href: '/dashboard/jobs/search',
    badge: 'Popular',
    gradient: 'from-chart-1 to-chart-2',
  },
  {
    id: 'edit-profile',
    title: 'Edit Profile',
    description: 'Update your personal information',
    icon: User,
    href: '/dashboard/profile',
    gradient: 'from-chart-2 to-chart-3',
  },
  {
    id: 'upload-resume',
    title: 'Upload Resume',
    description: 'Update your resume for better matching',
    icon: Upload,
    href: '/dashboard/profile/resume',
    gradient: 'from-chart-3 to-chart-4',
  },
  {
    id: 'job-preferences',
    title: 'Job Preferences',
    description: 'Set your job search criteria',
    icon: Target,
    href: '/dashboard/settings/preferences',
    gradient: 'from-chart-4 to-chart-5',
  },
  {
    id: 'interview-prep',
    title: 'Interview Prep',
    description: 'Practice with AI interview simulator',
    icon: BookOpen,
    href: '/dashboard/interview-prep',
    badge: 'AI Powered',
    gradient: 'from-chart-5 to-chart-1',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Manage account and notifications',
    icon: Settings,
    href: '/dashboard/settings',
    gradient: 'from-chart-1 to-chart-3',
  },
]

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions = defaultActions,
  loading = false,
  className,
}) => {
  if (loading) {
    return (
      <Card className={`bg-card text-card-foreground border border-border ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PlusCircle className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg border border-border animate-pulse">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-muted rounded" />
                  <div className="flex-1">
                    <div className="h-4 w-20 bg-muted rounded mb-1" />
                    <div className="h-3 w-32 bg-muted rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-card text-card-foreground border border-border ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <PlusCircle className="h-5 w-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => {
            const Icon = action.icon
            
            return (
              <Link key={action.id} href={action.href}>
                <div className="group p-4 rounded-lg border border-border hover:border-primary/20 transition-all duration-200 hover:shadow-md cursor-pointer bg-background/50 hover:bg-background">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${action.gradient || 'from-primary to-primary/80'} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {action.title}
                        </h3>
                        {action.badge && (
                          <Badge className="px-1.5 py-0.5 text-xs bg-accent text-accent-foreground">
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">
                        {action.description}
                      </p>
                      
                      <div className="flex items-center text-xs text-primary group-hover:text-primary/80 transition-colors">
                        <span>Get started</span>
                        <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Need help getting started?</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/help">
                View Guide
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}