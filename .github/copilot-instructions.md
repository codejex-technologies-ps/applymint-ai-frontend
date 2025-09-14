# ApplyMint AI Frontend - AI Coding Agent Instructions

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [AI Development Guidelines](#ai-development-guidelines)
4. [Folder Structure](#folder-structure)
5. [Current Implementation Status](#current-implementation-status)
6. [Component Guidelines](#component-guidelines)
7. [Styling Guidelines](#styling-guidelines)
8. [TypeScript Guidelines](#typescript-guidelines)
9. [State Management](#state-management)
10. [API Integration](#api-integration)
11. [Development Workflow](#development-workflow)
12. [Performance Guidelines](#performance-guidelines)
13. [Security Guidelines](#security-guidelines)

## Project Overview

ApplyMint AI is a SaaS application designed to help job seekers streamline their job search process using AI technology. The frontend is built with Next.js 15, TypeScript, and Tailwind CSS v4, following modern React patterns and best practices. This is an active development project with a focus on AI-powered features.

## Technology Stack

**Core Framework:**
- **Framework**: Next.js 15.4.5 with App Router (using Turbopack for dev)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4.1.11 + Shadcn/ui components
- **Package Manager**: PNPM 10.12.3 (locked)
- **Authentication**: Supabase Auth (@supabase/supabase-js, @supabase/ssr)

**UI & Styling:**
- **Design System**: Shadcn/ui components with semantic color variables
- **Icons**: Lucide React (v0.536.0)
- **Theme**: Built-in dark/light mode with next-themes
- **Animations**: tw-animate-css

**Development Tools:**
- **Forms**: React Hook Form 7.62.0 + @hookform/resolvers
- **Validation**: Zod 4.0.17
- **State Management**: Zustand 5.0.7 (configured) + React Context for Auth
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## AI Development Guidelines

### PNPM and Shadcn CLI Usage

**Always prefer using official CLI commands instead of manual component creation:**

```bash
# Install shadcn components (PREFERRED)
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add form

# Install multiple components at once
pnpm dlx shadcn@latest add button card input form dialog

# Check available components
pnpm dlx shadcn@latest
```

**Development Scripts (from package.json):**
```json
{
  "dev": "next dev --turbopack",    // Uses Turbopack for faster dev
  "build": "next build",
  "start": "next start", 
  "lint": "next lint"
}
```

### AI Agent Productivity Tips

1. **Use File Search First**: Before creating new components, always search for existing patterns
2. **Leverage Semantic Search**: Use semantic search to understand existing implementations
3. **Follow Existing Patterns**: Copy patterns from implemented components rather than reinventing
4. **Incremental Development**: Build on existing structure rather than recreating from scratch

## Folder Structure

**Current Implementation Status (as of latest update):**

```
src/
├── app/                          # Next.js App Router (IMPLEMENTED)
│   ├── (auth)/                   # Route groups for auth pages (PLANNED)
│   ├── (dashboard)/              # Protected dashboard routes (PLANNED)
│   ├── (legal)/                  # Legal pages (IMPLEMENTED)
│   │   └── terms-of-service/     # ✅ Complete
│   ├── (public)/                 # Public pages (PARTIAL)
│   │   ├── about/                # ✅ Complete  
│   │   └── contact/              # ✅ Complete
│   ├── favicon.ico
│   ├── globals.css               # ✅ Tailwind v4 + semantic colors
│   ├── layout.tsx                # ✅ Root layout with theme provider
│   └── page.tsx                  # ✅ Homepage with all sections
├── components/                   # Reusable components
│   ├── ui/                      # ✅ Shadcn/ui base components
│   │   ├── button.tsx           # ✅ Implemented
│   │   ├── input.tsx            # ✅ Implemented  
│   │   ├── card.tsx             # ✅ Implemented
│   │   ├── badge.tsx            # ✅ Implemented
│   │   ├── separator.tsx        # ✅ Implemented
│   │   ├── avatar.tsx           # ✅ Implemented
│   │   ├── dropdown-menu.tsx    # ✅ Implemented
│   │   ├── form.tsx             # ✅ Implemented
│   │   ├── label.tsx            # ✅ Implemented
│   │   ├── textarea.tsx         # ✅ Implemented
│   │   └── mode-toggle.tsx      # ✅ Dark/light theme toggle
│   ├── auth/                    # Authentication components (IMPLEMENTED)
│   │   ├── auth-provider.tsx   # ✅ Supabase auth context
│   │   ├── login-form.tsx      # ✅ Complete login form
│   │   └── register-form.tsx   # ✅ Complete register form
│   ├── dashboard/               # Dashboard components (EMPTY)
│   ├── jobs/                    # Job-related components (PARTIAL)
│   │   └── job-card.tsx         # ✅ Implemented
│   ├── layout/                  # Layout components (IMPLEMENTED)
│   │   ├── navbar.tsx           # ✅ Complete with auth states
│   │   └── footer.tsx           # ✅ Complete
│   ├── homepage/                # Homepage sections (COMPLETE)
│   │   ├── hero-section.tsx     # ✅ Hero with CTA
│   │   ├── features-section.tsx # ✅ 5 features inc. AI Interview
│   │   ├── how-it-works-section.tsx # ✅ Process flow
│   │   ├── testimonials-section.tsx # ✅ User testimonials
│   │   ├── pricing-section.tsx  # ✅ Pricing tiers
│   │   ├── cta-section.tsx      # ✅ Bottom CTA
│   │   └── index.tsx            # ✅ Exports
│   ├── profile/                 # Profile components (EMPTY)
│   └── provider/                # Context providers (IMPLEMENTED)
│       └── theme-provider.tsx   # ✅ Theme context
├── lib/                         # Utility libraries (MINIMAL)
│   ├── utils.ts                 # ✅ clsx + tailwind-merge utility
│   └── supabase/                # ✅ Supabase configuration
│       ├── client.ts            # ✅ Browser client
│       ├── server.ts            # ✅ Server client
│       └── middleware.ts        # ✅ Auth middleware
├── types/                       # TypeScript definitions (EXTENSIVE)
│   └── index.ts                 # ✅ 312 lines of comprehensive types
└── styles/                      # Additional styles (PLANNED)
```

## Current Implementation Status

### ✅ Completed Features
- **Homepage**: Complete with all 6 sections (hero, features, how-it-works, testimonials, pricing, CTA)
- **Legal Pages**: Terms of Service page fully implemented
- **Public Pages**: About page, Contact page with forms
- **UI Components**: Full Shadcn/ui component library
- **Theme System**: Dark/light mode with semantic color variables
- **Type System**: Comprehensive TypeScript definitions
- **Layout**: Responsive navigation and footer
- **Authentication**: Complete Supabase integration with login/register forms

### 🚧 In Progress
- **Dashboard**: Route structure planned, components pending  
- **Job Features**: Basic job card implemented, full job system pending

### 📋 Planned Features
- Job search and filtering
- User dashboard with analytics
- Profile management and resume builder
- AI interview simulator implementation
- Application tracking system

## Current Implementation Insights

### Actual Dependencies in package.json

**Production Dependencies:**
```json
{
  "@hookform/resolvers": "^5.2.1",
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-dropdown-menu": "^2.1.15", 
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-separator": "^1.1.7",
  "@radix-ui/react-slot": "^1.2.3",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.536.0",
  "next": "15.4.5",
  "next-themes": "^0.4.6",
  "react": "19.1.0",
  "react-dom": "19.1.0", 
  "react-hook-form": "^7.62.0",
  "tailwind-merge": "^3.3.1",
  "zod": "^4.0.17",
  "zustand": "^5.0.7"
}
```

**Dev Dependencies:**
```json
{
  "@eslint/eslintrc": "^3",
  "@tailwindcss/postcss": "^4", 
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "15.4.5",
  "tailwindcss": "^4",
  "tw-animate-css": "^1.3.6",
  "typescript": "^5"
}
```

### Key Implementation Patterns Discovered

**1. Semantic Color System (globals.css)**
- Uses Tailwind v4 with CSS custom properties
- OKLCH color space for better color consistency
- Comprehensive dark/light mode support
- Sidebar-specific color variables for dashboard layouts

**2. Component Organization**
- Homepage components are fully implemented and follow consistent patterns
- All use semantic color variables correctly
- Responsive design with mobile-first approach
- Lucide React icons throughout

**3. Type System (src/types/index.ts)**
- 312+ lines of comprehensive TypeScript definitions
- Covers User, Job, Application, Resume, and API types
- Well-structured interfaces with proper relationships

**4. Route Groups Architecture**
- Uses Next.js 15 App Router route groups: `(auth)`, `(dashboard)`, `(legal)`, `(public)`
- Enables organized routing without affecting URL structure
- Legal and public sections partially implemented

## Naming Conventions

### Files and Folders (Current Practice)

- Use **kebab-case** for file and folder names
- Use **PascalCase** for React components  
- Use **camelCase** for utility functions and variables

```typescript
// ✅ Current Implementation Pattern
components/homepage/features-section.tsx
components/ui/mode-toggle.tsx
components/provider/theme-provider.tsx
lib/utils.ts
types/index.ts

// ✅ Component Names (from actual codebase)
export const FeaturesSection = () => { ... }
export const ThemeProvider = () => { ... }
export const ModeToggle = () => { ... }
```

### Variables and Functions (Current Practice)

```typescript
// ✅ From actual components
const features = [
  {
    icon: Target,
    title: "AI-Powered Resume Matching",
    description: "...",
    benefits: [...],
    gradient: "from-chart-1 to-chart-2",
    badge: "Most Popular",
    cta: "Start Matching",
  },
  // ...
];

// ✅ Current utility pattern
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Component Guidelines

### Component Structure (Based on Current Implementation)

All components should follow the established pattern from existing codebase:

```typescript
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  FileText,
  Bell,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Mic,
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Target,
      title: "AI-Powered Resume Matching",
      description: "Our intelligent algorithm analyzes your resume...",
      benefits: [
        "Apply only to jobs you're qualified for",
        "Discover hidden opportunities based on your skills",
        "Get match percentage for each job",
        "Real-time job compatibility scoring",
      ],
      gradient: "from-chart-1 to-chart-2",
      badge: "Most Popular",
      cta: "Start Matching",
    },
    // ... more features
  ];

  return (
    <section id="features" className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Component content */}
      </div>
    </section>
  );
};
```

### Current Component Best Practices (From Codebase Analysis)

1. **Always use semantic color variables** (never hardcoded colors)
2. **Export components as named exports** 
3. **Use Lucide React icons consistently**
4. **Follow responsive design patterns**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
5. **Use semantic HTML5 elements**: `<section>`, `<main>`, `<header>`, `<footer>`

### Actual Shadcn/ui Components Available

**From current src/components/ui/ directory:**
```typescript
// ✅ Currently Implemented
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ModeToggle } from "@/components/ui/mode-toggle";
```

### Component Installation Pattern

**Always use shadcn CLI for new components:**
```bash
# ✅ Preferred method (based on project instructions)
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add toast
pnpm dlx shadcn@latest add sheet
pnpm dlx shadcn@latest add tabs

# ✅ Install multiple at once
pnpm dlx shadcn@latest add dialog toast sheet tabs select
```

### Responsive Design Patterns (From Current Implementation)

```typescript
// ✅ Current responsive patterns from homepage components
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
  {/* 5 features grid layout */}
</div>

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Standard container pattern */}
</div>

<div className="space-y-6 lg:space-y-8">
  {/* Responsive spacing */}
</div>

// ✅ Responsive typography (from actual components)
<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-primary mb-4">
<p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center">
```

### Error Handling Patterns

```typescript
// ✅ Early returns pattern (recommended)
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

## Authentication with Supabase

### Setup and Configuration

**Environment Variables Required:**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Client Configuration:**
```typescript
// lib/supabase/client.ts - Browser client
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts - Server client
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
```

### Authentication Context Provider

**Current Implementation Pattern:**
```typescript
// components/auth/auth-provider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, metadata?: object) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### Form Components with Supabase

**Login Form Pattern:**
```typescript
// components/auth/login-form.tsx
'use client'

import { useAuth } from './auth-provider'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export function LoginForm() {
  const { signIn } = useAuth()
  const form = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    const { error } = await signIn(data.email, data.password)
    if (error) {
      setError(error)
      return
    }
    router.push('/dashboard')
  }
}
```

### Authentication Guards and Middleware

**Protected Routes:**
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(/* config */)
  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users from auth pages
  if (user && (request.nextUrl.pathname.startsWith('/login'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}
```

### Navigation Integration

**Conditional Navigation:**
```typescript
// components/layout/navbar.tsx
import { useAuth } from '@/components/auth/auth-provider'

export const Navbar = () => {
  const { user, signOut, loading } = useAuth()

  return (
    <nav>
      {!loading && (
        user ? (
          // Authenticated state - show user menu
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={signOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Unauthenticated state - show login/register buttons
          <>
            <Button asChild><Link href="/login">Sign In</Link></Button>
            <Button asChild><Link href="/register">Get Started</Link></Button>
          </>
        )
      )}
    </nav>
  )
}
```

### Authentication Best Practices

1. **Always use the auth context**: Never access Supabase client directly in components
2. **Handle loading states**: Show loading indicators while auth state is being determined
3. **Error handling**: Always handle and display authentication errors appropriately
4. **Type safety**: Use proper TypeScript types from Supabase
5. **Security**: Never expose sensitive data in client-side code

### Current Auth Routes

**Implemented:**
- `/login` - Login form with email/password
- `/register` - Registration form with validation
- Authentication state management throughout the app
- Protected dashboard routes
- Logout functionality

**Planned:**
- `/auth/forgot-password` - Password reset flow
- `/auth/reset-password` - Password reset confirmation
- Social authentication (Google, GitHub)
- Email verification flow


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

## Development Workflow

### AI Agent Workflow for ApplyMint AI

**1. Discovery Phase (Before Any Code Changes)**
```bash
# Always start by understanding current state
file_search "src/components/**/*.tsx"
semantic_search "component patterns button card"
list_dir "src/components/ui"
read_file "package.json" 1 50
```

**2. Component Creation Workflow**
```bash
# Step 1: Check if component exists
semantic_search "component_name existing implementation"

# Step 2: Install shadcn components if needed (PREFERRED)
pnpm dlx shadcn@latest add button card input

# Step 3: Follow existing patterns from components/homepage/*
read_file "src/components/homepage/features-section.tsx" 1 100

# Step 4: Use semantic color variables and responsive patterns
```

**3. Page Creation Workflow**
```bash
# Check existing pages for patterns
file_search "src/app/(public|legal)/**/*.tsx"

# Follow route group structure: (auth), (dashboard), (legal), (public)
# Use semantic colors and responsive containers
```

**4. Development Commands (Current)**
```bash
# Development with Turbopack (faster)
pnpm dev

# Build and type checking
pnpm build
pnpm lint

# Package manager commands
pnpm add <package>
pnpm dlx shadcn@latest add <component>
```

### Current Configuration Files

**ESLint (eslint.config.mjs) - Current Implementation:**
```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

**TypeScript Config (tsconfig.json) - Current Implementation:**
```jsonc
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Git Workflow

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

This comprehensive style guide is specifically designed for AI coding agents working on the ApplyMint AI frontend. It provides concrete, actionable patterns based on the actual current codebase state.

### Key Principles for AI Agents:

1. **Discovery First**: Always explore current codebase before making changes
2. **Pattern Following**: Copy established patterns from existing components
3. **Tool Usage**: Prefer shadcn CLI over manual component creation
4. **Semantic Colors**: Always use the semantic color system, never hardcoded colors
5. **Responsive Design**: Follow the established responsive patterns
6. **Incremental Development**: Build on existing architecture

### Quick Reference for AI Agents:

**Component Creation:**
```bash
pnpm dlx shadcn@latest add <component-name>
```

**Current Dependencies:**
- Next.js 15.4.5 with Turbopack
- React 19.1.0
- TypeScript 5.x
- Tailwind CSS v4.1.11
- Shadcn/ui with semantic colors

**Color System:**
```css
/* Always use semantic variables */
bg-primary text-primary-foreground
bg-card text-card-foreground
bg-muted text-muted-foreground
```

**Container Pattern:**
```typescript
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

**File Structure:**
- `src/app/(route-group)/page-name/page.tsx`
- `src/components/category/component-name.tsx`
- `src/types/index.ts` for TypeScript definitions

This guide is a living document that should be referenced before any code changes to ensure consistency with the established codebase patterns and architecture decisions.
