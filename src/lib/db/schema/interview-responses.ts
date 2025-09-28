import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { interviewQuestions } from './interview-questions';

export const interviewResponses = pgTable('interview_responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  questionId: uuid('question_id').notNull().references(() => interviewQuestions.id, { onDelete: 'cascade' }),
  response: text('response').notNull(),
  responseTime: integer('response_time'), // Time taken in seconds
  score: integer('score'), // AI-generated score for the response
  feedback: text('feedback'), // AI-generated feedback
  audioUrl: text('audio_url'), // URL to recorded audio response
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const interviewResponsesRelations = relations(interviewResponses, ({ one }) => ({
  question: one(interviewQuestions, {
    fields: [interviewResponses.questionId],
    references: [interviewQuestions.id],
  }),
}));

export type InterviewResponse = typeof interviewResponses.$inferSelect;
export type NewInterviewResponse = typeof interviewResponses.$inferInsert;

export const insertInterviewResponseSchema = createInsertSchema(interviewResponses, {
  response: z.string().min(1, 'Response is required'),
  responseTime: z.number().min(1).optional(),
  score: z.number().min(0).max(100).optional(),
  feedback: z.string().max(2000).optional(),
  audioUrl: z.string().url('Invalid audio URL').optional(),
});

export const selectInterviewResponseSchema = createSelectSchema(interviewResponses);
export const updateInterviewResponseSchema = insertInterviewResponseSchema.omit({ 
  id: true, 
  questionId: true,
  createdAt: true 
}).partial();

export type InsertInterviewResponse = z.infer<typeof insertInterviewResponseSchema>;
export type UpdateInterviewResponse = z.infer<typeof updateInterviewResponseSchema>;