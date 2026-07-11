import { MedicionFormData, BAND_CONFIGS } from '@/lib/types';

/** Margen de seguridad (M) fijo según especificación técnica */
export const MARGEN_SEGURIDAD = 1;

/**
 * Pérdida óptica máxima permitida (dB):
 * IL_MAX = (L × α) + (Ne × Pe) + (Nc × Pc) + M
 */
export function calculateILMax(formData: MedicionFormData): number | null {
  const { tipoBanda, distanciaEnlace, numeroEmpalmes, numeroConectores } = formData;

  if (
    tipoBanda &&
    distanciaEnlace !== '' &&
    numeroEmpalmes !== '' &&
    numeroConectores !== ''
  ) {
    const config = BAND_CONFIGS[tipoBanda];
    if (!config) return null;

    const distancia = Number(distanciaEnlace);
    const empalmes = Number(numeroEmpalmes);
    const conectores = Number(numeroConectores);

    return (
      config.atenuacionTipica * distancia +
      empalmes * config.perdidaEmpalme +
      conectores * config.perdidaConector +
      MARGEN_SEGURIDAD
    );
  }

  return null;
}

/**
 * Pérdida óptica real medida (dB):
 * IL_REAL = |Potencia TX − Potencia RX|
 */
export function calculateILReal(
  potenciaTx: number | string | '',
  potenciaRx: number | string | ''
): number | null {
  if (potenciaTx === '' || potenciaRx === '') return null;

  const ptx = Number(potenciaTx);
  const prx = Number(potenciaRx);

  if (isNaN(ptx) || isNaN(prx)) return null;

  return Math.abs(ptx - prx);
}

export type MedicionEstado = 'Excelente' | 'Bueno' | 'Regular' | 'No Conforme';

export function evaluateStatus(ilReal: number, ilMax: number): {
  estado: MedicionEstado;
  backgroundColor: string;
  borderColor: string;
} {
  if (ilReal <= 0.75 * ilMax) {
    return { estado: 'Excelente', backgroundColor: '#d1fae5', borderColor: '#10b981' };
  }
  if (ilReal <= 0.90 * ilMax) {
    return { estado: 'Bueno', backgroundColor: '#fed7aa', borderColor: '#f97316' };
  }
  if (ilReal <= ilMax) {
    return { estado: 'Regular', backgroundColor: '#fef3c7', borderColor: '#eab308' };
  }
  return { estado: 'No Conforme', backgroundColor: '#fee2e2', borderColor: '#ef4444' };
}

export const MEDICION_RECOMENDACIONES: Record<MedicionEstado, string[]> = {
  Excelente: [
    'Enlace óptico en condiciones óptimas.',
    'No se requieren acciones correctivas.',
    'Mantener monitoreo preventivo.',
  ],
  Bueno: [
    'Enlace dentro de parámetros aceptables.',
    'Realizar monitoreo periódico y revisión preventiva.',
  ],
  Regular: [
    'Enlace cercano al límite máximo permitido.',
    'Revisar empalmes, conectores, curvaturas y eventos reflectométricos.',
  ],
  'No Conforme': [
    'La pérdida real supera el límite permitido.',
    'Revisar empalmes, conectores, roseta, patch cord, curvaturas y eventos OTDR.',
  ],
};

export function getMedicionRecomendaciones(
  estado: MedicionEstado | string | null | undefined,
): string[] {
  if (!estado || !(estado in MEDICION_RECOMENDACIONES)) return [];
  return MEDICION_RECOMENDACIONES[estado as MedicionEstado];
}

export function getPowerColors(value: number) {
  if (value >= -7) return { backgroundColor: '#d1fae5', borderColor: '#10b981' };
  if (value >= -9.5) return { backgroundColor: '#fef3c7', borderColor: '#eab308' };
  return { backgroundColor: '#fee2e2', borderColor: '#ef4444' };
}

export function getEmpalmeColors(value: number) {
  if (value < 0.8) return { backgroundColor: '#d1fae5', borderColor: '#10b981' };
  if (value < 1) return { backgroundColor: '#fef3c7', borderColor: '#eab308' };
  return { backgroundColor: '#fee2e2', borderColor: '#ef4444' };
}

export function getConectorColors(value: number) {
  if (value < 1) return { backgroundColor: '#d1fae5', borderColor: '#10b981' };
  if (value < 1.3) return { backgroundColor: '#fef3c7', borderColor: '#eab308' };
  return { backgroundColor: '#fee2e2', borderColor: '#ef4444' };
}

export function getReflectanciaColors(value: number) {
  if (value <= -40) return { backgroundColor: '#d1fae5', borderColor: '#10b981' };
  if (value <= -35) return { backgroundColor: '#fef3c7', borderColor: '#eab308' };
  return { backgroundColor: '#fee2e2', borderColor: '#ef4444' };
}
