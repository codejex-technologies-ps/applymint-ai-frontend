import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { profiles } from './profiles';

const notificationTypes = ['JOB_MATCH', 'APPLICATION_UPDATE', 'INTERVIEW_REMINDER', 'SYSTEM'] as const;

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  type: text('type').$type<typeof notificationTypes[number]>().notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  actionUrl: text('action_url'),
  metadata: text('metadata'), // JSON string for additional data
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(profiles, {
    fields: [notifications.userId],
    references: [profiles.id],
  }),
}));

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

export const insertNotificationSchema = createInsertSchema(notifications, {
  type: z.enum(notificationTypes),
  title: z.string().min(1, 'Title is required').max(255),
  message: z.string().min(1, 'Message is required'),
  actionUrl: z.string().url('Invalid action URL').optional(),
  metadata: z.string().optional(),
});

export const selectNotificationSchema = createSelectSchema(notifications);
export const updateNotificationSchema = insertNotificationSchema.omit({ 
  id: true, 
  userId: true,
  createdAt: true 
}).partial();

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type UpdateNotification = z.infer<typeof updateNotificationSchema>;
export type NotificationType = typeof notificationTypes[number];