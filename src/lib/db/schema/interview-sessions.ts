import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { profiles } from './profiles';

const sessionTypes = ['PRACTICE', 'MOCK_INTERVIEW', 'SKILL_ASSESSMENT'] as const;
const sessionStatuses = ['ACTIVE', 'COMPLETED', 'CANCELLED'] as const;

export const interviewSessions = pgTable('interview_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  type: text('type').$type<typeof sessionTypes[number]>().notNull(),
  status: text('status').$type<typeof sessionStatuses[number]>().default('ACTIVE').notNull(),
  duration: integer('duration'), // Duration in minutes
  score: integer('score'), // Overall performance score
  feedback: text('feedback'),
  metadata: text('metadata'), // JSON string for additional data
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const interviewSessionsRelations = relations(interviewSessions, ({ one }) => ({
  user: one(profiles, {
    fields: [interviewSessions.userId],
    references: [profiles.id],
  }),
}));

export type InterviewSession = typeof interviewSessions.$inferSelect;
export type NewInterviewSession = typeof interviewSessions.$inferInsert;

export const insertInterviewSessionSchema = createInsertSchema(interviewSessions, {
  title: z.string().min(1, 'Session title is required').max(255),
  type: z.enum(sessionTypes),
  status: z.enum(sessionStatuses),
  duration: z.number().min(1).max(300).optional(), // 1-300 minutes
  score: z.number().min(0).max(100).optional(), // 0-100 score
  feedback: z.string().max(5000).optional(),
  metadata: z.string().optional(),
});

export const selectInterviewSessionSchema = createSelectSchema(interviewSessions);
export const updateInterviewSessionSchema = insertInterviewSessionSchema.omit({ 
  id: true, 
  userId: true,
  createdAt: true 
}).partial().extend({
  updatedAt: z.date().optional(),
});

export type InsertInterviewSession = z.infer<typeof insertInterviewSessionSchema>;
export type UpdateInterviewSession = z.infer<typeof updateInterviewSessionSchema>;
export type SessionType = typeof sessionTypes[number];
export type SessionStatus = typeof sessionStatuses[number];