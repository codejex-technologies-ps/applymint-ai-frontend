import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { resumes } from './resumes';

// Skill proficiency levels
const skillLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const;

// Skill categories
const skillCategories = [
  'PROGRAMMING',
  'FRAMEWORKS',
  'DATABASES',
  'TOOLS',
  'LANGUAGES',
  'SOFT_SKILLS',
  'CERTIFICATIONS',
  'OTHER'
] as const;

// Skills table
export const skills = pgTable('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  resumeId: uuid('resume_id').notNull().references(() => resumes.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  level: text('level').$type<typeof skillLevels[number]>().notNull(),
  category: text('category').$type<typeof skillCategories[number]>(),
  yearsOfExperience: text('years_of_experience'), // Store as text to handle ranges like "2-3 years"
  description: text('description'), // Additional details about the skill
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const skillsRelations = relations(skills, ({ one }) => ({
  resume: one(resumes, {
    fields: [skills.resumeId],
    references: [resumes.id],
  }),
}));

// Infer types from the schema
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

// Zod schemas for validation
export const insertSkillSchema = createInsertSchema(skills, {
  name: z.string().min(1, 'Skill name is required').max(100, 'Skill name must be less than 100 characters'),
  level: z.enum(skillLevels),
  category: z.enum(skillCategories).optional(),
  yearsOfExperience: z.string().max(20, 'Years of experience must be less than 20 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const selectSkillSchema = createSelectSchema(skills);

// Update schema (exclude id, resumeId, createdAt)
export const updateSkillSchema = insertSkillSchema.omit({ 
  id: true, 
  resumeId: true,
  createdAt: true 
}).partial().extend({
  updatedAt: z.date().optional(),
});

// Export schema types for services
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type UpdateSkill = z.infer<typeof updateSkillSchema>;
export type SkillLevel = typeof skillLevels[number];
export type SkillCategory = typeof skillCategories[number];