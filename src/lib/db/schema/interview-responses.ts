import { pgTable, uuid, text, integer, timestamp, json } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { interviewQuestions } from './interview-questions';

export const interviewResponses = pgTable('interview_responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  questionId: uuid('question_id').notNull().references(() => interviewQuestions.id, { onDelete: 'cascade' }),
  answer: text('answer').notNull(), // User's response text
  audioUrl: text('audio_url'), // URL to recorded audio response
  transcription: text('transcription'), // Transcription of audio response
  duration: integer('duration').notNull(), // Response time in seconds
  
  // AI Feedback scores (1-10 scale)
  communicationScore: integer('communication_score'),
  technicalScore: integer('technical_score'),
  completenessScore: integer('completeness_score'),
  overallScore: integer('overall_score'),
  
  // Detailed feedback
  strengths: json('strengths').$type<string[]>(), // Array of strength points
  weaknesses: json('weaknesses').$type<string[]>(), // Array of improvement areas
  suggestions: json('suggestions').$type<string[]>(), // Array of suggestions
  improvedAnswer: text('improved_answer'), // AI-suggested better answer
  
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
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
  answer: z.string().min(1, 'Response is required'),
  audioUrl: z.string().url('Invalid audio URL').optional(),
  transcription: z.string().optional(),
  duration: z.number().min(1),
  communicationScore: z.number().min(1).max(10).optional(),
  technicalScore: z.number().min(1).max(10).optional(),
  completenessScore: z.number().min(1).max(10).optional(),
  overallScore: z.number().min(1).max(10).optional(),
  strengths: z.array(z.string()).optional(),
  weaknesses: z.array(z.string()).optional(),
  suggestions: z.array(z.string()).optional(),
  improvedAnswer: z.string().optional(),
});

export const selectInterviewResponseSchema = createSelectSchema(interviewResponses);

export type InsertInterviewResponse = z.infer<typeof insertInterviewResponseSchema>;