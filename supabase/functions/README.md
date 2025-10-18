# ApplyMint AI API Endpoints

This document describes the Supabase Edge Functions created for the ApplyMint AI application.

## Available APIs

### 1. Jobs API (`/functions/v1/jobs`)

**GET /functions/v1/jobs**
- Get all jobs with optional filters
- Query parameters:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)
  - `location` (string): Filter by location
  - `jobType` (string): Filter by job type (FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE)
  - `experienceLevel` (string): Filter by experience level (ENTRY, MID, SENIOR, EXECUTIVE)
  - `isRemote` (boolean): Filter remote jobs
  - `companyId` (string): Filter by company ID
  - `skills` (string): Comma-separated skills to filter by
  - `salaryMin` (number): Minimum salary filter
  - `salaryMax` (number): Maximum salary filter
  - `query` (string): Search in title and description

**GET /functions/v1/jobs/:id**
- Get a specific job by ID

**POST /functions/v1/jobs**
- Create a new job
- Required fields: `title`, `company_id`, `location`, `description`

**PUT /functions/v1/jobs/:id**
- Update a job

**DELETE /functions/v1/jobs/:id**
- Soft delete a job (sets is_active to false)

### 2. Companies API (`/functions/v1/companies`)

**GET /functions/v1/companies**
- Get all companies with optional filters
- Query parameters:
  - `page`, `limit`, `industry`, `size`, `location`, `query`

**GET /functions/v1/companies/:id**
- Get a specific company with its active jobs

**POST /functions/v1/companies**
- Create a new company
- Required field: `name`

**PUT /functions/v1/companies/:id**
- Update a company

**DELETE /functions/v1/companies/:id**
- Delete a company (only if no active jobs)

### 3. Job Applications API (`/functions/v1/job-applications`)

**GET /functions/v1/job-applications**
- Get job applications with optional filters
- Query parameters: `page`, `limit`, `status`, `userId`, `jobId`

**GET /functions/v1/job-applications/:id**
- Get a specific application with full details

**POST /functions/v1/job-applications**
- Create a new job application
- Required fields: `job_id`, `user_id`
- Prevents duplicate applications

**PUT /functions/v1/job-applications/:id**
- Update application (status, cover letter, notes)

### 5. Job Alerts API (`/functions/v1/job-alerts`)

**GET /functions/v1/job-alerts**
- Get job alerts for the authenticated user
- Query parameters:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)
  - `isActive` (boolean): Filter by active status

**GET /functions/v1/job-alerts/:id**
- Get a specific job alert by ID

**POST /functions/v1/job-alerts**
- Create a new job alert
- Required fields: `name`, `criteria`
- Optional fields: `is_active` (default: true), `frequency`, `notification_preferences`

**PUT /functions/v1/job-alerts/:id**
- Update a job alert

**DELETE /functions/v1/job-alerts/:id**
- Delete a job alert

### 6. Resumes API (`/functions/v1/resumes`)

**GET /functions/v1/resumes**
- Get resumes for the authenticated user
- Query parameters: `page`, `limit`, `isPrimary`

**GET /functions/v1/resumes/:id**
- Get a specific resume with all related data

**POST /functions/v1/resumes**
- Create a new resume
- Required fields: `title`
- Optional: `is_primary` (automatically manages primary resume status)

**PUT /functions/v1/resumes/:id**
- Update a resume

**DELETE /functions/v1/resumes/:id**
- Delete a resume

### 7. Saved Jobs API (`/functions/v1/saved-jobs`)

**GET /functions/v1/saved-jobs**
- Get saved jobs for the authenticated user
- Query parameters: `page`, `limit`

**POST /functions/v1/saved-jobs**
- Save a job for the authenticated user
- Required field: `job_id`
- Prevents duplicate saves

**DELETE /functions/v1/saved-jobs/:id**
- Remove a saved job

**GET /functions/v1/profiles**
- Get current user's profile with all related data
- Requires authentication

**GET /functions/v1/profiles/:id**
- Get a specific user's profile (respects privacy settings)

**PUT /functions/v1/profiles**
- Update current user's profile

**PUT /functions/v1/profiles/:id**
- Update a specific profile (users can only update their own)

**POST /functions/v1/profiles**
- Create a new profile

## Authentication

All API endpoints require proper Supabase authentication. Include the Authorization header:

```
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```

For authenticated endpoints, also include the user's JWT token in the Authorization header.

## Testing Locally

1. Start Supabase services:
```bash
supabase start
```

2. Serve the functions:
```bash
supabase functions serve
```

3. Test an endpoint:
```bash
curl -X GET "http://localhost:54321/functions/v1/jobs?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

## Deploying to Production

1. Link to your Supabase project:
```bash
supabase link --project-ref YOUR_PROJECT_ID
```

2. Deploy functions:
```bash
supabase functions deploy jobs
supabase functions deploy companies
supabase functions deploy job-applications
supabase functions deploy profiles
supabase functions deploy job-alerts
supabase functions deploy resumes
supabase functions deploy saved-jobs
```

Or deploy all at once:
```bash
supabase functions deploy
```

## Environment Variables

The functions use these environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key

## Error Handling

All endpoints return JSON responses with appropriate HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

Error responses include an `error` field with a descriptive message.

## CORS Support

All endpoints include proper CORS headers for browser requests.