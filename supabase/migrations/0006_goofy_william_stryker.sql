CREATE TABLE IF NOT EXISTS "derantau_admin_profile" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"department" varchar(256) NOT NULL,
	"position" varchar(256) NOT NULL,
	"admin_level" varchar(256) NOT NULL,
	"region_id" varchar(256) NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nomad_profile" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"bio" text,
	"skills" text,
	"interests" text,
	"current_location" varchar(256),
	"contact_information" text,
	"user_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "derantau_admin_profile" ADD CONSTRAINT "derantau_admin_profile_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "derantau_admin_profile" ADD CONSTRAINT "derantau_admin_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nomad_profile" ADD CONSTRAINT "nomad_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
