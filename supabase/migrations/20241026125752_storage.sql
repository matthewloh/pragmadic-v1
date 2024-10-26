alter table "auth"."mfa_factors"
drop constraint "mfa_factors_phone_key";

drop index if exists "auth"."mfa_factors_phone_key";

drop index if exists "auth"."unique_verified_phone_factor";

alter table "auth"."mfa_challenges"
add column "web_authn_session_data" jsonb;

alter table "auth"."mfa_factors"
add column "web_authn_aaguid" uuid;

alter table "auth"."mfa_factors"
add column "web_authn_credential" jsonb;

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);

CREATE TRIGGER create_user_on_signup
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE FUNCTION handle_new_user ();