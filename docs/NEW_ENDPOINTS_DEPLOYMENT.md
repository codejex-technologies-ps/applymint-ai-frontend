# Deployment Guide for New API Endpoints

This guide explains how to deploy and test the new API endpoints.

## New Endpoints Added

1. **Educations** (`/functions/v1/educations`)
2. **Certifications** (`/functions/v1/certifications`)
3. **Projects** (`/functions/v1/projects`)
4. **Languages** (`/functions/v1/languages`)

## Prerequisites

- Supabase CLI installed (`npm install -g supabase`)
- Project linked (`npx supabase link`)
- Database schema up to date

## Step 1: Deploy Functions

Deploy all new functions at once:

```bash
npx supabase functions deploy educations
npx supabase functions deploy certifications
npx supabase functions deploy projects
npx supabase functions deploy languages
```

Or deploy all functions:

```bash
npx supabase functions deploy
```

**Expected Output:**
```
Deploying function educations...
Deploying function certifications...
Deploying function projects...
Deploying function languages...
✓ All functions deployed successfully
```

## Step 2: Verify Deployment

List deployed functions:

```bash
npx supabase functions list
```

You should see:
- ✅ educations
- ✅ certifications  
- ✅ projects
- ✅ languages
- ✅ skills
- ✅ work-experiences
- (and other existing functions)

## Step 3: Test Endpoints

### Test Education Endpoint

**Create Education:**
```bash
curl -X POST "https://pidjubyaqzoitmbixzbf.supabase.co/functions/v1/educations" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_id": "your-resume-id",
    "institution": "Stanford University",
    "degree": "Bachelor of Science",
    "field_of_study": "Computer Science",
    "start_date": "2015-09-01",
    "end_date": "2019-06-01"
  }'
```

**List Educations:**
```bash
curl "https://pidjubyaqzoitmbixzbf.supabase.co/functions/v1/educations?page=1&limit=10" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Certification Endpoint

**Create Certification:**
```bash
curl -X POST "https://pidjubyaqzoitmbixzbf.supabase.co/functions/v1/certifications" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_id": "your-resume-id",
    "name": "AWS Solutions Architect",
    "issuer": "Amazon Web Services",
    "issue_date": "2023-01-15"
  }'
```

### Test Project Endpoint

**Create Project:**
```bash
curl -X POST "https://pidjubyaqzoitmbixzbf.supabase.co/functions/v1/projects" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_id": "your-resume-id",
    "title": "E-commerce Platform",
    "description": "Full-stack e-commerce solution",
    "technologies": ["React", "Node.js", "PostgreSQL"],
    "start_date": "2022-01-01"
  }'
```

### Test Language Endpoint

**Create Language:**
```bash
curl -X POST "https://pidjubyaqzoitmbixzbf.supabase.co/functions/v1/languages" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_id": "your-resume-id",
    "name": "Spanish",
    "proficiency": "FLUENT"
  }'
