// Base types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: "USER" | "ADMIN";
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  phone?: string;
  preferences: UserPreferences;
  resume?: Resume;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  jobAlerts: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  preferredJobTypes: JobType[];
  preferredLocations: string[];
  salaryExpectation?: {
    min: number;
    max: number;
    currency: string;
  };
  remoteWork: boolean;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  summary?: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  isCurrentRole: boolean;
  location: string;
  skills: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  category: "TECHNICAL" | "SOFT" | "LANGUAGE" | "TOOL";
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  startDate: Date;
  endDate?: Date;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "BASIC" | "CONVERSATIONAL" | "FLUENT" | "NATIVE";
}

// Job related types
export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "FREELANCE";
export type ExperienceLevel = "ENTRY" | "MID" | "SENIOR" | "EXECUTIVE";
export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "ACCEPTED";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  isRemote: boolean;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  postedAt: Date;
  applicationDeadline?: Date;
  isActive: boolean;
  matchScore?: number;
  isSaved: boolean;
  hasApplied: boolean;
}

export interface JobFilters {
  query?: string;
  location?: string;
  jobTypes?: JobType[];
  experienceLevel?: ExperienceLevel[];
  isRemote?: boolean;
  salaryRange?: {
    min: number;
    max: number;
  };
  companies?: string[];
  skills?: string[];
  postedWithin?: "DAY" | "WEEK" | "MONTH" | "ALL";
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  resumeId: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt: Date;
  notes?: string;
  job: Job;
}

// API Response types
export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      message?: string;
    }
  | {
      success: false;
      error: string;
      code?: string;
    };

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface JobSearchResponse {
  jobs: Job[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  filters: JobFilters;
  suggestedSkills?: string[];
  suggestedCompanies?: string[];
}

// Authentication types
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: "USER" | "ADMIN";
  isEmailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Dashboard types
export interface DashboardStats {
  appliedJobs: number;
  savedJobs: number;
  interviewsScheduled: number;
  profileViews: number;
  matchedJobs: number;
  responseRate: number;
}

export interface RecentActivity {
  id: string;
  type:
    | "APPLICATION_SUBMITTED"
    | "JOB_SAVED"
    | "PROFILE_UPDATED"
    | "INTERVIEW_SCHEDULED";
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: "JOB_MATCH" | "APPLICATION_UPDATE" | "INTERVIEW_REMINDER" | "SYSTEM";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  // Use unknown for flexible metadata type
  metadata?: Record<string, unknown>;
}

// Common utility types
export type LoadingState = "idle" | "loading" | "success" | "error";

export interface ErrorState {
  message: string;
  code?: string;
  field?: string;
}

export interface FormState<T> {
  data: T;
  isLoading: boolean;
  errors: Record<keyof T, string>;
  isValid: boolean;
}
