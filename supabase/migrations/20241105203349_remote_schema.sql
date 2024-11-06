set
    check_function_bodies = off;

CREATE
OR REPLACE FUNCTION storage.handle_empty_folder_placeholder () RETURNS trigger LANGUAGE plpgsql AS $function$
DECLARE
    name_tokens text[];
    modified_name text;
BEGIN
    -- Split the name into an array of tokens based on '/'
    name_tokens := string_to_array(NEW.name, '/');

    -- Check if the last item in name_tokens is '.emptyFolderPlaceholder'
    IF name_tokens[array_length(name_tokens, 1)] = '.emptyFolderPlaceholder' THEN
        
        -- Change the last item to '.folderPlaceholder'
        name_tokens[array_length(name_tokens, 1)] := '.folderPlaceholder';
        
        -- Reassemble the tokens back into a string
        modified_name := array_to_string(name_tokens, '/');

        -- Insert a new row with the modified name
        INSERT INTO storage.objects (bucket_id, name, owner, owner_id,  parent_path)
        VALUES (
            NEW.bucket_id,
            modified_name,
            NEW.owner,
            NEW.owner_id,
            NEW.parent_path
        );
    END IF;

    -- Insert the original row
    RETURN NEW;
END;
$function$;

create policy "TODO: Improve granularity for policies for buckets" on "storage"."buckets" as permissive for all to anon,
authenticated using (true);

create policy "TODO: Improve security granularity " on "storage"."objects" as permissive for all to authenticated,
anon using (true);

create policy "Users can insert their own files" on "storage"."objects" as permissive for insert to public
with
    check (
        (
            (bucket_id = 'attachments'::text)
            AND (auth.role () = 'authenticated'::text)
        )
    );

create policy "Users can select their own files" on "storage"."objects" as permissive for
select
    to public using (
        (
            (bucket_id = 'attachments'::text)
            AND (auth.role () = 'authenticated'::text)
        )
    );

create policy "Users can update their own files" on "storage"."objects" as permissive for
update to public using (
    (
        (bucket_id = 'attachments'::text)
        AND (auth.role () = 'authenticated'::text)
    )
);

create policy "all permissions 1313ape_0" on "storage"."objects" as permissive for insert to anon,
authenticated,
service_role
with
    check ((bucket_id = 'knowledge_base'::text));

create policy "all permissions 1313ape_1" on "storage"."objects" as permissive for delete to anon,
authenticated,
service_role using ((bucket_id = 'knowledge_base'::text));

create policy "all permissions 1313ape_2" on "storage"."objects" as permissive for
update to anon,
authenticated,
service_role using ((bucket_id = 'knowledge_base'::text));

create policy "all permissions 1313ape_3" on "storage"."objects" as permissive for
select
    to anon,
    authenticated,
    service_role using ((bucket_id = 'knowledge_base'::text));

create policy "idek man 17rw4od_0" on "storage"."objects" as permissive for
update to authenticated,
anon,
service_role using ((bucket_id = 'hub_files'::text));

create policy "idek man 17rw4od_1" on "storage"."objects" as permissive for delete to authenticated,
anon,
service_role using ((bucket_id = 'hub_files'::text));

create policy "idek man 17rw4od_2" on "storage"."objects" as permissive for insert to authenticated,
anon,
service_role
with
    check ((bucket_id = 'hub_files'::text));

create policy "idek man 17rw4od_3" on "storage"."objects" as permissive for
select
    to authenticated,
    anon,
    service_role using ((bucket_id = 'hub_files'::text));

create policy "idek man 53fan5_0" on "storage"."objects" as permissive for
select
    to anon,
    authenticated,
    service_role using ((bucket_id = 'community_files'::text));

create policy "idek man 53fan5_1" on "storage"."objects" as permissive for insert to anon,
authenticated,
service_role
with
    check ((bucket_id = 'community_files'::text));

create policy "idek man 53fan5_2" on "storage"."objects" as permissive for
update to anon,
authenticated,
service_role using ((bucket_id = 'community_files'::text));

create policy "idek man 53fan5_3" on "storage"."objects" as permissive for delete to anon,
authenticated,
service_role using ((bucket_id = 'community_files'::text));

create policy "yes 1oj01fe_0" on "storage"."objects" as permissive for insert to authenticated,
anon
with
    check ((bucket_id = 'avatars'::text));

create policy "yes 1oj01fe_1" on "storage"."objects" as permissive for
update to authenticated,
anon using ((bucket_id = 'avatars'::text));

create policy "yes 1oj01fe_2" on "storage"."objects" as permissive for
select
    to authenticated,
    anon using ((bucket_id = 'avatars'::text));

create policy "yes 1oj01fe_3" on "storage"."objects" as permissive for delete to authenticated,
anon using ((bucket_id = 'avatars'::text));

CREATE
OR REPLACE FUNCTION public.delete_from_documents () RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
     DELETE FROM public.documents
     WHERE object_id = OLD.id;
     RETURN OLD;
END;
$$;

CREATE TRIGGER before_delete_objects BEFORE DELETE ON storage.objects FOR EACH ROW WHEN ((old.bucket_id = 'vault'::text))
EXECUTE FUNCTION delete_from_documents ();