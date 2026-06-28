-- auth.users 作成時に public.users へ同期する関数
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'name',
      nullif(split_part(new.email, '@', 1), ''),
      'User'
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- auth.users への INSERT 後に trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();