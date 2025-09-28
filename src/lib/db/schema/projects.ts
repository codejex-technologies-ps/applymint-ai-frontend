import { pgTable, uuid, text, date, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { resumes } from './resumes';

// Projects table
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  resumeId: uuid('resume_id').notNull().references(() => resumes.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  technologies: text('technologies').array(),
  projectUrl: text('project_url'),
  githubUrl: text('github_url'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const projectsRelations = relations(projects, ({ one }) => ({
  resume: one(resumes, {
    fields: [projects.resumeId],
    references: [resumes.id],
  }),
}));

// Infer types
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

// Validation schemas
export const insertProjectSchema = createInsertSchema(projects, {
  title: z.string().min(1, 'Project title is required').max(255),
  description: z.string().min(1, 'Project description is required'),
  technologies: z.array(z.string().min(1)).optional(),
  projectUrl: z.string().url('Invalid project URL').optional(),
  githubUrl: z.string().url('Invalid GitHub URL').optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
});

export const selectProjectSchema = createSelectSchema(projects);
export const updateProjectSchema = insertProjectSchema.omit({ 
  id: true, 
  resumeId: true,
  createdAt: true 
}).partial().extend({
  updatedAt: z.date().optional(),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;