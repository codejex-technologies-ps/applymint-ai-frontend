import { pgTable, uuid, text, date, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { resumes } from './resumes';

// Certifications table
export const certifications = pgTable('certifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  resumeId: uuid('resume_id').notNull().references(() => resumes.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  issuer: text('issuer').notNull(),
  issueDate: date('issue_date').notNull(),
  expiryDate: date('expiry_date'),
  credentialId: text('credential_id'),
  credentialUrl: text('credential_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const certificationsRelations = relations(certifications, ({ one }) => ({
  resume: one(resumes, {
    fields: [certifications.resumeId],
    references: [resumes.id],
  }),
}));

// Infer types
export type Certification = typeof certifications.$inferSelect;
export type NewCertification = typeof certifications.$inferInsert;

// Validation schemas
export const insertCertificationSchema = createInsertSchema(certifications, {
  name: z.string().min(1, 'Certification name is required').max(255),
  issuer: z.string().min(1, 'Issuer is required').max(255),
  issueDate: z.date(),
  expiryDate: z.date().optional(),
  credentialId: z.string().max(100).optional(),
  credentialUrl: z.string().url('Invalid credential URL').optional(),
});

export const selectCertificationSchema = createSelectSchema(certifications);
export const updateCertificationSchema = insertCertificationSchema.omit({ 
  id: true, 
  resumeId: true,
  createdAt: true 
}).partial().extend({
  updatedAt: z.date().optional(),
});

export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type UpdateCertification = z.infer<typeof updateCertificationSchema>;