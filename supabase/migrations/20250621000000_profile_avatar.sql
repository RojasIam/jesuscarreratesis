-- Avatar en perfiles (ejecutar en Supabase SQL Editor si la tabla ya existía)
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists avatar_public_id text;
