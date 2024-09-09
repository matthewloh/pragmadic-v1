CREATE TABLE IF NOT EXISTS "hub_owner_profiles" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"company_name" varchar(256),
	"business_registration_number" varchar(256),
	"bio" text NOT NULL,
	"business_contact_no" varchar(256) NOT NULL,
	"business_email" varchar(256) NOT NULL,
	"business_location" varchar(256) NOT NULL,
	"residing_location" varchar(256) NOT NULL,
	"social_media_handles" text,
	"website_url" varchar(256),
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hub_owner_profiles" ADD CONSTRAINT "hub_owner_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
