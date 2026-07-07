'use client';

import { useState, useEffect } from 'react';
import { translateUserMessage } from '@/lib/user-messages';
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import EvidenciasSection, {
  initialEvidenciasFiles,
  type EvidenciasFiles,
} from '@/components/EvidenciasSection';
import { BoltIcon, PieChartIcon, CheckCircleIcon } from '@/icons';
import { useGeolocation } from '@/hooks/useGeolocation';
import { uploadFile } from '@/lib/upload-client';
import { MedicionFormData, DEPARTAMENTOS_PERU } from '@/lib/types';
import {
  calculateILMax,
  calculateILReal,
  evaluateStatus,
  getPowerColors,
  getEmpalmeColors,
  getConectorColors,
  getReflectanciaColors,
} from '@/lib/calculations';

function parseNumber(value: string | number | ''): number | '' {
  if (value === '' || value === '-') return '';
  const strValue = String(value);
  if (strValue === '.' || strValue === ',') return '';
  const normalizedValue = strValue.replace(',', '.');
  const numValue = Number(normalizedValue);
  return isNaN(numValue) ? '' : numValue;
}

/** Teclados móviles no muestran "-" con inputmode decimal/numeric; text permite dBm negativos. */
const signedDbmInputProps = {
  type: 'text' as const,
  inputMode: 'text' as const,
  autoComplete: 'off' as const,
};

function getFieldColors(name: string, value: string | number | '') {
  if (value === '' || value === '-') {
    return { backgroundColor: '', borderColor: '' };
  }
  const strValue = String(value).replace(',', '.');
  const numValue = typeof value === 'string' ? Number(strValue) : value;
  if (isNaN(numValue) || strValue === '.') return { backgroundColor: '', borderColor: '' };

  switch (name) {
    case 'potenciaSiteNodo':
      return getPowerColors(numValue);
    case 'peorEmpalme':
      return getEmpalmeColors(numValue);
    case 'peorConector':
      return getConectorColors(numValue);
    case 'reflectancia':
      return getReflectanciaColors(numValue);
    default:
      return { backgroundColor: '', borderColor: '' };
  }
}

const initialFormData: MedicionFormData = {
  departamento: 'Lima',
  distrito: '',
  sede: '',
  tecnicoResponsable: '',
  codigoCircuito: '',
  clienteEmpresa: '',
  tipoBanda: '1310',
  potenciaSiteNodo: '',
  numeroEmpalmes: '',
  numeroConectores: '',
  distanciaEnlace: '',
  potenciaRecibidaRoseta: '',
  peorEmpalme: '',
  peorConector: '',
  reflectancia: '',
};

