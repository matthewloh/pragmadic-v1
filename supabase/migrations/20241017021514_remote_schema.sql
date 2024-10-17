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

alter table "public"."user_roles" enable row level security;

set
  check_function_bodies = off;

CREATE
OR REPLACE FUNCTION public.handle_new_user () RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET
  search_path TO 'public' AS $function$
BEGIN
  INSERT INTO public.user (id, email, display_name, image_url, role)
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
      WHEN new.email = 'matthewloh256@gmail.com' THEN 'admin'::public.user_role
      ELSE 'regular'::public.user_role
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = excluded.email,
    display_name = excluded.display_name,
    image_url = excluded.image_url,
    role = excluded.role;  -- Update role in case of conflict as well
  RETURN new;
END;
$function$;

CREATE
OR REPLACE FUNCTION public.set_user_role (event jsonb) RETURNS jsonb LANGUAGE plpgsql AS $function$
declare
  claims jsonb;
  user_email text;
begin
  -- Log the entire event object
  RAISE LOG 'Full event object: %', event;

  -- Get the user's email from the claims object
  user_email := event->'claims'->>'email';

  -- Log the user's email
  RAISE LOG 'User email: %', user_email;

  claims := coalesce(event->'claims', '{}'::jsonb);

  -- Check if 'app_metadata' exists in claims
  if jsonb_typeof(claims->'app_metadata') is null then
    claims := jsonb_set(claims, '{app_metadata}', '{}');
  end if;

  -- Set a claim of 'admin' if the email matches, otherwise 'regular'
  if user_email = 'matthewloh256@gmail.com' then
    claims := jsonb_set(claims, '{app_metadata, role}', '"admin"');
    -- Log the role being set
    RAISE LOG 'Setting role to admin for email: %', user_email;
  else
    claims := jsonb_set(claims, '{app_metadata, role}', '"regular"');
    -- Log the role being set
    RAISE LOG 'Setting role to regular for email: %', user_email;
  end if;

  -- Update the 'claims' object in the original event
  event := jsonb_set(event, '{claims}', claims);

  -- Log the final event object
  RAISE LOG 'Final event object: %', event;

  return event;
end;
$function$;

create policy "Authenticated users can delete their own roles" on "public"."user_roles" as permissive for delete to authenticated using (
  (
    (
      SELECT
        auth.uid () AS uid
    ) = user_id
  )
);

create policy "Authenticated users can insert their own roles" on "public"."user_roles" as permissive for insert to authenticated
with
  check (
    (
      (
        SELECT
          auth.uid () AS uid
      ) = user_id
    )
  );

create policy "Authenticated users can select their own roles" on "public"."user_roles" as permissive for
select
  to authenticated using (true);

create policy "Authenticated users can update their own roles" on "public"."user_roles" as permissive for
update to authenticated using (
  (
    (
      SELECT
        auth.uid () AS uid
    ) = user_id
  )
)
with
  check (
    (
      (
        SELECT
          auth.uid () AS uid
      ) = user_id
    )
  );