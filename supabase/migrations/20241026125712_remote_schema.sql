create schema if not exists "drizzle";

create sequence "drizzle"."__drizzle_migrations_id_seq";

create table
  "drizzle"."__drizzle_migrations" (
    "id" integer not null default nextval('drizzle.__drizzle_migrations_id_seq'::regclass),
    "hash" text not null,
    "created_at" bigint
  );

alter sequence "drizzle"."__drizzle_migrations_id_seq" owned by "drizzle"."__drizzle_migrations"."id";

CREATE UNIQUE INDEX __drizzle_migrations_pkey ON drizzle.__drizzle_migrations USING btree (id);

alter table "drizzle"."__drizzle_migrations"
add constraint "__drizzle_migrations_pkey" PRIMARY KEY using index "__drizzle_migrations_pkey";

set
  check_function_bodies = off;

CREATE
OR REPLACE FUNCTION public.handle_new_user () RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET
  search_path TO 'public' AS $function$
BEGIN
  INSERT INTO public.users (id, email, display_name, image_url, roles)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'user_name',
      new.raw_user_meta_data ->> 'name',
      '[redacted]'
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    CASE 
      WHEN new.email = 'matthewloh256@gmail.com' THEN ARRAY['admin'::public.user_role]
      ELSE ARRAY['regular'::public.user_role]
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = excluded.email,
    display_name = excluded.display_name,
    image_url = excluded.image_url,
    roles = excluded.roles;  -- Update role in case of conflict as well

  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    new.id,
    CASE 
      WHEN new.email = 'matthewloh256@gmail.com' THEN 'admin'::public.user_role
      ELSE 'regular'::public.user_role
    END
  )
  ON CONFLICT (user_id, role) DO NOTHING;  -- Prevent duplicate entries

  RETURN new;
END;
$function$;

CREATE
OR REPLACE FUNCTION public.set_user_role (event jsonb) RETURNS jsonb LANGUAGE plpgsql AS $function$
declare
  claims jsonb;
  user_email text;
  user_roles public.user_role[];
begin
  -- Log the entire event object
  RAISE LOG 'Full event object: %', event;

  -- Fetch the user roles in the user_roles table
  select array_agg(role) into user_roles from public.user_roles where user_id = (event->>'user_id')::uuid;

  -- Get the user's email from the claims object
  user_email := event->'claims'->>'email';

  -- Log the user's email
  RAISE LOG 'User email: %', user_email;

  claims := coalesce(event->'claims', '{}'::jsonb);

  -- Check if 'app_metadata' exists in claims
  if jsonb_typeof(claims->'app_metadata') is null then
    claims := jsonb_set(claims, '{app_metadata}', '{}');
  end if;

  -- Set the user_roles in app_metadata
  if user_roles is not null and array_length(user_roles, 1) > 0 then
    claims := jsonb_set(claims, '{app_metadata, user_roles}', to_jsonb(user_roles));
  else
    claims := jsonb_set(claims, '{app_metadata, user_roles}', '[]'::jsonb);
  end if;

  -- Update the 'claims' object in the original event
  event := jsonb_set(event, '{claims}', claims);

  -- Log the final event object
  RAISE LOG 'Final event object: %', event;

  return event;
end;
$function$;

grant delete on table "public"."user_roles" to "supabase_auth_admin";

grant insert on table "public"."user_roles" to "supabase_auth_admin";

grant references on table "public"."user_roles" to "supabase_auth_admin";

grant
select
  on table "public"."user_roles" to "supabase_auth_admin";

grant trigger on table "public"."user_roles" to "supabase_auth_admin";

grant
truncate on table "public"."user_roles" to "supabase_auth_admin";

grant
update on table "public"."user_roles" to "supabase_auth_admin";