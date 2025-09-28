import { pgTable, uuid, text, date, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { resumes } from './resumes';

// Work experiences table
export const workExperiences = pgTable('work_experiences', {
  id: uuid('id').primaryKey().defaultRandom(),
  resumeId: uuid('resume_id').notNull().references(() => resumes.id, { onDelete: 'cascade' }),
  company: text('company').notNull(),
  position: text('position').notNull(),
  location: text('location'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  isCurrent: boolean('is_current').default(false).notNull(),
  description: text('description'),
  achievements: text('achievements').array(), // Array of achievements
  skills: text('skills').array(), // Skills used in this role
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const workExperiencesRelations = relations(workExperiences, ({ one }) => ({
  resume: one(resumes, {
    fields: [workExperiences.resumeId],
    references: [resumes.id],
  }),
}));

// Infer types from the schema
export type WorkExperience = typeof workExperiences.$inferSelect;
export type NewWorkExperience = typeof workExperiences.$inferInsert;

// Zod schemas for validation
export const insertWorkExperienceSchema = createInsertSchema(workExperiences, {
  company: z.string().min(1, 'Company name is required').max(255, 'Company name must be less than 255 characters'),
  position: z.string().min(1, 'Position is required').max(255, 'Position must be less than 255 characters'),
  location: z.string().max(255, 'Location must be less than 255 characters').optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  achievements: z.array(z.string().min(1)).optional(),
  skills: z.array(z.string().min(1)).optional(),
}).refine(
  (data) => {
    if (data.endDate && !data.isCurrent) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  {
    message: 'Start date must be before or equal to end date',
    path: ['startDate'],
  }
).refine(
  (data) => {
    if (data.isCurrent) {
      return !data.endDate;
    }
    return true;
  },
  {
    message: 'End date should not be set for current positions',
    path: ['endDate'],
  }
);

export const selectWorkExperienceSchema = createSelectSchema(workExperiences);

// Update schema (exclude id, resumeId, createdAt)
export const updateWorkExperienceSchema = insertWorkExperienceSchema.omit({ 
  id: true, 
  resumeId: true,
  createdAt: true 
}).partial().extend({
  updatedAt: z.date().optional(),
});

// Export schema types for services
export type InsertWorkExperience = z.infer<typeof insertWorkExperienceSchema>;
export type UpdateWorkExperience = z.infer<typeof updateWorkExperienceSchema>;