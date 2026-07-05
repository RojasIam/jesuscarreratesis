-- Datos de contacto y nombre desglosado en perfiles
alter table public.profiles add column if not exists nombres text;
alter table public.profiles add column if not exists apellidos text;
alter table public.profiles add column if not exists phone text;

create index if not exists profiles_phone_idx on public.profiles(phone);

-- Backfill desde full_name cuando exista
update public.profiles
set
  nombres = coalesce(nombres, nullif(split_part(trim(full_name), ' ', 1), '')),
  apellidos = coalesce(
    apellidos,
    nullif(trim(substring(trim(full_name) from position(' ' in trim(full_name) || ' ') + 1)), '')
  )
where full_name is not null
  and (nombres is null or apellidos is null);
