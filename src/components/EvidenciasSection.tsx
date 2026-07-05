'use client';

import Label from '@/components/form/Label';
import FileInput from '@/components/form/input/FileInput';
import Button from '@/components/ui/button/Button';
import {
  googleMapsUrl,
  type GeolocationCoords,
  type GeolocationStatus,
} from '@/hooks/useGeolocation';
import { UI } from '@/lib/user-messages';

export type EvidenciasFiles = {
  fotoTimestamp: File | null;
  fotoOtdr: File | null;
  fotoPotencia: File | null;
};

export const initialEvidenciasFiles: EvidenciasFiles = {
  fotoTimestamp: null,
  fotoOtdr: null,
  fotoPotencia: null,
};

type EvidenciasSectionProps = {
  files: EvidenciasFiles;
  onFilesChange: (files: EvidenciasFiles) => void;
  coords: GeolocationCoords | null;
  geoStatus: GeolocationStatus;
  geoError: string;
  onRequestLocation: () => void;
  geoLoading: boolean;
};

export default function EvidenciasSection({
  files,
  onFilesChange,
  coords,
  geoStatus,
  geoError,
  onRequestLocation,
  geoLoading,
}: EvidenciasSectionProps) {
  const setFile = (key: keyof EvidenciasFiles, file: File | null) => {
    onFilesChange({ ...files, [key]: file });
  };

  return (
    <div className="space-y-6">
      <div className="w-full">
        <Label>Ubicación GPS</Label>

        {geoStatus === 'success' && coords && (
          <div className="mt-1.5 space-y-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="mb-1.5 block text-theme-xs font-medium text-gray-500">Latitud</span>
                <div className="input-field bg-gray-50 font-mono text-sm dark:bg-white/[0.03]">
                  {coords.lat.toFixed(6)}
                </div>
              </div>
              <div>
                <span className="mb-1.5 block text-theme-xs font-medium text-gray-500">Longitud</span>
                <div className="input-field bg-gray-50 font-mono text-sm dark:bg-white/[0.03]">
                  {coords.lng.toFixed(6)}
                </div>
              </div>
            </div>
            <a
              href={googleMapsUrl(coords.lat, coords.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              {UI.viewOnMap} →
            </a>
            <div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onRequestLocation}
                disabled={geoLoading}
              >
                {geoLoading ? 'Actualizando…' : 'Actualizar ubicación'}
              </Button>
            </div>
          </div>
        )}

        {geoStatus === 'loading' && (
          <p className="mt-1.5 text-sm text-gray-500">Obteniendo ubicación…</p>
        )}

        {geoStatus === 'unsupported' && (
          <p className="mt-1.5 text-sm text-warning-600">Geolocalización no disponible.</p>
        )}

        {(geoStatus === 'denied' || geoStatus === 'unavailable' || geoStatus === 'idle') &&
          !coords && (
            <div className="mt-1.5 space-y-2">
              {geoError && (
                <p className="text-sm text-error-600 dark:text-error-400">{geoError}</p>
              )}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onRequestLocation}
                disabled={geoLoading}
              >
                {geoStatus === 'denied' ? 'Volver a permitir ubicación' : 'Permitir ubicación'}
              </Button>
            </div>
          )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <EvidenciaFileField
          label={UI.photoTimestamp}
          file={files.fotoTimestamp}
          onChange={(f) => setFile('fotoTimestamp', f)}
        />
        <EvidenciaFileField
          label={UI.photoOtdr}
          file={files.fotoOtdr}
          onChange={(f) => setFile('fotoOtdr', f)}
        />
        <EvidenciaFileField
          label={UI.photoPower}
          file={files.fotoPotencia}
          onChange={(f) => setFile('fotoPotencia', f)}
        />
      </div>
    </div>
  );
}

function EvidenciaFileField({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col">
      <Label>{label}</Label>
      <FileInput
        accept="image/*"
        fileName={file?.name}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
