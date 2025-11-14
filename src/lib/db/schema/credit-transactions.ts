import {
    integer,
    jsonb,
    numeric,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { profiles } from "./profiles";

// Credit transactions table - tracks all credit purchases and usage
export const creditTransactions = pgTable("credit_transactions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => profiles.id, {
        onDelete: "cascade",
    }).notNull(),
    transactionType: text("transaction_type").$type<
        "purchase" | "usage" | "refund" | "bonus"
    >().notNull(),
    amount: integer("amount").notNull(), // Positive for credits added, negative for credits used
    balanceBefore: integer("balance_before").notNull(), // Credit balance before transaction
    balanceAfter: integer("balance_after").notNull(), // Credit balance after transaction

    // Purchase details
    creditPackageId: uuid("credit_package_id"), // References credit_packages for purchases
    stripePaymentIntentId: text("stripe_payment_intent_id"), // Stripe payment intent ID
    price: numeric("price", { precision: 10, scale: 2 }), // Price paid (for purchases)

    // Usage details
    featureType: text("feature_type").$type<
        "resume_optimization" | "interview_scheduling" | "ai_matching" | null
    >(), // What feature was used
    featureId: text("feature_id"), // ID of the specific feature usage (e.g., job_id, resume_id)

    // Additional metadata
    description: text("description").notNull(), // Human-readable description
    metadata: jsonb("metadata"), // Additional transaction data

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
        .notNull(),
});

// Infer types from the schema
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type NewCreditTransaction = typeof creditTransactions.$inferInsert;

// Zod schemas for validation
export const insertCreditTransactionSchema = createInsertSchema(
    creditTransactions,
    {
        userId: z.uuid("Invalid user ID"),
        transactionType: z.enum(["purchase", "usage", "refund", "bonus"]),
        amount: z.number().int(),
        balanceBefore: z.number().int().min(0),
        balanceAfter: z.number().int().min(0),
        creditPackageId: z.string().uuid().optional(),
        stripePaymentIntentId: z.string().optional(),
        price: z.number().min(0).optional(),
        featureType: z.enum([
            "resume_optimization",
            "interview_scheduling",
            "ai_matching",
        ]).nullable(),
        featureId: z.string().optional(),
        description: z.string().min(1, "Description is required").max(
            500,
            "Description must be less than 500 characters",
        ),
        metadata: z.any().optional(),
    },
);

export const selectCreditTransactionSchema = createSelectSchema(
    creditTransactions,
);

// Export schema types for type inference in services
export type InsertCreditTransaction = z.infer<
    typeof insertCreditTransactionSchema
>;
