# ApplyMint AI Frontend - Code Style Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Folder Structure](#folder-structure)
4. [Naming Conventions](#naming-conventions)
5. [Component Guidelines](#component-guidelines)
6. [Styling Guidelines](#styling-guidelines)
7. [TypeScript Guidelines](#typescript-guidelines)
8. [State Management](#state-management)
9. [API Integration](#api-integration)
10. [Testing Guidelines](#testing-guidelines)
11. [Performance Guidelines](#performance-guidelines)
12. [Security Guidelines](#security-guidelines)

## Project Overview

ApplyMint AI is a SaaS application designed to help job seekers streamline their job search process using AI technology. The frontend is built with Next.js 15, TypeScript, and Tailwind CSS, following modern React patterns and best practices.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Package Manager**: PNPM
- **State Management**: React Context API / Zustand (for complex state)
- **UI Components**: Shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Fetch API / Axios
- **Authentication**: NextAuth.js

## Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route groups for auth pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── jobs/
│   │   │   ├── search/
│   │   │   ├── matched/
│   │   │   ├── applied/
│   │   │   └── saved/
│   │   ├── profile/
│   │   │   ├── personal/
│   │   │   ├── resume/
│   │   │   └── preferences/
│   │   ├── analytics/
│   │   └── settings/
│   ├── (legal)/                  # Legal pages
│   │   ├── privacy-policy/
│   │   ├── terms-of-service/
│   │   └── cookie-policy/
│   ├── (public)/                 # Public pages
│   │   ├── about/
│   │   ├── features/
│   │   ├── pricing/
│   │   └── contact/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── jobs/
│   │   ├── profile/
│   │   └── ai/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── auth/                    # Authentication components
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── auth-provider.tsx
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── stats-card.tsx
│   ├── jobs/                    # Job-related components
│   │   ├── job-card.tsx
│   │   ├── job-filters.tsx
│   │   ├── job-search.tsx
│   │   └── job-details.tsx
│   ├── profile/                 # Profile components
│   │   ├── profile-form.tsx
│   │   ├── resume-builder.tsx
│   │   └── skills-section.tsx
│   ├── layout/                  # Layout components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   └── breadcrumb.tsx
│   └── common/                  # Common/shared components
│       ├── loading-spinner.tsx
│       ├── error-boundary.tsx
│       ├── data-table.tsx
│       └── pagination.tsx
├── lib/                         # Utility libraries
│   ├── utils.ts                # General utilities
│   ├── auth.ts                 # Authentication utilities
│   ├── api.ts                  # API client configuration
│   ├── validations.ts          # Zod schemas
│   ├── constants.ts            # Application constants
│   └── types.ts                # Shared TypeScript types
├── hooks/                       # Custom React hooks
│   ├── use-auth.ts
│   ├── use-jobs.ts
│   ├── use-local-storage.ts
│   └── use-debounce.ts
├── store/                       # State management
│   ├── auth-store.ts
│   ├── jobs-store.ts
│   └── user-store.ts
├── styles/                      # Additional styles
│   ├── globals.css
│   └── components.css
└── types/                       # TypeScript type definitions
    ├── auth.ts
    ├── jobs.ts
    ├── user.ts
    └── api.ts
```

## Naming Conventions

### Files and Folders
- Use **kebab-case** for file and folder names
- Use **PascalCase** for React components
- Use **camelCase** for utility functions and variables

```typescript
// ✅ Good
components/job-search/job-filter-panel.tsx
lib/api-client.ts
hooks/use-job-search.ts

// ❌ Bad
components/JobSearch/JobFilterPanel.tsx
lib/apiClient.ts
hooks/useJobSearch.ts
```

### Components
- Use **PascalCase** for component names
- Use descriptive names that indicate purpose

```typescript
// ✅ Good
export const JobSearchForm = () => { ... }
export const UserProfileCard = () => { ... }

// ❌ Bad
export const jsf = () => { ... }
export const Card = () => { ... }
```

### Variables and Functions
- Use **camelCase** for variables and functions
- Use descriptive names

```typescript
// ✅ Good
const jobSearchResults = await fetchJobs()
const handleFormSubmit = () => { ... }

// ❌ Bad
const jsr = await fetchJobs()
const submit = () => { ... }
```

## Component Guidelines

### Component Structure
All components should follow this structure:

```typescript
'use client' // Only if needed (client components)

import React from 'react'
import { cn } from '@/lib/utils'

// External library imports
import { Button } from '@/components/ui/button'

// Internal imports
import { JobCard } from '@/components/jobs/job-card'

// Types
interface JobListProps {
  jobs: Job[]
  isLoading?: boolean
  className?: string
}

// Component
export const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading = false,
  className
}) => {
  // Early returns
  if (isLoading) {
    return <JobListSkeleton />
  }

  if (jobs.length === 0) {
    return <EmptyJobList />
  }

  // Main render
  return (
    <div className={cn('space-y-4', className)}>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}

// Sub-components (if small and related)
const JobListSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg" />
      ))}
    </div>
  )
}
```

### Component Best Practices

1. **Always use TypeScript interfaces for props**
2. **Export components as named exports**
3. **Use forwardRef for components that need ref forwarding**
4. **Implement proper error boundaries**
5. **Use React.memo for expensive components**

```typescript
// ✅ Good - With proper TypeScript and memo
interface ExpensiveComponentProps {
  data: ComplexData[]
  onUpdate: (id: string) => void
}

export const ExpensiveComponent = React.memo<ExpensiveComponentProps>(({
  data,
  onUpdate
}) => {
  // Component logic
})

// ✅ Good - With forwardRef
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div>
        {label && <label>{label}</label>}
        <input
          ref={ref}
          className={cn('input-base-styles', className)}
          {...props}
        />
      </div>
    )
  }
)
```

## Styling Guidelines

### Tailwind CSS Best Practices

1. **Use Shadcn/ui components as the foundation**
2. **Create custom CSS classes for repeated patterns**
3. **Use CSS variables for theming**
4. **Implement responsive design with mobile-first approach**

```typescript
// ✅ Good - Using Shadcn/ui components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const JobCard = ({ job }: { job: Job }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{job.company}</p>
        <Button className="mt-4 w-full">Apply Now</Button>
      </CardContent>
    </Card>
  )
}
```

### Custom Utility Classes

Create custom utility classes in `globals.css`:

```css
/* Custom utility classes */
@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
  }
  
  .card-hover {
    @apply transition-all duration-200 hover:shadow-lg hover:-translate-y-1;
  }
  
  .skeleton {
    @apply animate-pulse bg-gray-200 dark:bg-gray-700 rounded;
  }
}

