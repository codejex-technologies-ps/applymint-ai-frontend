'use client'

import React from 'react'
import Image from 'next/image'
import { MapPin, Clock, Bookmark, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatSalary, getDaysAgo } from '@/lib/utils'
import type { Job } from '@/types'

interface JobCardProps {
  job: Job
  onSave?: (jobId: string) => void
  onApply?: (jobId: string) => void
  className?: string
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onSave,
  onApply,
  className
}) => {
  const handleSave = () => {
    onSave?.(job.id)
  }

  const handleApply = () => {
    onApply?.(job.id)
  }

  const getMatchScoreColor = (score?: number) => {
    if (!score) return 'bg-muted text-muted-foreground'
    if (score >= 80) return 'bg-chart-2 text-chart-2 bg-opacity-10 border border-chart-2/20'
    if (score >= 60) return 'bg-chart-4 text-chart-4 bg-opacity-10 border border-chart-4/20'
    return 'bg-destructive text-destructive-foreground bg-opacity-10 border border-destructive/20'
  }

  return (
    <Card className={cn('bg-card text-card-foreground border-border hover:shadow-lg transition-all duration-200 hover:-translate-y-1', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {job.companyLogo && (
              <div className="flex-shrink-0">
                <Image
                  src={job.companyLogo}
                  alt={`${job.company} logo`}
                  width={48}
                  height={48}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-primary truncate">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                {job.company}
              </p>
              
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                  {job.isRemote && (
                    <Badge variant="secondary" className="ml-1 bg-accent text-accent-foreground">
                      Remote
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{getDaysAgo(job.postedAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            {job.matchScore && (
              <Badge 
                variant="outline"
                className={cn('text-xs font-medium', getMatchScoreColor(job.matchScore))}
              >
                {job.matchScore}% Match
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={cn(
                'p-2 hover:bg-accent hover:text-accent-foreground',
                job.isSaved && 'text-primary bg-primary/10'
              )}
            >
              <Bookmark className={cn('w-4 h-4', job.isSaved && 'fill-current')} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Job Type & Experience Level */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-secondary text-secondary-foreground border-border">
              {job.jobType.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className="bg-secondary text-secondary-foreground border-border">
              {job.experienceLevel}
            </Badge>
          </div>
          
          {/* Salary */}
          {job.salary && (
            <div className="text-sm">
              <span className="font-medium text-primary">
                {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
              </span>
            </div>
          )}
          
          {/* Job Description */}
          <p className="text-sm text-card-foreground line-clamp-3">
            {job.description}
          </p>
          
          {/* Skills */}
          {job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 5).map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-xs bg-muted text-muted-foreground"
                >
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 5 && (
                <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                  +{job.skills.length - 5} more
                </Badge>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1 border-border hover:bg-accent hover:text-accent-foreground"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Details</span>
            </Button>
            
            <Button
              onClick={handleApply}
              disabled={job.hasApplied}
              size="sm"
              className={cn(
                'min-w-[80px]',
                job.hasApplied 
                  ? 'bg-chart-2 text-chart-2 bg-opacity-10 border border-chart-2/20 hover:bg-chart-2 hover:bg-opacity-20' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              {job.hasApplied ? 'Applied' : 'Apply Now'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading skeleton component
export const JobCardSkeleton = () => {
  return (
    <Card className="animate-pulse bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <div className="h-6 bg-muted rounded w-20" />
            <div className="h-6 bg-muted rounded w-16" />
          </div>
          <div className="h-4 bg-muted rounded w-32" />
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-5/6" />
            <div className="h-3 bg-muted rounded w-3/4" />
          </div>
          <div className="flex justify-between pt-4 border-t border-border">
            <div className="h-8 bg-muted rounded w-24" />
            <div className="h-8 bg-muted rounded w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
