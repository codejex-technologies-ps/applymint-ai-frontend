// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { corsHeaders } from '../_shared/cors.ts'

interface ApplicationFilters {
  page?: number
  limit?: number
  status?: string
  userId?: string
  jobId?: string
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const applicationId = pathParts[pathParts.length - 1]

    switch (req.method) {
      case 'GET':
        if (applicationId && applicationId !== 'job-applications') {
          // GET /job-applications/:id - Get single application
          return await getApplicationById(supabaseClient, applicationId)
        } else {
          // GET /job-applications - Get applications with filters
          const filters = parseApplicationFilters(url.searchParams)
          return await getApplications(supabaseClient, filters)
        }

      case 'POST':
        // POST /job-applications - Create new application
        return await createApplication(supabaseClient, req)

      case 'PUT':
        if (!applicationId || applicationId === 'job-applications') {
          return new Response(JSON.stringify({ error: 'Application ID required for updates' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        // PUT /job-applications/:id - Update application
        return await updateApplication(supabaseClient, applicationId, req)

      case 'DELETE':
        if (!applicationId || applicationId === 'job-applications') {
          return new Response(JSON.stringify({ error: 'Application ID required for deletion' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        // DELETE /job-applications/:id - Delete application
        return await deleteApplication(supabaseClient, applicationId)

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function parseApplicationFilters(searchParams: URLSearchParams): ApplicationFilters {
  return {
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
    status: searchParams.get('status') || undefined,
    userId: searchParams.get('userId') || undefined,
    jobId: searchParams.get('jobId') || undefined,
  }
}

async function getApplications(supabaseClient: any, filters: ApplicationFilters) {
  try {
    let query = supabaseClient
      .from('job_applications')
      .select(`
        *,
        jobs (
          id,
          title,
          location,
          job_type,
          experience_level,
          companies (
            id,
            name,
            logo_url
          )
        ),
        profiles (
          id,
          first_name,
          last_name,
          email
        ),
        resumes (
          id,
          title,
          file_url
        )
      `, { count: 'exact' })
      .order('applied_at', { ascending: false })

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }

    if (filters.jobId) {
      query = query.eq('job_id', filters.jobId)
    }

    // Pagination
    const from = (filters.page! - 1) * filters.limit!
    const to = from + filters.limit! - 1
    query = query.range(from, to)

    const { data: applications, error, count } = await query

    if (error) throw error

    return new Response(JSON.stringify({
      applications,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        totalCount: count,
        totalPages: Math.ceil(count! / filters.limit!),
        hasNextPage: (filters.page! * filters.limit!) < count!,
        hasPrevPage: filters.page! > 1
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function getApplicationById(supabaseClient: any, applicationId: string) {
  try {
    const { data: application, error } = await supabaseClient
      .from('job_applications')
      .select(`
        *,
        jobs (
          id,
          title,
          description,
          location,
          job_type,
          experience_level,
          salary_min,
          salary_max,
          companies (
            id,
            name,
            logo_url,
            website
          )
        ),
        profiles (
          id,
          first_name,
          last_name,
          email,
          phone_number
        ),
        resumes (
          id,
          title,
          file_url,
          created_at
        )
      `)
      .eq('id', applicationId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Application not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ application }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function createApplication(supabaseClient: any, req: Request) {
  try {
    const applicationData = await req.json()

    // Validate required fields
    const requiredFields = ['job_id', 'user_id']
    for (const field of requiredFields) {
      if (!applicationData[field]) {
        return new Response(JSON.stringify({ error: `${field} is required` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    // Check if user already applied to this job
    const { data: existingApplication, error: checkError } = await supabaseClient
      .from('job_applications')
      .select('id')
      .eq('job_id', applicationData.job_id)
      .eq('user_id', applicationData.user_id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') throw checkError

    if (existingApplication) {
      return new Response(JSON.stringify({ error: 'You have already applied to this job' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify job exists and is active
    const { data: job, error: jobError } = await supabaseClient
      .from('jobs')
      .select('id, is_active')
      .eq('id', applicationData.job_id)
      .eq('is_active', true)
      .single()

    if (jobError || !job) {
      return new Response(JSON.stringify({ error: 'Job not found or inactive' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

    const { data: application, error } = await supabaseClient
      .from('job_applications')
      .insert([{
        ...applicationData,
        status: 'SUBMITTED',
        applied_at: new Date().toISOString()
      }])
      .select(`
        *,
        jobs (
          id,
          title,
          companies (
            id,
            name
          )
        )
      `)
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ application }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function updateApplication(supabaseClient: any, applicationId: string, req: Request) {
  try {
    const updates = await req.json()

    // Only allow updating certain fields
    const allowedFields = ['status', 'cover_letter', 'notes']
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as any)

    filteredUpdates.updated_at = new Date().toISOString()

    const { data: application, error } = await supabaseClient
      .from('job_applications')
      .update(filteredUpdates)
      .eq('id', applicationId)
      .select(`
        *,
        jobs (
          id,
          title,
          companies (
            id,
            name
          )
        )
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Application not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ application }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function deleteApplication(supabaseClient: any, applicationId: string) {
  try {
    const { data: application, error } = await supabaseClient
      .from('job_applications')
      .delete()
      .eq('id', applicationId)
      .select('id')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Application not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ message: 'Application deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/job-applications' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
