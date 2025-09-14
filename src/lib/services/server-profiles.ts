import { createClient } from '@/lib/supabase/server'
import type { UserProfile } from '@/types'

// Server-side profile operations
export const serverProfilesService = {
  // Get current user's profile on the server
  async getCurrentProfile(): Promise<UserProfile | null> {
    const supabase = await createClient()
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

  // Get profile by ID on the server
  async getProfileById(id: string): Promise<UserProfile | null> {
    const supabase = await createClient()
    
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
  }
}