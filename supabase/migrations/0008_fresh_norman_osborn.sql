ALTER TABLE "profile" DROP CONSTRAINT "profile_user_id_unique";--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "profile_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "id" SET DATA TYPE varchar(191);--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "website" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "website" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "contact_number" varchar(256);--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "social_links" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
