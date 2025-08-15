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
components / job - search / job - filter - panel.tsx;
lib / api - client.ts;
hooks / use - job - search.ts;

// ❌ Bad
components / JobSearch / JobFilterPanel.tsx;
lib / apiClient.ts;
hooks / useJobSearch.ts;
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
"use client"; // Only if needed (client components)

import React from "react";
import { cn } from "@/lib/utils";

// External library imports
import { Button } from "@/components/ui/button";

// Internal imports
import { JobCard } from "@/components/jobs/job-card";

// Types
interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
  className?: string;
}

// Component
export const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading = false,
  className,
}) => {
  // Early returns
  if (isLoading) {
    return <JobListSkeleton />;
  }

  if (jobs.length === 0) {
    return <EmptyJobList />;
  }

  // Main render
  return (
    <div className={cn("space-y-4", className)}>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

// Sub-components (if small and related)
const JobListSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg" />
      ))}
    </div>
  );
};
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
  data: ComplexData[];
  onUpdate: (id: string) => void;
}

export const ExpensiveComponent = React.memo<ExpensiveComponentProps>(
  ({ data, onUpdate }) => {
    // Component logic
  }
);

// ✅ Good - With forwardRef
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div>
        {label && <label>{label}</label>}
        <input
          ref={ref}
          className={cn("input-base-styles", className)}
          {...props}
        />
      </div>
    );
  }
);
```

## Styling Guidelines

### Tailwind CSS Best Practices

1. **Use Shadcn/ui components as the foundation**
2. **Create custom CSS classes for repeated patterns**
3. **Use CSS variables for theming**
4. **Implement responsive design with mobile-first approach**
5. **Always use semantic color variables instead of hardcoded colors**

#### Color System Guidelines

Our project uses a comprehensive color system defined in `globals.css`. Always use these semantic color variables instead of hardcoded colors:

##### Primary Color Variables

```css
/* Use these for main brand elements */
bg-primary          /* Primary background */
text-primary        /* Primary text */
bg-primary-foreground  /* Text/content on primary background */
text-primary-foreground /* Text on primary background */
border-primary      /* Primary borders */
```

##### Secondary & Accent Colors

```css
/* Use these for secondary elements */
bg-secondary        /* Secondary background */
text-secondary      /* Secondary text */
bg-secondary-foreground
text-secondary-foreground

/* Use these for highlighted/accent elements */
bg-accent          /* Accent background */
text-accent        /* Accent text */
bg-accent-foreground
text-accent-foreground
```

##### Muted & Neutral Colors

```css
/* Use these for subdued content */
bg-muted           /* Muted background */
text-muted         /* Muted text */
bg-muted-foreground
text-muted-foreground
```

##### Card & Layout Colors

```css
/* Use these for cards and containers */
bg-card            /* Card background */
text-card          /* Card text */
bg-card-foreground
text-card-foreground

/* Use these for popovers and overlays */
bg-popover         /* Popover background */
text-popover       /* Popover text */
bg-popover-foreground
text-popover-foreground
```

##### Interactive & State Colors

```css
/* Use these for destructive actions */
bg-destructive     /* Delete/error background */
text-destructive   /* Error text */
bg-destructive-foreground
text-destructive-foreground

/* Use these for borders and inputs */
border-border      /* Default border color */
border-input       /* Input border color */
ring-ring          /* Focus ring color */
```

##### Chart & Data Visualization Colors

```css
/* Use these for charts and data visualization */
bg-chart-1         /* First chart color */
bg-chart-2         /* Second chart color */
bg-chart-3         /* Third chart color */
bg-chart-4         /* Fourth chart color */
bg-chart-5         /* Fifth chart color */
```

##### Sidebar Colors (for dashboard layouts)

```css
/* Use these for sidebar components */
bg-sidebar         /* Sidebar background */
text-sidebar       /* Sidebar text */
bg-sidebar-primary /* Sidebar primary elements */
text-sidebar-primary
bg-sidebar-accent  /* Sidebar accent elements */
text-sidebar-accent
border-sidebar-border /* Sidebar borders */
```

#### Component Examples Using Color Variables

```typescript
// ✅ Good - Using semantic color variables
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const JobCard = ({ job }: { job: Job }) => {
  return (
    <Card className="bg-card text-card-foreground border-border hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-primary font-semibold">
          {job.title}
        </CardTitle>
        <p className="text-muted-foreground text-sm">{job.company}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-card-foreground">{job.description}</p>

        {/* Status indicators using semantic colors */}
        <div className="flex items-center space-x-2">
          {job.isUrgent && (
            <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-sm text-xs">
              Urgent
            </span>
          )}
          {job.isRemote && (
            <span className="bg-accent text-accent-foreground px-2 py-1 rounded-sm text-xs">
              Remote
            </span>
          )}
        </div>

        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );
};

