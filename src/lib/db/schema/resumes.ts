import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { profiles } from './profiles';

// Resumes table
export const resumes = pgTable('resumes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  summary: text('summary'),
  isDefault: boolean('is_default').default(false).notNull(),
  fileName: text('file_name'), // Original filename if uploaded
  fileUrl: text('file_url'), // URL to stored file (PDF, DOCX, etc.)
  fileSize: text('file_size'), // File size as string (e.g., "1.2MB")
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const resumesRelations = relations(resumes, ({ one }) => ({
  user: one(profiles, {
    fields: [resumes.userId],
    references: [profiles.id],
  }),
}));

// Infer types from the schema
export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;

// Zod schemas for validation
export const insertResumeSchema = createInsertSchema(resumes, {
  title: z.string().min(1, 'Resume title is required').max(255, 'Resume title must be less than 255 characters'),
  summary: z.string().max(2000, 'Summary must be less than 2000 characters').optional(),
  fileName: z.string().max(255, 'Filename must be less than 255 characters').optional(),
  fileUrl: z.string().url('Invalid file URL').optional(),
  fileSize: z.string().optional(),
});

export const selectResumeSchema = createSelectSchema(resumes);

// Update schema (exclude id, userId, createdAt)
export const updateResumeSchema = insertResumeSchema.omit({ 
  id: true, 
  userId: true,
  createdAt: true 
}).partial().extend({
  updatedAt: z.date().optional(),
});

// Export schema types for services
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type UpdateResume = z.infer<typeof updateResumeSchema>;