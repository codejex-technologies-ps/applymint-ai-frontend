// Hybrid profiles service demonstrating gradual migration from Supabase to Drizzle
// This shows how to migrate services incrementally while maintaining compatibility

import { createClient } from '@/lib/supabase/client';
import { drizzleProfilesService } from './drizzle-profiles';
import type { UserProfile, User } from '@/types';

// Feature flag to control which backend to use
const USE_DRIZZLE = process.env.NEXT_PUBLIC_USE_DRIZZLE === 'true';

export const hybridProfilesService = {
  // Get current user's profile - demonstrates gradual migration
  async getCurrentProfile(): Promise<UserProfile | null> {
    if (USE_DRIZZLE) {
      // New Drizzle implementation
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      const drizzleProfile = await drizzleProfilesService.getProfileById(user.id);
      if (!drizzleProfile) return null;
      
      // Convert Drizzle format to Supabase format for compatibility
      return {
        id: drizzleProfile.id,
        email: drizzleProfile.email,
        first_name: drizzleProfile.firstName,
        last_name: drizzleProfile.lastName,
        phone_number: drizzleProfile.phoneNumber,
        bio: drizzleProfile.bio,
        location: drizzleProfile.location,
        website: drizzleProfile.website,
        linkedin_url: drizzleProfile.linkedinUrl,
        github_url: drizzleProfile.githubUrl,
        twitter_url: drizzleProfile.twitterUrl,
        portfolio_url: drizzleProfile.portfolioUrl,
        current_position: drizzleProfile.currentPosition,
        company: drizzleProfile.company,
        years_of_experience: drizzleProfile.yearsOfExperience,
        availability_status: drizzleProfile.availabilityStatus || 'available',
        preferred_work_type: drizzleProfile.preferredWorkType || 'full_time',
        profile_visibility: drizzleProfile.profileVisibility || 'public',
        credit: drizzleProfile.credit || 5,
        created_at: drizzleProfile.createdAt.toISOString(),
        updated_at: drizzleProfile.updatedAt.toISOString(),
      };
    } else {
      // Original Supabase implementation
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    }
  },

  // Update profile - shows how to maintain same interface
  async updateProfile(updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>): Promise<UserProfile | null> {
    if (USE_DRIZZLE) {
      // New Drizzle implementation with better type safety
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const drizzleProfile = await drizzleProfilesService.updateProfile(user.id, {
        firstName: updates.first_name || undefined,
        lastName: updates.last_name || undefined,
        phoneNumber: updates.phone_number || undefined,
        email: updates.email,
        bio: updates.bio || undefined,
        location: updates.location || undefined,
        website: updates.website || undefined,
        linkedinUrl: updates.linkedin_url || undefined,
        githubUrl: updates.github_url || undefined,
        twitterUrl: updates.twitter_url || undefined,
        portfolioUrl: updates.portfolio_url || undefined,
        currentPosition: updates.current_position || undefined,
        company: updates.company || undefined,
        yearsOfExperience: updates.years_of_experience || undefined,
        availabilityStatus: updates.availability_status || undefined,
        preferredWorkType: updates.preferred_work_type || undefined,
        profileVisibility: updates.profile_visibility || undefined,
      });
      
      if (!drizzleProfile) return null;
      
      // Convert back to Supabase format
      return {
        id: drizzleProfile.id,
        email: drizzleProfile.email,
        first_name: drizzleProfile.firstName,
        last_name: drizzleProfile.lastName,
        phone_number: drizzleProfile.phoneNumber,
        bio: drizzleProfile.bio,
        location: drizzleProfile.location,
        website: drizzleProfile.website,
        linkedin_url: drizzleProfile.linkedinUrl,
        github_url: drizzleProfile.githubUrl,
        twitter_url: drizzleProfile.twitterUrl,
        portfolio_url: drizzleProfile.portfolioUrl,
        current_position: drizzleProfile.currentPosition,
        company: drizzleProfile.company,
        years_of_experience: drizzleProfile.yearsOfExperience,
        availability_status: drizzleProfile.availabilityStatus || 'available',
        preferred_work_type: drizzleProfile.preferredWorkType || 'full_time',
        profile_visibility: drizzleProfile.profileVisibility || 'public',
        credit: drizzleProfile.credit || 5,
        created_at: drizzleProfile.createdAt.toISOString(),
        updated_at: drizzleProfile.updatedAt.toISOString(),
      };
    } else {
      // Original Supabase implementation
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw new Error(error.message);
      }

      return data;
    }
  },

  // Get profile by ID - demonstrates performance comparison
  async getProfileById(id: string): Promise<UserProfile | null> {
    const startTime = performance.now();
    
    let result: UserProfile | null;
    
    if (USE_DRIZZLE) {
      // Drizzle with connection pooling
      const drizzleProfile = await drizzleProfilesService.getProfileById(id);
      if (!drizzleProfile) {
        result = null;
      } else {
        // Convert to Supabase format
        result = {
          id: drizzleProfile.id,
          email: drizzleProfile.email,
          first_name: drizzleProfile.firstName,
          last_name: drizzleProfile.lastName,
          phone_number: drizzleProfile.phoneNumber,
          bio: drizzleProfile.bio,
          location: drizzleProfile.location,
          website: drizzleProfile.website,
          linkedin_url: drizzleProfile.linkedinUrl,
          github_url: drizzleProfile.githubUrl,
          twitter_url: drizzleProfile.twitterUrl,
          portfolio_url: drizzleProfile.portfolioUrl,
          current_position: drizzleProfile.currentPosition,
          company: drizzleProfile.company,
          years_of_experience: drizzleProfile.yearsOfExperience,
          availability_status: drizzleProfile.availabilityStatus || 'available',
          preferred_work_type: drizzleProfile.preferredWorkType || 'full_time',
          profile_visibility: drizzleProfile.profileVisibility || 'public',
          credit: drizzleProfile.credit || 5,
          created_at: drizzleProfile.createdAt.toISOString(),
          updated_at: drizzleProfile.updatedAt.toISOString(),
        };
      }
    } else {
      // Original Supabase
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      result = data;
    }
    
    const endTime = performance.now();
    console.log(`Profile fetch took ${endTime - startTime}ms using ${USE_DRIZZLE ? 'Drizzle' : 'Supabase'}`);
    
    return result;
  },

  // Convert profile to User interface (shared logic)
  convertToUser(profile: UserProfile, isEmailVerified: boolean = false): User {
    // Always use the original conversion logic for consistency
    return {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name || undefined,
      lastName: profile.last_name || undefined,
      phoneNumber: profile.phone_number || undefined,
      isEmailVerified,
      createdAt: new Date(profile.created_at),
      updatedAt: new Date(profile.updated_at),
    };
  },

  // Performance comparison utility
  async performanceTest(userId: string): Promise<{
    supabaseTime: number;
    drizzleTime: number;
    improvement: string;
  }> {
    console.log('Running performance comparison...');
    
    // Test Supabase
    const supabaseStart = performance.now();
    const supabase = createClient();
    await supabase.from('profiles').select('*').eq('id', userId).single();
    const supabaseEnd = performance.now();
    const supabaseTime = supabaseEnd - supabaseStart;
    
    // Test Drizzle
    const drizzleStart = performance.now();
    await drizzleProfilesService.getProfileById(userId);
    const drizzleEnd = performance.now();
    const drizzleTime = drizzleEnd - drizzleStart;
    
    const improvement = supabaseTime > drizzleTime 
      ? `${((supabaseTime - drizzleTime) / supabaseTime * 100).toFixed(1)}% faster`
      : `${((drizzleTime - supabaseTime) / drizzleTime * 100).toFixed(1)}% slower`;
    
    return {
      supabaseTime: Math.round(supabaseTime * 100) / 100,
      drizzleTime: Math.round(drizzleTime * 100) / 100,
      improvement,
    };
  },

  // Migration utility to verify data consistency
  async verifyMigration(userId: string): Promise<{
    consistent: boolean;
    differences: string[];
  }> {
    try {
      // Get data from both sources
      const supabase = createClient();
      const { data: supabaseData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      const drizzleData = await drizzleProfilesService.getProfileById(userId);
      
      if (!supabaseData || !drizzleData) {
        return {
          consistent: false,
          differences: ['Data not found in one or both sources'],
        };
      }
      
      // Compare key fields
      const differences: string[] = [];
      
      if (supabaseData.email !== drizzleData.email) {
        differences.push(`Email mismatch: ${supabaseData.email} vs ${drizzleData.email}`);
      }
      
      if (supabaseData.first_name !== drizzleData.firstName) {
        differences.push(`First name mismatch: ${supabaseData.first_name} vs ${drizzleData.firstName}`);
      }
      
      if (supabaseData.last_name !== drizzleData.lastName) {
        differences.push(`Last name mismatch: ${supabaseData.last_name} vs ${drizzleData.lastName}`);
      }
      
      if (supabaseData.phone_number !== drizzleData.phoneNumber) {
        differences.push(`Phone mismatch: ${supabaseData.phone_number} vs ${drizzleData.phoneNumber}`);
      }
      
      return {
        consistent: differences.length === 0,
        differences,
      };
    } catch (error) {
      return {
        consistent: false,
        differences: [`Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      };
    }
  },
};