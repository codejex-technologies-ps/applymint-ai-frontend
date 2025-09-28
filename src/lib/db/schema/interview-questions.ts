import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { interviewSessions } from './interview-sessions';

const questionTypes = ['BEHAVIORAL', 'TECHNICAL', 'SITUATIONAL', 'GENERAL'] as const;
const difficultyLevels = ['EASY', 'MEDIUM', 'HARD'] as const;

export const interviewQuestions = pgTable('interview_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => interviewSessions.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  type: text('type').$type<typeof questionTypes[number]>().notNull(),
  difficulty: text('difficulty').$type<typeof difficultyLevels[number]>().notNull(),
  expectedAnswer: text('expected_answer'), // AI-generated ideal answer
  timeLimit: integer('time_limit'), // Time limit in seconds
  order: integer('order').notNull(), // Question order in session
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const interviewQuestionsRelations = relations(interviewQuestions, ({ one }) => ({
  session: one(interviewSessions, {
    fields: [interviewQuestions.sessionId],
    references: [interviewSessions.id],
  }),
}));

export type InterviewQuestion = typeof interviewQuestions.$inferSelect;
export type NewInterviewQuestion = typeof interviewQuestions.$inferInsert;

export const insertInterviewQuestionSchema = createInsertSchema(interviewQuestions, {
  question: z.string().min(1, 'Question is required'),
  type: z.enum(questionTypes),
  difficulty: z.enum(difficultyLevels),
  expectedAnswer: z.string().optional(),
  timeLimit: z.number().min(30).max(1800).optional(), // 30 seconds to 30 minutes
  order: z.number().min(1),
});

export const selectInterviewQuestionSchema = createSelectSchema(interviewQuestions);
export const updateInterviewQuestionSchema = insertInterviewQuestionSchema.omit({ 
  id: true, 
  sessionId: true,
  createdAt: true 
}).partial();

export type InsertInterviewQuestion = z.infer<typeof insertInterviewQuestionSchema>;
export type UpdateInterviewQuestion = z.infer<typeof updateInterviewQuestionSchema>;
export type QuestionType = typeof questionTypes[number];
export type DifficultyLevel = typeof difficultyLevels[number];