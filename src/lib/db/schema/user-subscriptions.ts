import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { profiles } from "./profiles";
import { creditPackages } from "./credit-packages";

// User subscriptions table - tracks active user subscriptions
export const userSubscriptions = pgTable("user_subscriptions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => profiles.id, {
        onDelete: "cascade",
    }).notNull(),
    creditPackageId: uuid("credit_package_id").references(
        () => creditPackages.id,
        { onDelete: "cascade" },
    ).notNull(),
    stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(), // Stripe subscription ID
    status: text("status").$type<
        | "active"
        | "canceled"
        | "past_due"
        | "incomplete"
        | "incomplete_expired"
        | "trialing"
        | "unpaid"
    >().notNull(),
    currentPeriodStart: timestamp("current_period_start", {
        withTimezone: true,
    }).notNull(),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true })
        .notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
        .notNull(),
});

// Infer types from the schema
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type NewUserSubscription = typeof userSubscriptions.$inferInsert;

// Zod schemas for validation
export const insertUserSubscriptionSchema = createInsertSchema(
    userSubscriptions,
    {
        userId: z.string().uuid("Invalid user ID"),
        creditPackageId: z.string().uuid("Invalid credit package ID"),
        stripeSubscriptionId: z.string().min(
            1,
            "Stripe subscription ID is required",
        ),
        status: z.enum([
            "active",
            "canceled",
            "past_due",
            "incomplete",
            "incomplete_expired",
            "trialing",
            "unpaid",
        ]),
        currentPeriodStart: z.date(),
        currentPeriodEnd: z.date(),
        cancelAtPeriodEnd: z.boolean().default(false),
        canceledAt: z.date().optional(),
    },
);

export const selectUserSubscriptionSchema = createSelectSchema(
    userSubscriptions,
);

// Partial update schema
export const updateUserSubscriptionSchema = insertUserSubscriptionSchema.omit({
    id: true,
    createdAt: true,
}).partial().extend({
    updatedAt: z.date().optional(),
});

// Export schema types for type inference in services
export type InsertUserSubscription = z.infer<
    typeof insertUserSubscriptionSchema
>;
export type UpdateUserSubscription = z.infer<
    typeof updateUserSubscriptionSchema
>;
