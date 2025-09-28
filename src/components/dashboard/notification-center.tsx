import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDistanceToNow } from 'date-fns'
import { Notification } from '@/types'
import {
  Bell,
  BellRing,
  X,
  Check,
  Briefcase,
  Calendar,
  Star,
  Info,
  CheckCircle,
  Eye,
  MoreVertical,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface NotificationCenterProps {
  notifications?: Notification[]
  loading?: boolean
  className?: string
  onMarkAsRead?: (notificationId: string) => void
  onMarkAllAsRead?: () => void
  onDelete?: (notificationId: string) => void
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'JOB_MATCH':
      return Star
    case 'APPLICATION_UPDATE':
      return Briefcase
    case 'INTERVIEW_REMINDER':
      return Calendar
    case 'SYSTEM':
      return Info
    default:
      return Bell
  }
}

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'JOB_MATCH':
      return 'text-chart-1'
    case 'APPLICATION_UPDATE':
      return 'text-chart-2'
    case 'INTERVIEW_REMINDER':
      return 'text-chart-3'
    case 'SYSTEM':
      return 'text-chart-4'
    default:
      return 'text-muted-foreground'
  }
}

const getNotificationBadgeColor = (type: Notification['type']) => {
  switch (type) {
    case 'JOB_MATCH':
      return 'bg-chart-1/10 text-chart-1 border-chart-1/20'
    case 'APPLICATION_UPDATE':
      return 'bg-chart-2/10 text-chart-2 border-chart-2/20'
    case 'INTERVIEW_REMINDER':
      return 'bg-chart-3/10 text-chart-3 border-chart-3/20'
    case 'SYSTEM':
      return 'bg-chart-4/10 text-chart-4 border-chart-4/20'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user1',
    type: 'JOB_MATCH',
    title: '3 New Job Matches Found',
    message: 'We found 3 new jobs that match your criteria including Senior Developer at TechCorp.',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    actionUrl: '/dashboard/jobs/recommended',
  },
  {
    id: '2',
    userId: 'user1',
    type: 'APPLICATION_UPDATE',
    title: 'Application Status Update',
    message: 'Your application for Frontend Developer at DataFlow has been reviewed.',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    actionUrl: '/dashboard/applications/app123',
  },
  {
    id: '3',
    userId: 'user1',
    type: 'INTERVIEW_REMINDER',
    title: 'Interview Tomorrow',
    message: 'Don\'t forget your interview with AI Solutions tomorrow at 2:00 PM.',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    actionUrl: '/dashboard/interviews/int456',
  },
  {
    id: '4',
    userId: 'user1',
    type: 'SYSTEM',
    title: 'Profile Optimization Tips',
    message: 'Complete your profile to get 40% more job recommendations.',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    actionUrl: '/profile',
  },
  {
    id: '5',
    userId: 'user1',
    type: 'APPLICATION_UPDATE',
    title: 'Interview Scheduled',
    message: 'Congratulations! StartupXYZ has scheduled an interview with you.',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    actionUrl: '/dashboard/interviews/int789',
  },
]

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = mockNotifications,
  loading = false,
  className,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}) => {
  const [localNotifications, setLocalNotifications] = useState(notifications)
  
  const unreadCount = localNotifications.filter(n => !n.isRead).length

  const handleMarkAsRead = (notificationId: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(notificationId)
    } else {
      setLocalNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
    }
  }

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead()
    } else {
      setLocalNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      )
    }
  }

  const handleDelete = (notificationId: string) => {
    if (onDelete) {
      onDelete(notificationId)
    } else {
      setLocalNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      )
    }
  }

  if (loading) {
    return (
      <Card className={`bg-card text-card-foreground border border-border ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center space-x-2">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-primary" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-xs"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Mark all read
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        {localNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Notifications</h3>
            <p className="text-muted-foreground text-sm">
              You&apos;re all caught up! New notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {localNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type)
              const iconColor = getNotificationColor(notification.type)
              
              return (
                <div key={notification.id}>
                  <div className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                    notification.isRead 
                      ? 'bg-background' 
                      : 'bg-accent/5 border border-accent/10'
                  }`}>
                    <div className={`flex-shrink-0 p-2 rounded-full bg-background border border-border`}>
                      <Icon className={`h-4 w-4 ${iconColor}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`text-sm font-medium ${
                              notification.isRead ? 'text-muted-foreground' : 'text-foreground'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                            
                            <div className="flex items-center space-x-2">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="h-6 px-2 text-xs"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Mark read
                                </Button>
                              )}
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {notification.actionUrl && (
                                    <DropdownMenuItem>
                                      <Eye className="mr-2 h-3 w-3" />
                                      View Details
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(notification.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <X className="mr-2 h-3 w-3" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {index < localNotifications.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}