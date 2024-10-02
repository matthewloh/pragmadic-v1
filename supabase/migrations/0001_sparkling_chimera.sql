DO $$ BEGIN
 CREATE TYPE "public"."user_community_permissions" AS ENUM('admin.invite', 'admin.remove', 'admin.ban', 'admin.edit', 'member.invite', 'member.remove', 'member.ban', 'member.edit');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_app_permissions" AS ENUM('hubs.create', 'hubs.delete', 'hubs.posts.create', 'communities.posts.create');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role_permissions" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"role" "user_role" NOT NULL,
	"permission" "user_app_permissions" NOT NULL,
	CONSTRAINT "role_permissions_role_permission_unique" UNIQUE("role","permission")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_roles" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "user_role" NOT NULL,
	CONSTRAINT "user_roles_user_id_role_unique" UNIQUE("user_id","role")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
