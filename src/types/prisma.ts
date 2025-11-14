// Prisma ORM type mappings and utility types
// This file provides common types used throughout the application with Prisma

import type { 
  Profile, 
  UserPreference, 
  Company, 
  Job, 
  Resume, 
  WorkExperience, 
  Education, 
  Skill, 
  Certification, 
  Project, 
  Language, 
  JobApplication, 
  SavedJob, 
  JobAlert, 
  InterviewSession, 
  InterviewQuestion, 
  InterviewResponse, 
  UserAnalytic, 
  Notification 
} from '@prisma/client';

// Enhanced types with relationships and computed fields
export interface ProfileWithPreferences extends Profile {
  preferences?: UserPreference;
}

export interface JobWithCompany extends Job {
  company?: Company;
}

export interface JobApplicationWithDetails extends JobApplication {
  job?: JobWithCompany;
  resume?: Resume;
}

export interface ResumeWithDetails extends Resume {
  workExperiences?: WorkExperience[];
  educations?: Education[];
  skills?: Skill[];
  certifications?: Certification[];
  projects?: Project[];
  languages?: Language[];
}

export interface InterviewSessionWithDetails extends InterviewSession {
  questions?: InterviewQuestion[];
  responses?: InterviewResponse[];
}

// Utility types for API responses
export interface DrizzlePaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Job search filters
export interface JobSearchFilters {
  query?: string;
  location?: string;
  jobTypes?: string[];
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  isRemote?: boolean;
  companyId?: string;
}

// Export all Prisma client types
export type {
  Profile,
  UserPreference,
  Company,
  Job,
  Resume,
  WorkExperience,
  Education,
  Skill,
  Certification,
  Project,
  Language,
  JobApplication,
  SavedJob,
  JobAlert,
  InterviewSession,
  InterviewQuestion,
  InterviewResponse,
  UserAnalytic,
  Notification,
};
