import { pgTable, uuid, text, boolean, numeric, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { profiles } from './profiles';

const frequencies = ['INSTANT', 'DAILY', 'WEEKLY'] as const;

export const jobAlerts = pgTable('job_alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  keywords: text('keywords').array(),
  location: text('location'),
  jobTypes: text('job_types').array(),
  salaryMin: numeric('salary_min'),
  salaryMax: numeric('salary_max'),
  isRemote: boolean('is_remote'),
  frequency: text('frequency').$type<typeof frequencies[number]>().default('DAILY').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  lastSent: timestamp('last_sent', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const jobAlertsRelations = relations(jobAlerts, ({ one }) => ({
  user: one(profiles, {
    fields: [jobAlerts.userId],
    references: [profiles.id],
  }),
}));

export type JobAlert = typeof jobAlerts.$inferSelect;
export type NewJobAlert = typeof jobAlerts.$inferInsert;

export const insertJobAlertSchema = createInsertSchema(jobAlerts, {
  name: z.string().min(1, 'Alert name is required').max(255),
  keywords: z.array(z.string().min(1)).optional(),
  location: z.string().max(255).optional(),
  jobTypes: z.array(z.string()).optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  frequency: z.enum(frequencies),
});

export const selectJobAlertSchema = createSelectSchema(jobAlerts);
export const updateJobAlertSchema = insertJobAlertSchema.omit({ 
  id: true, 
  userId: true,
  createdAt: true 
}).partial().extend({
  updatedAt: z.date().optional(),
});

export type InsertJobAlert = z.infer<typeof insertJobAlertSchema>;
export type UpdateJobAlert = z.infer<typeof updateJobAlertSchema>;
export type AlertFrequency = typeof frequencies[number];