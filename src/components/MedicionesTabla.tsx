'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table/DataTable';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { PlusIcon } from '@/icons';
import type { MedicionRow } from '@/lib/database';
import { EvidenciaArchivoCell, EvidenciaMapaCell } from '@/components/EvidenciaPreviewCell';
import { UI } from '@/lib/user-messages';
import { useAuth } from '@/context/AuthContext';
import MedicionesTablaFiltros from '@/components/MedicionesTablaFiltros';
import {
  filtrarMediciones,
  filtrosActivos,
  filtrosVacios,
  type MedicionesFiltros,
} from '@/lib/mediciones-filters';
import { canCreateMedicion, canViewAllMediciones } from '@/lib/roles';

function estadoBadgeColor(estado: string): 'success' | 'warning' | 'error' | 'info' {
  switch (estado) {
    case 'Excelente':
      return 'success';
    case 'Bueno':
      return 'info';
    case 'Regular':
      return 'warning';
    case 'No Conforme':
      return 'error';
    default:
      return 'info';
  }
}

function formatMedicionFecha(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function formatMedicionHora(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function cellText(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-gray-400">—</span>;
  }
  return <span className="text-gray-800">{value}</span>;
}

function buildMedicionesColumns(isFull: boolean, viewAll: boolean): ColumnDef<MedicionRow>[] {
  const columns: ColumnDef<MedicionRow>[] = [
    {
      accessorKey: 'codigo_circuito',
      header: 'Circuito',
      cell: ({ row }) => {
        const codigo = row.original.codigo_circuito;
        if (!codigo) return cellText(null);
        return (
          <Link
            href={`/medicion/${row.original.id}`}
            className="font-medium text-brand-600 hover:text-brand-700 hover:underline"
          >
            {codigo}
          </Link>
        );
      },
    },
    {
      accessorKey: 'cliente_empresa',
      header: 'Cliente',
      cell: ({ getValue }) => cellText(getValue<string>()),
    },
    {
      accessorKey: 'sede',
      header: 'Sede',
      cell: ({ getValue }) => cellText(getValue<string>()),
    },
  ];

  if (isFull) {
    columns.push(
      {
        accessorKey: 'distrito',
        header: 'Distrito',
        cell: ({ getValue }) => cellText(getValue<string>()),
      },
      {
        accessorKey: 'departamento',
        header: 'Departamento',
        cell: ({ getValue }) => cellText(getValue<string>()),
      },
      {
        accessorKey: 'tecnico_responsable',
        header: 'Técnico',
        cell: ({ getValue }) => cellText(getValue<string>()),
      },
    );

    if (viewAll) {
      columns.push({
        id: 'registrado_por',
        header: 'Registrado por',
        accessorFn: (row) => row.profiles?.full_name ?? row.profiles?.email ?? '',
        cell: ({ row }) =>
          cellText(row.original.profiles?.full_name ?? row.original.profiles?.email ?? null),
      });
    }

    columns.push(
      {
        accessorKey: 'tipo_banda',
        header: 'Banda',
        cell: ({ getValue }) => cellText(getValue<string>()),
      },
      {
        accessorKey: 'il_max',
        header: 'IL_MAX',
        cell: ({ getValue }) => {
          const v = getValue<number | null>();
          return v != null ? (
            <span className="font-mono text-gray-800">{v.toFixed(2)}</span>
          ) : (
            <span className="text-gray-400">—</span>
          );
        },
      },
      {
        accessorKey: 'il_real',
        header: 'IL_REAL',
        cell: ({ getValue }) => {
          const v = getValue<number | null>();
          return v != null ? (
            <span className="font-mono text-gray-800">{v.toFixed(2)}</span>
          ) : (
            <span className="text-gray-400">—</span>
          );
        },
      },
    );
  }

  columns.push(
    {
      accessorKey: 'estado',
      header: 'Estado',
      enableSorting: false,
      cell: ({ getValue }) => {
        const estado = getValue<string | null>();
        return estado ? (
          <Badge size="sm" color={estadoBadgeColor(estado)}>
            {estado}
          </Badge>
        ) : (
          <span className="text-gray-400">—</span>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha',
      cell: ({ getValue }) => (
        <span className="font-mono text-gray-700">{formatMedicionFecha(getValue<string>())}</span>
      ),
    },
  );

  if (isFull) {
    columns.push(
      {
        id: 'hora',
        header: 'Hora',
        accessorFn: (row) => row.created_at,
        cell: ({ getValue }) => (
          <span className="font-mono text-gray-700">{formatMedicionHora(getValue<string>())}</span>
        ),
      },
      {
        id: 'foto_timestamp',
        header: UI.photoTimestamp,
        enableSorting: false,
        cell: ({ row }) => (
          <EvidenciaArchivoCell url={row.original.foto_timestamp_url} title={UI.photoTimestamp} />
        ),
      },
      {
        id: 'foto_otdr',
        header: UI.evidenceOtdr,
        enableSorting: false,
        cell: ({ row }) => (
          <EvidenciaArchivoCell url={row.original.foto_otdr_url} title={UI.photoOtdr} />
        ),
      },
      {
        id: 'foto_potencia',
        header: UI.evidencePower,
        enableSorting: false,
        cell: ({ row }) => (
          <EvidenciaArchivoCell url={row.original.foto_potencia_url} title={UI.photoPower} />
        ),
      },
      {
        id: 'gps',
        header: UI.evidenceGps,
        enableSorting: false,
        cell: ({ row }) => (
          <EvidenciaMapaCell latitud={row.original.latitud} longitud={row.original.longitud} />
        ),
      },
    );
  }

  return columns;
}

type MedicionesTablaProps = {
  refreshKey?: number;
  variant?: 'compact' | 'full';
  title?: string;
  showNewButton?: boolean;
  onNewMedicionClick?: () => void;
};

function cardClass(isFull: boolean) {
  if (isFull) {
    return 'min-w-0 max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white px-0 pb-2 pt-3';
  }
  return 'min-w-0 max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white px-3 pb-3 pt-4 sm:px-4';
}

export default function MedicionesTabla({
  refreshKey = 0,
  variant = 'compact',
  title,
  showNewButton = true,
  onNewMedicionClick,
}: MedicionesTablaProps) {
  const { role } = useAuth();
  const [mediciones, setMediciones] = useState<MedicionRow[]>([]);
  const [filtros, setFiltros] = useState<MedicionesFiltros>(() => filtrosVacios());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const viewAll = canViewAllMediciones(role);
  const isFull = variant === 'full';

  const columns = useMemo(
    () => buildMedicionesColumns(isFull, viewAll),
    [isFull, viewAll],
  );

  const medicionesFiltradas = useMemo(
    () => filtrarMediciones(mediciones, filtros, viewAll),
    [mediciones, filtros, viewAll],
  );

  useEffect(() => {
    setFiltros(filtrosVacios());
  }, [refreshKey]);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('/api/mediciones')
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Error al cargar');
        setMediciones(data.mediciones ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const heading =
    title ?? (viewAll ? 'Todas las mediciones' : isFull ? 'Servicios registrados' : 'Mis mediciones recientes');
  const puedeCrear = showNewButton && canCreateMedicion(role);

  const newButton =
    puedeCrear &&
    (onNewMedicionClick ? (
      <Button size="md" onClick={onNewMedicionClick} startIcon={<PlusIcon className="size-5" />}>
        Nueva medición
      </Button>
    ) : (
      <Link href="/medicion">
        <Button size="sm" variant="outline">
          Nueva medición
        </Button>
      </Link>
    ));

  if (loading) {
    return (
      <div className={cardClass(isFull)}>
        <div className={`animate-pulse space-y-3 py-4 ${isFull ? 'px-2 sm:px-2.5' : ''}`}>
          <div className="h-4 w-48 rounded bg-gray-200" />
          <div className="h-12 rounded bg-gray-100" />
          <div className="h-12 rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-w-0 max-w-full overflow-hidden rounded-xl border border-error-200 bg-error-50 px-3 py-6 sm:px-4">
        <p className="text-sm text-error-600">{error}</p>
      </div>
    );
  }

  return (
    <div className={cardClass(isFull)}>
      <div
        className={`mb-3 ${
          isFull
            ? 'flex flex-col items-center gap-3 px-2 text-center sm:px-2.5'
            : 'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'
        }`}
      >
        {isFull ? (
          <>
            {newButton}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{heading}</h3>
              <p className="text-theme-xs text-gray-500">
                {filtrosActivos(filtros)
                  ? `${medicionesFiltradas.length} de ${mediciones.length} registro(s)`
                  : `${mediciones.length} registro(s)`}
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{heading}</h3>
              <p className="text-theme-xs text-gray-500">
                {filtrosActivos(filtros)
                  ? `${medicionesFiltradas.length} de ${mediciones.length} registro(s)`
                  : `${mediciones.length} registro(s)`}
              </p>
            </div>
            {newButton}
          </>
        )}
      </div>

      {mediciones.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <p className="font-medium text-gray-700">
            {viewAll ? 'Sin mediciones registradas' : 'Aún no tienes mediciones'}
          </p>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            {viewAll
              ? 'Los técnicos aparecerán aquí cuando registren mediciones.'
              : 'Usa el botón de arriba para registrar tu primera medición.'}
          </p>
        </div>
      ) : (
        <>
          <div className={isFull ? 'px-2 sm:px-2.5' : ''}>
            <MedicionesTablaFiltros
              mediciones={mediciones}
              filtros={filtros}
              onChange={setFiltros}
              viewAll={viewAll}
              compact={!isFull}
            />
          </div>

          {medicionesFiltradas.length === 0 ? (
            <div className={`flex flex-col items-center py-10 text-center ${isFull ? 'px-2 sm:px-2.5' : ''}`}>
              <p className="font-medium text-gray-700">Sin resultados</p>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                No hay mediciones que coincidan con los filtros aplicados.
              </p>
            </div>
          ) : (
            <DataTable
              data={medicionesFiltradas}
              columns={columns}
              pageSize={isFull ? 15 : 10}
              dense={isFull}
            />
          )}
        </>
      )}
    </div>
  );
}