export default function FormularioMedicion({
  embedded = false,
  onSaved,
}: {
  embedded?: boolean;
  onSaved?: () => void;
}) {
  const [formData, setFormData] = useState<MedicionFormData>(initialFormData);
  const [ilMax, setIlMax] = useState<number | null>(null);
  const [ilReal, setIlReal] = useState<number | null>(null);
  const [estado, setEstado] = useState<ReturnType<typeof evaluateStatus> | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [evidenciasFiles, setEvidenciasFiles] = useState<EvidenciasFiles>(initialEvidenciasFiles);
  const {
    coords,
    status: geoStatus,
    errorMessage: geoError,
    requestLocation,
    isLoading: geoLoading,
  } = useGeolocation(true);

  useEffect(() => {
    const parsedNumeroEmpalmes: number | '' =
      formData.numeroEmpalmes === ''
        ? ''
        : typeof formData.numeroEmpalmes === 'number'
          ? formData.numeroEmpalmes
          : Number(formData.numeroEmpalmes);
    const parsedNumeroConectores: number | '' =
      formData.numeroConectores === ''
        ? ''
        : typeof formData.numeroConectores === 'number'
          ? formData.numeroConectores
          : Number(formData.numeroConectores);

    const formDataForCalc: MedicionFormData = {
      ...formData,
      potenciaSiteNodo: parseNumber(formData.potenciaSiteNodo) as number | string | '',
      distanciaEnlace: parseNumber(formData.distanciaEnlace) as number | string | '',
      numeroEmpalmes: parsedNumeroEmpalmes,
      numeroConectores: parsedNumeroConectores,
      potenciaRecibidaRoseta: parseNumber(formData.potenciaRecibidaRoseta) as number | string | '',
      peorEmpalme: parseNumber(formData.peorEmpalme) as number | string | '',
      peorConector: parseNumber(formData.peorConector) as number | string | '',
      reflectancia: parseNumber(formData.reflectancia) as number | string | '',
    };

    const calculatedILMax = calculateILMax(formDataForCalc);
    setIlMax(calculatedILMax);

    const calculatedILReal = calculateILReal(
      formDataForCalc.potenciaSiteNodo,
      formDataForCalc.potenciaRecibidaRoseta
    );
    setIlReal(calculatedILReal);

    if (calculatedILMax !== null && calculatedILReal !== null) {
      setEstado(evaluateStatus(calculatedILReal, calculatedILMax));
    } else {
      setEstado(null);
    }
  }, [formData]);

  const handleChange = (name: string, value: string | number) => {
    if (name === 'potenciaSiteNodo' || name === 'potenciaRecibidaRoseta' || name === 'reflectancia') {
      const strValue = String(value).replace(',', '.');
      if (strValue === '' || strValue === '-' || strValue === '.' || /^-?\d*\.?\d*$/.test(strValue)) {
        setFormData((prev) => ({ ...prev, [name]: strValue }));
      }
    } else if (name === 'distanciaEnlace' || name === 'peorEmpalme' || name === 'peorConector') {
      const strValue = String(value).replace(',', '.');
      if (strValue === '' || strValue === '.' || /^\d*\.?\d*$/.test(strValue)) {
        setFormData((prev) => ({ ...prev, [name]: strValue }));
      }
    } else if (name === 'numeroEmpalmes' || name === 'numeroConectores') {
      const strValue = String(value);
      if (strValue === '' || /^\d*$/.test(strValue)) {
        const intValue = strValue === '' ? '' : parseInt(strValue, 10);
        setFormData((prev) => ({ ...prev, [name]: intValue }));
      }
    } else if (name === 'distrito' || name === 'tecnicoResponsable') {
      if (value === '' || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(String(value))) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === 'codigoCircuito') {
      if (value === '' || /^\d*$/.test(String(value))) {
        setFormData((prev) => ({ ...prev, [name]: String(value) }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaving(true);

    try {
      const uploadFolder = 'optical-quality/mediciones';
      const otdrStamp = Date.now();

      const [potenciaNodoUp, potenciaClienteUp, ...otdrUploads] = await Promise.all([
        evidenciasFiles.fotoPotenciaNodo
          ? uploadFile(evidenciasFiles.fotoPotenciaNodo, `${uploadFolder}/potencia-nodo`)
          : Promise.resolve(null),
        evidenciasFiles.fotoPotenciaCliente
          ? uploadFile(evidenciasFiles.fotoPotenciaCliente, `${uploadFolder}/potencia-cliente`)
          : Promise.resolve(null),
        ...evidenciasFiles.fotosOtdr.map((file, index) =>
          uploadFile(file, `${uploadFolder}/otdr/${otdrStamp}-${index}`),
        ),
      ]);

      const fotosOtdrUrls = otdrUploads
        .map((upload) => upload?.url)
        .filter((url): url is string => Boolean(url));
      const fotosOtdrPublicIds = otdrUploads
        .map((upload) => upload?.publicId)
        .filter((id): id is string => Boolean(id));

      const res = await fetch('/api/mediciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          ilMax,
          ilReal,
          estado: estado?.estado ?? null,
          evidencias: {
            latitud: coords?.lat ?? null,
            longitud: coords?.lng ?? null,
            fotoPotenciaNodoUrl: potenciaNodoUp?.url ?? null,
            fotoPotenciaNodoPublicId: potenciaNodoUp?.publicId ?? null,
            fotoPotenciaClienteUrl: potenciaClienteUp?.url ?? null,
            fotoPotenciaClientePublicId: potenciaClienteUp?.publicId ?? null,
            fotosOtdrUrls,
            fotosOtdrPublicIds,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? 'Error al guardar');
      }

      setSaved(true);
      setEvidenciasFiles(initialEvidenciasFiles);
      setFormData(initialFormData);
      onSaved?.();
      if (!embedded) {
        setTimeout(() => setSaved(false), 4000);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? translateUserMessage(err.message, 'Error al guardar') : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const fieldStyle = (name: string, value: string | number | '') => {
    const colors = getFieldColors(name, value);
    if (!colors.backgroundColor) return {};
    return {
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
    };
  };

  return (
    <div className={embedded ? '' : 'mx-auto max-w-3xl'}>
      {!embedded && (
        <div className="mb-6">
          <h1 className="font-semibold text-gray-800 text-title-sm sm:text-title-md">
            Nueva medición
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Complete los datos para calcular IL_MAX y evaluar conformidad
          </p>
        </div>
      )}

      {(ilMax !== null || ilReal !== null || estado) && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
          {ilMax !== null && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                <BoltIcon className="size-6 text-gray-800 dark:text-white/90" />
              </div>
              <div className="mt-5">
                <span className="text-sm text-gray-500 dark:text-gray-400">IL_MAX (dB)</span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {ilMax.toFixed(1)}
                </h4>
              </div>
            </div>
          )}
          {ilReal !== null && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                <PieChartIcon className="size-6 text-gray-800 dark:text-white/90" />
              </div>
              <div className="mt-5">
                <span className="text-sm text-gray-500 dark:text-gray-400">IL_REAL (dB)</span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {ilReal.toFixed(2)}
                </h4>
              </div>
            </div>
          )}
          {estado && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                <CheckCircleIcon className="size-6 text-gray-800 dark:text-white/90" />
              </div>
              <div className="mt-5">
                <span className="text-sm text-gray-500 dark:text-gray-400">Estado</span>
                <div className="mt-2">
                  <Badge
                    color={
                      estado.estado === 'Excelente'
                        ? 'success'
                        : estado.estado === 'Bueno'
                          ? 'info'
                          : estado.estado === 'Regular'
                            ? 'warning'
                            : 'error'
                    }
                  >
                    {estado.estado}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1 */}
        <ComponentCard title="1. Datos generales">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Departamento *">
              <select
                className="input-field"
                value={formData.departamento}
                onChange={(e) => handleChange('departamento', e.target.value)}
              >
                {DEPARTAMENTOS_PERU.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Distrito *">
              <input
                className="input-field"
                value={formData.distrito}
                onChange={(e) => handleChange('distrito', e.target.value)}
                placeholder="Solo letras"
              />
            </Field>
            <Field label="Sede *">
              <input
                className="input-field"
                value={formData.sede}
                onChange={(e) => handleChange('sede', e.target.value)}
                placeholder="Letras y números"
              />
            </Field>
            <Field label="Técnico responsable *">
              <input
                className="input-field"
                value={formData.tecnicoResponsable}
                onChange={(e) => handleChange('tecnicoResponsable', e.target.value)}
                placeholder="Solo letras"
              />
            </Field>
            <Field label="Código del circuito *">
              <input
                className="input-field"
                value={formData.codigoCircuito}
                onChange={(e) => handleChange('codigoCircuito', e.target.value)}
                placeholder="Solo números"
                inputMode="numeric"
              />
            </Field>
            <Field label="Cliente / Empresa *">
              <input
                className="input-field"
                value={formData.clienteEmpresa}
                onChange={(e) => handleChange('clienteEmpresa', e.target.value)}
                placeholder="Letras y números"
              />
            </Field>
          </div>
        </ComponentCard>

        <ComponentCard title="2. Parámetros de medición">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo de banda *">
              <select
                className="input-field"
                value={formData.tipoBanda}
                onChange={(e) => handleChange('tipoBanda', e.target.value)}
              >
                <option value="1310">1310</option>
                <option value="1490">1490</option>
                <option value="1550">1550</option>
              </select>
            </Field>
            <Field label="Potencia Site - Nodo / TX (dBm) *">
              <input
                className="input-field"
                style={fieldStyle('potenciaSiteNodo', formData.potenciaSiteNodo)}
                value={formData.potenciaSiteNodo === '' ? '' : String(formData.potenciaSiteNodo)}
                onChange={(e) => handleChange('potenciaSiteNodo', e.target.value)}
                placeholder="Ej: -7.5"
                {...signedDbmInputProps}
              />
            </Field>
            <Field label="Número de empalmes *">
              <input
                className="input-field"
                value={formData.numeroEmpalmes === '' ? '' : String(formData.numeroEmpalmes)}
                onChange={(e) => handleChange('numeroEmpalmes', e.target.value)}
                placeholder="Entero"
                inputMode="numeric"
              />
            </Field>
            <Field label="Número de conectores *">
              <input
                className="input-field"
                value={formData.numeroConectores === '' ? '' : String(formData.numeroConectores)}
                onChange={(e) => handleChange('numeroConectores', e.target.value)}
                placeholder="Entero"
                inputMode="numeric"
              />
            </Field>
            <Field label="Distancia del enlace (km) *">
              <input
                className="input-field"
                value={formData.distanciaEnlace === '' ? '' : String(formData.distanciaEnlace)}
                onChange={(e) => handleChange('distanciaEnlace', e.target.value)}
                placeholder="Decimal"
                inputMode="decimal"
              />
            </Field>
            <Field label="Potencia recibida en la roseta / RX (dBm) *">
              <input
                className="input-field"
                value={formData.potenciaRecibidaRoseta === '' ? '' : String(formData.potenciaRecibidaRoseta)}
                onChange={(e) => handleChange('potenciaRecibidaRoseta', e.target.value)}
                placeholder="Ej: -13.20"
                {...signedDbmInputProps}
              />
            </Field>
          </div>
        </ComponentCard>

        <ComponentCard title="3. Indicadores de calidad">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Peor empalme (dB) *">
              <input
                className="input-field"
                style={fieldStyle('peorEmpalme', formData.peorEmpalme)}
                value={formData.peorEmpalme === '' ? '' : String(formData.peorEmpalme)}
                onChange={(e) => handleChange('peorEmpalme', e.target.value)}
                placeholder="Decimal"
                inputMode="decimal"
              />
            </Field>
            <Field label="Peor conector (dB) *">
              <input
                className="input-field"
                style={fieldStyle('peorConector', formData.peorConector)}
                value={formData.peorConector === '' ? '' : String(formData.peorConector)}
                onChange={(e) => handleChange('peorConector', e.target.value)}
                placeholder="Decimal"
                inputMode="decimal"
              />
            </Field>
            <Field label="Reflectancia (dB) *">
              <input
                className="input-field"
                style={fieldStyle('reflectancia', formData.reflectancia)}
                value={formData.reflectancia === '' ? '' : String(formData.reflectancia)}
                onChange={(e) => handleChange('reflectancia', e.target.value)}
                placeholder="Decimal (negativo)"
                inputMode="decimal"
              />
            </Field>
          </div>
        </ComponentCard>

        <ComponentCard title="4. Resultados calculados">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="IL_MAX (dB)">
              <div className="input-field bg-gray-50 font-mono dark:bg-white/[0.03]">
                {ilMax !== null ? ilMax.toFixed(2) : '---'}
              </div>
            </Field>
            <Field label="IL_REAL (dB)">
              <div className="input-field bg-gray-50 font-mono dark:bg-white/[0.03]">
                {ilReal !== null ? ilReal.toFixed(2) : '---'}
              </div>
            </Field>
            <Field label="Estado de la medición">
              <div
                className="input-field text-center font-bold"
                style={
                  estado
                    ? { backgroundColor: estado.backgroundColor, borderColor: estado.borderColor, color: estado.borderColor }
                    : {}
                }
              >
                {estado?.estado || '---'}
              </div>
            </Field>
          </div>
        </ComponentCard>

        <ComponentCard title="5. Evidencias técnicas (opcional)">
          <EvidenciasSection
            files={evidenciasFiles}
            onFilesChange={setEvidenciasFiles}
            coords={coords}
            geoStatus={geoStatus}
            geoError={geoError}
            onRequestLocation={requestLocation}
            geoLoading={geoLoading}
          />
        </ComponentCard>

        <Button type="submit" disabled={saving} className="w-full" size="md">
          {saving ? 'Guardando...' : 'Guardar medición'}
        </Button>

        {saveError && (
          <p className="alert-box border border-error-200 bg-error-50 text-center font-medium text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            {saveError}
          </p>
        )}

        {saved && (
          <p className="alert-box border border-success-200 bg-success-50 text-center font-medium text-success-700 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400">
            Medición guardada en Supabase correctamente
          </p>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
