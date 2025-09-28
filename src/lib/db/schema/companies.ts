import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Company sizes enum
const companySizes = ['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE'] as const;

// Companies table
export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  website: text('website'),
  logoUrl: text('logo_url'),
  industry: text('industry'),
  size: text('size').$type<typeof companySizes[number]>(),
  location: text('location'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Infer types from the schema
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;

// Zod schemas for validation
export const insertCompanySchema = createInsertSchema(companies, {
  name: z.string().min(1, 'Company name is required').max(255, 'Company name must be less than 255 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  website: z.string().url('Invalid website URL').optional(),
  logoUrl: z.string().url('Invalid logo URL').optional(),
  industry: z.string().max(100, 'Industry must be less than 100 characters').optional(),
  size: z.enum(companySizes).optional(),
  location: z.string().max(255, 'Location must be less than 255 characters').optional(),
});

export const selectCompanySchema = createSelectSchema(companies);

// Update schema (exclude id, createdAt)
export const updateCompanySchema = insertCompanySchema.omit({ 
  id: true, 
  createdAt: true 
}).partial().extend({
  updatedAt: z.date().optional(),
});

// Export schema types for services
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type UpdateCompany = z.infer<typeof updateCompanySchema>;
export type CompanySize = typeof companySizes[number];