```

## Step 4: Test Enhanced Resume Creation

Create a complete resume with all nested data:

```bash
curl -X POST "https://pidjubyaqzoitmbixzbf.supabase.co/functions/v1/resumes" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Developer Resume",
    "summary": "Experienced developer with 5+ years in full-stack development",
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
        "description": "Led development of customer-facing applications",
        "start_date": "2020-01-01",
        "is_current_role": true,
        "location": "San Francisco, CA",
        "skills": ["React", "Node.js", "AWS"]
      }
    ],
    "educations": [
      {
        "institution": "Stanford University",
        "degree": "Bachelor of Science",
        "field_of_study": "Computer Science",
        "start_date": "2015-09-01",
        "end_date": "2019-06-01",
        "grade": "3.8"
      }
    ],
    "certifications": [
      {
        "name": "AWS Solutions Architect",
        "issuer": "Amazon Web Services",
        "issue_date": "2023-01-15"
      }
    ],
    "projects": [
      {
        "title": "E-commerce Platform",
        "description": "Built full-stack e-commerce solution",
        "technologies": ["React", "Node.js", "PostgreSQL"],
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
  }'
```

**Expected Response:**
```json
{
  "resume": {
    "id": "...",
    "title": "Senior Developer Resume",
    "summary": "...",
    "skills": [...],
    "work_experiences": [...],
    "educations": [...],
    "certifications": [...],
    "projects": [...],
    "languages": [...]
  }
}
```

## Step 5: Verify in Supabase Dashboard

1. Open Supabase Dashboard
2. Go to Table Editor
3. Check these tables have new data:
   - `educations`
   - `certifications`
   - `projects`
   - `languages`

## Step 6: View OpenAPI Documentation

### Option 1: Swagger UI (Local)

```bash
# Using Docker
cd /path/to/project
docker run -p 8080:8080 \
  -e SWAGGER_JSON=/openapi.yaml \
  -v $(pwd):/usr/share/nginx/html \
  swaggerapi/swagger-ui

# Visit http://localhost:8080
```

### Option 2: Swagger Editor (Online)

1. Go to https://editor.swagger.io/
2. Copy contents of `openapi.yaml`
3. Paste into editor
4. Explore all endpoints interactively

### Option 3: Redoc (Alternative)

```bash
# Using npx
npx redoc-cli serve openapi.yaml

# Visit http://localhost:8080
```

## Troubleshooting

### Issue: Function deployment fails

**Error:** `Error deploying function`

**Solution:**
```bash
# Check Docker is running
docker ps

# Or deploy without Docker
npx supabase functions deploy --no-verify-jwt
```

### Issue: "Resume not found" error

**Error:** `Resume not found or unauthorized`

**Solution:**
- Ensure resume belongs to authenticated user
- Verify resume_id is correct
- Check user is properly authenticated

### Issue: Database error

**Error:** `relation "educations" does not exist`

**Solution:**
```bash
# Run database migrations
npx supabase db push

# Or reset database (WARNING: deletes all data)
npx supabase db reset
```

### Issue: CORS errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
- Ensure `_shared/cors.ts` exists
- Check CORS headers are included in all responses
- Verify OPTIONS method is handled

## Testing with Postman

Import the OpenAPI spec into Postman:

1. Open Postman
2. Click Import → Upload Files
3. Select `openapi.yaml`
4. All endpoints will be imported as a collection

Configure environment variables:
- `baseUrl`: `https://pidjubyaqzoitmbixzbf.supabase.co/functions/v1`
- `anonKey`: Your Supabase anon key
- `bearerToken`: Your JWT token

## Integration with Frontend

### Example: React Hook for Educations

```typescript
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useEducations(resumeId: string) {
  const [educations, setEducations] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchEducations() {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(
        `/functions/v1/educations?resumeId=${resumeId}`,
        {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          }
        }
      )
      
      const { educations } = await response.json()
      setEducations(educations)
      setLoading(false)
    }

    fetchEducations()
  }, [resumeId])

  return { educations, loading }
}
```

### Example: Creating Education

```typescript
async function addEducation(resumeId: string, educationData: any) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  const response = await fetch('/functions/v1/educations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session?.access_token}`,
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      resume_id: resumeId,
      ...educationData
    })
  })
  
  return await response.json()
}
```

## Monitoring

Check function logs:

```bash
# Real-time logs for all functions
npx supabase functions logs --follow

# Logs for specific function
npx supabase functions logs educations --follow
npx supabase functions logs certifications --follow
```

## Performance Considerations

1. **Pagination:** Always use pagination for list endpoints
2. **Filtering:** Use resumeId filter to reduce response size
3. **Nested Creation:** Creating resume with all nested data is more efficient than individual calls
4. **Caching:** Consider caching frequently accessed data

## Security Checklist

- [x] All endpoints require authentication
- [x] Users can only access their own data
- [x] Resume ownership verified before operations
- [x] Input validation on all required fields
- [x] No sensitive data exposed in responses
- [x] CORS properly configured

## Next Steps

1. Deploy functions to production
2. Update frontend to use new endpoints
3. Add analytics/monitoring
4. Create automated tests
5. Document frontend integration patterns

## Resources

- [Supabase Functions Documentation](https://supabase.com/docs/guides/functions)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Postman Documentation](https://learning.postman.com/)
