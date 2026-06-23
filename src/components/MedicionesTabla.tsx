'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import type { MedicionRow } from '@/lib/database';
import { useAuth } from '@/context/AuthContext';
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

type MedicionesTablaProps = {
  refreshKey?: number;
  variant?: 'compact' | 'full';
  title?: string;
  showNewButton?: boolean;
};

export default function MedicionesTabla({
  refreshKey = 0,
  variant = 'compact',
  title,
  showNewButton = true,
}: MedicionesTablaProps) {
  const { role } = useAuth();
  const [mediciones, setMediciones] = useState<MedicionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const viewAll = canViewAllMediciones(role);
  const isFull = variant === 'full';

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

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 sm:px-6">
        <div className="animate-pulse space-y-3 py-4">
          <div className="h-4 w-48 rounded bg-gray-200" />
          <div className="h-12 rounded bg-gray-100" />
          <div className="h-12 rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-2xl border border-error-200 bg-error-50 px-4 py-6 sm:px-6">
        <p className="text-sm text-error-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{heading}</h3>
          <p className="text-theme-xs text-gray-500">{mediciones.length} registro(s)</p>
        </div>
        {showNewButton && canCreateMedicion(role) && (
          <Link href="/medicion">
            <Button size="sm" variant="outline">
              Nueva medición
            </Button>
          </Link>
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
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-y border-gray-100">
              <TableRow>
                <TableCell isHeader className="py-3 text-start font-medium text-gray-500 text-theme-xs">
                  Circuito
                </TableCell>
                <TableCell isHeader className="py-3 text-start font-medium text-gray-500 text-theme-xs">
                  Cliente / Sede
                </TableCell>
                {isFull && (
                  <TableCell isHeader className="py-3 text-start font-medium text-gray-500 text-theme-xs">
                    Banda
                  </TableCell>
                )}
                {isFull && (
                  <TableCell isHeader className="py-3 text-start font-medium text-gray-500 text-theme-xs">
                    IL_MAX
                  </TableCell>
                )}
                {isFull && (
                  <TableCell isHeader className="py-3 text-start font-medium text-gray-500 text-theme-xs">
                    IL_REAL
                  </TableCell>
                )}
                <TableCell isHeader className="py-3 text-start font-medium text-gray-500 text-theme-xs">
                  Estado
                </TableCell>
                <TableCell isHeader className="py-3 text-start font-medium text-gray-500 text-theme-xs">
                  Fecha
                </TableCell>
                <TableCell isHeader className="py-3 text-start font-medium text-gray-500 text-theme-xs">
                  Adjunto
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {mediciones.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="py-3">
                    <p className="font-medium text-gray-800 text-theme-sm">{m.codigo_circuito}</p>
                    <span className="text-gray-500 text-theme-xs">
                      {m.distrito}, {m.departamento}
                    </span>
                    {viewAll && m.profiles && (
                      <p className="mt-0.5 text-gray-500 text-theme-xs">
                        {m.profiles.full_name ?? m.profiles.email}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <p className="text-gray-800 text-theme-sm">{m.cliente_empresa}</p>
                    <span className="text-gray-500 text-theme-xs">{m.sede}</span>
                  </TableCell>
                  {isFull && (
                    <TableCell className="py-3 text-gray-700 text-theme-sm">{m.tipo_banda}</TableCell>
                  )}
                  {isFull && (
                    <TableCell className="py-3 font-mono text-theme-sm text-gray-700">
                      {m.il_max != null ? m.il_max.toFixed(2) : '—'}
                    </TableCell>
                  )}
                  {isFull && (
                    <TableCell className="py-3 font-mono text-theme-sm text-gray-700">
                      {m.il_real != null ? m.il_real.toFixed(2) : '—'}
                    </TableCell>
                  )}
                  <TableCell className="py-3">
                    {m.estado ? (
                      <Badge size="sm" color={estadoBadgeColor(m.estado)}>
                        {m.estado}
                      </Badge>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm">
                    {new Date(m.created_at).toLocaleString('es-PE', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell className="py-3">
                    {m.adjunto_url ? (
                      <a
                        href={m.adjunto_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-500 text-theme-sm hover:text-brand-600"
                      >
                        Ver archivo
                      </a>
                    ) : (
                      <span className="text-gray-400 text-theme-sm">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