/* Component specific styles */
@layer components {
  .job-card {
    @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 card-hover;
  }
  
  .dashboard-grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
  }
}
```

## TypeScript Guidelines

### Type Definitions

Create comprehensive type definitions:

```typescript
// types/jobs.ts
export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary?: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  benefits: string[]
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP'
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE'
  isRemote: boolean
  postedAt: Date
  applicationDeadline?: Date
  matchScore?: number
}

export interface JobFilters {
  query?: string
  location?: string
  employmentType?: Job['employmentType'][]
  experienceLevel?: Job['experienceLevel'][]
  salaryRange?: {
    min: number
    max: number
  }
  isRemote?: boolean
}

// API Response types
export interface JobSearchResponse {
  jobs: Job[]
  totalCount: number
  page: number
  pageSize: number
  hasNextPage: boolean
}
```

### Utility Types

```typescript
// lib/types.ts
export type ApiResponse<T> = {
  success: true
  data: T
} | {
  success: false
  error: string
}

export type PaginatedResponse<T> = {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
```

## State Management

### Context API for Global State

```typescript
// store/auth-context.tsx
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Implementation...
  
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Zustand for Complex State

```typescript
// store/jobs-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface JobsState {
  jobs: Job[]
  filters: JobFilters
  isLoading: boolean
  error: string | null
  
  // Actions
  setJobs: (jobs: Job[]) => void
  setFilters: (filters: Partial<JobFilters>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  searchJobs: () => Promise<void>
}

export const useJobsStore = create<JobsState>()(
  devtools(
    (set, get) => ({
      jobs: [],
      filters: {},
      isLoading: false,
      error: null,
      
      setJobs: (jobs) => set({ jobs }),
      setFilters: (filters) => set((state) => ({ 
        filters: { ...state.filters, ...filters } 
      })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      searchJobs: async () => {
        set({ isLoading: true, error: null })
        try {
          const { filters } = get()
          const response = await searchJobsAPI(filters)
          set({ jobs: response.jobs, isLoading: false })
        } catch (error) {
          set({ error: error.message, isLoading: false })
        }
      }
    }),
    { name: 'jobs-store' }
  )
)
```

## API Integration

### API Client Setup

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

class ApiClient {
  private baseURL: string
  
  constructor(baseURL: string) {
    this.baseURL = baseURL
  }
  
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    
    return response.json()
  }
  
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }
  
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
```

### Service Layer

```typescript
// lib/services/jobs.ts
export const jobsService = {
  searchJobs: async (filters: JobFilters): Promise<JobSearchResponse> => {
    const queryParams = new URLSearchParams()
    
    if (filters.query) queryParams.append('q', filters.query)
    if (filters.location) queryParams.append('location', filters.location)
    // Add other filters...
    
    const response = await apiClient.get<JobSearchResponse>(
      `/jobs/search?${queryParams.toString()}`
    )
    
    if (response.success) {
      return response.data
    }
    
    throw new Error(response.error)
  },
  
  getJobById: async (id: string): Promise<Job> => {
    const response = await apiClient.get<Job>(`/jobs/${id}`)
    
    if (response.success) {
      return response.data
    }
    
    throw new Error(response.error)
  },
  
  applyToJob: async (jobId: string, applicationData: ApplicationData): Promise<void> => {
    const response = await apiClient.post(`/jobs/${jobId}/apply`, applicationData)
    
    if (!response.success) {
      throw new Error(response.error)
    }
  }
}
```

## Testing Guidelines

### Component Testing

```typescript
// __tests__/components/job-card.test.tsx
import { render, screen } from '@testing-library/react'
import { JobCard } from '@/components/jobs/job-card'
import { mockJob } from '@/lib/test-utils'

