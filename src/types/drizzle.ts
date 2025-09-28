// Drizzle ORM type mappings and bridge types
// This file provides type mappings between Drizzle schemas and existing application types

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
} from '@/lib/db/schema';

// Export Drizzle types for use throughout the application
export type {
  Profile as DrizzleProfile,
  UserPreference as DrizzleUserPreference,
  Company as DrizzleCompany,
  Job as DrizzleJob,
  Resume as DrizzleResume,
  WorkExperience as DrizzleWorkExperience,
  Education as DrizzleEducation,
  Skill as DrizzleSkill,
  Certification as DrizzleCertification,
  Project as DrizzleProject,
  Language as DrizzleLanguage,
  JobApplication as DrizzleJobApplication,
  SavedJob as DrizzleSavedJob,
  JobAlert as DrizzleJobAlert,
  InterviewSession as DrizzleInterviewSession,
  InterviewQuestion as DrizzleInterviewQuestion,
  InterviewResponse as DrizzleInterviewResponse,
  UserAnalytic as DrizzleUserAnalytic,
  Notification as DrizzleNotification,
};

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

export interface DrizzleApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Search and filter types
export interface JobSearchFilters {
  query?: string;
  location?: string;
  jobTypes?: string[];
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  isRemote?: boolean;
  companyId?: string;
  skills?: string[];
}

export interface ProfileSearchFilters {
  query?: string;
  location?: string;
  skills?: string[];
  experienceLevel?: string;
}

// Dashboard aggregate types
export interface UserDashboardStats {
  totalApplications: number;
  activeApplications: number;
  savedJobs: number;
  interviewSessions: number;
  profileViews: number;
  matchScore: number;
}

export interface JobMatchResult {
  job: JobWithCompany;
  matchScore: number;
  matchReasons: string[];
  skillsMatch: string[];
  experienceMatch: boolean;
  locationMatch: boolean;
}

// Form types for complex operations
export interface ResumeFormData {
  title: string;
  summary?: string;
  workExperiences: Omit<WorkExperience, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>[];
  educations: Omit<Education, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>[];
  skills: Omit<Skill, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>[];
  certifications: Omit<Certification, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>[];
  projects: Omit<Project, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>[];
  languages: Omit<Language, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>[];
}

export interface JobApplicationFormData {
  jobId: string;
  resumeId?: string;
  coverLetter?: string;
  notes?: string;
}

// Analytics types
export interface UserActivitySummary {
  date: string;
  loginCount: number;
  jobViews: number;
  applications: number;
  searches: number;
}

export interface JobMarketInsights {
  topSkills: Array<{ skill: string; count: number; trend: 'up' | 'down' | 'stable' }>;
  salaryRanges: Array<{ range: string; count: number; avgSalary: number }>;
  popularLocations: Array<{ location: string; count: number }>;
  industryTrends: Array<{ industry: string; growth: number }>;
}

// Export enum types from schemas
export type { 
  JobType, 
  ExperienceLevel
} from '@/lib/db/schema/jobs';

export type { 
  CompanySize 
} from '@/lib/db/schema/companies';

export type { 
  SkillLevel, 
  SkillCategory 
} from '@/lib/db/schema/skills';

export type { 
  ApplicationStatus 
} from '@/lib/db/schema/job-applications';

export type { 
  DegreeType 
} from '@/lib/db/schema/educations';

export type { 
  ProficiencyLevel 
} from '@/lib/db/schema/languages';

export type { 
  SessionType, 
  SessionStatus 
} from '@/lib/db/schema/interview-sessions';

export type { 
  QuestionType, 
  DifficultyLevel 
} from '@/lib/db/schema/interview-questions';

export type { 
  AlertFrequency 
} from '@/lib/db/schema/job-alerts';

export type { 
  EventType 
} from '@/lib/db/schema/user-analytics';

export type { 
  NotificationType 
} from '@/lib/db/schema/notifications';