# ApplyMint AI Database Schema Documentation

## Overview

This document provides a comprehensive overview of the ApplyMint AI database schema, including all tables, relationships, and business logic. The database is designed to support a complete AI-powered job search platform with resume management, application tracking, and analytics.

## Database Architecture

### Core Design Principles
- **Supabase Integration**: Built on Supabase with Row Level Security (RLS)
- **User-Centric**: All data is properly isolated by user ownership
- **Scalable**: Optimized with proper indexing and relationships
- **AI-Ready**: Structured to support AI features like resume optimization and job matching

---

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│   auth.users    │       │   profiles      │
│   (Supabase)    │◄──────┤                 │
│                 │       │ - id (FK)       │
│ - id (PK)       │       │ - email         │
│ - email         │       │ - first_name    │
│ - created_at    │       │ - last_name     │
│ - updated_at    │       │ - phone_number  │
└─────────────────┘       └─────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────┐       ┌─────────────────┐
│   companies     │       │ user_preferences│
│                 │       │                 │
│ - id (PK)       │       │ - id (PK)       │
│ - name          │       │ - user_id (FK)  │
│ - description   │       │ - job_alerts    │
│ - website       │       │ - salary_range  │
│ - industry      │       │ - remote_work   │
│ - size          │       └─────────────────┘
│ - location      │               │
└─────────────────┘               │
         │                       │
         ▼                       ▼
┌─────────────────┐       ┌─────────────────┐
│      jobs       │       │  notifications  │
│                 │       │                 │
│ - id (PK)       │       │ - id (PK)       │
│ - title         │       │ - user_id (FK)  │
│ - company_id(FK)│       │ - type          │
│ - location      │       │ - title         │
│ - job_type      │       │ - message       │
│ - experience_lvl│       │ - is_read       │
│ - description   │       │ - action_url    │
│ - salary_range  │       └─────────────────┘
│ - skills[]      │               │
│ - requirements[]│               │
└─────────────────┘               │
         │                       │
         ▼                       ▼
┌─────────────────┐       ┌─────────────────┐
│job_applications │       │ activity_logs   │
│                 │       │                 │
│ - id (PK)       │       │ - id (PK)       │
│ - job_id (FK)   │       │ - user_id (FK)  │
│ - user_id (FK)  │       │ - activity_type │
│ - resume_id (FK)│       │ - description   │
│ - status        │       │ - metadata      │
│ - applied_at    │       └─────────────────┘
│ - cover_letter  │
└─────────────────┘
         │
         ▼
┌─────────────────┐       ┌─────────────────┐
│  saved_jobs     │       │interview_sessions│
│                 │       │                 │
│ - id (PK)       │       │ - id (PK)       │
│ - job_id (FK)   │       │ - user_id (FK)  │
│ - user_id (FK)  │       │ - job_id (FK)   │
│ - saved_at      │       │ - session_type  │
│ - notes         │       │ - questions     │
└─────────────────┘       │ - feedback      │
                          └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │    resumes      │
                         │                 │
                         │ - id (PK)       │
                         │ - user_id (FK)  │
                         │ - title         │
                         │ - summary       │
                         │ - is_ai_optimized│
                         │ - file_url      │
                         └─────────────────┘
                                  │
                                  ▼
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
         ┌─────────────────┐ ┌─────────┐ ┌─────────────┐
         │work_experiences │ │educations│ │   skills    │
         │                 │ │         │ │             │
         │ - resume_id (FK)│ │-resume_id│ │ - resume_id │
         │ - company       │ │-institution││ - name      │
         │ - position      │ │- degree  │ │ - level     │
         │ - start_date    │ │-start_date││ - category  │
         │ - end_date      │ └─────────┘ └─────────────┘
         └─────────────────┘             │
                                         ▼
                              ┌─────────────────┐
                              │ certifications │
                              │                 │
                              │ - resume_id (FK)│
                              │ - name          │
                              │ - issuer        │
                              │ - issue_date    │
                              │ - expiry_date   │
                              └─────────────────┘
                                         │
                                         ▼
                              ┌─────────────────┐
                              │   projects     │
                              │                 │
                              │ - resume_id (FK)│
                              │ - title         │
                              │ - description   │
                              │ - technologies │
                              │ - github_url    │
                              └─────────────────┘
                                         │
                                         ▼
                              ┌─────────────────┐
                              │   languages    │
                              │                 │
                              │ - resume_id (FK)│
                              │ - name          │
                              │ - proficiency   │
                              └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│ job_categories  │◄──────┤job_category_   │
