// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { corsHeaders } from '../_shared/cors.ts'

interface SkillFilters {
  page?: number
  limit?: number
  userId?: string
  resumeId?: string
  category?: string
  level?: string
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
    const skillId = pathParts[pathParts.length - 1]

    switch (req.method) {
      case 'GET':
        if (skillId && skillId !== 'skills') {
          // GET /skills/:id - Get single skill
          return await getSkillById(supabaseClient, skillId)
        } else {
          // GET /skills - Get skills with filters
          const filters = parseSkillFilters(url.searchParams)
          return await getSkills(supabaseClient, filters)
        }

      case 'POST':
        // POST /skills - Create new skill
        return await createSkill(supabaseClient, req)

      case 'PUT':
        if (!skillId || skillId === 'skills') {
          return new Response(JSON.stringify({ error: 'Skill ID required for updates' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        // PUT /skills/:id - Update skill
        return await updateSkill(supabaseClient, skillId, req)

      case 'DELETE':
        if (!skillId || skillId === 'skills') {
          return new Response(JSON.stringify({ error: 'Skill ID required for deletion' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        // DELETE /skills/:id - Delete skill
        return await deleteSkill(supabaseClient, skillId)

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

function parseSkillFilters(searchParams: URLSearchParams): SkillFilters {
  return {
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    userId: searchParams.get('userId') || undefined,
    resumeId: searchParams.get('resumeId') || undefined,
    category: searchParams.get('category') || undefined,
    level: searchParams.get('level') || undefined,
  }
}

async function getSkills(supabaseClient: any, filters: SkillFilters) {
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
      .from('skills')
      .select(`
        *,
        resumes (
          id,
          title,
          user_id
        )
      `, { count: 'exact' })
      .order('name', { ascending: true })

    // Filter by resume's user_id to show only user's skills
    if (filters.resumeId) {
      query = query.eq('resume_id', filters.resumeId)
    } else {
      // Get all skills for user's resumes
      query = query.eq('resumes.user_id', user.id)
    }

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    if (filters.level) {
      query = query.eq('level', filters.level)
    }

    // Pagination
    const from = (filters.page! - 1) * filters.limit!
    const to = from + filters.limit! - 1
    query = query.range(from, to)

    const { data: skills, error, count } = await query

    if (error) throw error

    return new Response(JSON.stringify({
      skills,
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

async function getSkillById(supabaseClient: any, skillId: string) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: skill, error } = await supabaseClient
      .from('skills')
      .select(`
        *,
        resumes (
          id,
          title,
          user_id
        )
      `)
      .eq('id', skillId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Skill not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    // Check if skill belongs to user's resume
    if (skill.resumes.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ skill }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function createSkill(supabaseClient: any, req: Request) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const skillData = await req.json()

    // Validate required fields
    if (!skillData.resume_id || !skillData.name) {
      return new Response(JSON.stringify({ error: 'resume_id and name are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify resume belongs to user
    const { data: resume, error: resumeError } = await supabaseClient
      .from('resumes')
      .select('id, user_id')
      .eq('id', skillData.resume_id)
      .eq('user_id', user.id)
      .single()

    if (resumeError || !resume) {
      return new Response(JSON.stringify({ error: 'Resume not found or unauthorized' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: skill, error } = await supabaseClient
      .from('skills')
      .insert([skillData])
      .select(`
        *,
        resumes (
          id,
          title
        )
      `)
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ skill }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function updateSkill(supabaseClient: any, skillId: string, req: Request) {
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

    // Verify skill belongs to user's resume
    const { data: existingSkill, error: checkError } = await supabaseClient
      .from('skills')
      .select('id, resumes(user_id)')
      .eq('id', skillId)
      .single()

    if (checkError || !existingSkill || existingSkill.resumes.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Skill not found or unauthorized' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: skill, error } = await supabaseClient
      .from('skills')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', skillId)
      .select(`
        *,
        resumes (
          id,
          title
        )
      `)
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ skill }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function deleteSkill(supabaseClient: any, skillId: string) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify skill belongs to user's resume
    const { data: existingSkill, error: checkError } = await supabaseClient
      .from('skills')
      .select('id, resumes(user_id)')
      .eq('id', skillId)
      .single()

    if (checkError || !existingSkill || existingSkill.resumes.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Skill not found or unauthorized' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: skill, error } = await supabaseClient
      .from('skills')
      .delete()
      .eq('id', skillId)
      .select('id')
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ message: 'Skill deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}
