import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enum values for profile fields
const availabilityStatusEnum = ['available', 'not_available', 'open_to_opportunities'] as const;
const preferredWorkTypeEnum = ['full_time', 'part_time', 'contract', 'freelance', 'internship'] as const;
const profileVisibilityEnum = ['public', 'private', 'connections_only'] as const;

// Profiles table - matches the extended Supabase schema
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // References auth.users(id)
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phoneNumber: text('phone_number'),
  
  // Extended profile fields
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  linkedinUrl: text('linkedin_url'),
  githubUrl: text('github_url'),
  twitterUrl: text('twitter_url'),
  portfolioUrl: text('portfolio_url'),
  currentPosition: text('current_position'),
  company: text('company'),
  yearsOfExperience: integer('years_of_experience'),
  availabilityStatus: text('availability_status').$type<typeof availabilityStatusEnum[number]>().default('available'),
  preferredWorkType: text('preferred_work_type').$type<typeof preferredWorkTypeEnum[number]>().default('full_time'),
  profileVisibility: text('profile_visibility').$type<typeof profileVisibilityEnum[number]>().default('public'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Infer types from the schema
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

// URL validation regex patterns
const urlRegex = /^https?:\/\/.+/;
const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/.+/;
const githubRegex = /^https?:\/\/(www\.)?github\.com\/.+/;
const twitterRegex = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/;

// Zod schemas for validation
export const insertProfileSchema = createInsertSchema(profiles, {
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters').optional(),
  phoneNumber: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format').optional(),
  
  // Extended field validations
  bio: z.string().max(2000, 'Bio must be less than 2000 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  website: z.string().regex(urlRegex, 'Invalid website URL').optional().or(z.literal('')),
  linkedinUrl: z.string().regex(linkedinRegex, 'Invalid LinkedIn URL').optional().or(z.literal('')),
  githubUrl: z.string().regex(githubRegex, 'Invalid GitHub URL').optional().or(z.literal('')),
  twitterUrl: z.string().regex(twitterRegex, 'Invalid Twitter URL').optional().or(z.literal('')),
  portfolioUrl: z.string().regex(urlRegex, 'Invalid portfolio URL').optional().or(z.literal('')),
  currentPosition: z.string().max(100, 'Position must be less than 100 characters').optional(),
  company: z.string().max(100, 'Company name must be less than 100 characters').optional(),
  yearsOfExperience: z.number().int().min(0, 'Years of experience cannot be negative').max(50, 'Years of experience seems too high').optional(),
  availabilityStatus: z.enum(availabilityStatusEnum).optional(),
  preferredWorkType: z.enum(preferredWorkTypeEnum).optional(),
  profileVisibility: z.enum(profileVisibilityEnum).optional(),
});

export const selectProfileSchema = createSelectSchema(profiles);

// Partial update schema (exclude id, createdAt)
export const updateProfileSchema = insertProfileSchema.omit({ 
  id: true, 
  createdAt: true 
}).partial().extend({
  updatedAt: z.date().optional(),
});

// Export schema types for type inference in services
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

// Export enum types for frontend use
export type AvailabilityStatus = typeof availabilityStatusEnum[number];
export type PreferredWorkType = typeof preferredWorkTypeEnum[number];
export type ProfileVisibility = typeof profileVisibilityEnum[number];