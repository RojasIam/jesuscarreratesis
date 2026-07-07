'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon } from '@/icons';
import Badge from '@/components/ui/badge/Badge';
import {
  EvidenciaDetalleFoto,
  EvidenciaDetalleFotosMulti,
  EvidenciaMapaDetalle,
} from '@/components/EvidenciaPreviewCell';
import type { MedicionRow } from '@/lib/database';
import { getFotosOtdrUrls } from '@/lib/evidencias';
import { googleMapsUrl } from '@/hooks/useGeolocation';
import { useAuth } from '@/context/AuthContext';
import { canViewAllMediciones } from '@/lib/roles';
import { UI } from '@/lib/user-messages';

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

function DetalleCampo({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white/75 px-4 py-3 shadow-theme-xs backdrop-blur-sm">
      <dt className="text-theme-xs font-bold text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-gray-900">
        {value ?? <span className="font-normal text-gray-400">—</span>}
      </dd>
    </div>
  );
}

type SectionTone = 'sky' | 'blue' | 'amber' | 'green' | 'violet';

const sectionToneClass: Record<SectionTone, { wrap: string; title: string }> = {
  sky: { wrap: 'bg-blue-light-50', title: 'text-blue-light-800' },
  blue: { wrap: 'bg-brand-50', title: 'text-brand-800' },
  amber: { wrap: 'bg-orange-50', title: 'text-orange-800' },
  green: { wrap: 'bg-success-50', title: 'text-success-800' },
  violet: { wrap: 'bg-violet-50', title: 'text-violet-800' },
};

function DetalleSeccion({
  titulo,
  tone,
  children,
}: {
  titulo: string;
  tone: SectionTone;
  children: React.ReactNode;
}) {
  const styles = sectionToneClass[tone];

  return (
    <section className={`space-y-4 rounded-2xl p-5 sm:p-6 ${styles.wrap}`}>
      <h2 className={`text-sm font-bold tracking-wide uppercase sm:text-base ${styles.title}`}>
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function num(value: number | null | undefined, dec = 2) {
  if (value == null || Number.isNaN(value)) return null;
  return value.toFixed(dec);
}

export default function MedicionDetalleContent({ id }: { id: string }) {
  const { role } = useAuth();
  const viewAll = canViewAllMediciones(role);
  const [medicion, setMedicion] = useState<MedicionRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`/api/mediciones/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Error al cargar');
        setMedicion(data.medicion);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !medicion) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center">
        <p className="text-sm text-error-600">{error || 'Medición no encontrada'}</p>
        <Link href="/medicion" className="mt-4 inline-block text-sm text-brand-600 hover:text-brand-700">
          Volver a mediciones
        </Link>
      </div>
    );
  }

  const registradoPor = medicion.profiles?.full_name ?? medicion.profiles?.email ?? null;
  const tieneGps = medicion.latitud != null && medicion.longitud != null;

  return (
    <div className="w-full min-w-0 space-y-8 px-1 py-6 sm:px-2">
      <Link
        href="/medicion"
        className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
      >
        <ChevronLeftIcon className="size-4" />
        Volver a mediciones
      </Link>

      <header className="rounded-2xl bg-gradient-to-br from-brand-50 via-blue-light-50 to-success-50 px-6 py-8 text-center shadow-theme-sm">
        <p className="text-theme-xs font-bold tracking-widest text-brand-700 uppercase">Circuito</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">{medicion.codigo_circuito}</h1>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {medicion.estado && (
            <Badge size="md" color={estadoBadgeColor(medicion.estado)}>
              {medicion.estado}
            </Badge>
          )}
          <span className="rounded-full bg-white/70 px-3 py-1 font-mono text-sm text-gray-700 shadow-theme-xs">
            {formatMedicionFecha(medicion.created_at)} · {formatMedicionHora(medicion.created_at)}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <DetalleSeccion titulo="Ubicación" tone="sky">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetalleCampo label="Departamento" value={medicion.departamento} />
              <DetalleCampo label="Distrito" value={medicion.distrito} />
              <DetalleCampo label="Sede" value={medicion.sede} />
              {tieneGps && (
                <DetalleCampo
                  label="Coordenadas GPS"
                  value={
                    <div className="space-y-1">
                      <p className="font-mono text-sm">
                        {medicion.latitud!.toFixed(6)}, {medicion.longitud!.toFixed(6)}
                      </p>
                      <a
                        href={googleMapsUrl(medicion.latitud!, medicion.longitud!)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex text-sm font-medium text-brand-600 hover:text-brand-700"
                      >
                        {UI.viewOnMap} →
                      </a>
                    </div>
                  }
                />
              )}
            </dl>
          </DetalleSeccion>

          <DetalleSeccion titulo="Servicio" tone="blue">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetalleCampo label="Cliente" value={medicion.cliente_empresa} />
              <DetalleCampo label="Técnico responsable" value={medicion.tecnico_responsable} />
              {viewAll && <DetalleCampo label="Registrado por" value={registradoPor} />}
              <DetalleCampo label="Banda (nm)" value={medicion.tipo_banda} />
            </dl>
          </DetalleSeccion>

          <DetalleSeccion titulo="Parámetros de medición" tone="amber">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetalleCampo label="Potencia site/nodo (dBm)" value={num(medicion.potencia_site_nodo)} />
              <DetalleCampo label="Potencia recibida roseta (dBm)" value={num(medicion.potencia_recibida_roseta)} />
              <DetalleCampo label="Distancia enlace (km)" value={num(medicion.distancia_enlace)} />
              <DetalleCampo label="N.º empalmes" value={medicion.numero_empalmes} />
              <DetalleCampo label="N.º conectores" value={medicion.numero_conectores} />
              <DetalleCampo label="Peor empalme (dB)" value={num(medicion.peor_empalme)} />
              <DetalleCampo label="Peor conector (dB)" value={num(medicion.peor_conector)} />
              <DetalleCampo label="Reflectancia (dB)" value={num(medicion.reflectancia)} />
            </dl>
          </DetalleSeccion>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <DetalleSeccion titulo="Resultados" tone="green">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <DetalleCampo label="IL_MAX (dB)" value={num(medicion.il_max)} />
              <DetalleCampo label="IL_REAL (dB)" value={num(medicion.il_real)} />
              <DetalleCampo label="Estado" value={medicion.estado} />
            </dl>
          </DetalleSeccion>

          <DetalleSeccion titulo="Evidencias" tone="violet">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-1">
              <EvidenciaDetalleFoto
                url={medicion.foto_timestamp_url}
                title={UI.photoPotenciaNodo}
              />
              <EvidenciaDetalleFoto
                url={medicion.foto_potencia_url}
                title={UI.photoPotenciaCliente}
              />
              <EvidenciaDetalleFotosMulti
                urls={getFotosOtdrUrls(medicion)}
                title={UI.photoOtdr}
              />
              <EvidenciaMapaDetalle latitud={medicion.latitud} longitud={medicion.longitud} />
            </div>
            {medicion.adjunto_url && (
              <div className="pt-4">
                <EvidenciaDetalleFoto url={medicion.adjunto_url} title={UI.evidenceLegacy} />
              </div>
            )}
          </DetalleSeccion>
        </div>
      </div>
    </div>
  );
}
