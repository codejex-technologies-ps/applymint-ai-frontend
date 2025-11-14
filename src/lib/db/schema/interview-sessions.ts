import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { profiles } from './profiles';

const interviewModes = ['text', 'voice'] as const;
const sessionStatuses = ['pending', 'active', 'paused', 'completed', 'cancelled'] as const;
const difficultyLevels = ['entry', 'mid', 'senior', 'expert'] as const;

export const interviewSessions = pgTable('interview_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  mode: text('mode').$type<typeof interviewModes[number]>().notNull(),
  status: text('status').$type<typeof sessionStatuses[number]>().default('pending').notNull(),
  jobRole: text('job_role').notNull(),
  company: text('company'),
  difficulty: text('difficulty').$type<typeof difficultyLevels[number]>().notNull(),
  duration: integer('duration').notNull(), // Duration in minutes
  currentQuestionIndex: integer('current_question_index').default(0).notNull(),
  totalQuestions: integer('total_questions').default(5).notNull(),
  overallScore: integer('overall_score'), // Final overall score (1-10)
  
  // Session timing
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  
  // Configuration
  customInstructions: text('custom_instructions'),
  questionTypes: text('question_types'), // JSON array of question types
});

// New table for conversation messages
export const interviewMessages = pgTable('interview_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => interviewSessions.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'ai' | 'user'
  content: text('content').notNull(),
  questionId: uuid('question_id'), // Reference to question if this is a question message
  audioUrl: text('audio_url'), // For voice messages
  transcription: text('transcription'), // For voice messages
  messageIndex: integer('message_index').notNull(), // Order in conversation
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const interviewSessionsRelations = relations(interviewSessions, ({ one, many }) => ({
  user: one(profiles, {
    fields: [interviewSessions.userId],
    references: [profiles.id],
  }),
  messages: many(interviewMessages),
}));

export const interviewMessagesRelations = relations(interviewMessages, ({ one }) => ({
  session: one(interviewSessions, {
    fields: [interviewMessages.sessionId],
    references: [interviewSessions.id],
  }),
}));

export type InterviewSession = typeof interviewSessions.$inferSelect;
export type NewInterviewSession = typeof interviewSessions.$inferInsert;
export type InterviewMessage = typeof interviewMessages.$inferSelect;
export type NewInterviewMessage = typeof interviewMessages.$inferInsert;

export const insertInterviewSessionSchema = createInsertSchema(interviewSessions, {
  title: z.string().min(1, 'Session title is required').max(255),
  mode: z.enum(interviewModes),
  status: z.enum(sessionStatuses),
  jobRole: z.string().min(1, 'Job role is required'),
  company: z.string().optional(),
  difficulty: z.enum(difficultyLevels),
  duration: z.number().min(15).max(120), // 15-120 minutes
  totalQuestions: z.number().min(1).max(20),
  overallScore: z.number().min(1).max(10).optional(),
  customInstructions: z.string().optional(),
  questionTypes: z.string().optional(), // JSON string
});

export const insertInterviewMessageSchema = createInsertSchema(interviewMessages, {
  type: z.enum(['ai', 'user']),
  content: z.string().min(1),
  audioUrl: z.string().url().optional(),
  transcription: z.string().optional(),
  messageIndex: z.number().min(0),
});

export const selectInterviewSessionSchema = createSelectSchema(interviewSessions);
export const selectInterviewMessageSchema = createSelectSchema(interviewMessages);

export type InsertInterviewSession = z.infer<typeof insertInterviewSessionSchema>;
export type InsertInterviewMessage = z.infer<typeof insertInterviewMessageSchema>;
export type InterviewMode = typeof interviewModes[number];
export type SessionStatus = typeof sessionStatuses[number];
export type DifficultyLevel = typeof difficultyLevels[number];