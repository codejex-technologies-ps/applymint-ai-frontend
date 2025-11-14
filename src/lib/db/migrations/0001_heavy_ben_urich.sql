CREATE TABLE "credit_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"credits" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"package_type" text NOT NULL,
	"billing_interval" text,
	"stripe_price_id" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credit_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"transaction_type" text NOT NULL,
	"amount" integer NOT NULL,
	"balance_before" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"credit_package_id" uuid,
	"stripe_payment_intent_id" text,
	"price" numeric(10, 2),
	"feature_type" text,
	"feature_id" text,
	"description" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feature_credit_costs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feature_type" text NOT NULL,
	"feature_name" text NOT NULL,
	"credit_cost" integer NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "feature_credit_costs_feature_type_unique" UNIQUE("feature_type")
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"credit_package_id" uuid NOT NULL,
	"stripe_subscription_id" text NOT NULL,
	"status" text NOT NULL,
	"current_period_start" timestamp with time zone NOT NULL,
	"current_period_end" timestamp with time zone NOT NULL,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"canceled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "credit" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_credit_package_id_credit_packages_id_fk" FOREIGN KEY ("credit_package_id") REFERENCES "public"."credit_packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
INSERT INTO "feature_credit_costs" ("feature_type", "feature_name", "credit_cost", "description") VALUES
('resume_optimization', 'Resume Optimization', 2, 'AI-powered resume optimization for a specific job'),
('interview_scheduling', 'Interview Scheduling', 3, 'Schedule and prepare for job interviews'),
('ai_matching', 'AI Job Matching', 1, 'Advanced AI job matching with personalized insights');--> statement-breakpoint
INSERT INTO "credit_packages" ("name", "description", "credits", "price", "package_type", "billing_interval", "is_active", "sort_order") VALUES
('Starter Pack', 'Get started with 10 credits', 10, 4.99, 'one_time', NULL, true, 1),
('Pro Pack', 'Power up with 25 credits', 25, 9.99, 'one_time', NULL, true, 2),
('Monthly Pro', '25 credits every month', 25, 14.99, 'subscription', 'monthly', true, 3),
('Yearly Pro', '25 credits every month, billed annually', 300, 149.99, 'subscription', 'yearly', true, 4);