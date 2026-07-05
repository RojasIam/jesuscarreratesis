import type { MedicionRow } from '@/lib/database';
import { BANDA_CHART_COLORS, ESTADO_CHART_COLORS, PIE_VIVID_PALETTE } from '@/lib/chart-colors';

export const ESTADO_ORDER = ['Excelente', 'Bueno', 'Regular', 'No Conforme'] as const;

export const ESTADO_COLORS: Record<string, string> = ESTADO_CHART_COLORS;

export const BANDA_COLORS: Record<string, string> = BANDA_CHART_COLORS;

export const MESES_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const;

export function getCurrentMonthYear(date = new Date()): { year: number; month: number } {
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

export function formatMesAnio(year: number, month: number): string {
  return `${MESES_ES[month - 1]} ${year}`;
}

export function toMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function parseMonthKey(key: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(key);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12 || year < 2000) return null;

  return { year, month };
}

export function buildMonthOptions(
  monthsBack = 24,
  from = new Date(),
): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), 1);

  for (let i = 0; i < monthsBack; i++) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth() + 1;
    options.push({
      value: toMonthKey(year, month),
      label: formatMesAnio(year, month),
    });
    cursor.setMonth(cursor.getMonth() - 1);
  }

  return options;
}

export function buildYearOptions(yearsBack = 5, from = new Date()): number[] {
  const currentYear = from.getFullYear();
  return Array.from({ length: yearsBack }, (_, index) => currentYear - index);
}

export function buildMonthFilterOptions(): { value: number; label: string }[] {
  return MESES_ES.map((label, index) => ({
    value: index + 1,
    label,
  }));
}

export function filterMedicionesByMonth(
  mediciones: MedicionRow[],
  year: number,
  month: number,
): MedicionRow[] {
  return mediciones.filter((m) => {
    const d = new Date(m.created_at);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
}

export function countByEstado(mediciones: MedicionRow[]): { name: string; value: number; color: string }[] {
  const counts = new Map<string, number>();

  for (const m of mediciones) {
    const key = m.estado?.trim() || 'Sin estado';
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const ordered: { name: string; value: number; color: string }[] = ESTADO_ORDER.filter((e) =>
    counts.has(e),
  ).map((name) => ({
    name,
    value: counts.get(name)!,
    color: ESTADO_COLORS[name],
  }));

  if (counts.has('Sin estado')) {
    ordered.push({
      name: 'Sin estado',
      value: counts.get('Sin estado')!,
      color: ESTADO_COLORS['Sin estado'],
    });
  }

  return ordered;
}

export function countByField(
  mediciones: MedicionRow[],
  getLabel: (m: MedicionRow) => string,
  limit = 8,
): { name: string; value: number }[] {
  const counts = new Map<string, number>();

  for (const m of mediciones) {
    const label = getLabel(m).trim() || 'Sin dato';
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function countByDay(
  mediciones: MedicionRow[],
  year: number,
  month: number,
): { day: string; count: number }[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const counts = new Map<number, number>();

  for (let d = 1; d <= daysInMonth; d++) {
    counts.set(d, 0);
  }

  for (const m of mediciones) {
    const date = new Date(m.created_at);
    if (date.getFullYear() === year && date.getMonth() + 1 === month) {
      const day = date.getDate();
      counts.set(day, (counts.get(day) ?? 0) + 1);
    }
  }

  return [...counts.entries()].map(([day, count]) => ({
    day: String(day),
    count,
  }));
}

export function countByBanda(mediciones: MedicionRow[]): { name: string; value: number; color: string }[] {
  const counts = new Map<string, number>();

  for (const m of mediciones) {
    const banda = m.tipo_banda?.trim() || 'Sin dato';
    counts.set(banda, (counts.get(banda) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, value]) => ({
      name: `${name} nm`,
      value,
      color: BANDA_COLORS[name] ?? '#64748b',
    }))
    .sort((a, b) => b.value - a.value);
}

export function countBySede(
  mediciones: MedicionRow[],
  limit = 8,
): { name: string; value: number; color: string }[] {
  const counts = new Map<string, number>();

  for (const m of mediciones) {
    const sede = m.sede?.trim() || 'Sin dato';
    counts.set(sede, (counts.get(sede) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, value], index) => ({
      name,
      value,
      color: PIE_VIVID_PALETTE[index % PIE_VIVID_PALETTE.length],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function conformidadRate(mediciones: MedicionRow[]): number | null {
  if (mediciones.length === 0) return null;
  const conformes = mediciones.filter((m) => m.estado !== 'No Conforme').length;
  return Math.round((conformes / mediciones.length) * 100);
}
