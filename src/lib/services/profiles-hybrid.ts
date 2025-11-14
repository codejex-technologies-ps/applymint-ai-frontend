// Hybrid profiles service demonstrating gradual migration from Drizzle to Prisma
// This shows how to migrate services incrementally while maintaining compatibility
// UPDATED: Now uses Prisma ORM instead of Drizzle ORM

import { createClient } from '@/lib/supabase/client';
import { prismaProfilesService } from './prisma-profiles';
import type { UserProfile, User } from '@/types';

// Feature flag to control which backend to use (now defaults to Prisma)
const USE_PRISMA = process.env.NEXT_PUBLIC_USE_PRISMA !== 'false';

export const hybridProfilesService = {
  // Get current user's profile - now uses Prisma by default
  async getCurrentProfile(): Promise<UserProfile | null> {
    if (USE_PRISMA) {
      // New Prisma implementation
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      const prismaProfile = await prismaProfilesService.getProfileById(user.id);
      if (!prismaProfile) return null;
      
      // Convert Prisma format to Supabase format for compatibility
      return {
        id: prismaProfile.id,
        email: prismaProfile.email,
        first_name: prismaProfile.firstName,
        last_name: prismaProfile.lastName,
        phone_number: prismaProfile.phoneNumber,
        bio: prismaProfile.bio,
        location: prismaProfile.location,
        website: prismaProfile.website,
        linkedin_url: prismaProfile.linkedinUrl,
        github_url: prismaProfile.githubUrl,
        twitter_url: prismaProfile.twitterUrl,
        portfolio_url: prismaProfile.portfolioUrl,
        current_position: prismaProfile.currentPosition,
        company: prismaProfile.company,
        years_of_experience: prismaProfile.yearsOfExperience,
        availability_status: (prismaProfile.availabilityStatus || 'available') as UserProfile['availability_status'],
        preferred_work_type: (prismaProfile.preferredWorkType || 'full_time') as UserProfile['preferred_work_type'],
        profile_visibility: (prismaProfile.profileVisibility || 'public') as UserProfile['profile_visibility'],
        credit: prismaProfile.credit || 5,
        created_at: prismaProfile.createdAt.toISOString(),
        updated_at: prismaProfile.updatedAt.toISOString(),
      };
    } else {
      // Fallback to Supabase implementation
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

  // Update profile - now uses Prisma by default
  async updateProfile(updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>): Promise<UserProfile | null> {
    if (USE_PRISMA) {
      // New Prisma implementation with better type safety
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const prismaProfile = await prismaProfilesService.updateProfile(user.id, {
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
      
      if (!prismaProfile) return null;
      
      // Convert back to Supabase format
      return {
        id: prismaProfile.id,
        email: prismaProfile.email,
        first_name: prismaProfile.firstName,
        last_name: prismaProfile.lastName,
        phone_number: prismaProfile.phoneNumber,
        bio: prismaProfile.bio,
        location: prismaProfile.location,
        website: prismaProfile.website,
        linkedin_url: prismaProfile.linkedinUrl,
        github_url: prismaProfile.githubUrl,
        twitter_url: prismaProfile.twitterUrl,
        portfolio_url: prismaProfile.portfolioUrl,
        current_position: prismaProfile.currentPosition,
        company: prismaProfile.company,
        years_of_experience: prismaProfile.yearsOfExperience,
        availability_status: (prismaProfile.availabilityStatus || 'available') as UserProfile['availability_status'],
        preferred_work_type: (prismaProfile.preferredWorkType || 'full_time') as UserProfile['preferred_work_type'],
        profile_visibility: (prismaProfile.profileVisibility || 'public') as UserProfile['profile_visibility'],
        credit: prismaProfile.credit || 5,
        created_at: prismaProfile.createdAt.toISOString(),
        updated_at: prismaProfile.updatedAt.toISOString(),
      };
    } else {
      // Fallback to Supabase implementation
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

  // Get profile by ID - now uses Prisma by default
  async getProfileById(id: string): Promise<UserProfile | null> {
    const startTime = performance.now();
    
    let result: UserProfile | null;
    
    if (USE_PRISMA) {
      // Prisma with connection pooling
      const prismaProfile = await prismaProfilesService.getProfileById(id);
      if (!prismaProfile) {
        result = null;
      } else {
        // Convert to Supabase format
        result = {
          id: prismaProfile.id,
          email: prismaProfile.email,
          first_name: prismaProfile.firstName,
          last_name: prismaProfile.lastName,
          phone_number: prismaProfile.phoneNumber,
          bio: prismaProfile.bio,
          location: prismaProfile.location,
          website: prismaProfile.website,
          linkedin_url: prismaProfile.linkedinUrl,
          github_url: prismaProfile.githubUrl,
          twitter_url: prismaProfile.twitterUrl,
          portfolio_url: prismaProfile.portfolioUrl,
          current_position: prismaProfile.currentPosition,
          company: prismaProfile.company,
          years_of_experience: prismaProfile.yearsOfExperience,
          availability_status: (prismaProfile.availabilityStatus || 'available') as UserProfile['availability_status'],
          preferred_work_type: (prismaProfile.preferredWorkType || 'full_time') as UserProfile['preferred_work_type'],
          profile_visibility: (prismaProfile.profileVisibility || 'public') as UserProfile['profile_visibility'],
          credit: prismaProfile.credit || 5,
          created_at: prismaProfile.createdAt.toISOString(),
          updated_at: prismaProfile.updatedAt.toISOString(),
        };
      }
    } else {
      // Fallback to Supabase
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
    console.log(`Profile fetch took ${endTime - startTime}ms using ${USE_PRISMA ? 'Prisma' : 'Supabase'}`);
    
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
    prismaTime: number;
    improvement: string;
  }> {
    console.log('Running performance comparison...');
    
    // Test Supabase
    const supabaseStart = performance.now();
    const supabase = createClient();
    await supabase.from('profiles').select('*').eq('id', userId).single();
    const supabaseEnd = performance.now();
    const supabaseTime = supabaseEnd - supabaseStart;
    
    // Test Prisma
    const prismaStart = performance.now();
    await prismaProfilesService.getProfileById(userId);
    const prismaEnd = performance.now();
    const prismaTime = prismaEnd - prismaStart;
    
    const improvement = supabaseTime > prismaTime 
      ? `${((supabaseTime - prismaTime) / supabaseTime * 100).toFixed(1)}% faster`
      : `${((prismaTime - supabaseTime) / supabaseTime * 100).toFixed(1)}% slower`;
    
    return {
      supabaseTime: Math.round(supabaseTime * 100) / 100,
      prismaTime: Math.round(prismaTime * 100) / 100,
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
      
      const prismaData = await prismaProfilesService.getProfileById(userId);
      
      if (!supabaseData || !prismaData) {
        return {
          consistent: false,
          differences: ['Data not found in one or both sources'],
        };
      }
      
      // Compare key fields
      const differences: string[] = [];
      
      if (supabaseData.email !== prismaData.email) {
        differences.push(`Email mismatch: ${supabaseData.email} vs ${prismaData.email}`);
      }
      
      if (supabaseData.first_name !== prismaData.firstName) {
        differences.push(`First name mismatch: ${supabaseData.first_name} vs ${prismaData.firstName}`);
      }
      
      if (supabaseData.last_name !== prismaData.lastName) {
        differences.push(`Last name mismatch: ${supabaseData.last_name} vs ${prismaData.lastName}`);
      }
      
      if (supabaseData.phone_number !== prismaData.phoneNumber) {
        differences.push(`Phone mismatch: ${supabaseData.phone_number} vs ${prismaData.phoneNumber}`);
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