│                 │       │   mappings     │
│ - id (PK)       │       │                 │
│ - name          │       │ - job_id (FK)  │
│ - description   │       │ - category_id  │
│ - parent_id (FK)│       │   (FK)         │
└─────────────────┘       └─────────────────┘
```

---

## Table Details

### 🔐 Authentication & User Management

#### `profiles`
**Purpose**: Extends Supabase auth.users with additional user information
**Relationships**:
- `1:1` with `auth.users` (id)
- `1:many` with most other tables (user_id)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, FK → auth.users | User ID |
| email | text | UNIQUE, NOT NULL | User email |
| first_name | text | NULL | User's first name |
| last_name | text | NULL | User's last name |
| phone_number | text | NULL | User's phone number |
| created_at | timestamp | DEFAULT now() | Creation timestamp |
| updated_at | timestamp | DEFAULT now() | Last update timestamp |

#### `user_preferences`
**Purpose**: Stores user job search preferences and notification settings
**Relationships**: `many:1` with `profiles` (user_id)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Preference ID |
| user_id | uuid | FK → profiles, UNIQUE | User ID |
| job_alerts | boolean | DEFAULT true | Job alert notifications |
| email_notifications | boolean | DEFAULT true | Email notifications |
| sms_notifications | boolean | DEFAULT false | SMS notifications |
| preferred_job_types | text[] | NULL | Preferred job types |
| preferred_locations | text[] | NULL | Preferred locations |
| salary_min | numeric | NULL | Minimum salary preference |
| salary_max | numeric | NULL | Maximum salary preference |
| salary_currency | text | DEFAULT 'USD' | Salary currency |
| remote_work | boolean | DEFAULT false | Remote work preference |

---

### 🏢 Job Search & Companies

#### `companies`
**Purpose**: Stores company information for job listings
**Relationships**: `1:many` with `jobs` (company_id)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Company ID |
| name | text | NOT NULL | Company name |
| description | text | NULL | Company description |
| website | text | NULL | Company website URL |
| logo_url | text | NULL | Company logo URL |
| industry | text | NULL | Industry sector |
| size | text | CHECK constraint | Company size (STARTUP, SMALL, etc.) |
| location | text | NULL | Company headquarters location |

#### `jobs`
**Purpose**: Core job listings with comprehensive details
**Relationships**:
- `many:1` with `companies` (company_id)
- `1:many` with `job_applications` (job_id)
- `1:many` with `saved_jobs` (job_id)
- `many:many` with `job_categories` (via job_category_mappings)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Job ID |
| title | text | NOT NULL | Job title |
| company_id | uuid | FK → companies | Company offering the job |
| location | text | NOT NULL | Job location |
| is_remote | boolean | DEFAULT false | Remote work availability |
| job_type | text | CHECK constraint | Job type (FULL_TIME, etc.) |
| experience_level | text | CHECK constraint | Experience level (ENTRY, etc.) |
| description | text | NOT NULL | Job description |
| requirements | text[] | NULL | Job requirements array |
| responsibilities | text[] | NULL | Job responsibilities array |
| benefits | text[] | NULL | Job benefits array |
| salary_min | numeric | NULL | Minimum salary |
| salary_max | numeric | NULL | Maximum salary |
| salary_currency | text | DEFAULT 'USD' | Salary currency |
| skills | text[] | NULL | Required skills array |
| posted_at | timestamp | DEFAULT now() | Job posting date |
| application_deadline | timestamp | NULL | Application deadline |
| is_active | boolean | DEFAULT true | Job active status |
| external_job_id | text | NULL | External job board ID |
| external_source | text | NULL | External source (LINKEDIN, etc.) |

#### `job_applications`
**Purpose**: Tracks user applications to jobs
**Relationships**:
- `many:1` with `jobs` (job_id)
- `many:1` with `profiles` (user_id)
- `many:1` with `resumes` (resume_id)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Application ID |
| job_id | uuid | FK → jobs | Applied job |
| user_id | uuid | FK → profiles | Applicant user |
| resume_id | uuid | NULL | Resume used for application |
| cover_letter | text | NULL | Application cover letter |
| status | text | CHECK constraint | Application status |
| applied_at | timestamp | DEFAULT now() | Application timestamp |
| updated_at | timestamp | DEFAULT now() | Last update timestamp |
| notes | text | NULL | Internal notes |

#### `saved_jobs`
**Purpose**: User's bookmarked jobs
**Relationships**:
- `many:1` with `jobs` (job_id)
- `many:1` with `profiles` (user_id)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Saved job ID |
| job_id | uuid | FK → jobs | Saved job |
| user_id | uuid | FK → profiles | User who saved |
| saved_at | timestamp | DEFAULT now() | Save timestamp |
| notes | text | NULL | Personal notes |

---

### 📄 Resume Management System

#### `resumes`
**Purpose**: Main resume container with AI optimization tracking
**Relationships**:
- `many:1` with `profiles` (user_id)
- `1:many` with all resume component tables

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Resume ID |
| user_id | uuid | FK → profiles | Resume owner |
| title | text | NOT NULL | Resume title |
| summary | text | NULL | Professional summary |
| is_default | boolean | DEFAULT false | Default resume flag |
| is_ai_optimized | boolean | DEFAULT false | AI optimization status |
| original_content | text | NULL | Original resume text |
| optimized_content | text | NULL | AI-optimized content |
| file_url | text | NULL | Uploaded file URL |

#### `work_experiences`
**Purpose**: Professional work experience entries
**Relationships**: `many:1` with `resumes` (resume_id)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Experience ID |
| resume_id | uuid | FK → resumes | Parent resume |
| company | text | NOT NULL | Company name |
| position | text | NOT NULL | Job position |
| description | text | NOT NULL | Role description |
| start_date | date | NOT NULL | Start date |
| end_date | date | NULL | End date |
| is_current_role | boolean | DEFAULT false | Current position flag |
| location | text | NULL | Work location |
| skills | text[] | NULL | Skills used |

#### `educations`
**Purpose**: Educational background entries
**Relationships**: `many:1` with `resumes` (resume_id)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Education ID |
| resume_id | uuid | FK → resumes | Parent resume |
| institution | text | NOT NULL | School/university name |
| degree | text | NOT NULL | Degree earned |
| field_of_study | text | NOT NULL | Field of study |
| start_date | date | NOT NULL | Start date |
| end_date | date | NULL | Graduation date |
| grade | text | NULL | GPA/Grade |
| description | text | NULL | Additional details |

#### `skills`
**Purpose**: Technical and soft skills with proficiency levels
**Relationships**: `many:1` with `resumes` (resume_id)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Skill ID |
| resume_id | uuid | FK → resumes | Parent resume |
| name | text | NOT NULL | Skill name |
| level | text | CHECK constraint | Proficiency level |
| category | text | CHECK constraint | Skill category |

#### `certifications`
**Purpose**: Professional certifications and credentials
**Relationships**: `many:1` with `resumes` (resume_id)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Certification ID |
| resume_id | uuid | FK → resumes | Parent resume |
| name | text | NOT NULL | Certification name |
| issuer | text | NOT NULL | Issuing organization |
| issue_date | date | NOT NULL | Issue date |
| expiry_date | date | NULL | Expiry date |
| credential_id | text | NULL | Credential ID |
| credential_url | text | NULL | Verification URL |

#### `projects`
**Purpose**: Portfolio projects and achievements
**Relationships**: `many:1` with `resumes` (resume_id)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Project ID |
| resume_id | uuid | FK → resumes | Parent resume |
| title | text | NOT NULL | Project title |
| description | text | NOT NULL | Project description |
| technologies | text[] | NULL | Technologies used |
| project_url | text | NULL | Live project URL |
| github_url | text | NULL | GitHub repository URL |
| start_date | date | NOT NULL | Project start date |
| end_date | date | NULL | Project end date |

#### `languages`
**Purpose**: Language proficiencies
**Relationships**: `many:1` with `resumes` (resume_id)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Language ID |
| resume_id | uuid | FK → resumes | Parent resume |
| name | text | NOT NULL | Language name |
| proficiency | text | CHECK constraint | Proficiency level |

---

### 🤖 AI Features & Analytics

#### `interview_sessions`
**Purpose**: AI-powered interview preparation sessions
**Relationships**:
- `many:1` with `profiles` (user_id)
- `many:1` with `jobs` (job_id, optional)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Session ID |
| user_id | uuid | FK → profiles | User preparing |
| job_id | uuid | FK → jobs, NULL | Target job (optional) |
| session_type | text | CHECK constraint | Session type |
| title | text | NOT NULL | Session title |
| questions | jsonb | NULL | Interview questions |
| feedback | jsonb | NULL | AI feedback and scores |
| duration_minutes | integer | NULL | Session duration |
| completed_at | timestamp | NULL | Completion timestamp |

#### `notifications`
**Purpose**: System and job-related notifications
**Relationships**: `many:1` with `profiles` (user_id)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Notification ID |
| user_id | uuid | FK → profiles | Target user |
| type | text | CHECK constraint | Notification type |
| title | text | NOT NULL | Notification title |
| message | text | NOT NULL | Notification content |
| is_read | boolean | DEFAULT false | Read status |
| action_url | text | NULL | Action URL |
| metadata | jsonb | NULL | Additional data |

#### `activity_logs`
**Purpose**: User activity tracking for analytics
**Relationships**: `many:1` with `profiles` (user_id)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Activity log ID |
| user_id | uuid | FK → profiles | User who performed action |
| activity_type | text | NOT NULL | Type of activity |
| description | text | NOT NULL | Activity description |
| metadata | jsonb | NULL | Additional context data |

---

### 🏷️ Job Categorization

#### `job_categories`
**Purpose**: Hierarchical job categories for filtering
**Relationships**:
- `many:1` self-reference (parent_id)
- `many:many` with `jobs` (via job_category_mappings)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Category ID |
| name | text | NOT NULL, UNIQUE | Category name |
| description | text | NULL | Category description |
| parent_id | uuid | FK → job_categories | Parent category |

#### `job_category_mappings`
**Purpose**: Junction table for job-category many-to-many relationship
**Relationships**:
- `many:1` with `jobs` (job_id)
- `many:1` with `job_categories` (category_id)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| job_id | uuid | FK → jobs, PK | Job ID |
| category_id | uuid | FK → job_categories, PK | Category ID |

---

## Security & Access Control

### Row Level Security (RLS) Policies

#### Public Access Tables
- **`companies`**: Viewable by everyone
- **`jobs`**: Viewable by everyone
- **`job_categories`**: Viewable by everyone
- **`job_category_mappings`**: Viewable by everyone

#### User-Specific Tables
- **`profiles`**: Users can view all profiles, update own profile
- **`user_preferences`**: Users can only access their own preferences
- **`job_applications`**: Users can only access their own applications
- **`saved_jobs`**: Users can only access their own saved jobs
- **`resumes`**: Users can only access their own resumes
- **`notifications`**: Users can only access their own notifications
- **`activity_logs`**: Users can only access their own activity logs
- **`interview_sessions`**: Users can only access their own sessions

#### Resume Component Tables
All resume-related tables use subqueries to ensure users can only access components of their own resumes:
```sql
auth.uid() = (SELECT user_id FROM resumes WHERE id = resume_id)
```

---

## Performance Optimizations

### Indexes Created

#### Jobs Table Indexes
- `idx_jobs_location` - Location-based searches
- `idx_jobs_job_type` - Job type filtering
- `idx_jobs_experience_level` - Experience level filtering
- `idx_jobs_is_active` - Active job filtering
- `idx_jobs_posted_at` - Recent jobs sorting
- `idx_jobs_company_id` - Company-based queries

#### Applications & User Data Indexes
- `idx_job_applications_user_id` - User's applications
- `idx_job_applications_job_id` - Job's applications
- `idx_job_applications_status` - Status-based filtering
- `idx_saved_jobs_user_id` - User's saved jobs
- `idx_notifications_user_id` - User's notifications
- `idx_notifications_is_read` - Unread notifications
- `idx_activity_logs_user_id` - User's activity logs
- `idx_activity_logs_created_at` - Activity timeline

---

## Data Integrity Constraints

### Check Constraints
- **Job Types**: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE
- **Experience Levels**: ENTRY, MID, SENIOR, EXECUTIVE
- **Application Status**: DRAFT, SUBMITTED, UNDER_REVIEW, INTERVIEW, OFFER, REJECTED, ACCEPTED
- **Skill Levels**: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
- **Skill Categories**: TECHNICAL, SOFT, LANGUAGE, TOOL
- **Language Proficiency**: BASIC, CONVERSATIONAL, FLUENT, NATIVE
- **Company Sizes**: STARTUP, SMALL, MEDIUM, LARGE, ENTERPRISE
- **Interview Session Types**: MOCK_INTERVIEW, TECHNICAL_PREP, BEHAVIORAL_PREP
- **Notification Types**: JOB_MATCH, APPLICATION_UPDATE, INTERVIEW_REMINDER, SYSTEM

### Unique Constraints
- **Profiles**: email (unique)
- **Job Applications**: (job_id, user_id) - prevent duplicate applications
- **Saved Jobs**: (job_id, user_id) - prevent duplicate saves
- **User Preferences**: user_id (unique) - one preference set per user
- **Job Categories**: name (unique)

### Foreign Key Constraints
- All foreign keys use CASCADE delete where appropriate
- Interview sessions allow NULL job_id (general preparation)
- Resume components cascade delete from parent resume

---

## Business Logic & Workflows

### User Registration Flow
1. User registers via Supabase Auth
2. `auth.users` record created
3. Trigger creates `profiles` record with user metadata
4. User can update profile information
5. User can set job search preferences

### Job Application Flow
1. User browses jobs (public access)
2. User saves interesting jobs (optional)
3. User applies with resume and cover letter
4. Application status tracked through workflow
5. Notifications sent for status updates

### Resume Management Flow
1. User creates resume with basic information
2. User adds work experiences, education, skills, etc.
3. User can upload resume file or build from components
4. AI optimization available for resume content
5. Resume used for job applications

### AI Features Integration
1. **Resume Optimization**: AI analyzes and improves resume content
2. **Job Matching**: AI matches user profiles with suitable jobs
3. **Interview Preparation**: AI generates questions and provides feedback
4. **Activity Analytics**: AI analyzes user behavior for insights

---

## API Integration Points

### External Job Sources
- `jobs.external_job_id` - Links to external job boards
- `jobs.external_source` - Tracks data source (LINKEDIN, INDEED, etc.)
- Supports importing jobs from multiple sources

### File Storage Integration
- `resumes.file_url` - Links to uploaded resume files
- `companies.logo_url` - Company logo images
- `certifications.credential_url` - Certificate verification links

### Notification System
- `notifications.action_url` - Deep links to relevant pages
- `notifications.metadata` - Flexible data for different notification types
- Supports email, SMS, and in-app notifications

---

## Maintenance & Operations

### Automated Triggers
- `updated_at` timestamps automatically updated on all tables
- Profile creation trigger for new user registration
- All triggers use `update_updated_at_column()` function

### Backup & Recovery
- All tables include creation and update timestamps
- Foreign key relationships maintain referential integrity
- RLS policies ensure data isolation

### Monitoring & Analytics
- `activity_logs` table tracks all user actions
- Performance indexes optimize common queries
- JSONB fields allow flexible metadata storage

---

## Future Extensibility

### Planned Enhancements
- **Company Reviews**: User reviews and ratings for companies
- **Job Alerts**: Automated job matching notifications
- **Interview Scheduling**: Calendar integration for interviews
- **Resume Analytics**: AI-powered resume scoring and suggestions
- **Networking Features**: Professional connections and messaging

### Schema Evolution
- UUID primary keys allow for easy data migration
- JSONB fields provide flexibility for new features
- Proper foreign key relationships support feature expansion
- RLS policies can be extended for new access patterns

---

*This database schema provides a solid foundation for the ApplyMint AI job search platform, supporting all current features and providing extensibility for future AI-powered enhancements.*</content>
<parameter name="filePath">c:\Personal\Codejex\Applymint\applymint-ai-frontend\DATABASE_SCHEMA_DOCUMENTATION.md