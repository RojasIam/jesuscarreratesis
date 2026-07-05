'use client';

import { useMemo } from 'react';
import { Search } from 'lucide-react';
import Button from '@/components/ui/button/Button';
import {
  ESTADOS_MEDICION,
  type MedicionesFiltros,
  filtrosActivos,
  filtrosVacios,
  opcionesFiltroMediciones,
} from '@/lib/mediciones-filters';
import type { MedicionRow } from '@/lib/database';

const campoClass =
  'h-9 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-2 text-xs text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10 focus:outline-none sm:px-2.5 sm:text-sm';

type MedicionesTablaFiltrosProps = {
  mediciones: MedicionRow[];
  filtros: MedicionesFiltros;
  onChange: (filtros: MedicionesFiltros) => void;
  viewAll: boolean;
  compact?: boolean;
};

function gridTemplate(compact: boolean, viewAll: boolean, conLimpiar: boolean) {
  if (compact) {
    return conLimpiar ? 'minmax(0,2fr) minmax(0,1fr) auto' : 'minmax(0,2fr) minmax(0,1fr)';
  }
  if (viewAll) {
    const cols =
      'minmax(0,1.35fr) minmax(0,0.8fr) minmax(0,0.8fr) minmax(0,0.9fr) minmax(0,0.95fr) minmax(0,0.85fr) minmax(0,0.85fr) minmax(0,0.9fr) minmax(0,0.75fr)';
    return conLimpiar ? `${cols} auto` : cols;
  }
  const cols =
    'minmax(0,1.45fr) minmax(0,0.85fr) minmax(0,0.85fr) minmax(0,0.95fr) minmax(0,0.9fr) minmax(0,0.9fr) minmax(0,0.95fr) minmax(0,0.8fr)';
  return conLimpiar ? `${cols} auto` : cols;
}

function FiltroSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <select
      id={id}
      title={placeholder}
      aria-label={placeholder}
      className={`${campoClass} truncate`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export default function MedicionesTablaFiltros({
  mediciones,
  filtros,
  onChange,
  viewAll,
  compact = false,
}: MedicionesTablaFiltrosProps) {
  const opciones = useMemo(() => opcionesFiltroMediciones(mediciones), [mediciones]);
  const patch = (partial: Partial<MedicionesFiltros>) => onChange({ ...filtros, ...partial });
  const hayFiltros = filtrosActivos(filtros);

  return (
    <div className={`border-b border-gray-200 pb-3 ${compact ? '' : 'px-2 sm:px-2.5'}`}>
      <div
        className="mx-auto grid w-full min-w-0 max-w-full items-center gap-1.5 sm:gap-2"
        style={{ gridTemplateColumns: gridTemplate(compact, viewAll, hayFiltros) }}
      >
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-gray-400 sm:left-2.5 sm:size-4" />
          <input
            id="busqueda-mediciones"
            type="search"
            aria-label="Buscar por circuito, cliente o técnico"
            className={`${campoClass} pl-7 sm:pl-8`}
            placeholder="Buscar…"
            value={filtros.busqueda}
            onChange={(e) => patch({ busqueda: e.target.value })}
          />
        </div>

        {!compact && (
          <>
            <input
              id="fecha-desde"
              type="date"
              title="Desde"
              aria-label="Desde"
              className={campoClass}
              value={filtros.fechaDesde}
              onChange={(e) => patch({ fechaDesde: e.target.value })}
            />
            <input
              id="fecha-hasta"
              type="date"
              title="Hasta"
              aria-label="Hasta"
              className={campoClass}
              value={filtros.fechaHasta}
              onChange={(e) => patch({ fechaHasta: e.target.value })}
            />
            <FiltroSelect
              id="filtro-tecnico"
              placeholder="Técnico"
              value={filtros.tecnico}
              onChange={(tecnico) => patch({ tecnico })}
              options={opciones.tecnicos}
            />
            {viewAll && (
              <FiltroSelect
                id="filtro-registrado"
                placeholder="Registrado"
                value={filtros.registradoPor}
                onChange={(registradoPor) => patch({ registradoPor })}
                options={opciones.registradosPor}
              />
            )}
            <FiltroSelect
              id="filtro-distrito"
              placeholder="Distrito"
              value={filtros.distrito}
              onChange={(distrito) => patch({ distrito })}
              options={opciones.distritos}
            />
            <FiltroSelect
              id="filtro-sede"
              placeholder="Sede"
              value={filtros.sede}
              onChange={(sede) => patch({ sede })}
              options={opciones.sedes}
            />
            <FiltroSelect
              id="filtro-departamento"
              placeholder="Dto."
              value={filtros.departamento}
              onChange={(departamento) => patch({ departamento })}
              options={opciones.departamentos}
            />
          </>
        )}

        <FiltroSelect
          id="filtro-estado"
          placeholder="Estado"
          value={filtros.estado}
          onChange={(estado) => patch({ estado })}
          options={[...ESTADOS_MEDICION]}
        />

        {hayFiltros && (
          <Button
            size="sm"
            variant="outline"
            className="h-9 whitespace-nowrap px-2 sm:px-2.5"
            onClick={() => onChange(filtrosVacios())}
          >
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}
