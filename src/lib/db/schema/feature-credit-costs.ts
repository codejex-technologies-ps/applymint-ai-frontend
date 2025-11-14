import {
    boolean,
    integer,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Feature credit costs table - defines credit costs for different features
export const featureCreditCosts = pgTable("feature_credit_costs", {
    id: uuid("id").primaryKey().defaultRandom(),
    featureType: text("feature_type").$type<
        "resume_optimization" | "interview_scheduling" | "ai_matching"
    >().notNull().unique(),
    featureName: text("feature_name").notNull(), // Human-readable name
    creditCost: integer("credit_cost").notNull(), // Credits required for this feature
    description: text("description"), // Description of what the feature does
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
        .notNull(),
});

// Infer types from the schema
export type FeatureCreditCost = typeof featureCreditCosts.$inferSelect;
export type NewFeatureCreditCost = typeof featureCreditCosts.$inferInsert;

// Zod schemas for validation
export const insertFeatureCreditCostSchema = createInsertSchema(
    featureCreditCosts,
    {
        featureType: z.enum([
            "resume_optimization",
            "interview_scheduling",
            "ai_matching",
        ]),
        featureName: z.string().min(1, "Feature name is required").max(
            100,
            "Feature name must be less than 100 characters",
        ),
        creditCost: z.number().int().min(1, "Credit cost must be at least 1"),
        description: z.string().max(
            500,
            "Description must be less than 500 characters",
        ).optional(),
        isActive: z.boolean().default(true),
    },
);

export const selectFeatureCreditCostSchema = createSelectSchema(
    featureCreditCosts,
);

// Partial update schema
export const updateFeatureCreditCostSchema = insertFeatureCreditCostSchema.omit(
    {
        id: true,
        createdAt: true,
    },
).partial().extend({
    updatedAt: z.date().optional(),
});

// Export schema types for type inference in services
export type InsertFeatureCreditCost = z.infer<
    typeof insertFeatureCreditCostSchema
>;
export type UpdateFeatureCreditCost = z.infer<
    typeof updateFeatureCreditCostSchema
>;
