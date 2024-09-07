CREATE TABLE IF NOT EXISTS "accommodation_proofs" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"status" varchar(256) NOT NULL,
	"submission_date" date NOT NULL,
	"accommodation_details" text,
	"accommodation_type" varchar(256),
	"verification_status" varchar(256),
	"remarks" text,
	"visa_application_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"type_of_event" varchar(256) NOT NULL,
	"event_date" date NOT NULL,
	"completion_date" date,
	"is_complete" boolean NOT NULL,
	"info" text,
	"hub_id" varchar(256) NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "financial_proofs" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"status" varchar(256) NOT NULL,
	"submission_date" date NOT NULL,
	"document_links" text,
	"declared_amount" integer NOT NULL,
	"verification_status" boolean NOT NULL,
	"remarks" text NOT NULL,
	"visa_application_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_clearance_info" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"status" varchar(256) NOT NULL,
	"clearance_date" date NOT NULL,
	"health_facility_name" varchar(256) NOT NULL,
	"medical_report" text NOT NULL,
	"health_conditions" text NOT NULL,
	"visa_application_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hubs" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"type_of_hub" varchar(256) NOT NULL,
	"public" boolean NOT NULL,
	"info" text,
	"state_id" varchar(256) NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "regions" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"public" boolean NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "work_contract_proofs" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"status" varchar(256) NOT NULL,
	"submission_date" date NOT NULL,
	"document_links" text,
	"employer_details" text,
	"contract_details" text,
	"verification_status" varchar(256),
	"remarks" text,
	"visa_application_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visa_applications" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"status" varchar(256) NOT NULL,
	"approved_at" date NOT NULL,
	"expiry" timestamp,
	"application_type" varchar(256) NOT NULL,
	"is_renewal" boolean,
	"application_date" date NOT NULL,
	"health_clearance_status" boolean,
	"financial_proof_status" varchar(256),
	"work_contract_status" boolean,
	"region_id" varchar(256) NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "states" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"capital_city" varchar(256) NOT NULL,
	"population" integer NOT NULL,
	"approved_at" date,
	"region_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"content" text NOT NULL,
	"rating" integer NOT NULL,
	"photo_url" varchar(256),
	"hub_id" varchar(256) NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accommodation_proofs" ADD CONSTRAINT "accommodation_proofs_visa_application_id_visa_applications_id_fk" FOREIGN KEY ("visa_application_id") REFERENCES "public"."visa_applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_hub_id_hubs_id_fk" FOREIGN KEY ("hub_id") REFERENCES "public"."hubs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "financial_proofs" ADD CONSTRAINT "financial_proofs_visa_application_id_visa_applications_id_fk" FOREIGN KEY ("visa_application_id") REFERENCES "public"."visa_applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_clearance_info" ADD CONSTRAINT "health_clearance_info_visa_application_id_visa_applications_id_fk" FOREIGN KEY ("visa_application_id") REFERENCES "public"."visa_applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hubs" ADD CONSTRAINT "hubs_state_id_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_contract_proofs" ADD CONSTRAINT "work_contract_proofs_visa_application_id_visa_applications_id_fk" FOREIGN KEY ("visa_application_id") REFERENCES "public"."visa_applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "visa_applications" ADD CONSTRAINT "visa_applications_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "states" ADD CONSTRAINT "states_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_hub_id_hubs_id_fk" FOREIGN KEY ("hub_id") REFERENCES "public"."hubs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
