import { createClient } from '@/lib/supabase/client'
import type { UserProfile, User } from '@/types'

// Client-side profile operations
export const profilesService = {
  // Get current user's profile
  async getCurrentProfile(): Promise<UserProfile | null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  },

  // Update current user's profile
  async updateProfile(updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>): Promise<UserProfile | null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw new Error(error.message)
    }

    return data
  },

  // Get profile by ID (for viewing other users)
  async getProfileById(id: string): Promise<UserProfile | null> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  },

  // Convert profile data to User interface for frontend use
  convertToUser(profile: UserProfile, isEmailVerified: boolean = false): User {
    return {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name || undefined,
      lastName: profile.last_name || undefined,
      phoneNumber: profile.phone_number || undefined,
      isEmailVerified,
      createdAt: new Date(profile.created_at),
      updatedAt: new Date(profile.updated_at),
    }
  }
}