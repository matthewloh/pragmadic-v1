ALTER TABLE "derantau_admin_profile" ADD CONSTRAINT "derantau_admin_profile_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
ALTER TABLE "hub_owner_profiles" ADD CONSTRAINT "hub_owner_profiles_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
ALTER TABLE "nomad_profile" ADD CONSTRAINT "nomad_profile_user_id_unique" UNIQUE("user_id");