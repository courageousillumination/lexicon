-- Lexicons owned by an authenticated user.
create table if not exists public.lexicons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lexicons_user_id_idx on public.lexicons (user_id);

alter table public.lexicons enable row level security;

create policy "Users can select own lexicons"
  on public.lexicons
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own lexicons"
  on public.lexicons
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own lexicons"
  on public.lexicons
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete own lexicons"
  on public.lexicons
  for delete
  to authenticated
  using (user_id = auth.uid());
