import { pgTable, uuid, boolean, text, numeric, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { profiles } from './profiles';

// User preferences table
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }).unique(),
  jobAlerts: boolean('job_alerts').default(true).notNull(),
  emailNotifications: boolean('email_notifications').default(true).notNull(),
  smsNotifications: boolean('sms_notifications').default(false).notNull(),
  preferredJobTypes: text('preferred_job_types').array(), // Array of job types
  preferredLocations: text('preferred_locations').array(), // Array of locations
  salaryMin: numeric('salary_min'),
  salaryMax: numeric('salary_max'),
  salaryCurrency: text('salary_currency').default('USD').notNull(),
  remoteWork: boolean('remote_work').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(profiles, {
    fields: [userPreferences.userId],
    references: [profiles.id],
  }),
}));

// Infer types from the schema
export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert;

// Define valid job types and currencies
const jobTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'] as const;
const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'] as const;

// Zod schemas for validation
export const insertUserPreferenceSchema = createInsertSchema(userPreferences, {
  preferredJobTypes: z.array(z.enum(jobTypes)).optional(),
  preferredLocations: z.array(z.string().min(1)).optional(),
  salaryMin: z.number().min(0, 'Minimum salary must be positive').optional(),
  salaryMax: z.number().min(0, 'Maximum salary must be positive').optional(),
  salaryCurrency: z.enum(currencies),
}).refine(
  (data) => {
    if (data.salaryMin && data.salaryMax) {
      return data.salaryMin <= data.salaryMax;
    }
    return true;
  },
  {
    message: 'Minimum salary must be less than or equal to maximum salary',
    path: ['salaryMin'],
  }
);

export const selectUserPreferenceSchema = createSelectSchema(userPreferences);

// Update schema (exclude id, userId, createdAt)
export const updateUserPreferenceSchema = insertUserPreferenceSchema.omit({ 
  id: true, 
  userId: true,
  createdAt: true 
}).partial().extend({
  updatedAt: z.date().optional(),
});

// Export schema types for services
export type InsertUserPreference = z.infer<typeof insertUserPreferenceSchema>;
export type UpdateUserPreference = z.infer<typeof updateUserPreferenceSchema>;
export type PreferredJobType = typeof jobTypes[number];
export type Currency = typeof currencies[number];