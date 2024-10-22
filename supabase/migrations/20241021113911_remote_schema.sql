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