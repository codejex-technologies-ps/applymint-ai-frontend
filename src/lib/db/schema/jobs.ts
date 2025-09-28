import { pgTable, uuid, text, boolean, numeric, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { companies } from './companies';

// Job types and experience levels
const jobTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'] as const;
const experienceLevels = ['ENTRY', 'MID', 'SENIOR', 'EXECUTIVE'] as const;

// Jobs table
export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  companyId: uuid('company_id').references(() => companies.id, { onDelete: 'cascade' }),
  location: text('location').notNull(),
  isRemote: boolean('is_remote').default(false).notNull(),
  jobType: text('job_type').$type<typeof jobTypes[number]>(),
  experienceLevel: text('experience_level').$type<typeof experienceLevels[number]>(),
  description: text('description').notNull(),
  requirements: text('requirements').array(), // Array of requirements
  responsibilities: text('responsibilities').array(), // Array of responsibilities
  benefits: text('benefits').array(), // Array of benefits
  salaryMin: numeric('salary_min'),
  salaryMax: numeric('salary_max'),
  salaryCurrency: text('salary_currency').default('USD').notNull(),
  skills: text('skills').array(), // Array of required skills
  postedAt: timestamp('posted_at', { withTimezone: true }).defaultNow().notNull(),
  applicationDeadline: timestamp('application_deadline', { withTimezone: true }),
  isActive: boolean('is_active').default(true).notNull(),
  externalJobId: text('external_job_id'), // For jobs scraped from other sources
  externalSource: text('external_source'), // Source of the job (LinkedIn, Indeed, etc.)
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const jobsRelations = relations(jobs, ({ one }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
}));

// Infer types from the schema
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

// Zod schemas for validation
export const insertJobSchema = createInsertSchema(jobs, {
  title: z.string().min(1, 'Job title is required').max(255, 'Job title must be less than 255 characters'),
  location: z.string().min(1, 'Location is required').max(255, 'Location must be less than 255 characters'),
  jobType: z.enum(jobTypes).optional(),
  experienceLevel: z.enum(experienceLevels).optional(),
  description: z.string().min(1, 'Job description is required'),
  requirements: z.array(z.string().min(1)).optional(),
  responsibilities: z.array(z.string().min(1)).optional(),
  benefits: z.array(z.string().min(1)).optional(),
  salaryMin: z.number().min(0, 'Minimum salary must be positive').optional(),
  salaryMax: z.number().min(0, 'Maximum salary must be positive').optional(),
  salaryCurrency: z.string().default('USD'),
  skills: z.array(z.string().min(1)).optional(),
  applicationDeadline: z.date().optional(),
  externalJobId: z.string().optional(),
  externalSource: z.string().optional(),
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
).refine(
  (data) => {
    if (data.applicationDeadline) {
      return data.applicationDeadline > new Date();
    }
    return true;
  },
  {
    message: 'Application deadline must be in the future',
    path: ['applicationDeadline'],
  }
);

export const selectJobSchema = createSelectSchema(jobs);

// Update schema (exclude id, createdAt)
export const updateJobSchema = insertJobSchema.omit({ 
  id: true, 
  createdAt: true 
}).partial().extend({
  updatedAt: z.date().optional(),
});

// Export schema types for services
export type InsertJob = z.infer<typeof insertJobSchema>;
export type UpdateJob = z.infer<typeof updateJobSchema>;
export type JobType = typeof jobTypes[number];
export type ExperienceLevel = typeof experienceLevels[number];