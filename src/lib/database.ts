import { MedicionFormData } from '@/lib/types';

export interface MedicionRow {
  id: string;
  user_id: string;
  departamento: string;
  distrito: string;
  sede: string;
  tecnico_responsable: string;
  codigo_circuito: string;
  cliente_empresa: string;
  tipo_banda: string;
  potencia_site_nodo: number;
  numero_empalmes: number;
  numero_conectores: number;
  distancia_enlace: number;
  potencia_recibida_roseta: number;
  peor_empalme: number;
  peor_conector: number;
  reflectancia: number;
  il_max: number | null;
  il_real: number | null;
  estado: string | null;
  adjunto_url: string | null;
  adjunto_public_id: string | null;
  latitud: number | null;
  longitud: number | null;
  foto_timestamp_url: string | null;
  foto_timestamp_public_id: string | null;
  foto_otdr_url: string | null;
  foto_otdr_public_id: string | null;
  foto_potencia_url: string | null;
  foto_potencia_public_id: string | null;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string | null;
    role: string;
  } | null;
}

export interface MedicionEvidencias {
  latitud: number | null;
  longitud: number | null;
  fotoTimestampUrl?: string | null;
  fotoTimestampPublicId?: string | null;
  fotoOtdrUrl?: string | null;
  fotoOtdrPublicId?: string | null;
  fotoPotenciaUrl?: string | null;
  fotoPotenciaPublicId?: string | null;
}

export interface MedicionPayload {
  formData: MedicionFormData;
  ilMax: number | null;
  ilReal: number | null;
  estado: string | null;
  adjuntoUrl?: string | null;
  adjuntoPublicId?: string | null;
  evidencias?: MedicionEvidencias;
}

export function formDataToDbRow(
  userId: string,
  payload: MedicionPayload,
): Omit<MedicionRow, 'id' | 'created_at'> {
  const { formData, ilMax, ilReal, estado, adjuntoUrl, adjuntoPublicId, evidencias } = payload;

  return {
    user_id: userId,
    departamento: formData.departamento,
    distrito: formData.distrito,
    sede: formData.sede,
    tecnico_responsable: formData.tecnicoResponsable,
    codigo_circuito: formData.codigoCircuito,
    cliente_empresa: formData.clienteEmpresa,
    tipo_banda: formData.tipoBanda,
    potencia_site_nodo: Number(formData.potenciaSiteNodo),
    numero_empalmes: Number(formData.numeroEmpalmes),
    numero_conectores: Number(formData.numeroConectores),
    distancia_enlace: Number(formData.distanciaEnlace),
    potencia_recibida_roseta: Number(formData.potenciaRecibidaRoseta),
    peor_empalme: Number(formData.peorEmpalme),
    peor_conector: Number(formData.peorConector),
    reflectancia: Number(formData.reflectancia),
    il_max: ilMax,
    il_real: ilReal,
    estado,
    adjunto_url: adjuntoUrl ?? null,
    adjunto_public_id: adjuntoPublicId ?? null,
    latitud: evidencias?.latitud ?? null,
    longitud: evidencias?.longitud ?? null,
    foto_timestamp_url: evidencias?.fotoTimestampUrl ?? null,
    foto_timestamp_public_id: evidencias?.fotoTimestampPublicId ?? null,
    foto_otdr_url: evidencias?.fotoOtdrUrl ?? null,
    foto_otdr_public_id: evidencias?.fotoOtdrPublicId ?? null,
    foto_potencia_url: evidencias?.fotoPotenciaUrl ?? null,
    foto_potencia_public_id: evidencias?.fotoPotenciaPublicId ?? null,
  };
}

export function medicionRowToSummary(row: MedicionRow) {
  return {
    id: row.id,
    codigoCircuito: row.codigo_circuito,
    sede: row.sede,
    clienteEmpresa: row.cliente_empresa,
    estado: row.estado,
    ilMax: row.il_max,
    ilReal: row.il_real,
    createdAt: row.created_at,
    adjuntoUrl: row.adjunto_url,
  };
}

export type MedicionSummary = ReturnType<typeof medicionRowToSummary>;
