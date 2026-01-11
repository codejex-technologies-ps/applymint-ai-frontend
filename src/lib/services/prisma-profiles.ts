// Prisma-based profiles service
// Replaces drizzle-profiles.ts with Prisma ORM implementation

import { prisma } from '@/lib/prisma'
import type { Profile, Prisma } from '@prisma/client'
import type { User } from '@/types'

export const prismaProfilesService = {
  // Get profile by ID
  async getProfileById(id: string): Promise<Profile | null> {
    try {
      const profile = await prisma.profile.findUnique({
        where: { id },
      })
      return profile
    } catch (error) {
      console.error('Error fetching profile by ID:', error)
      return null
    }
  },

  // Get profile by email
  async getProfileByEmail(email: string): Promise<Profile | null> {
    try {
      const profile = await prisma.profile.findUnique({
        where: { email },
      })
      return profile
    } catch (error) {
      console.error('Error fetching profile by email:', error)
      return null
    }
  },

  // Create new profile
  async createProfile(profileData: Prisma.ProfileCreateInput): Promise<Profile | null> {
    try {
      const profile = await prisma.profile.create({
        data: profileData,
      })
      return profile
    } catch (error) {
      console.error('Error creating profile:', error)
      throw new Error(`Failed to create profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },

  // Update profile
  async updateProfile(id: string, updates: Prisma.ProfileUpdateInput): Promise<Profile | null> {
    try {
      const profile = await prisma.profile.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      })
      return profile
    } catch (error) {
      console.error('Error updating profile:', error)
      throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },

  // Delete profile
  async deleteProfile(id: string): Promise<boolean> {
    try {
      await prisma.profile.delete({
        where: { id },
      })
      return true
    } catch (error) {
      console.error('Error deleting profile:', error)
      return false
    }
  },

  // Get all profiles (admin functionality)
  async getAllProfiles(limit = 100, offset = 0): Promise<Profile[]> {
    try {
      const profiles = await prisma.profile.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      })
      return profiles
    } catch (error) {
      console.error('Error fetching all profiles:', error)
      return []
    }
  },

  // Check if profile exists
  async profileExists(id: string): Promise<boolean> {
    try {
      const profile = await prisma.profile.findUnique({
        where: { id },
        select: { id: true },
      })
      return profile !== null
    } catch (error) {
      console.error('Error checking profile existence:', error)
      return false
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
      bio: profile.bio || undefined,
      location: profile.location || undefined,
      website: profile.website || undefined,
      linkedinUrl: profile.linkedinUrl || undefined,
      githubUrl: profile.githubUrl || undefined,
      twitterUrl: profile.twitterUrl || undefined,
      portfolioUrl: profile.portfolioUrl || undefined,
      currentPosition: profile.currentPosition || undefined,
      company: profile.company || undefined,
      yearsOfExperience: profile.yearsOfExperience || undefined,
      availabilityStatus: profile.availabilityStatus as User['availabilityStatus'] || undefined,
      preferredWorkType: profile.preferredWorkType as User['preferredWorkType'] || undefined,
      profileVisibility: profile.profileVisibility as User['profileVisibility'] || undefined,
      credit: profile.credit || undefined,
      isEmailVerified,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    }
  },

  // Batch operations
  async createProfiles(profilesData: Prisma.ProfileCreateInput[]): Promise<Profile[]> {
    try {
      const result = await prisma.$transaction(
        profilesData.map(profile =>
          prisma.profile.create({ data: profile })
        )
      )
      return result
    } catch (error) {
      console.error('Error creating profiles in batch:', error)
      throw new Error(`Failed to create profiles: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },

  // Search profiles by name or email
  async searchProfiles(query: string, limit = 20): Promise<Profile[]> {
    try {
      const profiles = await prisma.profile.findMany({
        where: {
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      })
      return profiles
    } catch (error) {
      console.error('Error searching profiles:', error)
      return []
    }
  },
}
