'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BandaPieChart,
  ChartCard,
  DiaBarChart,
  EstadoPieChart,
  RankingBarChart,
} from '@/components/charts/MedicionesCharts';
import type { MedicionRow } from '@/lib/database';
import {
  conformidadRate,
  countByBanda,
  countByDay,
  countByEstado,
  countByField,
  countBySede,
  buildMonthFilterOptions,
  buildYearOptions,
  getCurrentMonthYear,
} from '@/lib/mediciones-stats';

const selectClass =
  'h-9 min-w-[10rem] rounded-lg border border-gray-300 bg-white px-3 text-sm capitalize text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90';

export default function MedicionesDashboardCharts() {
  const current = getCurrentMonthYear();
  const [year, setYear] = useState(current.year);
  const [month, setMonth] = useState(current.month);
  const yearOptions = useMemo(() => buildYearOptions(5), []);
  const monthOptions = useMemo(() => buildMonthFilterOptions(), []);
  const [mediciones, setMediciones] = useState<MedicionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/mediciones?mes=${month}&anio=${year}`)
      .then((r) => {
        if (!r.ok) throw new Error('No se pudieron cargar las mediciones');
        return r.json();
      })
      .then((d) => setMediciones(d.mediciones ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar'))
      .finally(() => setLoading(false));
  }, [month, year]);

  const stats = useMemo(() => {
    const porEstado = countByEstado(mediciones);
    const porDia = countByDay(mediciones, year, month);
    const porTecnico = countByField(mediciones, (m) => m.tecnico_responsable);
    const porDepartamento = countByField(mediciones, (m) => m.departamento);
    const porBanda = countByBanda(mediciones);
    const porSede = countBySede(mediciones);
    const conformidad = conformidadRate(mediciones);
    const noConformes = mediciones.filter((m) => m.estado === 'No Conforme').length;
    const tecnicosActivos = new Set(mediciones.map((m) => m.tecnico_responsable)).size;

    return {
      porEstado,
      porDia,
      porTecnico,
      porDepartamento,
      porBanda,
      porSede,
      conformidad,
      noConformes,
      tecnicosActivos,
    };
  }, [mediciones, year, month]);

  const periodFilters = (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <select
        aria-label="Año"
        className={selectClass}
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
      >
        {yearOptions.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <select
        aria-label="Mes"
        className={`${selectClass} capitalize`}
        value={month}
        onChange={(e) => setMonth(Number(e.target.value))}
      >
        {monthOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  if (error) {
    return (
      <div className="space-y-4 md:space-y-6">
        {periodFilters}
        <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {periodFilters}

      <div className={`relative ${loading ? 'pointer-events-none opacity-50' : ''}`}>
        {loading ? (
          <div className="absolute inset-0 z-10 flex items-start justify-center pt-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{mediciones.length}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Total</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {stats.conformidad !== null ? `${stats.conformidad}%` : '—'}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Conformidad</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {stats.tecnicosActivos}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Técnicos</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{stats.noConformes}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">No conformes</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6">
          <div className="col-span-12 xl:col-span-6">
            <ChartCard title="Por estado">
              <EstadoPieChart data={stats.porEstado} />
            </ChartCard>
          </div>
          <div className="col-span-12 xl:col-span-6">
            <ChartCard title="Por día">
              <DiaBarChart data={stats.porDia} />
            </ChartCard>
          </div>
          <div className="col-span-12 xl:col-span-6">
            <ChartCard title="Por técnico">
              <RankingBarChart
                data={stats.porTecnico}
                variant="indigo"
                emptyMessage="Sin datos"
              />
            </ChartCard>
          </div>
          <div className="col-span-12 xl:col-span-6">
            <ChartCard title="Por departamento">
              <RankingBarChart
                data={stats.porDepartamento}
                variant="violet"
                emptyMessage="Sin datos"
              />
            </ChartCard>
          </div>
          <div className="col-span-12 xl:col-span-6">
            <ChartCard title="Por banda">
              <BandaPieChart data={stats.porBanda} />
            </ChartCard>
          </div>
          <div className="col-span-12 xl:col-span-6">
            <ChartCard title="Por sede">
              <BandaPieChart data={stats.porSede} />
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}
