create type "public"."user_community_permissions" as enum(
  'admin.invite',
  'admin.remove',
  'admin.ban',
  'admin.edit',
  'member.invite',
  'member.remove',
  'member.ban',
  'member.edit'
);

set
  check_function_bodies = off;

CREATE
OR REPLACE FUNCTION public.handle_empty_folder_placeholder () RETURNS trigger LANGUAGE plpgsql AS $function$
BEGIN
    -- Check if the name does not end with '.folderPlaceholder'
    IF NEW.bucket_id = 'vault' AND NEW.name NOT LIKE '%/.folderPlaceholder' THEN

        -- Create a modified name with '.folderPlaceholder' at the end
        DECLARE
            modified_name TEXT;
        BEGIN
            modified_name := regexp_replace(NEW.name, '([^/]+)$', '.folderPlaceholder');

            -- Check if the modified name already exists in the table
            IF NOT EXISTS (
                SELECT 1 
                FROM storage.objects 
                WHERE bucket_id = NEW.bucket_id 
                AND name = modified_name
            ) THEN
                -- Insert the new row with the modified name
                INSERT INTO storage.objects (
                    bucket_id, 
                    name, 
                    owner, 
                    owner_id, 
                    parent_path, 
                    depth
                )
                VALUES (
                    NEW.bucket_id, 
                    modified_name, 
                    NEW.owner, 
                    NEW.owner_id, 
                    NEW.parent_path, 
                    NEW.depth
                );
            END IF;
        END;
    END IF;

    -- Allow the original row to be inserted without modifying NEW.name
    RETURN NEW;
END;
$function$;

CREATE
OR REPLACE FUNCTION public.handle_updated_user () RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET
  search_path TO 'public' AS $function$
BEGIN
  -- Check if email_confirmed_at is updated from NULL to NOT NULL
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    -- Insert or update the user record in the users table
    INSERT INTO public.users (id, email, display_name, image_url, roles)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(
        NEW.raw_user_meta_data ->> 'full_name',
        NEW.raw_user_meta_data ->> 'user_name',
        NEW.raw_user_meta_data ->> 'name',
        split_part(NEW.email, '@', 1),  -- Extract first part of email as fallback
        '[redacted]'  -- Final fallback
      ),
      NEW.raw_user_meta_data ->> 'avatar_url',
      CASE  
        WHEN NEW.email = 'matthewloh256@gmail.com' THEN ARRAY['admin'::public.user_role, 'regular'::public.user_role]  -- Assign both roles
        ELSE ARRAY['regular'::public.user_role]  -- Assign regular role to others
      END
    )
    ON CONFLICT (id) DO UPDATE SET
      email = excluded.email,
      display_name = excluded.display_name,
      image_url = excluded.image_url,
      roles = excluded.roles;  -- Update role in case of conflict as well

    -- Insert into user_roles table conditionally
    IF NEW.email = 'matthewloh256@gmail.com' THEN
      INSERT INTO public.user_roles (user_id, role)
      VALUES 
      (
        NEW.id,
        'admin'::public.user_role  -- Assign admin role
      )
      ON CONFLICT (user_id, role) DO NOTHING;  -- Prevent duplicate entries

      INSERT INTO public.user_roles (user_id, role)
      VALUES 
      (
        NEW.id,
        'regular'::public.user_role  -- Assign regular role
      )
      ON CONFLICT (user_id, role) DO NOTHING;  -- Prevent duplicate entries
    ELSE
      INSERT INTO public.user_roles (user_id, role)
      VALUES 
      (
        NEW.id,
        'regular'::public.user_role  -- Assign regular role
      )
      ON CONFLICT (user_id, role) DO NOTHING;  -- Prevent duplicate entries
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

CREATE
OR REPLACE FUNCTION public.insert_into_documents () RETURNS trigger LANGUAGE plpgsql AS $function$DECLARE
    modified_name TEXT;
    parent_id TEXT;
BEGIN
    BEGIN
        -- Extract parent_id from path_tokens
        IF array_length(NEW.path_tokens, 1) > 1 THEN
            IF NEW.path_tokens[array_length(NEW.path_tokens, 1)] = '.emptyFolderPlaceholder' THEN
                -- If the last token is '.folderPlaceholder', take the second to last token
                parent_id := NEW.path_tokens[array_length(NEW.path_tokens, 1) - 2];
            ELSE
                -- Otherwise, take the last token
                parent_id := NEW.path_tokens[array_length(NEW.path_tokens, 1) - 1];
            END IF;
        ELSE
            -- If there's only one token, set parent_id to null
            parent_id := null;
        END IF;
    END;

    IF NOT NEW.name LIKE '%.emptyFolderPlaceholder' THEN
        INSERT INTO documents (
            id,
            name,
            created_at,
            created_by,
            metadata,
            path_tokens,
            parent_id,
            object_id,
            owner_id
        )
        VALUES (
            NEW.id,
            NEW.name,
            NEW.created_at,
            NEW.created_by,  -- Use NEW.created_by instead of team_id
            NEW.metadata,
            NEW.path_tokens,
            parent_id,
            NEW.id,
            NEW.owner_id::uuid
        );
    END IF;

    BEGIN
        IF array_length(NEW.path_tokens, 1) > 2 AND parent_id NOT IN ('inbox', 'transactions', 'exports', 'imports') THEN
            -- Create a modified name with '.folderPlaceholder' at the end
            modified_name := regexp_replace(NEW.name, '([^/]+)$', '.folderPlaceholder');
            
            -- Check if the modified name already exists in the table
            IF NOT EXISTS (
                SELECT 1 
                FROM documents 
                WHERE name = modified_name
            ) THEN
                -- Insert the new row with the modified name
                INSERT INTO documents (
                    name, 
                    path_tokens,
                    parent_id,
                    object_id,
                    created_by  -- Include created_by for the new document
                )
                VALUES (
                    modified_name, 
                    string_to_array(modified_name, '/'),
                    parent_id,
                    NEW.id,
                    NEW.created_by  -- Use NEW.created_by
                );
            END IF;
        END IF;
    END;

    RETURN NEW;
END;$function$;

CREATE
OR REPLACE FUNCTION public.delete_from_documents () RETURNS trigger LANGUAGE plpgsql AS $function$
BEGIN
    DELETE FROM public.documents
    WHERE object_id = OLD.id;
    RETURN OLD;
END;
$function$;

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
      WHEN new.email = 'matthewloh256@gmail.com' THEN ARRAY['admin'::public.user_role, 'regular'::public.user_role]  -- Assign both roles
      ELSE ARRAY['regular'::public.user_role]  -- Assign regular role to others
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = excluded.email,
    display_name = excluded.display_name,
    image_url = excluded.image_url,
    roles = excluded.roles;  -- Update role in case of conflict as well

  -- Insert into user_roles table conditionally
  IF new.email = 'matthewloh256@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES 
    (
      new.id,
      'admin'::public.user_role  -- Assign admin role
    )
    ON CONFLICT (user_id, role) DO NOTHING;  -- Prevent duplicate entries

    INSERT INTO public.user_roles (user_id, role)
    VALUES 
    (
      new.id,
      'regular'::public.user_role  -- Assign regular role
    )
    ON CONFLICT (user_id, role) DO NOTHING;  -- Prevent duplicate entries
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES 
    (
      new.id,
      'regular'::public.user_role  -- Assign regular role
    )
    ON CONFLICT (user_id, role) DO NOTHING;  -- Prevent duplicate entries
  END IF;

  RETURN new;
END;
$function$;