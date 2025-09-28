'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { profileSchema } from '@/lib/schemas/profile-schema'

// Get current user's profile
export async function getProfile() {
  const supabase = await createClient()
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      redirect('/login')
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return null
    }

    return {
      user: {
        id: user.id,
        email: user.email || '',
        isEmailVerified: user.email_confirmed_at !== null,
        createdAt: new Date(user.created_at),
      },
      profile
    }
  } catch (error) {
    console.error('Error in getProfile:', error)
    return null
  }
}

// Update profile server action
export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient()

  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { error: 'Not authenticated' }
    }

    // Extract and validate form data
    const rawData = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      phone_number: formData.get('phone_number') as string,
      bio: formData.get('bio') as string,
      location: formData.get('location') as string,
      website: formData.get('website') as string,
      linkedin_url: formData.get('linkedin_url') as string,
      github_url: formData.get('github_url') as string,
    }

    // Validate the data
    const validatedData = profileSchema.parse(rawData)

    // Update the profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        phone_number: validatedData.phone_number || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return { error: 'Failed to update profile' }
    }

    // Revalidate the profile page
    revalidatePath('/dashboard/profile')
    
    return { success: true }
  } catch (error) {
    console.error('Error in updateProfileAction:', error)
    
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || 'Validation error' }
    }
    
    return { error: 'An unexpected error occurred' }
  }
}

// Resume data server actions
export async function saveResumeAction(formData: FormData) {
  const supabase = await createClient()

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { error: 'Not authenticated' }
    }

    // Extract resume data from form
    const resumeData = {
      title: formData.get('title') as string,
      summary: formData.get('summary') as string,
      experience: JSON.parse(formData.get('experience') as string || '[]'),
      education: JSON.parse(formData.get('education') as string || '[]'),
      skills: JSON.parse(formData.get('skills') as string || '[]'),
    }

    // Save to database (this would need proper resume schema)
    // For now, just return success
    console.log('Resume data to save:', resumeData)

    revalidatePath('/dashboard/profile')
    return { success: true }
  } catch (error) {
    console.error('Error saving resume:', error)
    return { error: 'Failed to save resume' }
  }
}