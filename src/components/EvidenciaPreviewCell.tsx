'use client';

import { useState } from 'react';
import { ImageIcon, FileIcon, MapPin } from 'lucide-react';
import { Modal } from '@/components/ui/modal/Modal';
import { googleMapsUrl } from '@/hooks/useGeolocation';

function isImageUrl(url: string) {
  return (
    /\.(jpe?g|png|gif|webp|avif|bmp|svg)(\?|$)/i.test(url) ||
    url.includes('/image/upload/')
  );
}

type EvidenciaArchivoCellProps = {
  url: string | null | undefined;
  title: string;
};

export function EvidenciaArchivoCell({ url, title }: EvidenciaArchivoCellProps) {
  const [open, setOpen] = useState(false);

  if (!url) return null;

  const esImagen = isImageUrl(url);
  const Icon = esImagen ? ImageIcon : FileIcon;

  return (
    <>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-600 transition hover:bg-brand-50 hover:text-brand-700"
          aria-label={`Ver ${title}`}
          title={title}
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </button>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-3xl">
        <div className="px-5 pt-12 pb-6 sm:px-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">{title}</h3>
          {esImagen ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={title}
              className="mx-auto max-h-[min(70vh,720px)] w-full rounded-lg object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 py-8">
              <FileIcon className="size-12 text-brand-600" strokeWidth={1.5} />
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 text-sm font-medium hover:text-brand-700 hover:underline"
              >
                Abrir archivo
              </a>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

type EvidenciaDetalleFotoProps = {
  url: string | null | undefined;
  title: string;
};

export function EvidenciaDetalleFoto({ url, title }: EvidenciaDetalleFotoProps) {
  const [open, setOpen] = useState(false);

  if (!url) {
    return (
      <div className="space-y-2 rounded-xl bg-white/75 px-4 py-3 shadow-theme-xs">
        <p className="text-sm font-bold text-gray-800">{title}</p>
        <p className="text-sm text-gray-400">Sin archivo</p>
      </div>
    );
  }

  const esImagen = isImageUrl(url);

  return (
    <>
      <div className="space-y-2 rounded-xl bg-white/75 p-3 shadow-theme-xs">
        <p className="text-sm font-bold text-gray-800">{title}</p>
        {esImagen ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="block w-full overflow-hidden rounded-lg bg-gray-50 transition hover:opacity-90"
            aria-label={`Ver ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={title} className="h-44 w-full object-cover" />
          </button>
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            <FileIcon className="size-4" />
            Abrir archivo
          </a>
        )}
      </div>

      {esImagen && (
        <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-3xl">
          <div className="px-5 pt-12 pb-6 sm:px-8">
            <h3 className="mb-4 text-lg font-bold text-gray-800">{title}</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={title}
              className="mx-auto max-h-[min(70vh,720px)] w-full rounded-lg object-contain"
            />
          </div>
        </Modal>
      )}
    </>
  );
}

type EvidenciaMapaDetalleProps = {
  latitud: number | null | undefined;
  longitud: number | null | undefined;
};

export function EvidenciaMapaDetalle({ latitud, longitud }: EvidenciaMapaDetalleProps) {
  if (latitud == null || longitud == null) {
    return (
      <div className="space-y-2 rounded-xl bg-white/75 px-4 py-3 shadow-theme-xs">
        <p className="text-sm font-bold text-gray-800">Ubicación GPS</p>
        <p className="text-sm text-gray-400">Sin coordenadas</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-xl bg-white/75 px-4 py-3 shadow-theme-xs">
      <p className="text-sm font-bold text-gray-800">Ubicación GPS</p>
      <p className="font-mono text-sm text-gray-700">
        {latitud.toFixed(6)}, {longitud.toFixed(6)}
      </p>
      <a
        href={googleMapsUrl(latitud, longitud)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        <MapPin className="size-4" />
        Ver en mapa →
      </a>
    </div>
  );
}

type EvidenciaMapaCellProps = {
  latitud: number | null | undefined;
  longitud: number | null | undefined;
};

export function EvidenciaMapaCell({ latitud, longitud }: EvidenciaMapaCellProps) {
  if (latitud == null || longitud == null) return null;

  return (
    <div className="flex justify-center">
      <a
        href={googleMapsUrl(latitud, longitud)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-600 transition hover:bg-brand-50 hover:text-brand-700"
        aria-label="Ver en mapa"
        title="Ver en mapa"
      >
        <MapPin className="size-5" strokeWidth={1.75} />
      </a>
    </div>
  );
}
