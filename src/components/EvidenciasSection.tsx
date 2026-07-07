'use client';

import Label from '@/components/form/Label';
import FileInput from '@/components/form/input/FileInput';
import Button from '@/components/ui/button/Button';
import {
  googleMapsUrl,
  type GeolocationCoords,
  type GeolocationStatus,
} from '@/hooks/useGeolocation';
import { MAX_FOTOS_OTDR } from '@/lib/evidencias';
import { UI } from '@/lib/user-messages';

export type EvidenciasFiles = {
  fotoPotenciaNodo: File | null;
  fotoPotenciaCliente: File | null;
  fotosOtdr: File[];
};

export const initialEvidenciasFiles: EvidenciasFiles = {
  fotoPotenciaNodo: null,
  fotoPotenciaCliente: null,
  fotosOtdr: [],
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
  const setSingleFile = (key: 'fotoPotenciaNodo' | 'fotoPotenciaCliente', file: File | null) => {
    onFilesChange({ ...files, [key]: file });
  };

  const addOtdrFiles = (incoming: FileList | null) => {
    if (!incoming?.length) return;
    const merged = [...files.fotosOtdr, ...Array.from(incoming)].slice(0, MAX_FOTOS_OTDR);
    onFilesChange({ ...files, fotosOtdr: merged });
  };

  const removeOtdrFile = (index: number) => {
    onFilesChange({
      ...files,
      fotosOtdr: files.fotosOtdr.filter((_, i) => i !== index),
    });
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
          label={UI.photoPotenciaNodo}
          file={files.fotoPotenciaNodo}
          onChange={(f) => setSingleFile('fotoPotenciaNodo', f)}
        />
        <EvidenciaFileField
          label={UI.photoPotenciaCliente}
          file={files.fotoPotenciaCliente}
          onChange={(f) => setSingleFile('fotoPotenciaCliente', f)}
        />
        <div className="flex w-full min-w-0 flex-col">
          <Label>{UI.photoOtdr}</Label>
          <FileInput
            accept="image/*"
            multiple
            chooseLabel={files.fotosOtdr.length >= MAX_FOTOS_OTDR ? 'Máximo' : UI.chooseFile}
            fileNames={files.fotosOtdr.map((file) => file.name)}
            onChange={(e) => {
              if (files.fotosOtdr.length >= MAX_FOTOS_OTDR) return;
              addOtdrFiles(e.target.files);
              e.target.value = '';
            }}
          />
          <p className="mt-1.5 text-theme-xs text-gray-500">
            Hasta {MAX_FOTOS_OTDR} fotos ({files.fotosOtdr.length}/{MAX_FOTOS_OTDR})
          </p>
          {files.fotosOtdr.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {files.fotosOtdr.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-2.5 py-1.5 text-theme-xs text-gray-700"
                >
                  <span className="min-w-0 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeOtdrFile(index)}
                    className="shrink-0 font-medium text-error-600 hover:text-error-700"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
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
