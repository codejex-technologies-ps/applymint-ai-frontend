// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { corsHeaders } from '../_shared/cors.ts'

interface JobAlertFilters {
  page?: number
  limit?: number
  userId?: string
  isActive?: boolean
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
    const alertId = pathParts[pathParts.length - 1]

    switch (req.method) {
      case 'GET':
        if (alertId && alertId !== 'job-alerts') {
          // GET /job-alerts/:id - Get single job alert
          return await getJobAlertById(supabaseClient, alertId)
        } else {
          // GET /job-alerts - Get job alerts with filters
          const filters = parseJobAlertFilters(url.searchParams)
          return await getJobAlerts(supabaseClient, filters)
        }

      case 'POST':
        // POST /job-alerts - Create new job alert
        return await createJobAlert(supabaseClient, req)

      case 'PUT':
        if (!alertId || alertId === 'job-alerts') {
          return new Response(JSON.stringify({ error: 'Job alert ID required for updates' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        // PUT /job-alerts/:id - Update job alert
        return await updateJobAlert(supabaseClient, alertId, req)

      case 'DELETE':
        if (!alertId || alertId === 'job-alerts') {
          return new Response(JSON.stringify({ error: 'Job alert ID required for deletion' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        // DELETE /job-alerts/:id - Delete job alert
        return await deleteJobAlert(supabaseClient, alertId)

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

function parseJobAlertFilters(searchParams: URLSearchParams): JobAlertFilters {
  return {
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
    userId: searchParams.get('userId') || undefined,
    isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
  }
}

async function getJobAlerts(supabaseClient: any, filters: JobAlertFilters) {
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
      .from('job_alerts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Users can only see their own job alerts
    query = query.eq('user_id', user.id)

    // Apply filters
    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive)
    }

    // Pagination
    const from = (filters.page! - 1) * filters.limit!
    const to = from + filters.limit! - 1
    query = query.range(from, to)

    const { data: jobAlerts, error, count } = await query

    if (error) throw error

    return new Response(JSON.stringify({
      jobAlerts,
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

async function getJobAlertById(supabaseClient: any, alertId: string) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: jobAlert, error } = await supabaseClient
      .from('job_alerts')
      .select('*')
      .eq('id', alertId)
      .eq('user_id', user.id) // Users can only access their own alerts
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Job alert not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ jobAlert }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function createJobAlert(supabaseClient: any, req: Request) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const alertData = await req.json()

    // Validate required fields
    if (!alertData.name || !alertData.criteria) {
      return new Response(JSON.stringify({ error: 'Alert name and criteria are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: jobAlert, error } = await supabaseClient
      .from('job_alerts')
      .insert([{
        ...alertData,
        user_id: user.id,
        is_active: alertData.is_active !== undefined ? alertData.is_active : true,
        last_sent_at: null
      }])
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ jobAlert }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function updateJobAlert(supabaseClient: any, alertId: string, req: Request) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const updates = await req.json()

    // Remove fields that shouldn't be updated directly
    delete updates.id
    delete updates.user_id
    delete updates.created_at

    const { data: jobAlert, error } = await supabaseClient
      .from('job_alerts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', alertId)
      .eq('user_id', user.id) // Users can only update their own alerts
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Job alert not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ jobAlert }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function deleteJobAlert(supabaseClient: any, alertId: string) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: jobAlert, error } = await supabaseClient
      .from('job_alerts')
      .delete()
      .eq('id', alertId)
      .eq('user_id', user.id) // Users can only delete their own alerts
      .select('id')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Job alert not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ message: 'Job alert deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/job-alerts' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
