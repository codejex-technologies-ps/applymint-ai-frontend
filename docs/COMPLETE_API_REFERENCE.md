# Complete API Endpoints Reference

This document provides a comprehensive overview of all available API endpoints in the ApplyMint AI platform.

## Table of Contents

1. [Authentication](#authentication)
2. [Profiles](#profiles)
3. [Companies](#companies)
4. [Jobs](#jobs)
5. [Resumes](#resumes)
6. [Skills](#skills)
7. [Work Experiences](#work-experiences)
8. [Educations](#educations) ⭐ NEW
9. [Certifications](#certifications) ⭐ NEW
10. [Projects](#projects) ⭐ NEW
11. [Languages](#languages) ⭐ NEW
12. [Job Applications](#job-applications)
13. [Saved Jobs](#saved-jobs)
14. [Job Alerts](#job-alerts)

---

## Authentication

Base URL: `https://pidjubyaqzoitmbixzbf.supabase.co/auth/v1`

### Register User
```
POST /signup
Body: { email, password, metadata }
```

### Login
```
POST /token?grant_type=password
Body: { email, password }
```

### Get Session
```
GET /user
Headers: { Authorization: Bearer <token> }
```

---

## Profiles

Base URL: `/functions/v1/profiles`

### Get Current User Profile
```
GET /profiles
Returns: Profile with work experiences, educations, skills, etc.
```

### Update Profile
```
PUT /profiles
Body: { first_name, last_name, phone_number, ... }
```

### Get Specific Profile
```
GET /profiles/:id
Returns: Complete profile with all relations
```

---

## Companies

Base URL: `/functions/v1/companies`

### List Companies
```
GET /companies?page=1&limit=10&industry=Technology&size=MEDIUM
Query Params:
  - page (integer, default: 1)
  - limit (integer, default: 10, max: 100)
  - industry (string)
  - size (STARTUP|SMALL|MEDIUM|LARGE|ENTERPRISE)
  - location (string)
  - query (string, search)
```

### Get Company by ID
```
GET /companies/:id
Returns: Company with associated jobs
```

### Create Company
```
POST /companies
Body: { name, description, industry, size, location, ... }
Required: name
```

---

## Jobs

Base URL: `/functions/v1/jobs`

### List Jobs
```
GET /jobs?page=1&limit=10&location=SF&jobType=FULL_TIME
Query Params:
  - page, limit
  - location (string)
  - jobType (FULL_TIME|PART_TIME|CONTRACT|INTERNSHIP|FREELANCE)
  - experienceLevel (ENTRY|MID|SENIOR|EXECUTIVE)
  - isRemote (boolean)
  - minSalary (number)
```

### Get Job by ID
```
GET /jobs/:id
Returns: Job with company information
```

### Create Job
```
POST /jobs
Body: { title, company_id, location, job_type, description, ... }
```

---

## Resumes

Base URL: `/functions/v1/resumes`

### List Resumes
```
GET /resumes?page=1&limit=10&isPrimary=true
Query Params:
  - page, limit
  - isPrimary (boolean)
```

### Get Resume by ID
```
GET /resumes/:id
Returns: Resume with skills, work_experiences, educations, 
         certifications, projects, languages
```

### Create Resume (Enhanced) ⭐
```
POST /resumes
Body: {
  title: "My Resume",
  summary: "...",
  is_primary: true,
  
  // Optional nested arrays - all created automatically
  skills: [{name, level, category}, ...],
  work_experiences: [{company, position, ...}, ...],
  educations: [{institution, degree, ...}, ...],
  certifications: [{name, issuer, ...}, ...],
  projects: [{title, description, ...}, ...],
  languages: [{name, proficiency}, ...]
}

Returns: Complete resume with all nested data
```

### Update Resume
```
PUT /resumes/:id
Body: { title, summary, ... }
```

### Delete Resume
```
DELETE /resumes/:id
Note: Cascade deletes all related data
```

---

## Skills

Base URL: `/functions/v1/skills`

### List Skills
```
GET /skills?page=1&limit=50&resumeId=xxx&category=TECHNICAL&level=EXPERT
Query Params:
  - page, limit
  - resumeId (uuid)
  - category (TECHNICAL|SOFT|LANGUAGE|TOOL)
  - level (BEGINNER|INTERMEDIATE|ADVANCED|EXPERT)
```

### Get Skill by ID
```
GET /skills/:id
```

### Create Skill
```
POST /skills
Body: {
  resume_id: "uuid",
  name: "JavaScript",
  level: "EXPERT",
  category: "TECHNICAL"
}
Required: resume_id, name
```

### Update Skill
```
PUT /skills/:id
Body: { name, level, category }
```

### Delete Skill
```
DELETE /skills/:id
```

---

## Work Experiences

Base URL: `/functions/v1/work-experiences`

### List Work Experiences
```
GET /work-experiences?page=1&limit=50&resumeId=xxx&isCurrent=true
Query Params:
  - page, limit
  - resumeId (uuid)
  - isCurrent (boolean)
```

### Get Work Experience by ID
```
GET /work-experiences/:id
```

### Create Work Experience
```
POST /work-experiences
Body: {
  resume_id: "uuid",
  company: "TechCorp",
  position: "Senior Developer",
  description: "Led team...",
  start_date: "2020-01-01",
  end_date: "2023-06-30",
  is_current_role: false,
  location: "San Francisco",
  skills: ["React", "Node.js"]
}
Required: resume_id, company, position, description, start_date
```

### Update Work Experience
```
PUT /work-experiences/:id
Body: { company, position, description, ... }
```

### Delete Work Experience
```
DELETE /work-experiences/:id
```

---

## Educations ⭐ NEW

Base URL: `/functions/v1/educations`

### List Educations
```
GET /educations?page=1&limit=50&resumeId=xxx
Query Params:
  - page, limit
  - resumeId (uuid)
```

### Get Education by ID
```
GET /educations/:id
```

### Create Education
```
POST /educations
Body: {
  resume_id: "uuid",
  institution: "Stanford University",
  degree: "Bachelor of Science",
  field_of_study: "Computer Science",
  start_date: "2015-09-01",
  end_date: "2019-06-01",
  grade: "3.8 GPA",
  description: "Focused on AI and ML"
}
Required: resume_id, institution, degree, field_of_study, start_date
```

### Update Education
```
PUT /educations/:id
Body: { institution, degree, grade, ... }
```

### Delete Education
```
DELETE /educations/:id
```

---

## Certifications ⭐ NEW

Base URL: `/functions/v1/certifications`

### List Certifications
```
GET /certifications?page=1&limit=50&resumeId=xxx
Query Params:
  - page, limit
  - resumeId (uuid)
```

### Get Certification by ID
```
GET /certifications/:id
```

### Create Certification
```
POST /certifications
Body: {
  resume_id: "uuid",
  name: "AWS Solutions Architect",
  issuer: "Amazon Web Services",
  issue_date: "2023-01-15",
  expiry_date: "2026-01-15",
  credential_id: "AWS-123456",
  credential_url: "https://..."
}
Required: resume_id, name, issuer, issue_date
```

### Update Certification
```
PUT /certifications/:id
Body: { name, issuer, expiry_date, ... }
```

### Delete Certification
```
DELETE /certifications/:id
```

---

## Projects ⭐ NEW

Base URL: `/functions/v1/projects`

### List Projects
```
GET /projects?page=1&limit=50&resumeId=xxx
Query Params:
  - page, limit
  - resumeId (uuid)
```

### Get Project by ID
```
GET /projects/:id
```

### Create Project
```
POST /projects
Body: {
  resume_id: "uuid",
  title: "E-commerce Platform",
  description: "Full-stack solution with React and Node.js",
  technologies: ["React", "Node.js", "PostgreSQL", "Docker"],
  project_url: "https://project.com",
  github_url: "https://github.com/user/project",
  start_date: "2022-01-01",
  end_date: "2022-06-30"
}
Required: resume_id, title, description, start_date
```

### Update Project
```
PUT /projects/:id
Body: { title, description, technologies, ... }
```

### Delete Project
```
DELETE /projects/:id
```

---

## Languages ⭐ NEW

Base URL: `/functions/v1/languages`

### List Languages
```
GET /languages?page=1&limit=50&resumeId=xxx
Query Params:
  - page, limit
  - resumeId (uuid)
```

### Get Language by ID
```
GET /languages/:id
```

### Create Language
```
POST /languages
Body: {
  resume_id: "uuid",
  name: "Spanish",
  proficiency: "FLUENT"
}
Proficiency: BASIC|CONVERSATIONAL|FLUENT|NATIVE
Required: resume_id, name, proficiency
```

### Update Language
```
PUT /languages/:id
Body: { name, proficiency }
```

### Delete Language
```
DELETE /languages/:id
```

---

## Job Applications

Base URL: `/functions/v1/job-applications`

### List Applications
```
GET /job-applications?page=1&limit=10&status=SUBMITTED
Query Params:
  - page, limit
  - status (DRAFT|SUBMITTED|UNDER_REVIEW|INTERVIEW|OFFER|REJECTED|ACCEPTED)
```

### Get Application by ID
```
GET /job-applications/:id
```

### Create Application
```
POST /job-applications
Body: {
  job_id: "uuid",
  user_id: "uuid",
  resume_id: "uuid",
  cover_letter: "Dear Hiring Manager..."
}
```

### Update Application
```
PUT /job-applications/:id
Body: { status, notes, ... }
```

---

## Saved Jobs

Base URL: `/functions/v1/saved-jobs`

### List Saved Jobs
```
GET /saved-jobs?page=1&limit=10
```

### Save Job
```
POST /saved-jobs
Body: {
  job_id: "uuid",
  notes: "Interesting opportunity"
}
```

### Remove Saved Job
```
DELETE /saved-jobs/:id
```

---

## Job Alerts

Base URL: `/functions/v1/job-alerts`

### List Job Alerts
```
GET /job-alerts?page=1&limit=10&isActive=true
Query Params:
  - page, limit
  - isActive (boolean)
```

### Create Job Alert
```
POST /job-alerts
Body: {
  name: "Full Stack Developer Alerts",
  criteria: {
    keywords: ["React", "Node.js"],
    locations: ["San Francisco", "Remote"],
    experienceLevels: ["MID", "SENIOR"],
    salaryMin: 90000
  },
  frequency: "DAILY",
  is_active: true
}
Frequency: DAILY|WEEKLY|MONTHLY
```

### Update Job Alert
```
PUT /job-alerts/:id
Body: { criteria, frequency, is_active }
```

### Delete Job Alert
```
DELETE /job-alerts/:id
```

---

## Common Patterns

### Authentication
All endpoints (except public job/company listings) require:
```
Headers: {
  Authorization: Bearer <jwt-token>,
  apikey: <supabase-anon-key>,
  Content-Type: application/json
}
```

### Pagination Response
```json
{
  "items": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 45,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Responses
```json
// 400 Bad Request
{ "error": "field_name is required" }

// 401 Unauthorized
{ "error": "Unauthorized" }

// 404 Not Found
{ "error": "Resource not found" }

// 500 Internal Server Error
{ "error": "Internal server error" }
```

### Authorization Rules
- Users can only access/modify their own data
- Resume ownership is verified for skills, work experiences, educations, etc.
- Attempting to access another user's data returns 403 Forbidden

---

## Quick Reference

### Total Endpoints: 14 categories

**Public (No Auth Required):**
- Companies (GET list, GET by ID)
- Jobs (GET list, GET by ID)

**Authenticated:**
- Profiles (GET, PUT)
- Resumes (GET, POST, PUT, DELETE) + nested creation
- Skills (Full CRUD)
- Work Experiences (Full CRUD)
- Educations (Full CRUD) ⭐ NEW
- Certifications (Full CRUD) ⭐ NEW
- Projects (Full CRUD) ⭐ NEW
- Languages (Full CRUD) ⭐ NEW
- Job Applications (GET, POST, PUT)
- Saved Jobs (GET, POST, DELETE)
- Job Alerts (Full CRUD)

### New Features Summary

1. **OpenAPI Specification** - Complete API docs in `openapi.yaml`
2. **4 New Endpoints** - Educations, Certifications, Projects, Languages
3. **Enhanced Resume Creation** - One-shot creation with all nested data
4. **Comprehensive Documentation** - Usage guides, deployment instructions, examples

---

## Resources

- **OpenAPI Spec:** `openapi.yaml`
- **Usage Guide:** `NEW_ENDPOINTS_DOCUMENTATION.md`
- **Deployment:** `NEW_ENDPOINTS_DEPLOYMENT.md`
- **Original Docs:** `API_SIMULATION_SUMMARY.md`

## Support

For issues or questions:
1. Check function logs: `npx supabase functions logs <function-name>`
2. Review documentation files
3. Test with Swagger UI or Postman
4. Verify authentication and authorization

---

**Last Updated:** October 18, 2025
**API Version:** 1.0.0
**Total Endpoints:** 50+
