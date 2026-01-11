// Prisma-based dashboard service
// Replaces drizzle-dashboard.ts with Prisma ORM implementation

import { prisma } from '@/lib/prisma'
import type { DashboardStats } from '@/components/dashboard/stats-overview'

// Dashboard data service using Prisma ORM
export const prismaDashboardService = {
  // Get comprehensive dashboard stats for a user
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      // Get current date for time-based calculations
      const now = new Date()
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      // Get total applications
      const totalApplications = await prisma.jobApplication.count({
        where: { userId },
      })

      // Get applications this week
      const weekApplications = await prisma.jobApplication.count({
        where: {
          userId,
          appliedAt: { gte: lastWeek },
        },
      })

      // Get interview sessions
      const totalInterviews = await prisma.interviewSession.count({
        where: { userId },
      })

      // Get offers (accepted applications)
      const totalOffers = await prisma.jobApplication.count({
        where: {
          userId,
          status: 'OFFER',
        },
      })

      // Calculate response rate (interviews / applications * 100)
      const responseRate = totalApplications > 0 
        ? Math.round((totalInterviews / totalApplications) * 100) 
        : 0

      // Calculate match score (this would be based on AI matching in real implementation)
      // For now, we'll use a calculation based on user activity
      const matchScore = Math.min(95, Math.max(0, 70 + (totalApplications * 2) + (totalInterviews * 5)))

      return {
        jobsApplied: totalApplications,
        jobsAppliedChange: weekApplications > 0 ? {
          value: weekApplications,
          type: 'increase',
          label: 'this week',
        } : undefined,
        interviews: totalInterviews,
        interviewsChange: totalInterviews > 0 ? {
          value: totalInterviews,
          type: 'increase',
          label: 'scheduled',
        } : undefined,
        matchScore,
        matchScoreChange: {
          value: matchScore > 80 ? 'Above average' : 'Below average',
          type: matchScore > 80 ? 'increase' : 'decrease',
        },
        responseRate,
        responseRateChange: responseRate > 0 ? {
          value: `${responseRate}%`,
          type: responseRate > 50 ? 'increase' : 'decrease',
          label: 'overall',
        } : undefined,
        offers: totalOffers,
        offersChange: totalOffers > 0 ? {
          value: totalOffers,
          type: 'increase',
          label: 'received',
        } : undefined,
        profileViews: Math.floor(Math.random() * 100) + 50, // Mock data for now
        profileViewsChange: {
          value: Math.floor(Math.random() * 20) + 5,
          type: 'increase',
          label: 'this week',
        },
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Return default values if there's an error
      return {
        jobsApplied: 0,
        interviews: 0,
        matchScore: 0,
        responseRate: 0,
        offers: 0,
        profileViews: 0,
      }
    }
  },

  // Get recent activity for the user
  async getRecentActivity(userId: string, limit = 10) {
    try {
      // Get recent job applications with job and company info
      const recentApplications = await prisma.jobApplication.findMany({
        where: { userId },
        include: {
          job: {
            include: {
              company: true,
            },
          },
        },
        orderBy: { appliedAt: 'desc' },
        take: limit,
      })

      // Get recent saved jobs
      const recentSavedJobs = await prisma.savedJob.findMany({
        where: { userId },
        include: {
          job: {
            include: {
              company: true,
            },
          },
        },
        orderBy: { savedAt: 'desc' },
        take: limit,
      })

      // Transform and combine activities
      const activities = [
        ...recentApplications.map(app => ({
          id: `app-${app.id}`,
          type: 'job_application' as const,
          title: `Applied to ${app.job.title || 'Unknown Position'}`,
          description: `at ${app.job.company?.name || 'Unknown Company'}`,
          timestamp: app.appliedAt,
          status: app.status,
        })),
        ...recentSavedJobs.map(saved => ({
          id: `saved-${saved.id}`,
          type: 'job_saved' as const,
          title: `Saved ${saved.job.title || 'Unknown Position'}`,
          description: `at ${saved.job.company?.name || 'Unknown Company'}`,
          timestamp: saved.savedAt,
        })),
      ]

      // Sort by timestamp and return limited results
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      return []
    }
  },

  // Get job recommendations based on user profile and activity
  async getJobRecommendations(userId: string, limit = 5) {
    try {
      // For now, get recent active jobs as recommendations
      // In a real implementation, this would use AI matching based on user profile, skills, etc.
      const jobs = await prisma.job.findMany({
        where: { isActive: true },
        include: {
          company: true,
        },
        orderBy: { postedAt: 'desc' },
        take: limit,
      })

      return jobs.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company?.name || 'Unknown Company',
        location: job.location,
        salary: job.salaryMin && job.salaryMax ? {
          min: parseInt(job.salaryMin.toString()),
          max: parseInt(job.salaryMax.toString()),
          currency: job.salaryCurrency || 'USD',
        } : undefined,
        matchScore: Math.floor(Math.random() * 30) + 70, // Mock match score
        postedAt: job.postedAt,
        isRemote: job.isRemote,
        tags: job.skills?.slice(0, 3) || [],
        description: job.description?.substring(0, 100) + '...' || '',
      }))
    } catch (error) {
      console.error('Error fetching job recommendations:', error)
      return []
    }
  },

  // Check if user is a first-time user (no applications, saved jobs, etc.)
  async isFirstTimeUser(userId: string): Promise<boolean> {
    try {
      const [applications, saved, interviews] = await Promise.all([
        prisma.jobApplication.count({ where: { userId } }),
        prisma.savedJob.count({ where: { userId } }),
        prisma.interviewSession.count({ where: { userId } }),
      ])

      const totalActivity = applications + saved + interviews

      return totalActivity === 0
    } catch (error) {
      console.error('Error checking first-time user status:', error)
      return true // Default to showing tour if there's an error
    }
  },
}
