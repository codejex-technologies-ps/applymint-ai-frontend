import { eq, desc, count, and, gte } from 'drizzle-orm';
import { db } from '@/lib/db/connection';
import { 
  profiles, 
  jobApplications, 
  savedJobs, 
  interviewSessions,
  userAnalytics,
  jobs,
  companies 
} from '@/lib/db/schema';
import type { DashboardStats } from '@/components/dashboard/stats-overview';

// Dashboard data service using Drizzle ORM
export const drizzleDashboardService = {
  // Get comprehensive dashboard stats for a user
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      // Get current date for time-based calculations
      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Get total applications
      const totalApplicationsResult = await db
        .select({ count: count() })
        .from(jobApplications)
        .where(eq(jobApplications.userId, userId));

      // Get applications this week
      const weekApplicationsResult = await db
        .select({ count: count() })
        .from(jobApplications)
        .where(and(
          eq(jobApplications.userId, userId),
          gte(jobApplications.appliedAt, lastWeek)
        ));

      // Get interview sessions
      const interviewsResult = await db
        .select({ count: count() })
        .from(interviewSessions)
        .where(eq(interviewSessions.userId, userId));

      // Get offers (accepted applications)
      const offersResult = await db
        .select({ count: count() })
        .from(jobApplications)
        .where(and(
          eq(jobApplications.userId, userId),
          eq(jobApplications.status, 'OFFER')
        ));

      // Get saved jobs count
      const savedJobsResult = await db
        .select({ count: count() })
        .from(savedJobs)
        .where(eq(savedJobs.userId, userId));

      // Calculate response rate (interviews / applications * 100)
      const totalApplications = totalApplicationsResult[0]?.count || 0;
      const totalInterviews = interviewsResult[0]?.count || 0;
      const responseRate = totalApplications > 0 
        ? Math.round((totalInterviews / totalApplications) * 100) 
        : 0;

      // Calculate match score (this would be based on AI matching in real implementation)
      // For now, we'll use a calculation based on user activity
      const matchScore = Math.min(95, Math.max(0, 70 + (totalApplications * 2) + (totalInterviews * 5)));

      return {
        jobsApplied: totalApplications,
        jobsAppliedChange: weekApplicationsResult[0]?.count > 0 ? {
          value: weekApplicationsResult[0].count,
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
        offers: offersResult[0]?.count || 0,
        offersChange: offersResult[0]?.count > 0 ? {
          value: offersResult[0].count,
          type: 'increase',
          label: 'received',
        } : undefined,
        profileViews: Math.floor(Math.random() * 100) + 50, // Mock data for now
        profileViewsChange: {
          value: Math.floor(Math.random() * 20) + 5,
          type: 'increase',
          label: 'this week',
        },
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values if there's an error
      return {
        jobsApplied: 0,
        interviews: 0,
        matchScore: 0,
        responseRate: 0,
        offers: 0,
        profileViews: 0,
      };
    }
  },

  // Get recent activity for the user
  async getRecentActivity(userId: string, limit = 10) {
    try {
      // Get recent job applications with job and company info
      const recentApplications = await db
        .select({
          id: jobApplications.id,
          appliedAt: jobApplications.appliedAt,
          status: jobApplications.status,
          jobTitle: jobs.title,
          companyName: companies.name,
        })
        .from(jobApplications)
        .leftJoin(jobs, eq(jobApplications.jobId, jobs.id))
        .leftJoin(companies, eq(jobs.companyId, companies.id))
        .where(eq(jobApplications.userId, userId))
        .orderBy(desc(jobApplications.appliedAt))
        .limit(limit);

      // Get recent saved jobs
      const recentSavedJobs = await db
        .select({
          id: savedJobs.id,
          savedAt: savedJobs.savedAt,
          jobTitle: jobs.title,
          companyName: companies.name,
        })
        .from(savedJobs)
        .leftJoin(jobs, eq(savedJobs.jobId, jobs.id))
        .leftJoin(companies, eq(jobs.companyId, companies.id))
        .where(eq(savedJobs.userId, userId))
        .orderBy(desc(savedJobs.savedAt))
        .limit(limit);

      // Transform and combine activities
      const activities = [
        ...recentApplications.map(app => ({
          id: `app-${app.id}`,
          type: 'job_application' as const,
          title: `Applied to ${app.jobTitle || 'Unknown Position'}`,
          description: `at ${app.companyName || 'Unknown Company'}`,
          timestamp: app.appliedAt,
          status: app.status,
        })),
        ...recentSavedJobs.map(saved => ({
          id: `saved-${saved.id}`,
          type: 'job_saved' as const,
          title: `Saved ${saved.jobTitle || 'Unknown Position'}`,
          description: `at ${saved.companyName || 'Unknown Company'}`,
          timestamp: saved.savedAt,
        })),
      ];

      // Sort by timestamp and return limited results
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  },

  // Get job recommendations based on user profile and activity
  async getJobRecommendations(userId: string, limit = 5) {
    try {
      // For now, get recent active jobs as recommendations
      // In a real implementation, this would use AI matching based on user profile, skills, etc.
      const recommendations = await db
        .select({
          id: jobs.id,
          title: jobs.title,
          companyName: companies.name,
          location: jobs.location,
          isRemote: jobs.isRemote,
          salaryMin: jobs.salaryMin,
          salaryMax: jobs.salaryMax,
          salaryCurrency: jobs.salaryCurrency,
          postedAt: jobs.postedAt,
          description: jobs.description,
          skills: jobs.skills,
        })
        .from(jobs)
        .leftJoin(companies, eq(jobs.companyId, companies.id))
        .where(eq(jobs.isActive, true))
        .orderBy(desc(jobs.postedAt))
        .limit(limit);

      return recommendations.map(job => ({
        id: job.id,
        title: job.title,
        company: job.companyName || 'Unknown Company',
        location: job.location,
        salary: job.salaryMin && job.salaryMax ? {
          min: parseInt(job.salaryMin),
          max: parseInt(job.salaryMax),
          currency: job.salaryCurrency || 'USD',
        } : undefined,
        matchScore: Math.floor(Math.random() * 30) + 70, // Mock match score
        postedAt: job.postedAt,
        isRemote: job.isRemote,
        tags: job.skills?.slice(0, 3) || [],
        description: job.description?.substring(0, 100) + '...' || '',
      }));
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      return [];
    }
  },

  // Check if user is a first-time user (no applications, saved jobs, etc.)
  async isFirstTimeUser(userId: string): Promise<boolean> {
    try {
      const [applications, saved, interviews] = await Promise.all([
        db.select({ count: count() }).from(jobApplications).where(eq(jobApplications.userId, userId)),
        db.select({ count: count() }).from(savedJobs).where(eq(savedJobs.userId, userId)),
        db.select({ count: count() }).from(interviewSessions).where(eq(interviewSessions.userId, userId)),
      ]);

      const totalActivity = (applications[0]?.count || 0) + 
                           (saved[0]?.count || 0) + 
                           (interviews[0]?.count || 0);

      return totalActivity === 0;
    } catch (error) {
      console.error('Error checking first-time user status:', error);
      return true; // Default to showing tour if there's an error
    }
  },
};