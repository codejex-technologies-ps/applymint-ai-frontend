// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { corsHeaders } from '../_shared/cors.ts'

interface JobFilters {
  page?: number
  limit?: number
  location?: string
  jobType?: string
  experienceLevel?: string
  isRemote?: boolean
  companyId?: string
  skills?: string[]
  salaryMin?: number
  salaryMax?: number
  query?: string
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
    const jobId = pathParts[pathParts.length - 1]

    switch (req.method) {
      case 'GET':
        if (jobId && jobId !== 'jobs') {
          // GET /jobs/:id - Get single job
          return await getJobById(supabaseClient, jobId)
        } else {
          // GET /jobs - Get all jobs with filters
          const filters = parseJobFilters(url.searchParams)
          return await getJobs(supabaseClient, filters)
        }

      case 'POST':
        // POST /jobs - Create new job
        return await createJob(supabaseClient, req)

      case 'PUT':
        if (!jobId || jobId === 'jobs') {
          return new Response(JSON.stringify({ error: 'Job ID required for updates' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        // PUT /jobs/:id - Update job
        return await updateJob(supabaseClient, jobId, req)

      case 'DELETE':
        if (!jobId || jobId === 'jobs') {
          return new Response(JSON.stringify({ error: 'Job ID required for deletion' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        // DELETE /jobs/:id - Delete job
        return await deleteJob(supabaseClient, jobId)

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

function parseJobFilters(searchParams: URLSearchParams): JobFilters {
  return {
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
    location: searchParams.get('location') || undefined,
    jobType: searchParams.get('jobType') || undefined,
    experienceLevel: searchParams.get('experienceLevel') || undefined,
    isRemote: searchParams.get('isRemote') ? searchParams.get('isRemote') === 'true' : undefined,
    companyId: searchParams.get('companyId') || undefined,
    skills: searchParams.get('skills') ? searchParams.get('skills')!.split(',') : undefined,
    salaryMin: searchParams.get('salaryMin') ? parseInt(searchParams.get('salaryMin')!) : undefined,
    salaryMax: searchParams.get('salaryMax') ? parseInt(searchParams.get('salaryMax')!) : undefined,
    query: searchParams.get('query') || undefined,
  }
}

async function getJobs(supabaseClient: any, filters: JobFilters) {
  try {
    let query = supabaseClient
      .from('jobs')
      .select(`
        *,
        companies (
          id,
          name,
          logo_url,
          industry
        )
      `)
      .eq('is_active', true)
      .order('posted_at', { ascending: false })

    // Apply filters
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters.jobType) {
      query = query.eq('job_type', filters.jobType)
    }

    if (filters.experienceLevel) {
      query = query.eq('experience_level', filters.experienceLevel)
    }

    if (filters.isRemote !== undefined) {
      query = query.eq('is_remote', filters.isRemote)
    }

    if (filters.companyId) {
      query = query.eq('company_id', filters.companyId)
    }

    if (filters.salaryMin) {
      query = query.gte('salary_min', filters.salaryMin)
    }

    if (filters.salaryMax) {
      query = query.lte('salary_max', filters.salaryMax)
    }

    if (filters.query) {
      query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
    }

    if (filters.skills && filters.skills.length > 0) {
      // Filter jobs that contain any of the specified skills
      query = query.overlaps('skills', filters.skills)
    }

    // Pagination
    const from = (filters.page! - 1) * filters.limit!
    const to = from + filters.limit! - 1
    query = query.range(from, to)

    const { data: jobs, error, count } = await query

    if (error) throw error

    // Get total count for pagination
    const { count: totalCount } = await supabaseClient
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    return new Response(JSON.stringify({
      jobs,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        totalCount,
        totalPages: Math.ceil(totalCount! / filters.limit!),
        hasNextPage: (filters.page! * filters.limit!) < totalCount!,
        hasPrevPage: filters.page! > 1
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function getJobById(supabaseClient: any, jobId: string) {
  try {
    const { data: job, error } = await supabaseClient
      .from('jobs')
      .select(`
        *,
        companies (
          id,
          name,
          description,
          logo_url,
          industry,
          website
        )
      `)
      .eq('id', jobId)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Job not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ job }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function createJob(supabaseClient: any, req: Request) {
  try {
    const jobData = await req.json()

    // Validate required fields
    const requiredFields = ['title', 'company_id', 'location', 'description']
    for (const field of requiredFields) {
      if (!jobData[field]) {
        return new Response(JSON.stringify({ error: `${field} is required` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    // Verify company exists
    const { data: company, error: companyError } = await supabaseClient
      .from('companies')
      .select('id')
      .eq('id', jobData.company_id)
      .single()

    if (companyError || !company) {
      return new Response(JSON.stringify({ error: 'Invalid company ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: job, error } = await supabaseClient
      .from('jobs')
      .insert([{
        ...jobData,
        posted_at: new Date().toISOString(),
        is_active: true
      }])
      .select(`
        *,
        companies (
          id,
          name,
          logo_url,
          industry
        )
      `)
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ job }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function updateJob(supabaseClient: any, jobId: string, req: Request) {
  try {
    const updates = await req.json()

    // Remove fields that shouldn't be updated directly
    delete updates.id
    delete updates.created_at
    delete updates.posted_at

    const { data: job, error } = await supabaseClient
      .from('jobs')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .select(`
        *,
        companies (
          id,
          name,
          logo_url,
          industry
        )
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Job not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ job }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function deleteJob(supabaseClient: any, jobId: string) {
  try {
    // Soft delete by setting is_active to false
    const { data: job, error } = await supabaseClient
      .from('jobs')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', jobId)
      .select('id')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Job not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ message: 'Job deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/jobs' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
