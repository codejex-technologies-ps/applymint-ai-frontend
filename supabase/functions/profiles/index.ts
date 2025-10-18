// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { corsHeaders } from '../_shared/cors.ts'

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
    const profileId = pathParts[pathParts.length - 1]

    switch (req.method) {
      case 'GET':
        if (profileId && profileId !== 'profiles') {
          // GET /profiles/:id - Get specific profile
          return await getProfileById(supabaseClient, profileId)
        } else {
          // GET /profiles - Get current user's profile (requires auth)
          return await getCurrentProfile(supabaseClient)
        }

      case 'PUT':
        if (profileId && profileId !== 'profiles') {
          // PUT /profiles/:id - Update specific profile
          return await updateProfile(supabaseClient, profileId, req)
        } else {
          // PUT /profiles - Update current user's profile
          return await updateCurrentProfile(supabaseClient, req)
        }

      case 'POST':
        // POST /profiles - Create new profile (usually handled by auth triggers)
        return await createProfile(supabaseClient, req)

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

async function getCurrentProfile(supabaseClient: any) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .select(`
        *,
        work_experiences (
          id,
          job_title,
          company_name,
          start_date,
          end_date,
          is_current,
          description
        ),
        educations (
          id,
          institution,
          degree,
          field_of_study,
          start_date,
          end_date,
          grade
        ),
        skills (
          id,
          name,
          proficiency_level
        ),
        certifications (
          id,
          name,
          issuer,
          issue_date,
          expiry_date,
          credential_id
        ),
        projects (
          id,
          name,
          description,
          start_date,
          end_date,
          project_url,
          repository_url
        ),
        languages (
          id,
          name,
          proficiency_level
        )
      `)
      .eq('id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Profile not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ profile }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function getProfileById(supabaseClient: any, profileId: string) {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name,
        bio,
        location,
        website,
        linkedin_url,
        github_url,
        twitter_url,
        portfolio_url,
        current_position,
        company,
        years_of_experience,
        availability_status,
        preferred_work_type,
        profile_visibility,
        created_at,
        updated_at,
        work_experiences (
          id,
          job_title,
          company_name,
          start_date,
          end_date,
          is_current,
          description
        ),
        educations (
          id,
          institution,
          degree,
          field_of_study,
          start_date,
          end_date
        ),
        skills (
          id,
          name,
          proficiency_level
        ),
        projects (
          id,
          name,
          description,
          project_url,
          repository_url
        )
      `)
      .eq('id', profileId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Profile not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    // Check profile visibility
    if (profile.profile_visibility === 'private' && profile.id !== user.id) {
      return new Response(JSON.stringify({ error: 'Profile is private' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ profile }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function updateCurrentProfile(supabaseClient: any, req: Request) {
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
    delete updates.email // Email should be updated through auth
    delete updates.created_at

    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ profile }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function updateProfile(supabaseClient: any, profileId: string, req: Request) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Only allow users to update their own profile
    if (user.id !== profileId) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const updates = await req.json()

    // Remove fields that shouldn't be updated directly
    delete updates.id
    delete updates.email
    delete updates.created_at

    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', profileId)
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ profile }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

async function createProfile(supabaseClient: any, req: Request) {
  try {
    const profileData = await req.json()

    // Validate required fields
    if (!profileData.id || !profileData.email) {
      return new Response(JSON.stringify({ error: 'Profile ID and email are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .insert([profileData])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return new Response(JSON.stringify({ error: 'Profile already exists' }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ profile }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    throw error
  }
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/profiles' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
