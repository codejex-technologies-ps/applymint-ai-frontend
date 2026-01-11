// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { corsHeaders } from '../_shared/cors.ts'

interface WorkExperienceFilters {
  page?: number
  limit?: number
  userId?: string
  resumeId?: string
  isCurrent?: boolean
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
    const experienceId = pathParts[pathParts.length - 1]

    switch (req.method) {
      case 'GET':
        if (experienceId && experienceId !== 'work-experiences') {
          // GET /work-experiences/:id - Get single work experience
          return await getWorkExperienceById(supabaseClient, experienceId)
        } else {
          // GET /work-experiences - Get work experiences with filters
          const filters = parseWorkExperienceFilters(url.searchParams)
          return await getWorkExperiences(supabaseClient, filters)
        }

      case 'POST':
        // POST /work-experiences - Create new work experience
        return await createWorkExperience(supabaseClient, req)

      case 'PUT':
        if (!experienceId || experienceId === 'work-experiences') {
          return new Response(JSON.stringify({ error: 'Work experience ID required for updates' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        // PUT /work-experiences/:id - Update work experience
        return await updateWorkExperience(supabaseClient, experienceId, req)

      case 'DELETE':
        if (!experienceId || experienceId === 'work-experiences') {
          return new Response(JSON.stringify({ error: 'Work experience ID required for deletion' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        // DELETE /work-experiences/:id - Delete work experience
        return await deleteWorkExperience(supabaseClient, experienceId)

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

function parseWorkExperienceFilters(searchParams: URLSearchParams): WorkExperienceFilters {
  return {
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    userId: searchParams.get('userId') || undefined,
    resumeId: searchParams.get('resumeId') || undefined,
    isCurrent: searchParams.get('isCurrent') ? searchParams.get('isCurrent') === 'true' : undefined,
  }
}

async function getWorkExperiences(supabaseClient: any, filters: WorkExperienceFilters) {
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
      .from('work_experiences')
      .select(`
        *,
        resumes (
          id,
          title,
          user_id
        )
      `, { count: 'exact' })
      .order('start_date', { ascending: false })

    // Filter by resume's user_id to show only user's work experiences
    if (filters.resumeId) {
      query = query.eq('resume_id', filters.resumeId)
    } else {
      // Get all work experiences for user's resumes
      query = query.eq('resumes.user_id', user.id)
    }

    // Apply filters
    if (filters.isCurrent !== undefined) {
      query = query.eq('is_current_role', filters.isCurrent)
    }

    // Pagination
    const from = (filters.page! - 1) * filters.limit!
    const to = from + filters.limit! - 1
    query = query.range(from, to)

    const { data: workExperiences, error, count } = await query

    if (error) throw error

    return new Response(JSON.stringify({
      workExperiences,
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

async function getWorkExperienceById(supabaseClient: any, experienceId: string) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: workExperience, error } = await supabaseClient
      .from('work_experiences')
      .select(`
        *,
        resumes (
          id,
          title,
          user_id
        )
      `)
      .eq('id', experienceId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Work experience not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    // Check if work experience belongs to user's resume
    if (workExperience.resumes.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ workExperience }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function createWorkExperience(supabaseClient: any, req: Request) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const experienceData = await req.json()

    // Validate required fields
    const requiredFields = ['resume_id', 'company', 'position', 'description', 'start_date']
    for (const field of requiredFields) {
      if (!experienceData[field]) {
        return new Response(JSON.stringify({ error: `${field} is required` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    // Verify resume belongs to user
    const { data: resume, error: resumeError } = await supabaseClient
      .from('resumes')
      .select('id, user_id')
      .eq('id', experienceData.resume_id)
      .eq('user_id', user.id)
      .single()

    if (resumeError || !resume) {
      return new Response(JSON.stringify({ error: 'Resume not found or unauthorized' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: workExperience, error } = await supabaseClient
      .from('work_experiences')
      .insert([experienceData])
      .select(`
        *,
        resumes (
          id,
          title
        )
      `)
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ workExperience }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function updateWorkExperience(supabaseClient: any, experienceId: string, req: Request) {
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
    delete updates.resume_id
    delete updates.created_at

    // Verify work experience belongs to user's resume
    const { data: existingExperience, error: checkError } = await supabaseClient
      .from('work_experiences')
      .select('id, resumes(user_id)')
      .eq('id', experienceId)
      .single()

    if (checkError || !existingExperience || existingExperience.resumes.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Work experience not found or unauthorized' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: workExperience, error } = await supabaseClient
      .from('work_experiences')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', experienceId)
      .select(`
        *,
        resumes (
          id,
          title
        )
      `)
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ workExperience }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function deleteWorkExperience(supabaseClient: any, experienceId: string) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify work experience belongs to user's resume
    const { data: existingExperience, error: checkError } = await supabaseClient
      .from('work_experiences')
      .select('id, resumes(user_id)')
      .eq('id', experienceId)
      .single()

    if (checkError || !existingExperience || existingExperience.resumes.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Work experience not found or unauthorized' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: workExperience, error } = await supabaseClient
      .from('work_experiences')
      .delete()
      .eq('id', experienceId)
      .select('id')
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ message: 'Work experience deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}
