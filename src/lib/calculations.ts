import { MedicionFormData, BAND_CONFIGS } from '@/lib/types';

export function calculateILMax(formData: MedicionFormData): number | null {
  const {
    tipoBanda,
    potenciaSiteNodo,
    distanciaEnlace,
    numeroEmpalmes,
    numeroConectores,
  } = formData;

  if (
    tipoBanda &&
    potenciaSiteNodo !== '' &&
    distanciaEnlace !== '' &&
    numeroEmpalmes !== '' &&
    numeroConectores !== ''
  ) {
    const config = BAND_CONFIGS[tipoBanda];
    if (!config) return null;

    const potencia = Number(potenciaSiteNodo);
    const distancia = Number(distanciaEnlace);
    const empalmes = Number(numeroEmpalmes);
    const conectores = Number(numeroConectores);

    return (
      potencia -
      config.atenuacionTipica * distancia -
      empalmes * config.perdidaEmpalme -
      conectores * config.perdidaConector -
      1
    );
  }

  return null;
}

export function evaluateStatus(ilReal: number, ilMax: number): {
  estado: 'Excelente' | 'Bueno' | 'Regular' | 'No Conforme';
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
