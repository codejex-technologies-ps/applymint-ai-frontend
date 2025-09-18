import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: string | number
    type: 'increase' | 'decrease' | 'neutral'
    label?: string
  }
  icon?: LucideIcon
  className?: string
  loading?: boolean
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  className,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className={cn("bg-card text-card-foreground border border-border", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          </CardTitle>
          {Icon && (
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          )}
        </CardHeader>
        <CardContent>
          <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1" />
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'increase':
        return 'text-chart-2'
      case 'decrease':
        return 'text-destructive'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <Card className={cn("bg-card text-card-foreground border border-border hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>
        {change && (
          <div className="flex items-center space-x-1 mt-1">
            <span className={cn("text-xs", getChangeColor(change.type))}>
              {change.type === 'increase' && '+'}
              {change.value}
              {change.type === 'increase' && '↑'}
              {change.type === 'decrease' && '↓'}
            </span>
            {change.label && (
              <span className="text-xs text-muted-foreground">
                {change.label}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}