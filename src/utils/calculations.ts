import { FormData, BAND_CONFIGS } from '../types';

export function calculateILMax(formData: FormData): number | null {
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

    const ilMax =
      potencia -
      config.atenuacionTipica * distancia -
      empalmes * config.perdidaEmpalme -
      conectores * config.perdidaConector -
      1;

    return ilMax;
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
  } else if (ilReal <= 0.90 * ilMax) {
    return { estado: 'Bueno', backgroundColor: '#fed7aa', borderColor: '#f97316' };
  } else if (ilReal <= ilMax) {
    return { estado: 'Regular', backgroundColor: '#fef3c7', borderColor: '#eab308' };
  } else {
    return { estado: 'No Conforme', backgroundColor: '#fee2e2', borderColor: '#ef4444' };
  }
}

export function getPowerColors(value: number): { backgroundColor: string; borderColor: string } {
  if (value >= -7) {
    return { backgroundColor: '#d1fae5', borderColor: '#10b981' };
  } else if (value >= -9.5) {
    return { backgroundColor: '#fef3c7', borderColor: '#eab308' };
  } else {
    return { backgroundColor: '#fee2e2', borderColor: '#ef4444' };
  }
}

export function getEmpalmeColors(value: number): { backgroundColor: string; borderColor: string } {
  if (value < 0.8) {
    return { backgroundColor: '#d1fae5', borderColor: '#10b981' };
  } else if (value < 1) {
    return { backgroundColor: '#fef3c7', borderColor: '#eab308' };
  } else {
    return { backgroundColor: '#fee2e2', borderColor: '#ef4444' };
  }
}

export function getConectorColors(value: number): { backgroundColor: string; borderColor: string } {
  if (value < 1) {
    return { backgroundColor: '#d1fae5', borderColor: '#10b981' };
  } else if (value < 1.3) {
    return { backgroundColor: '#fef3c7', borderColor: '#eab308' };
  } else {
    return { backgroundColor: '#fee2e2', borderColor: '#ef4444' };
  }
}

export function getReflectanciaColors(value: number): { backgroundColor: string; borderColor: string } {
  if (value <= -40) {
    return { backgroundColor: '#d1fae5', borderColor: '#10b981' };
  } else if (value <= -35) {
    return { backgroundColor: '#fef3c7', borderColor: '#eab308' };
  } else {
    return { backgroundColor: '#fee2e2', borderColor: '#ef4444' };
  }
}
