// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { corsHeaders } from '../_shared/cors.ts'

interface ResumeFilters {
  page?: number
  limit?: number
  userId?: string
  isPrimary?: boolean
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
    const resumeId = pathParts[pathParts.length - 1]

    switch (req.method) {
      case 'GET':
        if (resumeId && resumeId !== 'resumes') {
          // GET /resumes/:id - Get single resume with all related data
          return await getResumeById(supabaseClient, resumeId)
        } else {
          // GET /resumes - Get resumes with filters
          const filters = parseResumeFilters(url.searchParams)
          return await getResumes(supabaseClient, filters)
        }

      case 'POST':
        // POST /resumes - Create new resume
        return await createResume(supabaseClient, req)

      case 'PUT':
        if (!resumeId || resumeId === 'resumes') {
          return new Response(JSON.stringify({ error: 'Resume ID required for updates' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        // PUT /resumes/:id - Update resume
        return await updateResume(supabaseClient, resumeId, req)

      case 'DELETE':
        if (!resumeId || resumeId === 'resumes') {
          return new Response(JSON.stringify({ error: 'Resume ID required for deletion' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        // DELETE /resumes/:id - Delete resume
        return await deleteResume(supabaseClient, resumeId)

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

function parseResumeFilters(searchParams: URLSearchParams): ResumeFilters {
  return {
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
    userId: searchParams.get('userId') || undefined,
    isPrimary: searchParams.get('isPrimary') ? searchParams.get('isPrimary') === 'true' : undefined,
  }
}

async function getResumes(supabaseClient: any, filters: ResumeFilters) {
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
      .from('resumes')
      .select(`
        *,
        profiles (
          id,
          first_name,
          last_name,
          email
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    // Users can only see their own resumes
    query = query.eq('user_id', user.id)

    // Apply filters
    if (filters.isPrimary !== undefined) {
      query = query.eq('is_primary', filters.isPrimary)
    }

    // Pagination
    const from = (filters.page! - 1) * filters.limit!
    const to = from + filters.limit! - 1
    query = query.range(from, to)

    const { data: resumes, error, count } = await query

    if (error) throw error

    return new Response(JSON.stringify({
      resumes,
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

async function getResumeById(supabaseClient: any, resumeId: string) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: resume, error } = await supabaseClient
      .from('resumes')
      .select(`
        *,
        profiles (
          id,
          first_name,
          last_name,
          email,
          bio,
          location,
          phone_number
        ),
        work_experiences (
          id,
          job_title,
          company_name,
          location,
          start_date,
          end_date,
          is_current,
          description,
          achievements
        ),
        educations (
          id,
          institution,
          degree,
          field_of_study,
          start_date,
          end_date,
          grade,
          description
        ),
        skills (
          id,
          name,
          proficiency_level,
          years_of_experience
        ),
        certifications (
          id,
          name,
          issuer,
          issue_date,
          expiry_date,
          credential_id,
          credential_url
        ),
        projects (
          id,
          name,
          description,
          start_date,
          end_date,
          project_url,
          repository_url,
          technologies
        ),
        languages (
          id,
          name,
          proficiency_level
        )
      `)
      .eq('id', resumeId)
      .eq('user_id', user.id) // Users can only access their own resumes
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Resume not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ resume }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function createResume(supabaseClient: any, req: Request) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const resumeData = await req.json()

    // Validate required fields
    if (!resumeData.title) {
      return new Response(JSON.stringify({ error: 'Resume title is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Extract nested data
    const skills = resumeData.skills || []
    const workExperiences = resumeData.work_experiences || []
    const educations = resumeData.educations || []
    const certifications = resumeData.certifications || []
    const projects = resumeData.projects || []
    const languages = resumeData.languages || []

    // Remove nested data from main resume object
    delete resumeData.skills
    delete resumeData.work_experiences
    delete resumeData.educations
    delete resumeData.certifications
    delete resumeData.projects
    delete resumeData.languages

    // If this is set as primary, unset other primary resumes
    if (resumeData.is_primary) {
      await supabaseClient
        .from('resumes')
        .update({ is_primary: false })
        .eq('user_id', user.id)
    }

    // Create the resume first
    const { data: resume, error } = await supabaseClient
      .from('resumes')
      .insert([{
        ...resumeData,
        user_id: user.id,
        is_primary: resumeData.is_primary || false
      }])
      .select(`
        *,
        profiles (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .single()

    if (error) throw error

    // Create nested data if provided
    const resumeId = resume.id

    // Insert skills
    if (skills.length > 0) {
      const skillsToInsert = skills.map((skill: any) => ({
        ...skill,
        resume_id: resumeId
      }))
      await supabaseClient.from('skills').insert(skillsToInsert)
    }

    // Insert work experiences
    if (workExperiences.length > 0) {
      const workExpToInsert = workExperiences.map((exp: any) => ({
        ...exp,
        resume_id: resumeId
      }))
      await supabaseClient.from('work_experiences').insert(workExpToInsert)
    }

    // Insert educations
    if (educations.length > 0) {
      const educationsToInsert = educations.map((edu: any) => ({
        ...edu,
        resume_id: resumeId
      }))
      await supabaseClient.from('educations').insert(educationsToInsert)
    }

    // Insert certifications
    if (certifications.length > 0) {
      const certificationsToInsert = certifications.map((cert: any) => ({
        ...cert,
        resume_id: resumeId
      }))
      await supabaseClient.from('certifications').insert(certificationsToInsert)
    }

    // Insert projects
    if (projects.length > 0) {
      const projectsToInsert = projects.map((proj: any) => ({
        ...proj,
        resume_id: resumeId
      }))
      await supabaseClient.from('projects').insert(projectsToInsert)
    }

    // Insert languages
    if (languages.length > 0) {
      const languagesToInsert = languages.map((lang: any) => ({
        ...lang,
        resume_id: resumeId
      }))
      await supabaseClient.from('languages').insert(languagesToInsert)
    }

    // Fetch the complete resume with all nested data
    const { data: completeResume } = await supabaseClient
      .from('resumes')
      .select(`
        *,
        profiles (
          id,
          first_name,
          last_name,
          email
        ),
        work_experiences (*),
        educations (*),
        skills (*),
        certifications (*),
        projects (*),
        languages (*)
      `)
      .eq('id', resumeId)
      .single()

    return new Response(JSON.stringify({ resume: completeResume }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function updateResume(supabaseClient: any, resumeId: string, req: Request) {
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

    // If this is set as primary, unset other primary resumes
    if (updates.is_primary) {
      await supabaseClient
        .from('resumes')
        .update({ is_primary: false })
        .eq('user_id', user.id)
        .neq('id', resumeId)
    }

    const { data: resume, error } = await supabaseClient
      .from('resumes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', resumeId)
      .eq('user_id', user.id) // Users can only update their own resumes
      .select(`
        *,
        profiles (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Resume not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ resume }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function deleteResume(supabaseClient: any, resumeId: string) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if resume is being used in any job applications
    const { data: applications, error: appError } = await supabaseClient
      .from('job_applications')
      .select('id')
      .eq('resume_id', resumeId)
      .eq('user_id', user.id)
      .limit(1)

    if (appError) throw appError

    if (applications && applications.length > 0) {
      return new Response(JSON.stringify({
        error: 'Cannot delete resume that is being used in job applications. Please remove it from applications first.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: resume, error } = await supabaseClient
      .from('resumes')
      .delete()
      .eq('id', resumeId)
      .eq('user_id', user.id) // Users can only delete their own resumes
      .select('id')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Resume not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ message: 'Resume deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/resumes' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
