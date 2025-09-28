import { pgTable, uuid, text, integer, timestamp, json } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { interviewSessions } from './interview-sessions';

const questionTypes = ['technical', 'behavioral', 'situational', 'company_specific'] as const;
const difficultyLevels = ['entry', 'mid', 'senior', 'expert'] as const;

export const interviewQuestions = pgTable('interview_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => interviewSessions.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  type: text('type').$type<typeof questionTypes[number]>().notNull(),
  difficulty: text('difficulty').$type<typeof difficultyLevels[number]>().notNull(),
  context: text('context'), // Additional context for the question
  expectedAnswerPoints: json('expected_answer_points').$type<string[]>(), // Array of expected points
  timeLimit: integer('time_limit'), // Time limit in seconds
  order: integer('order').notNull(), // Question order in session
  askedAt: timestamp('asked_at', { withTimezone: true }),
  answeredAt: timestamp('answered_at', { withTimezone: true }),
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
  context: z.string().optional(),
  expectedAnswerPoints: z.array(z.string()).optional(),
  timeLimit: z.number().min(30).max(1800).optional(), // 30 seconds to 30 minutes
  order: z.number().min(1),
});

export const selectInterviewQuestionSchema = createSelectSchema(interviewQuestions);

export type InsertInterviewQuestion = z.infer<typeof insertInterviewQuestionSchema>;
export type QuestionType = typeof questionTypes[number];
export type QuestionDifficultyLevel = typeof difficultyLevels[number];