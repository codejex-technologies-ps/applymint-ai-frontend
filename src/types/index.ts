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
  availability_status: 'available' | 'not_available' | 'open_to_opportunities';
  preferred_work_type: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
  profile_visibility: 'public' | 'private' | 'connections_only';
  
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
  availabilityStatus?: 'available' | 'not_available' | 'open_to_opportunities';
  preferredWorkType?: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
  profileVisibility?: 'public' | 'private' | 'connections_only';
  
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

// AI Interview Simulator types
export type InterviewMode = 'text' | 'voice';
export type InterviewStatus = 'pending' | 'active' | 'paused' | 'completed' | 'cancelled';
export type QuestionType = 'technical' | 'behavioral' | 'situational' | 'company_specific';
export type InterviewDifficulty = 'entry' | 'mid' | 'senior' | 'expert';

export interface InterviewSession {
  id: string;
  userId: string;
  title: string;
  mode: InterviewMode;
  status: InterviewStatus;
  jobRole: string;
  company?: string;
  difficulty: InterviewDifficulty;
  duration: number; // in minutes
  currentQuestionIndex: number;
  totalQuestions: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewQuestion {
  id: string;
  sessionId: string;
  type: QuestionType;
  question: string;
  context?: string;
  expectedAnswerPoints?: string[];
  difficulty: InterviewDifficulty;
  timeLimit?: number; // in seconds
  order: number;
  askedAt?: string;
  answeredAt?: string;
}

export interface InterviewAnswer {
  id: string;
  questionId: string;
  sessionId: string;
  answer: string;
  audioUrl?: string; // for voice mode
  transcription?: string; // for voice mode
  duration: number; // in seconds
  submittedAt: string;
}

export interface InterviewFeedback {
  id: string;
  answerId: string;
  questionId: string;
  sessionId: string;
  
  // Scoring (1-10 scale)
  communicationScore: number;
  technicalScore: number;
  completenessScore: number;
  overallScore: number;
  
  // Detailed feedback
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  improvedAnswer?: string;
  
  createdAt: string;
}

export interface InterviewSessionSummary {
  sessionId: string;
  overallScore: number;
  totalQuestions: number;
  answeredQuestions: number;
  averageResponseTime: number; // in seconds
  
  // Score breakdown
  communicationAvg: number;
  technicalAvg: number;
  completenessAvg: number;
  
  // Performance by question type
  technicalQuestions: { answered: number; avgScore: number };
  behavioralQuestions: { answered: number; avgScore: number };
  situationalQuestions: { answered: number; avgScore: number };
  
  // Key insights
  topStrengths: string[];
  areasForImprovement: string[];
  recommendedResources: string[];
  nextSteps: string[];
  
  generatedAt: string;
}

// WebSocket message types for real-time communication
export type WebSocketMessageType = 
  | 'session_start'
  | 'question_generated'
  | 'answer_submitted'
  | 'feedback_generated'
  | 'session_pause'
  | 'session_resume'
  | 'session_end'
  | 'error'
  | 'heartbeat';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: Record<string, unknown>;
  timestamp: string;
  sessionId?: string;
}

// Gemini Live API types
export interface GeminiLiveConfig {
  model: 'gemini-2.5-flash-native-audio-preview-09-2025' | 'gemini-live-2.5-flash-preview';
  ephemeralToken: string;
  audioFormat: {
    sampleRate: number;
    channels: number;
    bitDepth: number;
  };
}

export interface AudioChunk {
  data: string; // base64 encoded PCM
  timestamp: number;
  duration: number;
}

// Interview setup types
export interface InterviewSetupData {
  title: string;
  mode: InterviewMode;
  jobRole: string;
  company?: string;
  difficulty: InterviewDifficulty;
  duration: number;
  questionTypes: QuestionType[];
  customInstructions?: string;
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
