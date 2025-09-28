import { pgTable, uuid, text, date, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { resumes } from './resumes';

// Degree types
const degreeTypes = [
  'HIGH_SCHOOL',
  'ASSOCIATE',
  'BACHELOR',
  'MASTER',
  'DOCTORAL',
  'CERTIFICATE',
  'DIPLOMA',
  'OTHER'
] as const;

// Educations table
export const educations = pgTable('educations', {
  id: uuid('id').primaryKey().defaultRandom(),
  resumeId: uuid('resume_id').notNull().references(() => resumes.id, { onDelete: 'cascade' }),
  institution: text('institution').notNull(),
  degree: text('degree').$type<typeof degreeTypes[number]>(),
  fieldOfStudy: text('field_of_study'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  gpa: text('gpa'), // Store as text to handle different formats (3.5, 3.5/4.0, etc.)
  description: text('description'),
  achievements: text('achievements').array(), // Array of achievements
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const educationsRelations = relations(educations, ({ one }) => ({
  resume: one(resumes, {
    fields: [educations.resumeId],
    references: [resumes.id],
  }),
}));

// Infer types from the schema
export type Education = typeof educations.$inferSelect;
export type NewEducation = typeof educations.$inferInsert;

// Zod schemas for validation
export const insertEducationSchema = createInsertSchema(educations, {
  institution: z.string().min(1, 'Institution name is required').max(255, 'Institution name must be less than 255 characters'),
  degree: z.enum(degreeTypes).optional(),
  fieldOfStudy: z.string().max(255, 'Field of study must be less than 255 characters').optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  gpa: z.string().max(10, 'GPA must be less than 10 characters').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  achievements: z.array(z.string().min(1)).optional(),
}).refine(
  (data) => {
    if (data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  {
    message: 'Start date must be before or equal to end date',
    path: ['startDate'],
  }
);

export const selectEducationSchema = createSelectSchema(educations);

// Update schema (exclude id, resumeId, createdAt)
export const updateEducationSchema = insertEducationSchema.omit({ 
  id: true, 
  resumeId: true,
  createdAt: true 
}).partial().extend({
  updatedAt: z.date().optional(),
});

// Export schema types for services
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type UpdateEducation = z.infer<typeof updateEducationSchema>;
export type DegreeType = typeof degreeTypes[number];