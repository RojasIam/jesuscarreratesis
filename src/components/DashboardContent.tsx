'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/badge/Badge';
import { GroupIcon, BoltIcon, TableIcon, DocsIcon } from '@/icons';
import MedicionesRecientes from '@/components/MedicionesRecientes';
import { useAuth } from '@/context/AuthContext';
import { canCreateMedicion, canViewAllMediciones, ROLE_LABELS } from '@/lib/roles';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function DashboardContent() {
  const { role, profile } = useAuth();
  const showMedicion = canCreateMedicion(role);
  const [totalMediciones, setTotalMediciones] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/mediciones')
      .then((r) => r.json())
      .then((d) => setTotalMediciones(d.mediciones?.length ?? 0))
      .catch(() => setTotalMediciones(0));
  }, []);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Usuario';

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              <GroupIcon className="size-6 text-gray-800 dark:text-white/90" />
            </div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {canViewAllMediciones(role) ? 'Mediciones totales' : 'Mis mediciones'}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {totalMediciones ?? '—'}
                </h4>
              </div>
              <Badge color="success">Activo</Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              <BoltIcon className="size-6 text-gray-800 dark:text-white/90" />
            </div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Evaluación IL_MAX</span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  Automática
                </h4>
              </div>
              <Badge color="primary">Tiempo real</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          {showMedicion && (
            <Link
              href="/medicion"
              className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-500/30 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                <TableIcon className="size-6 text-gray-800 dark:text-white/90" />
              </div>
              <h4 className="mt-5 font-bold text-gray-800 text-theme-sm dark:text-white/90">
                Nueva medición
              </h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Captura datos de campo y calcula conformidad
              </p>
            </Link>
          )}
          <Link
            href="/formulas"
            className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-500/30 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              <DocsIcon className="size-6 text-gray-800 dark:text-white/90" />
            </div>
            <h4 className="mt-5 font-bold text-gray-800 text-theme-sm dark:text-white/90">
              Fórmulas y criterios
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Consulta IL_MAX y umbrales de evaluación
            </p>
          </Link>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Bienvenido</h3>
            {role && <Badge color="primary">{ROLE_LABELS[role]}</Badge>}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{getGreeting()},</p>
          <h4 className="mt-1 font-bold text-gray-800 text-title-sm dark:text-white/90">{firstName}</h4>
          <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {canViewAllMediciones(role)
              ? 'Panel de supervisión de mediciones ópticas en campo.'
              : 'Registra mediciones, calcula IL_MAX y evalúa la conformidad del enlace.'}
          </p>
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-theme-xs text-gray-500 dark:text-gray-400">Mediciones registradas</p>
            <p className="mt-1 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalMediciones ?? '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="col-span-12">
        <MedicionesRecientes />
      </div>
    </div>
  );
}
