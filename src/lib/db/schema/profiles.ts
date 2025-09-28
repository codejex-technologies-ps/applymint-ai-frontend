import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Profiles table - matches the existing Supabase schema
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // References auth.users(id)
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phoneNumber: text('phone_number'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Infer types from the schema
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

// Zod schemas for validation
export const insertProfileSchema = createInsertSchema(profiles, {
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters').optional(),
  phoneNumber: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format').optional(),
});

export const selectProfileSchema = createSelectSchema(profiles);

// Partial update schema (exclude id, createdAt)
export const updateProfileSchema = insertProfileSchema.omit({ 
  id: true, 
  createdAt: true 
}).partial().extend({
  updatedAt: z.date().optional(),
});

// Export schema for type inference in services
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;