// ✅ Good - Dashboard component with sidebar colors
export const DashboardSidebar = () => {
  return (
    <aside className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <nav className="p-4 space-y-2">
        <a
          href="/dashboard"
          className="flex items-center space-x-2 bg-sidebar-primary text-sidebar-primary-foreground px-3 py-2 rounded-md"
        >
          <DashboardIcon />
          <span>Dashboard</span>
        </a>
        <a
          href="/jobs"
          className="flex items-center space-x-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-3 py-2 rounded-md"
        >
          <JobsIcon />
          <span>Jobs</span>
        </a>
      </nav>
    </aside>
  );
};

// ✅ Good - Form with proper input styling
export const LoginForm = () => {
  return (
    <form className="bg-card text-card-foreground p-6 rounded-lg border border-border space-y-4">
      <div>
        <label className="text-primary font-medium">Email</label>
        <input
          type="email"
          className="w-full mt-1 px-3 py-2 bg-background text-foreground border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
        />
      </div>

      <Button
        type="submit"
        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
      >
        Sign In
      </Button>

      <p className="text-muted-foreground text-sm text-center">
        Don't have an account?
        <a href="/register" className="text-primary hover:text-primary/80 ml-1">
          Sign up
        </a>
      </p>
    </form>
  );
};
```

#### Color Usage Guidelines

**DO:**

- ✅ Use `text-primary` for important headings and primary actions
- ✅ Use `text-muted-foreground` for secondary text and descriptions
- ✅ Use `bg-card` and `text-card-foreground` for card components
- ✅ Use `bg-accent` and `text-accent-foreground` for highlighting
- ✅ Use `bg-destructive` and `text-destructive-foreground` for error states
- ✅ Use chart colors (`bg-chart-1` through `bg-chart-5`) for data visualization
- ✅ Use sidebar colors for dashboard navigation components

**DON'T:**

- ❌ Don't use hardcoded colors like `bg-blue-500` or `text-red-600`
- ❌ Don't use arbitrary color values like `bg-[#3B82F6]`
- ❌ Don't mix semantic variables with hardcoded colors in the same component

#### Dark Mode Considerations

Our color system automatically supports dark mode through CSS variables. When using semantic color variables:

```typescript
// ✅ This automatically works in both light and dark modes
<div className="bg-background text-foreground">
  <h1 className="text-primary">Welcome to ApplyMint AI</h1>
  <p className="text-muted-foreground">Your AI-powered job search companion</p>
</div>

// ❌ This doesn't respect dark mode
<div className="bg-white text-black">
  <h1 className="text-blue-600">Welcome to ApplyMint AI</h1>
  <p className="text-gray-500">Your AI-powered job search companion</p>
</div>
```

#### Color Variable Reference Guide

For quick reference, here are the most commonly used color combinations:

| Purpose                  | Background                | Text                          | Border                  | Example Usage                        |
| ------------------------ | ------------------------- | ----------------------------- | ----------------------- | ------------------------------------ |
| **Main Content**         | `bg-background`           | `text-foreground`             | `border-border`         | Page backgrounds, main content areas |
| **Cards/Containers**     | `bg-card`                 | `text-card-foreground`        | `border-border`         | Job cards, profile sections, forms   |
| **Primary Actions**      | `bg-primary`              | `text-primary-foreground`     | `border-primary`        | Submit buttons, main CTAs            |
| **Secondary Actions**    | `bg-secondary`            | `text-secondary-foreground`   | `border-border`         | Cancel buttons, secondary CTAs       |
| **Highlighted Content**  | `bg-accent`               | `text-accent-foreground`      | `border-accent`         | Featured items, hover states         |
| **Subtle Content**       | `bg-muted`                | `text-muted-foreground`       | `border-border`         | Disabled states, secondary info      |
| **Destructive Actions**  | `bg-destructive`          | `text-destructive-foreground` | `border-destructive`    | Delete buttons, error states         |
| **Success States**       | `bg-chart-2` with opacity | `text-chart-2`                | `border-chart-2/20`     | Success messages, completed tasks    |
| **Warning States**       | `bg-chart-4` with opacity | `text-chart-4`                | `border-chart-4/20`     | Warning messages, pending states     |
| **Navigation (Sidebar)** | `bg-sidebar`              | `text-sidebar-foreground`     | `border-sidebar-border` | Dashboard navigation                 |

#### Opacity Usage with Colors

Use opacity modifiers to create subtle variations:

```typescript
// ✅ Using opacity for subtle backgrounds
<div className="bg-primary/10 text-primary border border-primary/20">
  <p>Primary colored section with subtle background</p>
</div>

<div className="bg-chart-1/5 text-chart-1 border border-chart-1/10">
  <p>Chart color with very subtle background</p>
</div>

// ✅ Hover states with opacity
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Hover effect with opacity
</button>
```

### Custom Utility Classes

Create custom utility classes in `globals.css` using the semantic color variables:

```css
/* Custom utility classes using semantic colors */
@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent;
  }

  .text-gradient-chart {
    @apply bg-gradient-to-r from-chart-1 to-chart-3 bg-clip-text text-transparent;
  }

  .card-hover {
    @apply transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20;
  }

  .skeleton {
    @apply animate-pulse bg-muted rounded;
  }

  .button-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring;
  }

  .button-secondary {
    @apply bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border;
  }

  .button-destructive {
    @apply bg-destructive text-destructive-foreground hover:bg-destructive/90;
  }

  .input-field {
    @apply bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20;
  }

  .status-success {
    @apply bg-chart-2 text-chart-2 bg-opacity-10 border border-chart-2/20;
  }

  .status-warning {
    @apply bg-chart-4 text-chart-4 bg-opacity-10 border border-chart-4/20;
  }

  .status-error {
    @apply bg-destructive text-destructive-foreground bg-opacity-10 border border-destructive/20;
  }
}

/* Component specific styles using semantic colors */
@layer components {
  .job-card {
    @apply bg-card text-card-foreground border border-border rounded-lg p-6 card-hover;
  }

  .dashboard-grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
  }

  .nav-item {
    @apply flex items-center space-x-2 px-3 py-2 rounded-md transition-colors;
    @apply hover:bg-accent hover:text-accent-foreground;
  }

  .nav-item-active {
    @apply bg-primary text-primary-foreground;
  }

  .sidebar-nav {
    @apply bg-sidebar text-sidebar-foreground border-r border-sidebar-border;
  }

  .form-section {
    @apply bg-card text-card-foreground p-6 rounded-lg border border-border space-y-4;
  }

  .stats-card {
    @apply bg-card text-card-foreground p-6 rounded-lg border border-border;
    @apply hover:shadow-md transition-shadow;
  }

  .badge-primary {
    @apply bg-primary text-primary-foreground px-2 py-1 rounded-sm text-xs font-medium;
  }

  .badge-secondary {
    @apply bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-xs font-medium;
  }

  .badge-accent {
    @apply bg-accent text-accent-foreground px-2 py-1 rounded-sm text-xs font-medium;
  }

  .alert-info {
    @apply bg-chart-1 text-chart-1 bg-opacity-10 border border-chart-1/20 p-4 rounded-md;
  }

  .alert-success {
    @apply bg-chart-2 text-chart-2 bg-opacity-10 border border-chart-2/20 p-4 rounded-md;
  }

  .alert-warning {
    @apply bg-chart-4 text-chart-4 bg-opacity-10 border border-chart-4/20 p-4 rounded-md;
  }

  .alert-error {
    @apply bg-destructive text-destructive-foreground bg-opacity-10 border border-destructive/20 p-4 rounded-md;
  }
}
```

#### Usage Examples with Custom Classes

```typescript
// ✅ Using custom utility classes with semantic colors
export const DashboardCard = ({ title, value, trend }: StatsCardProps) => {
  return (
    <div className="stats-card">
      <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
      <div className="flex items-center justify-between mt-2">
        <span className="text-primary text-2xl font-bold">{value}</span>
        <span
          className={cn(
            "text-xs px-2 py-1 rounded",
            trend > 0 ? "status-success" : "status-error"
          )}
        >
          {trend > 0 ? "+" : ""}
          {trend}%
        </span>
      </div>
    </div>
  );
};

export const JobStatusBadge = ({ status }: { status: JobStatus }) => {
  const statusStyles = {
    applied: "badge-primary",
    interview: "badge-accent",
    rejected:
      "bg-destructive text-destructive-foreground px-2 py-1 rounded-sm text-xs",
    offer: "status-success px-2 py-1 rounded-sm text-xs",
  };

  return (
    <span className={statusStyles[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const AlertMessage = ({ type, message }: AlertProps) => {
  const alertClasses = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  };

  return (
    <div className={alertClasses[type]}>
      <p className="text-sm">{message}</p>
    </div>
  );
};
```

## TypeScript Guidelines

### Type Definitions

Create comprehensive type definitions:

```typescript
// types/jobs.ts
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  experienceLevel: "ENTRY" | "MID" | "SENIOR" | "EXECUTIVE";
  isRemote: boolean;
  postedAt: Date;
  applicationDeadline?: Date;
  matchScore?: number;
}

export interface JobFilters {
  query?: string;
  location?: string;
  employmentType?: Job["employmentType"][];
  experienceLevel?: Job["experienceLevel"][];
  salaryRange?: {
    min: number;
    max: number;
  };
  isRemote?: boolean;
}

// API Response types
export interface JobSearchResponse {
  jobs: Job[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}
```

### Utility Types

```typescript
// lib/types.ts
export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

export type LoadingState = "idle" | "loading" | "success" | "error";
```

## State Management

### Context API for Global State

```typescript
// store/auth-context.tsx
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Implementation...

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

### Zustand for Complex State

```typescript
// store/jobs-store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface JobsState {
  jobs: Job[];
  filters: JobFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  setJobs: (jobs: Job[]) => void;
  setFilters: (filters: Partial<JobFilters>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  searchJobs: () => Promise<void>;
}

export const useJobsStore = create<JobsState>()(
  devtools(
    (set, get) => ({
      jobs: [],
      filters: {},
      isLoading: false,
      error: null,

      setJobs: (jobs) => set({ jobs }),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      searchJobs: async () => {
        set({ isLoading: true, error: null });
        try {
          const { filters } = get();
          const response = await searchJobsAPI(filters);
          set({ jobs: response.jobs, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
    }),
    { name: "jobs-store" }
  )
);
```

## API Integration

### API Client Setup

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

### Service Layer

```typescript
// lib/services/jobs.ts
export const jobsService = {
  searchJobs: async (filters: JobFilters): Promise<JobSearchResponse> => {
    const queryParams = new URLSearchParams();

    if (filters.query) queryParams.append("q", filters.query);
    if (filters.location) queryParams.append("location", filters.location);
    // Add other filters...

    const response = await apiClient.get<JobSearchResponse>(
      `/jobs/search?${queryParams.toString()}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.error);
  },

  getJobById: async (id: string): Promise<Job> => {
    const response = await apiClient.get<Job>(`/jobs/${id}`);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.error);
  },

  applyToJob: async (
    jobId: string,
    applicationData: ApplicationData
  ): Promise<void> => {
    const response = await apiClient.post(
      `/jobs/${jobId}/apply`,
      applicationData
    );

    if (!response.success) {
      throw new Error(response.error);
    }
  },
};
```

## Testing Guidelines

### Component Testing

```typescript
// __tests__/components/job-card.test.tsx
import { render, screen } from "@testing-library/react";
import { JobCard } from "@/components/jobs/job-card";
import { mockJob } from "@/lib/test-utils";

describe("JobCard", () => {
  it("renders job information correctly", () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText(mockJob.title)).toBeInTheDocument();
    expect(screen.getByText(mockJob.company)).toBeInTheDocument();
    expect(screen.getByText("Apply Now")).toBeInTheDocument();
  });

  it("displays match score when provided", () => {
    const jobWithScore = { ...mockJob, matchScore: 85 };
    render(<JobCard job={jobWithScore} />);

    expect(screen.getByText("85% Match")).toBeInTheDocument();
  });
});
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
import Image from "next/image";

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
  );
};
```

## Security Guidelines

### Input Validation

```typescript
// lib/validations.ts
import { z } from "zod";

export const jobSearchSchema = z.object({
  query: z.string().min(1).max(100),
  location: z.string().optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^\+?[\d\s-()]+$/)
    .optional(),
});
```

### Authentication

```typescript
// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    // Configure providers
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
};
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
