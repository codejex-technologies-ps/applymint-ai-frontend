import { eq, and, desc, asc, ilike, or, gte, lte, inArray } from 'drizzle-orm';
import { db } from '@/lib/db/connection';
import { jobs, companies, jobApplications, savedJobs } from '@/lib/db/schema';
import type { 
  Job, 
  NewJob, 
  UpdateJob, 
  JobWithCompany, 
  JobSearchFilters,
  DrizzlePaginatedResponse 
} from '@/types/drizzle';

// Drizzle-based jobs service
export const drizzleJobsService = {
  // Get job by ID with company information
  async getJobById(id: string): Promise<JobWithCompany | null> {
    try {
      const result = await db
        .select({
          job: jobs,
          company: companies,
        })
        .from(jobs)
        .leftJoin(companies, eq(jobs.companyId, companies.id))
        .where(eq(jobs.id, id))
        .limit(1);

      if (result.length === 0) return null;

      const { job, company } = result[0];
      return {
        ...job,
        company: company || undefined,
      };
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      return null;
    }
  },

  // Search jobs with filters and pagination
  async searchJobs(
    filters: JobSearchFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<DrizzlePaginatedResponse<JobWithCompany>> {
    try {
      const offset = (page - 1) * pageSize;
      const conditions = [];

      // Build dynamic where conditions
      if (filters.query) {
        conditions.push(
          or(
            ilike(jobs.title, `%${filters.query}%`),
            ilike(jobs.description, `%${filters.query}%`)
          )
        );
      }

      if (filters.location) {
        conditions.push(ilike(jobs.location, `%${filters.location}%`));
      }

      if (filters.jobTypes && filters.jobTypes.length > 0) {
        conditions.push(inArray(jobs.jobType, filters.jobTypes as any));
      }

      if (filters.experienceLevel) {
        conditions.push(eq(jobs.experienceLevel, filters.experienceLevel as any));
      }

      if (filters.salaryMin) {
        conditions.push(gte(jobs.salaryMin, filters.salaryMin.toString()));
      }

      if (filters.salaryMax) {
        conditions.push(lte(jobs.salaryMax, filters.salaryMax.toString()));
      }

      if (filters.isRemote !== undefined) {
        conditions.push(eq(jobs.isRemote, filters.isRemote));
      }

      if (filters.companyId) {
        conditions.push(eq(jobs.companyId, filters.companyId));
      }

      // Always filter for active jobs
      conditions.push(eq(jobs.isActive, true));

      // Build the where clause
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Get total count
      const countResult = await db
        .select({ count: jobs.id })
        .from(jobs)
        .where(whereClause);

      const totalCount = countResult.length;

      // Get paginated results
      const result = await db
        .select({
          job: jobs,
          company: companies,
        })
        .from(jobs)
        .leftJoin(companies, eq(jobs.companyId, companies.id))
        .where(whereClause)
        .orderBy(desc(jobs.postedAt))
        .limit(pageSize)
        .offset(offset);

      const data = result.map(({ job, company }) => ({
        ...job,
        company: company || undefined,
      }));

      const totalPages = Math.ceil(totalCount / pageSize);

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
      };
    } catch (error) {
      console.error('Error searching jobs:', error);
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
      };
    }
  },

  // Create new job
  async createJob(jobData: NewJob): Promise<Job | null> {
    try {
      const result = await db
        .insert(jobs)
        .values({
          ...jobData,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error('Error creating job:', error);
      throw new Error(`Failed to create job: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Update job
  async updateJob(id: string, updates: UpdateJob): Promise<Job | null> {
    try {
      const result = await db
        .update(jobs)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, id))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error('Error updating job:', error);
      throw new Error(`Failed to update job: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Delete job (soft delete by setting isActive to false)
  async deleteJob(id: string): Promise<boolean> {
    try {
      const result = await db
        .update(jobs)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, id))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error('Error deleting job:', error);
      return false;
    }
  },

  // Get jobs by company
  async getJobsByCompany(companyId: string, isActive = true): Promise<Job[]> {
    try {
      const result = await db
        .select()
        .from(jobs)
        .where(and(
          eq(jobs.companyId, companyId),
          eq(jobs.isActive, isActive)
        ))
        .orderBy(desc(jobs.postedAt));

      return result;
    } catch (error) {
      console.error('Error fetching jobs by company:', error);
      return [];
    }
  },

  // Get user's applied jobs
  async getUserAppliedJobs(userId: string): Promise<JobWithCompany[]> {
    try {
      const result = await db
        .select({
          job: jobs,
          company: companies,
        })
        .from(jobApplications)
        .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
        .leftJoin(companies, eq(jobs.companyId, companies.id))
        .where(eq(jobApplications.userId, userId))
        .orderBy(desc(jobApplications.appliedAt));

      return result.map(({ job, company }) => ({
        ...job,
        company: company || undefined,
      }));
    } catch (error) {
      console.error('Error fetching user applied jobs:', error);
      return [];
    }
  },

  // Get user's saved jobs
  async getUserSavedJobs(userId: string): Promise<JobWithCompany[]> {
    try {
      const result = await db
        .select({
          job: jobs,
          company: companies,
        })
        .from(savedJobs)
        .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
        .leftJoin(companies, eq(jobs.companyId, companies.id))
        .where(eq(savedJobs.userId, userId))
        .orderBy(desc(savedJobs.savedAt));

      return result.map(({ job, company }) => ({
        ...job,
        company: company || undefined,
      }));
    } catch (error) {
      console.error('Error fetching user saved jobs:', error);
      return [];
    }
  },

  // Get similar jobs (based on skills and job type)
  async getSimilarJobs(jobId: string, limit = 5): Promise<JobWithCompany[]> {
    try {
      // First get the reference job
      const referenceJob = await this.getJobById(jobId);
      if (!referenceJob) return [];

      const conditions = [];

      // Exclude the current job
      conditions.push(eq(jobs.isActive, true));
      // conditions.push(ne(jobs.id, jobId)); // Uncomment when ne is available

      // Match job type if available
      if (referenceJob.jobType) {
        conditions.push(eq(jobs.jobType, referenceJob.jobType));
      }

      // Match experience level if available
      if (referenceJob.experienceLevel) {
        conditions.push(eq(jobs.experienceLevel, referenceJob.experienceLevel));
      }

      const result = await db
        .select({
          job: jobs,
          company: companies,
        })
        .from(jobs)
        .leftJoin(companies, eq(jobs.companyId, companies.id))
        .where(and(...conditions))
        .orderBy(desc(jobs.postedAt))
        .limit(limit);

      return result.map(({ job, company }) => ({
        ...job,
        company: company || undefined,
      }));
    } catch (error) {
      console.error('Error fetching similar jobs:', error);
      return [];
    }
  },

  // Get job statistics
  async getJobStats() {
    try {
      const totalJobs = await db
        .select({ count: jobs.id })
        .from(jobs)
        .where(eq(jobs.isActive, true));

      const recentJobs = await db
        .select({ count: jobs.id })
        .from(jobs)
        .where(and(
          eq(jobs.isActive, true),
          gte(jobs.postedAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last 7 days
        ));

      return {
        totalActiveJobs: totalJobs.length,
        newJobsThisWeek: recentJobs.length,
      };
    } catch (error) {
      console.error('Error fetching job stats:', error);
      return {
        totalActiveJobs: 0,
        newJobsThisWeek: 0,
      };
    }
  },
};