import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  TrendingUp,
  Building,
  MapPin,
  DollarSign,
  Clock,
  ExternalLink,
  Star,
  Target,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

export interface JobRecommendation {
  id: string
  title: string
  company: string
  location: string
  salary?: {
    min: number
    max: number
    currency: string
  }
  matchScore: number
  postedAt: Date
  isRemote: boolean
  tags: string[]
  description: string
}

export interface JobRecommendationsProps {
  recommendations?: JobRecommendation[]
  loading?: boolean
  className?: string
  maxJobs?: number
}

const formatSalary = (salary: JobRecommendation['salary']) => {
  if (!salary) return null
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: salary.currency,
    minimumFractionDigits: 0,
  })
  return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`
}

const getMatchScoreColor = (score: number) => {
  if (score >= 90) return 'text-chart-2'
  if (score >= 80) return 'text-chart-1'
  if (score >= 70) return 'text-chart-4'
  return 'text-muted-foreground'
}

const getMatchScoreBg = (score: number) => {
  if (score >= 90) return 'bg-chart-2/10 border-chart-2/20'
  if (score >= 80) return 'bg-chart-1/10 border-chart-1/20'
  if (score >= 70) return 'bg-chart-4/10 border-chart-4/20'
  return 'bg-muted/10 border-border'
}

// Mock data for development
const mockRecommendations: JobRecommendation[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: { min: 120000, max: 160000, currency: 'USD' },
    matchScore: 94,
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRemote: true,
    tags: ['React', 'TypeScript', 'Next.js'],
    description: 'Join our innovative team building cutting-edge web applications...',
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'DataFlow Solutions',
    location: 'Austin, TX',
    salary: { min: 100000, max: 130000, currency: 'USD' },
    matchScore: 87,
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isRemote: false,
    tags: ['Node.js', 'Python', 'AWS'],
    description: 'Build scalable data processing systems for enterprise clients...',
  },
  {
    id: '3',
    title: 'Software Engineer',
    company: 'AI Innovations',
    location: 'Remote',
    salary: { min: 90000, max: 120000, currency: 'USD' },
    matchScore: 82,
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isRemote: true,
    tags: ['Machine Learning', 'Python', 'TensorFlow'],
    description: 'Work on AI-powered products that are changing the industry...',
  },
]

export const JobRecommendations: React.FC<JobRecommendationsProps> = ({
  recommendations = mockRecommendations,
  loading = false,
  className,
  maxJobs = 3,
}) => {
  const displayJobs = recommendations.slice(0, maxJobs)

  if (loading) {
    return (
      <Card className={`bg-card text-card-foreground border border-border ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>AI Job Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg border border-border animate-pulse">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="h-5 w-48 bg-muted rounded mb-2" />
                    <div className="h-4 w-32 bg-muted rounded mb-1" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                  <div className="h-6 w-12 bg-muted rounded" />
                </div>
                <div className="flex space-x-2 mb-3">
                  <div className="h-5 w-16 bg-muted rounded" />
                  <div className="h-5 w-20 bg-muted rounded" />
                </div>
                <div className="h-8 w-full bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (displayJobs.length === 0) {
    return (
      <Card className={`bg-card text-card-foreground border border-border ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>AI Job Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Recommendations Yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Complete your profile to receive AI-powered job recommendations.
            </p>
            <Button asChild>
              <Link href="/profile">
                Complete Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-card text-card-foreground border border-border ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>AI Job Recommendations</span>
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/jobs/recommended">
            View All
            <ExternalLink className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayJobs.map((job, index) => (
            <div key={job.id}>
              <div className="group p-4 rounded-lg border border-border hover:border-primary/20 transition-all duration-200 hover:shadow-sm cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {job.title}
                      </h3>
                      {job.isRemote && (
                        <Badge variant="secondary" className="text-xs">
                          Remote
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center space-x-1">
                        <Building className="h-3 w-3" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{formatSalary(job.salary)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Badge className={`ml-2 px-2 py-1 text-xs font-medium border ${getMatchScoreBg(job.matchScore)} ${getMatchScoreColor(job.matchScore)}`}>
                    {job.matchScore}% Match
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  {job.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                  {job.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{job.tags.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      Posted {Math.floor((Date.now() - job.postedAt.getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Star className="h-3 w-3" />
                    </Button>
                    <Button size="sm" className="h-7 px-3 text-xs" asChild>
                      <Link href={`/dashboard/jobs/${job.id}`}>
                        Apply
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              {index < displayJobs.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Recommendations improve as you apply to more jobs</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}