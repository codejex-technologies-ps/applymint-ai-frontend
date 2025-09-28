import { pgTable, uuid, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { jobs } from './jobs';
import { profiles } from './profiles';

// Saved jobs table
export const savedJobs = pgTable('saved_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  savedAt: timestamp('saved_at', { withTimezone: true }).defaultNow().notNull(),
  notes: text('notes'), // User notes about the saved job
}, (table) => ({
  // Unique constraint to prevent duplicate saves
  uniqueJobUser: unique().on(table.jobId, table.userId),
}));

// Relations
export const savedJobsRelations = relations(savedJobs, ({ one }) => ({
  job: one(jobs, {
    fields: [savedJobs.jobId],
    references: [jobs.id],
  }),
  user: one(profiles, {
    fields: [savedJobs.userId],
    references: [profiles.id],
  }),
}));

// Infer types from the schema
export type SavedJob = typeof savedJobs.$inferSelect;
export type NewSavedJob = typeof savedJobs.$inferInsert;

// Zod schemas for validation
export const insertSavedJobSchema = createInsertSchema(savedJobs, {
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
});

export const selectSavedJobSchema = createSelectSchema(savedJobs);

// Update schema (exclude id, jobId, userId, savedAt)
export const updateSavedJobSchema = insertSavedJobSchema.omit({ 
  id: true, 
  jobId: true,
  userId: true,
  savedAt: true 
}).partial();

// Export schema types for services
export type InsertSavedJob = z.infer<typeof insertSavedJobSchema>;
export type UpdateSavedJob = z.infer<typeof updateSavedJobSchema>;