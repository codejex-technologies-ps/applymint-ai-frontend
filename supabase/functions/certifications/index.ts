// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const id = pathParts[pathParts.length - 1]
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    switch (req.method) {
      case 'GET':
        if (id && id !== 'certifications') {
          return await getCertificationById(supabaseClient, id, user.id)
        }
        return await getCertifications(supabaseClient, url.searchParams, user.id)

      case 'POST':
        return await createCertification(supabaseClient, req, user.id)

      case 'PUT':
        if (!id || id === 'certifications') {
          return new Response(JSON.stringify({ error: 'Certification ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        return await updateCertification(supabaseClient, id, req, user.id)

      case 'DELETE':
        if (!id || id === 'certifications') {
          return new Response(JSON.stringify({ error: 'Certification ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        return await deleteCertification(supabaseClient, id, user.id)

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

async function getCertifications(supabaseClient: any, searchParams: URLSearchParams, userId: string) {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
  const resumeId = searchParams.get('resumeId')

  let query = supabaseClient
    .from('certifications')
    .select('*, resumes!inner(id, title, user_id)', { count: 'exact' })
    .eq('resumes.user_id', userId)
    .order('issue_date', { ascending: false })

  if (resumeId) query = query.eq('resume_id', resumeId)

  const from = (page - 1) * limit
  query = query.range(from, from + limit - 1)

  const { data, error, count } = await query

  if (error) throw error

  return new Response(JSON.stringify({
    certifications: data,
    pagination: {
      page,
      limit,
      totalCount: count,
      totalPages: Math.ceil(count! / limit),
      hasNextPage: (page * limit) < count!,
      hasPrevPage: page > 1
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getCertificationById(supabaseClient: any, id: string, userId: string) {
  const { data, error } = await supabaseClient
    .from('certifications')
    .select('*, resumes!inner(id, title, user_id)')
    .eq('id', id)
    .eq('resumes.user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return new Response(JSON.stringify({ error: 'Certification not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    throw error
  }

  return new Response(JSON.stringify({ certification: data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function createCertification(supabaseClient: any, req: Request, userId: string) {
  const certificationData = await req.json()

  const requiredFields = ['resume_id', 'name', 'issuer', 'issue_date']
  for (const field of requiredFields) {
    if (!certificationData[field]) {
      return new Response(JSON.stringify({ error: `${field} is required` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  }

  // Verify resume belongs to user
  const { data: resume } = await supabaseClient
    .from('resumes')
    .select('id')
    .eq('id', certificationData.resume_id)
    .eq('user_id', userId)
    .single()

  if (!resume) {
    return new Response(JSON.stringify({ error: 'Resume not found or unauthorized' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { data, error } = await supabaseClient
    .from('certifications')
    .insert([certificationData])
    .select('*, resumes(id, title)')
    .single()

  if (error) throw error

  return new Response(JSON.stringify({ certification: data }), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function updateCertification(supabaseClient: any, id: string, req: Request, userId: string) {
  const updates = await req.json()
  delete updates.id
  delete updates.resume_id
  delete updates.created_at

  // Verify ownership
  const { data: existing } = await supabaseClient
    .from('certifications')
    .select('id, resumes!inner(user_id)')
    .eq('id', id)
    .eq('resumes.user_id', userId)
    .single()

  if (!existing) {
    return new Response(JSON.stringify({ error: 'Certification not found or unauthorized' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { data, error } = await supabaseClient
    .from('certifications')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, resumes(id, title)')
    .single()

  if (error) throw error

  return new Response(JSON.stringify({ certification: data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function deleteCertification(supabaseClient: any, id: string, userId: string) {
  // Verify ownership
  const { data: existing } = await supabaseClient
    .from('certifications')
    .select('id, resumes!inner(user_id)')
    .eq('id', id)
    .eq('resumes.user_id', userId)
    .single()

  if (!existing) {
    return new Response(JSON.stringify({ error: 'Certification not found or unauthorized' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { error } = await supabaseClient
    .from('certifications')
    .delete()
    .eq('id', id)

  if (error) throw error

  return new Response(JSON.stringify({ message: 'Certification deleted successfully' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
