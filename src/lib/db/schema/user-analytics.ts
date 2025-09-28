import { pgTable, uuid, text, timestamp, date } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { profiles } from './profiles';

const eventTypes = [
  'LOGIN',
  'LOGOUT',
  'JOB_VIEW',
  'JOB_APPLY',
  'JOB_SAVE',
  'PROFILE_UPDATE',
  'RESUME_UPLOAD',
  'INTERVIEW_PRACTICE',
  'SEARCH_PERFORMED'
] as const;

export const userAnalytics = pgTable('user_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  eventType: text('event_type').$type<typeof eventTypes[number]>().notNull(),
  eventData: text('event_data'), // JSON string for event-specific data
  sessionId: text('session_id'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  pageUrl: text('page_url'),
  date: date('date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userAnalyticsRelations = relations(userAnalytics, ({ one }) => ({
  user: one(profiles, {
    fields: [userAnalytics.userId],
    references: [profiles.id],
  }),
}));

export type UserAnalytic = typeof userAnalytics.$inferSelect;
export type NewUserAnalytic = typeof userAnalytics.$inferInsert;

export const insertUserAnalyticSchema = createInsertSchema(userAnalytics, {
  eventType: z.enum(eventTypes),
  eventData: z.string().optional(),
  sessionId: z.string().max(255).optional(),
  ipAddress: z.string().max(45).optional(), // IPv6 max length
  userAgent: z.string().max(500).optional(),
  referrer: z.string().url().optional(),
  pageUrl: z.string().url().optional(),
  date: z.date(),
});

export const selectUserAnalyticSchema = createSelectSchema(userAnalytics);

export type InsertUserAnalytic = z.infer<typeof insertUserAnalyticSchema>;
export type EventType = typeof eventTypes[number];