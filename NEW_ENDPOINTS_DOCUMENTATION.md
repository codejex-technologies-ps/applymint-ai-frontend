# New API Endpoints Documentation

This document describes the new endpoints added to the ApplyMint AI API.

## Overview

Added 4 new CRUD endpoints for comprehensive resume management:
- **Educations** - Academic history
- **Certifications** - Professional certifications
- **Projects** - Portfolio projects
- **Languages** - Language proficiency

## Educations Endpoint

### Base URL
`/functions/v1/educations`

### Operations

#### GET /educations
List user's education entries

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 50, max: 100) - Results per page
- `resumeId` (uuid) - Filter by resume ID

**Response:**
```json
{
  "educations": [
    {
      "id": "uuid",
      "resume_id": "uuid",
      "institution": "Stanford University",
      "degree": "Bachelor of Science",
      "field_of_study": "Computer Science",
      "start_date": "2015-09-01",
      "end_date": "2019-06-01",
      "grade": "3.8 GPA",
      "description": "Focused on AI and Machine Learning"
    }
  ],
  "pagination": {...}
}
```

#### POST /educations
Create new education entry

**Request Body:**
```json
{
  "resume_id": "uuid",
  "institution": "Stanford University",
  "degree": "Bachelor of Science",
  "field_of_study": "Computer Science",
  "start_date": "2015-09-01",
  "end_date": "2019-06-01",
  "grade": "3.8 GPA",
  "description": "Focused on AI and Machine Learning"
}
```

Required fields: `resume_id`, `institution`, `degree`, `field_of_study`, `start_date`

#### PUT /educations/:id
Update education entry

#### DELETE /educations/:id
Delete education entry

---

## Certifications Endpoint

### Base URL
`/functions/v1/certifications`

### Operations

#### GET /certifications
List user's certifications

**Query Parameters:**
- `page` (integer)
- `limit` (integer)
- `resumeId` (uuid)

**Response:**
```json
{
  "certifications": [
    {
      "id": "uuid",
      "resume_id": "uuid",
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "issue_date": "2023-01-15",
      "expiry_date": "2026-01-15",
      "credential_id": "AWS-123456",
      "credential_url": "https://..."
    }
  ],
  "pagination": {...}
}
```

#### POST /certifications
Create certification

**Request Body:**
```json
{
  "resume_id": "uuid",
  "name": "AWS Certified Solutions Architect",
  "issuer": "Amazon Web Services",
  "issue_date": "2023-01-15",
  "expiry_date": "2026-01-15",
  "credential_id": "AWS-123456",
  "credential_url": "https://..."
}
```

Required fields: `resume_id`, `name`, `issuer`, `issue_date`

#### PUT /certifications/:id
Update certification

#### DELETE /certifications/:id
Delete certification

---

## Projects Endpoint

### Base URL
`/functions/v1/projects`

### Operations

#### GET /projects
List user's projects

**Query Parameters:**
- `page` (integer)
- `limit` (integer)
- `resumeId` (uuid)

**Response:**
```json
{
  "projects": [
    {
      "id": "uuid",
      "resume_id": "uuid",
      "title": "E-commerce Platform",
      "description": "Full-stack e-commerce solution with React and Node.js",
      "technologies": ["React", "Node.js", "PostgreSQL", "Docker"],
      "project_url": "https://...",
      "github_url": "https://github.com/...",
      "start_date": "2022-01-01",
      "end_date": "2022-06-30"
    }
  ],
  "pagination": {...}
}
```

#### POST /projects
Create project

**Request Body:**
```json
{
  "resume_id": "uuid",
  "title": "E-commerce Platform",
  "description": "Full-stack e-commerce solution",
  "technologies": ["React", "Node.js", "PostgreSQL"],
  "project_url": "https://...",
  "github_url": "https://github.com/...",
  "start_date": "2022-01-01",
  "end_date": "2022-06-30"
}
```

Required fields: `resume_id`, `title`, `description`, `start_date`

#### PUT /projects/:id
Update project

#### DELETE /projects/:id
Delete project

---

## Languages Endpoint

### Base URL
`/functions/v1/languages`

### Operations

#### GET /languages
List user's languages

**Query Parameters:**
- `page` (integer)
- `limit` (integer)
- `resumeId` (uuid)

**Response:**
```json
{
  "languages": [
    {
      "id": "uuid",
      "resume_id": "uuid",
      "name": "Spanish",
      "proficiency": "FLUENT"
    }
  ],
  "pagination": {...}
}
```

#### POST /languages
Add language

**Request Body:**
```json
{
  "resume_id": "uuid",
  "name": "Spanish",
  "proficiency": "FLUENT"
}
```

