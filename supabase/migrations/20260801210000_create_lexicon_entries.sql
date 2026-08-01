-- Lexicon entries (morpheme | lexeme | phrase) belonging to a lexicon.
create type public.lexicon_entry_type as enum ('morpheme', 'lexeme', 'phrase');
create type public.lexicon_entry_status as enum ('draft', 'active', 'archived');

create table if not exists public.lexicon_entries (
  id uuid primary key default gen_random_uuid(),
  lexicon_id uuid not null references public.lexicons (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type public.lexicon_entry_type not null,
  status public.lexicon_entry_status not null default 'draft',
  value text not null,
  pronunciation text not null default '',
  language text not null,
  definitions jsonb not null default '[]'::jsonb,
  variants jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lexicon_entries_lexicon_id_idx
  on public.lexicon_entries (lexicon_id);

create index if not exists lexicon_entries_user_id_idx
  on public.lexicon_entries (user_id);

create index if not exists lexicon_entries_lexicon_id_type_idx
  on public.lexicon_entries (lexicon_id, type);

alter table public.lexicon_entries enable row level security;

create policy "Users can select own lexicon entries"
  on public.lexicon_entries
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own lexicon entries"
  on public.lexicon_entries
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own lexicon entries"
  on public.lexicon_entries
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete own lexicon entries"
  on public.lexicon_entries
  for delete
  to authenticated
  using (user_id = auth.uid());
