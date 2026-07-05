import { describe, expect, it } from 'vitest';
import type { MedicionRow } from '@/lib/database';
import {
  countByDay,
  countByEstado,
  countByField,
  countBySede,
  conformidadRate,
  filterMedicionesByMonth,
  formatMesAnio,
  buildMonthOptions,
  buildMonthFilterOptions,
  buildYearOptions,
  parseMonthKey,
  toMonthKey,
} from '@/lib/mediciones-stats';

function mockMedicion(overrides: Partial<MedicionRow> & { created_at: string }): MedicionRow {
  return {
    id: '1',
    user_id: 'u1',
    departamento: 'Lima',
    distrito: 'Miraflores',
    sede: 'Sede A',
    tecnico_responsable: 'Juan Pérez',
    codigo_circuito: '100',
    cliente_empresa: 'Cliente X',
    tipo_banda: '1310',
    potencia_site_nodo: 0,
    numero_empalmes: 0,
    numero_conectores: 0,
    distancia_enlace: 0,
    potencia_recibida_roseta: 0,
    peor_empalme: 0,
    peor_conector: 0,
    reflectancia: 0,
    il_max: 4,
    il_real: 3,
    estado: 'Excelente',
    adjunto_url: null,
    adjunto_public_id: null,
    latitud: null,
    longitud: null,
    foto_timestamp_url: null,
    foto_timestamp_public_id: null,
    foto_otdr_url: null,
    foto_otdr_public_id: null,
    foto_potencia_url: null,
    foto_potencia_public_id: null,
    ...overrides,
  };
}

describe('mediciones-stats', () => {
  const mediciones = [
    mockMedicion({ id: '1', created_at: '2026-07-04T10:00:00Z', estado: 'Excelente', tecnico_responsable: 'Ana' }),
    mockMedicion({ id: '2', created_at: '2026-07-04T14:00:00Z', estado: 'Bueno', tecnico_responsable: 'Luis' }),
    mockMedicion({ id: '3', created_at: '2026-06-15T10:00:00Z', estado: 'No Conforme' }),
  ];

  it('filtra por mes actual', () => {
    const julio = filterMedicionesByMonth(mediciones, 2026, 7);
    expect(julio).toHaveLength(2);
  });

  it('agrupa por estado', () => {
    const julio = filterMedicionesByMonth(mediciones, 2026, 7);
    const estados = countByEstado(julio);
    expect(estados.find((e) => e.name === 'Excelente')?.value).toBe(1);
    expect(estados.find((e) => e.name === 'Bueno')?.value).toBe(1);
  });

  it('cuenta por día del mes', () => {
    const julio = filterMedicionesByMonth(mediciones, 2026, 7);
    const dias = countByDay(julio, 2026, 7);
    expect(dias).toHaveLength(31);
    expect(dias.find((d) => d.day === '4')?.count).toBe(2);
  });

  it('cuenta por técnico', () => {
    const julio = filterMedicionesByMonth(mediciones, 2026, 7);
    const tecnicos = countByField(julio, (m) => m.tecnico_responsable);
    expect(tecnicos).toHaveLength(2);
  });

  it('cuenta por sede', () => {
    const julio = filterMedicionesByMonth(mediciones, 2026, 7);
    const sedes = countBySede(julio);
    expect(sedes).toHaveLength(1);
    expect(sedes[0]?.name).toBe('Sede A');
    expect(sedes[0]?.value).toBe(2);
  });

  it('calcula tasa de conformidad', () => {
    expect(conformidadRate(mediciones)).toBe(67);
    expect(conformidadRate([])).toBeNull();
  });

  it('formatea mes en español', () => {
    expect(formatMesAnio(2026, 7)).toBe('julio 2026');
  });

  it('genera clave y opciones de mes', () => {
    expect(toMonthKey(2026, 7)).toBe('2026-07');
    expect(parseMonthKey('2026-07')).toEqual({ year: 2026, month: 7 });
    const options = buildMonthOptions(3, new Date(2026, 6, 15));
    expect(options).toHaveLength(3);
    expect(options[0]?.value).toBe('2026-07');
    expect(options[0]?.label).toBe('julio 2026');
  });

  it('genera opciones separadas de año y mes', () => {
    const years = buildYearOptions(3, new Date(2026, 6, 15));
    expect(years).toEqual([2026, 2025, 2024]);

    const months = buildMonthFilterOptions();
    expect(months).toHaveLength(12);
    expect(months[6]).toEqual({ value: 7, label: 'julio' });
  });
});
