'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, SquarePen, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table/DataTable';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { PlusIcon } from '@/icons';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS, type UserRole } from '@/lib/roles';
import {
  displayApellidos,
  displayNombres,
  type ProfileRow,
} from '@/lib/users';

function roleBadgeColor(role: UserRole): 'primary' | 'info' | 'success' {
  switch (role) {
    case 'admin':
      return 'primary';
    case 'ti':
      return 'info';
    default:
      return 'success';
  }
}

function formatFecha(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function cellText(value: string | null | undefined) {
  if (!value || value === '—') {
    return <span className="text-gray-400">—</span>;
  }
  return <span className="text-gray-800">{value}</span>;
}

function buildColumns(
  onEdit?: (usuario: ProfileRow) => void,
  onDelete?: (usuario: ProfileRow) => void,
  currentUserId?: string,
): ColumnDef<ProfileRow>[] {
  const base: ColumnDef<ProfileRow>[] = [
  {
    id: 'nombres',
    header: 'Nombres',
    accessorFn: (row) => displayNombres(row),
    cell: ({ row }) => cellText(displayNombres(row.original)),
  },
  {
    id: 'apellidos',
    header: 'Apellidos',
    accessorFn: (row) => displayApellidos(row),
    cell: ({ row }) => cellText(displayApellidos(row.original)),
  },
  {
    accessorKey: 'phone',
    header: 'Celular',
    cell: ({ getValue }) => cellText(getValue<string | null>()),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ getValue }) => cellText(getValue<string>()),
  },
  {
    accessorKey: 'role',
    header: 'Rol',
    cell: ({ getValue }) => {
      const role = getValue<UserRole>();
      return (
        <Badge size="sm" color={roleBadgeColor(role)}>
          {ROLE_LABELS[role]}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Registro',
    cell: ({ getValue }) => cellText(formatFecha(getValue<string>())),
  },
  ];

  if (onEdit || onDelete) {
    base.push({
      id: 'acciones',
      header: () => <span className="block w-full text-center">Acciones</span>,
      enableSorting: false,
      cell: ({ row }) => {
        const usuario = row.original;
        const isSelf = currentUserId === usuario.id;
        return (
          <div className="flex w-full items-center justify-center gap-1 leading-none">
            {onEdit ? (
              <button
                type="button"
                onClick={() => onEdit(usuario)}
                className="inline-flex shrink-0 items-center justify-center rounded-md bg-brand-50 p-1.5 text-brand-600 transition hover:bg-brand-100"
                aria-label={`Editar ${displayNombres(usuario)}`}
                title="Editar"
              >
                <SquarePen className="size-3.5 shrink-0" strokeWidth={1.75} />
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(usuario)}
                disabled={isSelf}
                className="inline-flex shrink-0 items-center justify-center rounded-md bg-error-50 p-1.5 text-error-500 transition hover:bg-error-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Eliminar ${displayNombres(usuario)}`}
                title={isSelf ? 'No puede eliminar su propia cuenta' : 'Eliminar'}
              >
                <Trash2 className="size-3.5 shrink-0" strokeWidth={1.75} />
              </button>
            ) : null}
          </div>
        );
      },
    });
  }

  return base;
}

type UsuariosTablaProps = {
  refreshKey?: number;
  onNewUserClick?: () => void;
  onEditUser?: (usuario: ProfileRow) => void;
  onDeleteUser?: (usuario: ProfileRow) => void;
};

export default function UsuariosTabla({
  refreshKey = 0,
  onNewUserClick,
  onEditUser,
  onDeleteUser,
}: UsuariosTablaProps) {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<ProfileRow[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setBusqueda('');
  }, [refreshKey]);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('/api/usuarios')
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Error al cargar');
        setUsuarios(data.usuarios ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return usuarios;
    return usuarios.filter((u) => {
      const haystack = [
        displayNombres(u),
        displayApellidos(u),
        u.email,
        u.phone ?? '',
        ROLE_LABELS[u.role],
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [usuarios, busqueda]);

  const columns = useMemo(
    () => buildColumns(onEditUser, onDeleteUser, user?.id),
    [onEditUser, onDeleteUser, user?.id],
  );

  const newButton =
    onNewUserClick && (
      <Button size="md" onClick={onNewUserClick} startIcon={<PlusIcon className="size-5" />}>
        Nuevo usuario
      </Button>
    );

  if (loading) {
    return (
      <div className="min-w-0 max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white px-0 pb-2 pt-3">
        <div className="animate-pulse space-y-3 px-2 py-4 sm:px-2.5">
          <div className="mx-auto h-10 w-40 rounded bg-gray-200" />
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
    <div className="min-w-0 max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white px-0 pb-2 pt-3">
      <div className="mb-3 flex flex-col items-center gap-3 px-2 text-center sm:px-2.5">
        {newButton}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Usuarios del sistema</h3>
          <p className="text-theme-xs text-gray-500">
            {busqueda.trim()
              ? `${filtrados.length} de ${usuarios.length} registro(s)`
              : `${usuarios.length} registro(s)`}
          </p>
        </div>
      </div>

      {usuarios.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <p className="font-medium text-gray-700">Sin usuarios registrados</p>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            Use el botón de arriba para crear el primer usuario.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-3 px-2 sm:px-2.5">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, email, celular o rol…"
                className="h-9 w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 pl-9 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10 focus:outline-none"
              />
            </div>
          </div>

          {filtrados.length === 0 ? (
            <div className="flex flex-col items-center px-2 py-10 text-center sm:px-2.5">
              <p className="font-medium text-gray-700">Sin resultados</p>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                No hay usuarios que coincidan con la búsqueda.
              </p>
            </div>
          ) : (
            <DataTable data={filtrados} columns={columns} pageSize={15} dense />
          )}
        </>
      )}
    </div>
  );
}
