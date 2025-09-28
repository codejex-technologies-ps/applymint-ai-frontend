import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/connection';
import { profiles, type Profile, type NewProfile, type UpdateProfile } from '@/lib/db/schema/profiles';
import type { User } from '@/types';

// Drizzle-based profile operations
export const drizzleProfilesService = {
  // Get profile by ID
  async getProfileById(id: string): Promise<Profile | null> {
    try {
      const result = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error('Error fetching profile by ID:', error);
      return null;
    }
  },

  // Get profile by email
  async getProfileByEmail(email: string): Promise<Profile | null> {
    try {
      const result = await db
        .select()
        .from(profiles)
        .where(eq(profiles.email, email))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error('Error fetching profile by email:', error);
      return null;
    }
  },

  // Create new profile
  async createProfile(profileData: NewProfile): Promise<Profile | null> {
    try {
      const result = await db
        .insert(profiles)
        .values({
          ...profileData,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new Error(`Failed to create profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Update profile
  async updateProfile(id: string, updates: UpdateProfile): Promise<Profile | null> {
    try {
      const result = await db
        .update(profiles)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, id))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Delete profile
  async deleteProfile(id: string): Promise<boolean> {
    try {
      const result = await db
        .delete(profiles)
        .where(eq(profiles.id, id))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error('Error deleting profile:', error);
      return false;
    }
  },

  // Get all profiles (admin functionality)
  async getAllProfiles(limit = 100, offset = 0): Promise<Profile[]> {
    try {
      const result = await db
        .select()
        .from(profiles)
        .limit(limit)
        .offset(offset);

      return result;
    } catch (error) {
      console.error('Error fetching all profiles:', error);
      return [];
    }
  },

  // Check if profile exists
  async profileExists(id: string): Promise<boolean> {
    try {
      const result = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.id, id))
        .limit(1);

      return result.length > 0;
    } catch (error) {
      console.error('Error checking profile existence:', error);
      return false;
    }
  },

  // Convert profile data to User interface for frontend use
  convertToUser(profile: Profile, isEmailVerified: boolean = false): User {
    return {
      id: profile.id,
      email: profile.email,
      firstName: profile.firstName || undefined,
      lastName: profile.lastName || undefined,
      phoneNumber: profile.phoneNumber || undefined,
      isEmailVerified,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  },

  // Batch operations
  async createProfiles(profilesData: NewProfile[]): Promise<Profile[]> {
    try {
      const now = new Date();
      const profilesWithTimestamps = profilesData.map(profile => ({
        ...profile,
        createdAt: now,
        updatedAt: now,
      }));

      const result = await db
        .insert(profiles)
        .values(profilesWithTimestamps)
        .returning();

      return result;
    } catch (error) {
      console.error('Error creating profiles in batch:', error);
      throw new Error(`Failed to create profiles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Search profiles by name or email
  async searchProfiles(query: string, limit = 20): Promise<Profile[]> {
    try {
      // For a more sophisticated search, you might want to use PostgreSQL's full-text search
      // This is a simple implementation - in production you'd use proper search operators
      
      const result = await db
        .select()
        .from(profiles)
        .limit(limit);

      // Filter results in JavaScript for now (not optimal for large datasets)
      const lowerQuery = query.toLowerCase();
      return result.filter(profile => 
        profile.email.toLowerCase().includes(lowerQuery) ||
        profile.firstName?.toLowerCase().includes(lowerQuery) ||
        profile.lastName?.toLowerCase().includes(lowerQuery)
      ).slice(0, limit);
    } catch (error) {
      console.error('Error searching profiles:', error);
      return [];
    }
  },
};