-- Add source/target languages to lexicons.
-- source_language: language the learner knows (glosses/definitions)
-- target_language: language being learned (entry values)
-- Values are BCP 47 tags (ISO 639-1 + ISO 3166-1 region), e.g. zh-CN vs zh-TW.
-- Allowed codes are enforced in app code so new languages don't need a DB migration.
alter table public.lexicons
  add column if not exists source_language text not null default 'en-US',
  add column if not exists target_language text not null default 'zh-CN';
