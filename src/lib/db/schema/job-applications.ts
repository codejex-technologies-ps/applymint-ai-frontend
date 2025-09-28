import { pgTable, uuid, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { jobs } from './jobs';
import { profiles } from './profiles';
import { resumes } from './resumes';

// Application status types
const applicationStatuses = [
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'ACCEPTED'
] as const;

// Job applications table
export const jobApplications = pgTable('job_applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  resumeId: uuid('resume_id').references(() => resumes.id),
  coverLetter: text('cover_letter'),
  status: text('status').$type<typeof applicationStatuses[number]>().default('DRAFT').notNull(),
  appliedAt: timestamp('applied_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  notes: text('notes'), // Private notes from the user
}, (table) => ({
  // Unique constraint to prevent duplicate applications
  uniqueJobUser: unique().on(table.jobId, table.userId),
}));

// Relations
export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  job: one(jobs, {
    fields: [jobApplications.jobId],
    references: [jobs.id],
  }),
  user: one(profiles, {
    fields: [jobApplications.userId],
    references: [profiles.id],
  }),
  resume: one(resumes, {
    fields: [jobApplications.resumeId],
    references: [resumes.id],
  }),
}));

// Infer types from the schema
export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;

// Zod schemas for validation
export const insertJobApplicationSchema = createInsertSchema(jobApplications, {
  coverLetter: z.string().max(5000, 'Cover letter must be less than 5000 characters').optional(),
  status: z.enum(applicationStatuses),
  notes: z.string().max(2000, 'Notes must be less than 2000 characters').optional(),
});

export const selectJobApplicationSchema = createSelectSchema(jobApplications);

// Update schema (exclude id, jobId, userId, appliedAt)
export const updateJobApplicationSchema = insertJobApplicationSchema.omit({ 
  id: true, 
  jobId: true,
  userId: true,
  appliedAt: true 
}).partial().extend({
  updatedAt: z.date().optional(),
});

// Export schema types for services
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type UpdateJobApplication = z.infer<typeof updateJobApplicationSchema>;
export type ApplicationStatus = typeof applicationStatuses[number];