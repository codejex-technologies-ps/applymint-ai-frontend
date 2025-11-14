// Base types
// This interface matches the Supabase auth.users table
export interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

// This interface matches our extended profiles table schema
export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;

  // Extended profile fields
  bio: string | null;
  location: string | null;
  website: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  portfolio_url: string | null;
  current_position: string | null;
  company: string | null;
  years_of_experience: number | null;
  availability_status: "available" | "not_available" | "open_to_opportunities";
  preferred_work_type:
    | "full_time"
    | "part_time"
    | "contract"
    | "freelance"
    | "internship";
  profile_visibility: "public" | "private" | "connections_only";

  // Credit system
  credit: number;

  created_at: string;
  updated_at: string;
}

// Computed interface that combines auth and profile data for the frontend
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;

  // Extended profile fields
  bio?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  portfolioUrl?: string;
  currentPosition?: string;
  company?: string;
  yearsOfExperience?: number;
  availabilityStatus?: "available" | "not_available" | "open_to_opportunities";
  preferredWorkType?:
    | "full_time"
    | "part_time"
    | "contract"
    | "freelance"
    | "internship";
  profileVisibility?: "public" | "private" | "connections_only";

  // Credit system
  credit?: number;

  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Extended profile data (for future features like resume, preferences, etc.)
export interface ExtendedUserProfile {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  preferences?: UserPreferences;
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

// Credit System Types
export type TransactionType = "purchase" | "usage" | "refund" | "bonus";
export type FeatureType =
  | "resume_optimization"
  | "interview_scheduling"
  | "ai_matching";
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "unpaid";
export type PackageType = "one_time" | "subscription";
export type BillingInterval = "monthly" | "yearly";

export interface CreditPackage {
  id: string;
  name: string;
  description?: string;
  credits: number;
  price: number;
  currency: string;
  packageType: PackageType;
  billingInterval?: BillingInterval;
  stripePriceId?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  transactionType: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  creditPackageId?: string;
  stripePaymentIntentId?: string;
  price?: number;
  featureType?: FeatureType;
  featureId?: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface FeatureCreditCost {
  id: string;
  featureType: FeatureType;
  featureName: string;
  creditCost: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSubscription {
  id: string;
  userId: string;
  creditPackageId: string;
  stripeSubscriptionId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Credit system API types
export interface CreditBalance {
  currentCredits: number;
  transactions: CreditTransaction[];
}

export interface PurchaseCreditsRequest {
  packageId: string;
  paymentMethodId: string;
}

export interface UseCreditsRequest {
  featureType: FeatureType;
  featureId?: string;
  description: string;
}