describe('JobCard', () => {
  it('renders job information correctly', () => {
    render(<JobCard job={mockJob} />)
    
    expect(screen.getByText(mockJob.title)).toBeInTheDocument()
    expect(screen.getByText(mockJob.company)).toBeInTheDocument()
    expect(screen.getByText('Apply Now')).toBeInTheDocument()
  })
  
  it('displays match score when provided', () => {
    const jobWithScore = { ...mockJob, matchScore: 85 }
    render(<JobCard job={jobWithScore} />)
    
    expect(screen.getByText('85% Match')).toBeInTheDocument()
  })
})
```

## Performance Guidelines

### Code Splitting and Lazy Loading

```typescript
// Lazy load heavy components
const ResumeBuilder = lazy(() => import('@/components/profile/resume-builder'))
const JobAnalytics = lazy(() => import('@/components/dashboard/job-analytics'))

// Use Suspense with fallback
<Suspense fallback={<LoadingSpinner />}>
  <ResumeBuilder />
</Suspense>
```

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image'

export const CompanyLogo = ({ company }: { company: string }) => {
  return (
    <Image
      src={`/logos/${company.toLowerCase()}.png`}
      alt={`${company} logo`}
      width={48}
      height={48}
      className="rounded-lg"
      priority={false}
    />
  )
}
```

## Security Guidelines

### Input Validation

```typescript
// lib/validations.ts
import { z } from 'zod'

export const jobSearchSchema = z.object({
  query: z.string().min(1).max(100),
  location: z.string().optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
})

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[\d\s-()]+$/).optional(),
})
```

### Authentication

```typescript
// lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export const authOptions: NextAuthOptions = {
  providers: [
    // Configure providers
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      return session
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
}
```

## Code Quality Tools

### ESLint Configuration

```json
// eslint.config.mjs
export default [
  {
    extends: [
      'next/core-web-vitals',
      '@typescript-eslint/recommended',
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

## Git Workflow

### Commit Message Convention

```
feat: add job search functionality
fix: resolve authentication redirect issue
docs: update API documentation
style: format code according to prettier rules
refactor: restructure job card component
test: add unit tests for job service
chore: update dependencies
```

### Branch Naming

```
feature/job-search-filters
bugfix/auth-redirect-loop
hotfix/critical-security-patch
refactor/component-structure
```

---

## Conclusion

This style guide should be treated as a living document that evolves with the project. All team members should follow these guidelines to ensure code consistency, maintainability, and scalability.

Regular code reviews should be conducted to ensure adherence to these guidelines, and any proposed changes to the style guide should be discussed and agreed upon by the team.
