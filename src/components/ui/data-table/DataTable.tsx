'use client';

import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Button from '@/components/ui/button/Button';

type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  pageSize?: number;
  dense?: boolean;
};

export function DataTable<T>({ data, columns, pageSize = 10, dense = false }: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  });

  const sortIndicator = (sorted: false | 'asc' | 'desc') => {
    if (sorted === 'asc') return ' ↑';
    if (sorted === 'desc') return ' ↓';
    return '';
  };

  const headerCellClass = dense
    ? '!border-brand-800 whitespace-nowrap bg-brand-700 px-2.5 py-2.5 text-start font-semibold text-white text-theme-xs'
    : '!border-brand-800 whitespace-nowrap bg-brand-700 px-3 py-3 text-start font-semibold text-white text-theme-xs';
  const bodyCellClass = dense
    ? 'whitespace-nowrap px-2.5 py-2 text-theme-sm'
    : 'whitespace-nowrap px-3 py-2.5 text-theme-sm';
  const scrollClass = dense
    ? 'w-full min-w-0 overflow-x-auto border-t border-gray-200'
    : 'w-full min-w-0 overflow-x-auto rounded-lg border border-gray-200';

  return (
    <div className="min-w-0 space-y-4">
      <div className={scrollClass}>
        <Table>
          <TableHeader className="bg-brand-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-brand-700">
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    isHeader
                    className={headerCellClass}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="flex items-center gap-0.5 text-white hover:text-white/90"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span className="text-white/70">{sortIndicator(header.column.getIsSorted())}</span>
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="even:bg-gray-50/60 hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={bodyCellClass}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {table.getPageCount() > 1 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-theme-xs text-gray-500">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()} · {data.length}{' '}
            registro(s)
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
