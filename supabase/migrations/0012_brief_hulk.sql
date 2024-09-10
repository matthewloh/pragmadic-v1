DO $$ BEGIN
 CREATE TYPE "public"."invite_role_type" AS ENUM('admin', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."invite_status" AS ENUM('pending', 'accepted', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_communities" (
	"user_id" uuid NOT NULL,
	"community_id" varchar(191) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"pending" "invite_status",
	"member" "invite_role_type",
	CONSTRAINT "users_to_communities_user_id_community_id_pk" PRIMARY KEY("user_id","community_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_communities" ADD CONSTRAINT "users_to_communities_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_communities" ADD CONSTRAINT "users_to_communities_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
