import type { MedicionRow } from '@/lib/database';

export const MAX_FOTOS_OTDR = 5;

export function getFotosOtdrUrls(
  row: Pick<MedicionRow, 'foto_otdr_url' | 'fotos_otdr_urls'>,
): string[] {
  if (row.fotos_otdr_urls?.length) {
    return row.fotos_otdr_urls.filter((url): url is string => Boolean(url));
  }
  if (row.foto_otdr_url) return [row.foto_otdr_url];
  return [];
}
