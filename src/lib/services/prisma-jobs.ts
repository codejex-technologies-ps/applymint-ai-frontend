// Prisma-based jobs service
// Replaces drizzle-jobs.ts with Prisma ORM implementation

import { prisma } from '@/lib/prisma'
import type { Job, Company, Prisma } from '@prisma/client'
import type { 
  JobWithCompany, 
  JobSearchFilters,
  DrizzlePaginatedResponse 
} from '@/types/drizzle'

// Define update type locally
type UpdateJob = Prisma.JobUpdateInput

// Prisma-based jobs service
export const prismaJobsService = {
  // Get job by ID with company information
  async getJobById(id: string): Promise<JobWithCompany | null> {
    try {
      const job = await prisma.job.findUnique({
        where: { id },
        include: {
          company: true,
        },
      })

      if (!job) return null

      return {
        ...job,
        company: job.company || undefined,
        salaryMin: job.salaryMin?.toString() || null,
        salaryMax: job.salaryMax?.toString() || null,
      } as JobWithCompany
    } catch (error) {
      console.error('Error fetching job by ID:', error)
      return null
    }
  },

  // Search jobs with filters and pagination
  async searchJobs(
    filters: JobSearchFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<DrizzlePaginatedResponse<JobWithCompany>> {
    try {
      const skip = (page - 1) * pageSize

      // Build where clause
      const where: Prisma.JobWhereInput = {
        isActive: true,
      }

      if (filters.query) {
        where.OR = [
          { title: { contains: filters.query, mode: 'insensitive' } },
          { description: { contains: filters.query, mode: 'insensitive' } },
        ]
      }

      if (filters.location) {
        where.location = { contains: filters.location, mode: 'insensitive' }
      }

      if (filters.jobTypes && filters.jobTypes.length > 0) {
        where.jobType = { in: filters.jobTypes }
      }

      if (filters.experienceLevel) {
        where.experienceLevel = filters.experienceLevel
      }

      if (filters.salaryMin) {
        where.salaryMin = { gte: filters.salaryMin }
      }

      if (filters.salaryMax) {
        where.salaryMax = { lte: filters.salaryMax }
      }

      if (filters.isRemote !== undefined) {
        where.isRemote = filters.isRemote
      }

      if (filters.companyId) {
        where.companyId = filters.companyId
      }

      // Get total count
      const totalCount = await prisma.job.count({ where })

      // Get paginated results
      const jobs = await prisma.job.findMany({
        where,
        include: {
          company: true,
        },
        orderBy: { postedAt: 'desc' },
        take: pageSize,
        skip,
      })

      const data = jobs.map(job => ({
        ...job,
        company: job.company || undefined,
        salaryMin: job.salaryMin?.toString() || null,
        salaryMax: job.salaryMax?.toString() || null,
      })) as JobWithCompany[]

      const totalPages = Math.ceil(totalCount / pageSize)

      return {
        data,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      }
    } catch (error) {
      console.error('Error searching jobs:', error)
      return {
        data: [],
        pagination: {
          page,
          pageSize,
          totalCount: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }
    }
  },

  // Create new job
  async createJob(jobData: Prisma.JobCreateInput): Promise<Job | null> {
    try {
      const job = await prisma.job.create({
        data: jobData,
      })
      return job
    } catch (error) {
      console.error('Error creating job:', error)
      throw new Error(`Failed to create job: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },

  // Update job
  async updateJob(id: string, updates: UpdateJob): Promise<Job | null> {
    try {
      const job = await prisma.job.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      })
      return job
    } catch (error) {
      console.error('Error updating job:', error)
      throw new Error(`Failed to update job: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },

  // Delete job (soft delete by setting isActive to false)
  async deleteJob(id: string): Promise<boolean> {
    try {
      await prisma.job.update({
        where: { id },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      })
      return true
    } catch (error) {
      console.error('Error deleting job:', error)
      return false
    }
  },

  // Get jobs by company
  async getJobsByCompany(companyId: string, isActive = true): Promise<Job[]> {
    try {
      const jobs = await prisma.job.findMany({
        where: {
          companyId,
          isActive,
        },
        orderBy: { postedAt: 'desc' },
      })
      return jobs
    } catch (error) {
      console.error('Error fetching jobs by company:', error)
      return []
    }
  },

  // Get user's applied jobs
  async getUserAppliedJobs(userId: string): Promise<JobWithCompany[]> {
    try {
      const applications = await prisma.jobApplication.findMany({
        where: { userId },
        include: {
          job: {
            include: {
              company: true,
            },
          },
        },
        orderBy: { appliedAt: 'desc' },
      })

      return applications.map(app => ({
        ...app.job,
        company: app.job.company || undefined,
        salaryMin: app.job.salaryMin?.toString() || null,
        salaryMax: app.job.salaryMax?.toString() || null,
      })) as JobWithCompany[]
    } catch (error) {
      console.error('Error fetching user applied jobs:', error)
      return []
    }
  },

  // Get user's saved jobs
  async getUserSavedJobs(userId: string): Promise<JobWithCompany[]> {
    try {
      const savedJobs = await prisma.savedJob.findMany({
        where: { userId },
        include: {
          job: {
            include: {
              company: true,
            },
          },
        },
        orderBy: { savedAt: 'desc' },
      })

      return savedJobs.map(saved => ({
        ...saved.job,
        company: saved.job.company || undefined,
        salaryMin: saved.job.salaryMin?.toString() || null,
        salaryMax: saved.job.salaryMax?.toString() || null,
      })) as JobWithCompany[]
    } catch (error) {
      console.error('Error fetching user saved jobs:', error)
      return []
    }
  },

  // Get similar jobs (based on job type and experience level)
  async getSimilarJobs(jobId: string, limit = 5): Promise<JobWithCompany[]> {
    try {
      // First get the reference job
      const referenceJob = await prisma.job.findUnique({
        where: { id: jobId },
      })

      if (!referenceJob) return []

      const where: Prisma.JobWhereInput = {
        isActive: true,
        NOT: { id: jobId },
      }

      // Match job type if available
      if (referenceJob.jobType) {
        where.jobType = referenceJob.jobType
      }

      // Match experience level if available
      if (referenceJob.experienceLevel) {
        where.experienceLevel = referenceJob.experienceLevel
      }

      const jobs = await prisma.job.findMany({
        where,
        include: {
          company: true,
        },
        orderBy: { postedAt: 'desc' },
        take: limit,
      })

      return jobs.map(job => ({
        ...job,
        company: job.company || undefined,
        salaryMin: job.salaryMin?.toString() || null,
        salaryMax: job.salaryMax?.toString() || null,
      })) as JobWithCompany[]
    } catch (error) {
      console.error('Error fetching similar jobs:', error)
      return []
    }
  },

  // Get job statistics
  async getJobStats() {
    try {
      const totalActiveJobs = await prisma.job.count({
        where: { isActive: true },
      })

      const newJobsThisWeek = await prisma.job.count({
        where: {
          isActive: true,
          postedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      })

      return {
        totalActiveJobs,
        newJobsThisWeek,
      }
    } catch (error) {
      console.error('Error fetching job stats:', error)
      return {
        totalActiveJobs: 0,
        newJobsThisWeek: 0,
      }
    }
  },
}
