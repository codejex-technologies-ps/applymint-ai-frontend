import {
    boolean,
    integer,
    numeric,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Credit packages table - defines subscription tiers and one-time purchases
export const creditPackages = pgTable("credit_packages", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(), // e.g., "Starter Pack", "Pro Monthly"
    description: text("description"),
    credits: integer("credits").notNull(), // Number of credits included
    price: numeric("price", { precision: 10, scale: 2 }).notNull(), // Price in USD
    currency: text("currency").default("USD").notNull(),
    packageType: text("package_type").$type<"one_time" | "subscription">()
        .notNull(), // one_time or subscription
    billingInterval: text("billing_interval").$type<
        "monthly" | "yearly" | null
    >(), // For subscriptions
    stripePriceId: text("stripe_price_id"), // Stripe price ID for billing
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(), // For display ordering
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
        .notNull(),
});

// Infer types from the schema
export type CreditPackage = typeof creditPackages.$inferSelect;
export type NewCreditPackage = typeof creditPackages.$inferInsert;

// Zod schemas for validation
export const insertCreditPackageSchema = createInsertSchema(creditPackages, {
    name: z.string().min(1, "Package name is required").max(
        100,
        "Package name must be less than 100 characters",
    ),
    description: z.string().max(
        500,
        "Description must be less than 500 characters",
    ).optional(),
    credits: z.number().int().min(1, "Credits must be at least 1"),
    price: z.number().min(0, "Price cannot be negative"),
    currency: z.string().length(3, "Currency must be 3 characters").default(
        "USD",
    ),
    packageType: z.enum(["one_time", "subscription"]),
    billingInterval: z.enum(["monthly", "yearly"]).nullable(),
    stripePriceId: z.string().optional(),
    isActive: z.boolean().default(true),
    sortOrder: z.number().int().default(0),
});

export const selectCreditPackageSchema = createSelectSchema(creditPackages);

// Partial update schema
export const updateCreditPackageSchema = insertCreditPackageSchema.omit({
    id: true,
    createdAt: true,
}).partial().extend({
    updatedAt: z.date().optional(),
});

// Export schema types for type inference in services
export type InsertCreditPackage = z.infer<typeof insertCreditPackageSchema>;
export type UpdateCreditPackage = z.infer<typeof updateCreditPackageSchema>;
