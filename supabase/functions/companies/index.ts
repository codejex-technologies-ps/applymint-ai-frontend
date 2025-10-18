// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { corsHeaders } from '../_shared/cors.ts'

interface CompanyFilters {
  page?: number
  limit?: number
  industry?: string
  size?: string
  location?: string
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
    const companyId = pathParts[pathParts.length - 1]

    switch (req.method) {
      case 'GET':
        if (companyId && companyId !== 'companies') {
          // GET /companies/:id - Get single company
          return await getCompanyById(supabaseClient, companyId)
        } else {
          // GET /companies - Get all companies with filters
          const filters = parseCompanyFilters(url.searchParams)
          return await getCompanies(supabaseClient, filters)
        }

      case 'POST':
        // POST /companies - Create new company
        return await createCompany(supabaseClient, req)

      case 'PUT':
        if (!companyId || companyId === 'companies') {
          return new Response(JSON.stringify({ error: 'Company ID required for updates' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        // PUT /companies/:id - Update company
        return await updateCompany(supabaseClient, companyId, req)

      case 'DELETE':
        if (!companyId || companyId === 'companies') {
          return new Response(JSON.stringify({ error: 'Company ID required for deletion' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        // DELETE /companies/:id - Delete company
        return await deleteCompany(supabaseClient, companyId)

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

function parseCompanyFilters(searchParams: URLSearchParams): CompanyFilters {
  return {
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
    industry: searchParams.get('industry') || undefined,
    size: searchParams.get('size') || undefined,
    location: searchParams.get('location') || undefined,
    query: searchParams.get('query') || undefined,
  }
}

async function getCompanies(supabaseClient: any, filters: CompanyFilters) {
  try {
    let query = supabaseClient
      .from('companies')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true })

    // Apply filters
    if (filters.industry) {
      query = query.ilike('industry', `%${filters.industry}%`)
    }

    if (filters.size) {
      query = query.eq('size', filters.size)
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters.query) {
      query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%,industry.ilike.%${filters.query}%`)
    }

    // Pagination
    const from = (filters.page! - 1) * filters.limit!
    const to = from + filters.limit! - 1
    query = query.range(from, to)

    const { data: companies, error, count } = await query

    if (error) throw error

    return new Response(JSON.stringify({
      companies,
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

async function getCompanyById(supabaseClient: any, companyId: string) {
  try {
    const { data: company, error } = await supabaseClient
      .from('companies')
      .select(`
        *,
        jobs (
          id,
          title,
          location,
          job_type,
          experience_level,
          is_remote,
          posted_at,
          is_active
        )
      `)
      .eq('id', companyId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Company not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ company }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function createCompany(supabaseClient: any, req: Request) {
  try {
    const companyData = await req.json()

    // Validate required fields
    if (!companyData.name) {
      return new Response(JSON.stringify({ error: 'Company name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: company, error } = await supabaseClient
      .from('companies')
      .insert([companyData])
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ company }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function updateCompany(supabaseClient: any, companyId: string, req: Request) {
  try {
    const updates = await req.json()

    // Remove fields that shouldn't be updated directly
    delete updates.id
    delete updates.created_at

    const { data: company, error } = await supabaseClient
      .from('companies')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', companyId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Company not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ company }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function deleteCompany(supabaseClient: any, companyId: string) {
  try {
    // Check if company has active jobs
    const { data: jobs, error: jobsError } = await supabaseClient
      .from('jobs')
      .select('id')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .limit(1)

    if (jobsError) throw jobsError

    if (jobs && jobs.length > 0) {
      return new Response(JSON.stringify({
        error: 'Cannot delete company with active jobs. Please deactivate all jobs first.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: company, error } = await supabaseClient
      .from('companies')
      .delete()
      .eq('id', companyId)
      .select('id')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Company not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ message: 'Company deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/companies' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
