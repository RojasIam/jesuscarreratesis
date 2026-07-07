-- Múltiples fotos OTDR (hasta 5) por medición
alter table public.mediciones add column if not exists fotos_otdr_urls text[];
alter table public.mediciones add column if not exists fotos_otdr_public_ids text[];

update public.mediciones
set
  fotos_otdr_urls = array[foto_otdr_url],
  fotos_otdr_public_ids = array[foto_otdr_public_id]
where foto_otdr_url is not null
  and (fotos_otdr_urls is null or cardinality(fotos_otdr_urls) = 0);
