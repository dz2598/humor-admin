-- Run this once in the SAME Supabase project's SQL Editor.
alter table public.profiles
  add column if not exists is_superadmin boolean not null default false;

create or replace function public.is_superadmin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_superadmin = true
  );
$$;

revoke all on function public.is_superadmin() from public;
grant execute on function public.is_superadmin() to authenticated;

drop policy if exists "Superadmins can read all profiles" on public.profiles;
create policy "Superadmins can read all profiles" on public.profiles
for select to authenticated using (public.is_superadmin());

drop policy if exists "Superadmins can manage all memes" on public.memes;
create policy "Superadmins can manage all memes" on public.memes
for all to authenticated using (public.is_superadmin()) with check (public.is_superadmin());

drop policy if exists "Superadmins can read all votes" on public.votes;
create policy "Superadmins can read all votes" on public.votes
for select to authenticated using (public.is_superadmin());

-- Grant the project owner superadmin access.
update public.profiles
set is_superadmin = true
where id = (select id from auth.users where email = 'dz2598@columbia.edu');