Proficiency values: `BASIC`, `CONVERSATIONAL`, `FLUENT`, `NATIVE`

Required fields: `resume_id`, `name`, `proficiency`

#### PUT /languages/:id
Update language

#### DELETE /languages/:id
Delete language

---

## Enhanced Resume Creation

The `/functions/v1/resumes` POST endpoint now supports nested creation of all related data.

### Example: Create Resume with All Data

```json
{
  "title": "Senior Full Stack Developer Resume",
  "summary": "Experienced developer with 5+ years...",
  "is_primary": true,
  "skills": [
    {
      "name": "JavaScript",
      "level": "EXPERT",
      "category": "TECHNICAL"
    },
    {
      "name": "React",
      "level": "EXPERT",
      "category": "TECHNICAL"
    }
  ],
  "work_experiences": [
    {
      "company": "TechCorp",
      "position": "Senior Developer",
      "description": "Led development team...",
      "start_date": "2020-01-01",
      "is_current_role": true,
      "location": "San Francisco, CA",
      "skills": ["React", "Node.js", "AWS"]
    }
  ],
  "educations": [
    {
      "institution": "Stanford University",
      "degree": "BS",
      "field_of_study": "Computer Science",
      "start_date": "2015-09-01",
      "end_date": "2019-06-01",
      "grade": "3.8"
    }
  ],
  "certifications": [
    {
      "name": "AWS Solutions Architect",
      "issuer": "Amazon",
      "issue_date": "2023-01-15"
    }
  ],
  "projects": [
    {
      "title": "E-commerce Platform",
      "description": "Built full-stack platform",
      "technologies": ["React", "Node.js"],
      "start_date": "2022-01-01",
      "end_date": "2022-06-30"
    }
  ],
  "languages": [
    {
      "name": "English",
      "proficiency": "NATIVE"
    },
    {
      "name": "Spanish",
      "proficiency": "FLUENT"
    }
  ]
}
```

**Response:**
Returns the complete resume with all nested data populated.

---

## Authentication

All endpoints require authentication. Include JWT token:

```
Authorization: Bearer <your-jwt-token>
```

## Authorization

- Users can only access/modify their own data
- Resume ownership is verified before allowing operations on nested data
- Attempting to access another user's data returns 403 Forbidden

## Error Responses

### 400 Bad Request
```json
{
  "error": "resume_id is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Education not found"
}
```

## Pagination

All list endpoints support pagination:

```json
{
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

## Deployment

Deploy new functions:

```bash
npx supabase functions deploy educations
npx supabase functions deploy certifications
npx supabase functions deploy projects
npx supabase functions deploy languages
```

## OpenAPI Specification

Complete API documentation is available in `openapi.yaml`. View with Swagger UI:

```bash
# Using Docker
docker run -p 8080:8080 -e SWAGGER_JSON=/openapi.yaml -v $(pwd):/data swaggerapi/swagger-ui

# Or use online editor
# Visit https://editor.swagger.io/ and paste openapi.yaml content
```

## Integration Examples

### Creating a Complete Resume

```javascript
const response = await fetch('/functions/v1/resumes', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "My Resume",
    summary: "Experienced developer...",
    skills: [{name: "React", level: "EXPERT", category: "TECHNICAL"}],
    work_experiences: [{
      company: "TechCorp",
      position: "Developer",
      description: "Built features...",
      start_date: "2020-01-01",
      is_current_role: true
    }],
    educations: [{
      institution: "University",
      degree: "BS",
      field_of_study: "CS",
      start_date: "2015-09-01",
      end_date: "2019-06-01"
    }]
  })
})

const { resume } = await response.json()
// resume now contains all nested data
```

### Adding Individual Items

```javascript
// Add education to existing resume
await fetch('/functions/v1/educations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    resume_id: "existing-resume-id",
    institution: "Harvard",
    degree: "Master of Science",
    field_of_study: "Data Science",
    start_date: "2020-09-01",
    end_date: "2022-06-01"
  })
})
```

## Database Tables

All new endpoints interact with these tables:
- `educations` - Stores education entries
- `certifications` - Stores certifications
- `projects` - Stores project portfolio
- `languages` - Stores language proficiencies

All tables:
- Have `resume_id` foreign key to `resumes` table
- Include `created_at` and `updated_at` timestamps
- Are automatically cleaned up when resume is deleted (ON DELETE CASCADE)

## Next Steps

1. Test endpoints with Postman or API client
2. Update frontend to use new endpoints
3. Add more complex filtering if needed
4. Consider adding search functionality
