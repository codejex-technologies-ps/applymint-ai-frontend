// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { corsHeaders } from '../_shared/cors.ts'

interface SavedJobFilters {
  page?: number
  limit?: number
  userId?: string
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
    const savedJobId = pathParts[pathParts.length - 1]

    switch (req.method) {
      case 'GET':
        if (savedJobId && savedJobId !== 'saved-jobs') {
          // GET /saved-jobs/:id - Get single saved job
          return await getSavedJobById(supabaseClient, savedJobId)
        } else {
          // GET /saved-jobs - Get saved jobs with filters
          const filters = parseSavedJobFilters(url.searchParams)
          return await getSavedJobs(supabaseClient, filters)
        }

      case 'POST':
        // POST /saved-jobs - Save a job
        return await saveJob(supabaseClient, req)

      case 'DELETE':
        if (!savedJobId || savedJobId === 'saved-jobs') {
          return new Response(JSON.stringify({ error: 'Saved job ID required for deletion' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        // DELETE /saved-jobs/:id - Unsave a job
        return await unsaveJob(supabaseClient, savedJobId)

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

function parseSavedJobFilters(searchParams: URLSearchParams): SavedJobFilters {
  return {
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
    userId: searchParams.get('userId') || undefined,
  }
}

async function getSavedJobs(supabaseClient: any, filters: SavedJobFilters) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    let query = supabaseClient
      .from('saved_jobs')
      .select(`
        *,
        jobs (
          id,
          title,
          location,
          job_type,
          experience_level,
          salary_min,
          salary_max,
          is_remote,
          is_active,
          posted_at,
          companies (
            id,
            name,
            logo_url,
            industry
          )
        )
      `, { count: 'exact' })
      .order('saved_at', { ascending: false })

    // Users can only see their own saved jobs
    query = query.eq('user_id', user.id)

    // Pagination
    const from = (filters.page! - 1) * filters.limit!
    const to = from + filters.limit! - 1
    query = query.range(from, to)

    const { data: savedJobs, error, count } = await query

    if (error) throw error

    return new Response(JSON.stringify({
      savedJobs,
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

async function getSavedJobById(supabaseClient: any, savedJobId: string) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: savedJob, error } = await supabaseClient
      .from('saved_jobs')
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
          is_remote,
          is_active,
          posted_at,
          requirements,
          benefits,
          companies (
            id,
            name,
            logo_url,
            industry,
            website
          )
        )
      `)
      .eq('id', savedJobId)
      .eq('user_id', user.id) // Users can only access their own saved jobs
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Saved job not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ savedJob }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function saveJob(supabaseClient: any, req: Request) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const saveData = await req.json()

    // Validate required fields
    if (!saveData.job_id) {
      return new Response(JSON.stringify({ error: 'Job ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if job exists and is active
    const { data: job, error: jobError } = await supabaseClient
      .from('jobs')
      .select('id, is_active')
      .eq('id', saveData.job_id)
      .eq('is_active', true)
      .single()

    if (jobError || !job) {
      return new Response(JSON.stringify({ error: 'Job not found or inactive' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if job is already saved
    const { data: existingSave, error: checkError } = await supabaseClient
      .from('saved_jobs')
      .select('id')
      .eq('job_id', saveData.job_id)
      .eq('user_id', user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') throw checkError

    if (existingSave) {
      return new Response(JSON.stringify({ error: 'Job already saved' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: savedJob, error } = await supabaseClient
      .from('saved_jobs')
      .insert([{
        job_id: saveData.job_id,
        user_id: user.id,
        notes: saveData.notes || null,
        saved_at: new Date().toISOString()
      }])
      .select(`
        *,
        jobs (
          id,
          title,
          location,
          companies (
            id,
            name,
            logo_url
          )
        )
      `)
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ savedJob }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function unsaveJob(supabaseClient: any, savedJobId: string) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: savedJob, error } = await supabaseClient
      .from('saved_jobs')
      .delete()
      .eq('id', savedJobId)
      .eq('user_id', user.id) // Users can only unsave their own saved jobs
      .select('id')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Saved job not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ message: 'Job unsaved successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/saved-jobs' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
