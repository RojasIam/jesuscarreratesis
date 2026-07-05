-- =============================================================================
-- Optical Quality — Schema completo con roles (tecnico, admin, ti)
-- Ejecutar en Supabase → SQL Editor
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Tipo enum de roles
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.app_role as enum ('tecnico', 'admin', 'ti');
exception
  when duplicate_object then null;
end $$;

-- -----------------------------------------------------------------------------
-- 2. Perfiles de usuario (vinculado a auth.users)
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  nombres text,
  apellidos text,
  phone text,
  avatar_url text,
  avatar_public_id text,
  role public.app_role not null default 'tecnico',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_email_idx on public.profiles(email);

-- -----------------------------------------------------------------------------
-- 3. Tabla de mediciones (técnicos registran; admin/ti ven según rol)
-- -----------------------------------------------------------------------------
create table if not exists public.mediciones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  departamento text not null,
  distrito text not null,
  sede text not null,
  tecnico_responsable text not null,
  codigo_circuito text not null,
  cliente_empresa text not null,
  tipo_banda text not null check (tipo_banda in ('1310', '1490', '1550')),
  potencia_site_nodo numeric not null,
  numero_empalmes integer not null,
  numero_conectores integer not null,
  distancia_enlace numeric not null,
  potencia_recibida_roseta numeric not null,
  peor_empalme numeric not null,
  peor_conector numeric not null,
  reflectancia numeric not null,
  il_max numeric,
  il_real numeric,
  estado text,
  adjunto_url text,
  adjunto_public_id text,
  latitud numeric,
  longitud numeric,
  foto_timestamp_url text,
  foto_timestamp_public_id text,
  foto_otdr_url text,
  foto_otdr_public_id text,
  foto_potencia_url text,
  foto_potencia_public_id text,
  created_at timestamptz not null default now()
);

create index if not exists mediciones_user_id_idx on public.mediciones(user_id);
create index if not exists mediciones_created_at_idx on public.mediciones(created_at desc);

-- -----------------------------------------------------------------------------
-- 4. Funciones auxiliares para RLS
-- -----------------------------------------------------------------------------
create or replace function public.get_my_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_admin_or_ti()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'ti')
  );
$$;

create or replace function public.is_tecnico()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'tecnico'
  );
$$;

-- -----------------------------------------------------------------------------
-- 5. Trigger: crear perfil al registrar usuario en Auth
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'tecnico'
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Perfiles para usuarios ya existentes (ejecutar una vez si ya tenías usuarios)
insert into public.profiles (id, email, full_name, role)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  'tecnico'
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- -----------------------------------------------------------------------------
-- 6. RLS — profiles
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "Ver propio perfil" on public.profiles;
create policy "Ver propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Admin y TI ven todos los perfiles" on public.profiles;
create policy "Admin y TI ven todos los perfiles"
  on public.profiles for select
  using (public.is_admin_or_ti());

drop policy if exists "Actualizar propio perfil" on public.profiles;
create policy "Actualizar propio perfil"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

drop policy if exists "Admin actualiza cualquier perfil" on public.profiles;
create policy "Admin actualiza cualquier perfil"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- 7. RLS — mediciones
-- -----------------------------------------------------------------------------
alter table public.mediciones enable row level security;

-- SELECT: técnico ve las suyas; admin y TI ven todas
drop policy if exists "Usuarios leen sus mediciones" on public.mediciones;
drop policy if exists "Leer mediciones segun rol" on public.mediciones;
create policy "Leer mediciones segun rol"
  on public.mediciones for select
  using (
    auth.uid() = user_id
    or public.is_admin_or_ti()
  );

-- INSERT: solo técnicos (y admin si también registra en campo)
drop policy if exists "Usuarios insertan sus mediciones" on public.mediciones;
drop policy if exists "Insertar mediciones tecnicos" on public.mediciones;
create policy "Insertar mediciones tecnicos"
  on public.mediciones for insert
  with check (
    auth.uid() = user_id
    and (
      public.is_tecnico()
      or public.is_admin()
    )
  );

-- UPDATE: técnico las suyas; admin cualquiera
drop policy if exists "Usuarios actualizan sus mediciones" on public.mediciones;
drop policy if exists "Actualizar mediciones segun rol" on public.mediciones;
create policy "Actualizar mediciones segun rol"
  on public.mediciones for update
  using (
    auth.uid() = user_id
    or public.is_admin()
  )
  with check (
    auth.uid() = user_id
    or public.is_admin()
  );

-- DELETE: técnico las suyas; admin cualquiera
drop policy if exists "Usuarios eliminan sus mediciones" on public.mediciones;
drop policy if exists "Eliminar mediciones segun rol" on public.mediciones;
create policy "Eliminar mediciones segun rol"
  on public.mediciones for delete
  using (
    auth.uid() = user_id
    or public.is_admin()
  );

-- Si ya existía mediciones con FK a auth.users, ejecuta esto aparte:
-- alter table public.mediciones drop constraint if exists mediciones_user_id_fkey;
-- alter table public.mediciones
--   add constraint mediciones_user_id_fkey
--   foreign key (user_id) references public.profiles(id) on delete cascade;

-- -----------------------------------------------------------------------------
-- 8. Asignar tu primer administrador (CAMBIA EL EMAIL)
-- -----------------------------------------------------------------------------
-- update public.profiles
-- set role = 'admin', updated_at = now()
-- where email = 'tu-email@empresa.com';

-- Ejemplo TI:
-- update public.profiles set role = 'ti', updated_at = now() where email = 'ti@empresa.com';

-- -----------------------------------------------------------------------------
-- 9. Migración: avatar en perfil (ejecutar si la tabla ya existía)
-- -----------------------------------------------------------------------------
-- alter table public.profiles add column if not exists avatar_url text;
-- alter table public.profiles add column if not exists avatar_public_id text;

-- =============================================================================
-- RESUMEN DE PERMISOS
-- =============================================================================
-- tecnico : Crear/editar/eliminar SUS mediciones. Ver solo las suyas.
-- admin   : Ver TODAS las mediciones. Editar/eliminar cualquiera. Gestionar roles.
-- ti      : Ver TODAS las mediciones y perfiles (solo lectura). No registra mediciones.
-- =============================================================================
