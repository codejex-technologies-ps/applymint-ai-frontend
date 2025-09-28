import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { resumes } from './resumes';

const proficiencyLevels = ['BASIC', 'CONVERSATIONAL', 'FLUENT', 'NATIVE'] as const;

export const languages = pgTable('languages', {
  id: uuid('id').primaryKey().defaultRandom(),
  resumeId: uuid('resume_id').notNull().references(() => resumes.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  proficiency: text('proficiency').$type<typeof proficiencyLevels[number]>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const languagesRelations = relations(languages, ({ one }) => ({
  resume: one(resumes, {
    fields: [languages.resumeId],
    references: [resumes.id],
  }),
}));

export type Language = typeof languages.$inferSelect;
export type NewLanguage = typeof languages.$inferInsert;

export const insertLanguageSchema = createInsertSchema(languages, {
  name: z.string().min(1, 'Language name is required').max(100),
  proficiency: z.enum(proficiencyLevels),
});

export const selectLanguageSchema = createSelectSchema(languages);
export const updateLanguageSchema = insertLanguageSchema.omit({ 
  id: true, 
  resumeId: true,
  createdAt: true 
}).partial().extend({
  updatedAt: z.date().optional(),
});

export type InsertLanguage = z.infer<typeof insertLanguageSchema>;
export type UpdateLanguage = z.infer<typeof updateLanguageSchema>;
export type ProficiencyLevel = typeof proficiencyLevels[number];