import type { MedicionRow } from '@/lib/database';

export const ESTADOS_MEDICION = ['Excelente', 'Bueno', 'Regular', 'No Conforme'] as const;

export type MedicionesFiltros = {
  busqueda: string;
  fechaDesde: string;
  fechaHasta: string;
  tecnico: string;
  registradoPor: string;
  distrito: string;
  sede: string;
  departamento: string;
  estado: string;
};

export const filtrosVacios = (): MedicionesFiltros => ({
  busqueda: '',
  fechaDesde: '',
  fechaHasta: '',
  tecnico: '',
  registradoPor: '',
  distrito: '',
  sede: '',
  departamento: '',
  estado: '',
});

function startOfDay(isoDate: string) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function endOfDay(isoDate: string) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999);
}

export function registradoPorLabel(row: MedicionRow) {
  return row.profiles?.full_name ?? row.profiles?.email ?? '';
}

export function filtrarMediciones(
  rows: MedicionRow[],
  filtros: MedicionesFiltros,
  viewAll: boolean,
): MedicionRow[] {
  const q = filtros.busqueda.trim().toLowerCase();

  return rows.filter((row) => {
    if (q) {
      const coincide =
        row.codigo_circuito.toLowerCase().includes(q) ||
        row.cliente_empresa.toLowerCase().includes(q) ||
        row.tecnico_responsable.toLowerCase().includes(q);
      if (!coincide) return false;
    }

    if (filtros.fechaDesde) {
      if (new Date(row.created_at) < startOfDay(filtros.fechaDesde)) return false;
    }

    if (filtros.fechaHasta) {
      if (new Date(row.created_at) > endOfDay(filtros.fechaHasta)) return false;
    }

    if (filtros.tecnico && row.tecnico_responsable !== filtros.tecnico) return false;

    if (filtros.registradoPor && viewAll) {
      if (registradoPorLabel(row) !== filtros.registradoPor) return false;
    }

    if (filtros.distrito && row.distrito !== filtros.distrito) return false;
    if (filtros.sede && row.sede !== filtros.sede) return false;
    if (filtros.departamento && row.departamento !== filtros.departamento) return false;
    if (filtros.estado && row.estado !== filtros.estado) return false;

    return true;
  });
}

function uniqueSorted(values: (string | null | undefined)[]) {
  return [...new Set(values.filter((v): v is string => Boolean(v && v.trim())))]
    .sort((a, b) => a.localeCompare(b, 'es'));
}

export function opcionesFiltroMediciones(rows: MedicionRow[]) {
  return {
    tecnicos: uniqueSorted(rows.map((r) => r.tecnico_responsable)),
    registradosPor: uniqueSorted(rows.map(registradoPorLabel)),
    distritos: uniqueSorted(rows.map((r) => r.distrito)),
    sedes: uniqueSorted(rows.map((r) => r.sede)),
    departamentos: uniqueSorted(rows.map((r) => r.departamento)),
  };
}

export function filtrosActivos(filtros: MedicionesFiltros) {
  return Object.values(filtros).some((v) => v.trim() !== '');
}
