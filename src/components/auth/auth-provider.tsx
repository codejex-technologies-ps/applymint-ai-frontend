'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { profilesService } from '@/lib/services/profiles'
import type { User, UserProfile } from '@/types'

type AuthContextType = {
  user: User | null
  profile: UserProfile | null
  supabaseUser: SupabaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, metadata?: object) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
  updateProfile: (updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>) => Promise<{ error?: string }>
  refreshProfile: () => Promise<void>
  verifySignUp: (email: string, token: string) => Promise<{ error?: string }>
  resendVerification: (email: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Only create client if environment variables are available
  const supabase = (supabaseUrl && supabaseKey) ? createClient() : null

  // Function to fetch and set profile data
  const fetchProfile = useCallback(async () => {
    try {
      const profileData = await profilesService.getCurrentProfile()
      setProfile(profileData)
      
      if (profileData && supabaseUser) {
        const userData = profilesService.convertToUser(
          profileData, 
          !!supabaseUser.email_confirmed_at
        )
        setUser(userData)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
      setUser(null)
    }
  }, [supabaseUser])

  const refreshProfile = async () => {
    if (supabaseUser) {
      await fetchProfile()
    }
  }

  useEffect(() => {
    // Don't initialize if Supabase is not configured
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const authUser = session?.user ?? null
      setSupabaseUser(authUser)
      
      if (authUser) {
        await fetchProfile()
      } else {
        setProfile(null)
        setUser(null)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const authUser = session?.user ?? null
        setSupabaseUser(authUser)
        
        if (authUser) {
          await fetchProfile()
        } else {
          setProfile(null)
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, fetchProfile])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: 'Authentication service is not configured' }
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        // Check if it's an email not confirmed error
        if (error.message.includes('email not confirmed') || error.message.includes('Email not confirmed')) {
          return { error: 'email_not_confirmed' }
        }
        return { error: error.message }
      }
      
      return {}
    } catch {
      return { error: 'An unexpected error occurred' }
    }
  }

  const signUp = async (email: string, password: string, metadata?: object) => {
    if (!supabase) {
      return { error: 'Authentication service is not configured' }
    }
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })
      
      if (error) {
        return { error: error.message }
      }
      
      return {}
    } catch {
      return { error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: 'Authentication service is not configured' }
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      
      if (error) {
        return { error: error.message }
      }
      
      return {}
    } catch {
      return { error: 'An unexpected error occurred' }
    }
  }

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const updatedProfile = await profilesService.updateProfile(updates)
      if (updatedProfile) {
        setProfile(updatedProfile)
        if (supabaseUser) {
          const userData = profilesService.convertToUser(
            updatedProfile,
            !!supabaseUser.email_confirmed_at
          )
          setUser(userData)
        }
      }
      return {}
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to update profile' }
    }
  }

  const verifySignUp = async (email: string, token: string) => {
    if (!supabase) {
      return { error: 'Authentication service is not configured' }
    }
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'
      })
      
      if (error) {
        return { error: error.message }
      }
      
      return {}
    } catch {
      return { error: 'An unexpected error occurred' }
    }
  }

  const resendVerification = async (email: string) => {
    if (!supabase) {
      return { error: 'Authentication service is not configured' }
    }
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      })
      
      if (error) {
        return { error: error.message }
      }
      
      return {}
    } catch {
      return { error: 'An unexpected error occurred' }
    }
  }

  const value = {
    user,
    profile,
    supabaseUser,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
    verifySignUp,
    resendVerification,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}