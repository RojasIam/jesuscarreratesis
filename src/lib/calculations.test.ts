import { describe, it, expect } from 'vitest';
import {
  MARGEN_SEGURIDAD,
  calculateILMax,
  calculateILReal,
  evaluateStatus,
  getPowerColors,
  getEmpalmeColors,
  getConectorColors,
  getReflectanciaColors,
} from '@/lib/calculations';
import { BAND_CONFIGS, MedicionFormData } from '@/lib/types';

const baseForm: MedicionFormData = {
  departamento: 'Lima',
  distrito: 'Miraflores',
  sede: 'Sede1',
  tecnicoResponsable: 'Juan',
  codigoCircuito: '48422011',
  clienteEmpresa: 'Clínica SP',
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

function formWith(
  overrides: Partial<MedicionFormData>
): MedicionFormData {
  return { ...baseForm, ...overrides };
}

describe('calculateILMax', () => {
  it('retorna null si faltan campos requeridos', () => {
    expect(calculateILMax(baseForm)).toBeNull();
    expect(
      calculateILMax(formWith({ distanciaEnlace: 3.29, numeroEmpalmes: 6 }))
    ).toBeNull();
  });

  it('calcula IL_MAX con fórmula (L×α) + (Ne×Pe) + (Nc×Pc) + M — banda 1310', () => {
    const ilMax = calculateILMax(
      formWith({
        tipoBanda: '1310',
        distanciaEnlace: 3.29,
        numeroEmpalmes: 6,
        numeroConectores: 2,
      })
    );

    const { atenuacionTipica, perdidaEmpalme, perdidaConector } = BAND_CONFIGS['1310'];
    const expected =
      atenuacionTipica * 3.29 +
      6 * perdidaEmpalme +
      2 * perdidaConector +
      MARGEN_SEGURIDAD;

    expect(ilMax).toBeCloseTo(expected, 4);
    expect(ilMax).toBeCloseTo(3.7515, 3);
  });

  it('usa constantes distintas por banda 1490 y 1550', () => {
    const params = { distanciaEnlace: 10, numeroEmpalmes: 4, numeroConectores: 2 };

    const il1310 = calculateILMax(formWith({ ...params, tipoBanda: '1310' }))!;
    const il1490 = calculateILMax(formWith({ ...params, tipoBanda: '1490' }))!;
    const il1550 = calculateILMax(formWith({ ...params, tipoBanda: '1550' }))!;

    expect(il1550).toBeLessThan(il1490);
    expect(il1490).toBeLessThan(il1310);

    expect(il1490).toBeCloseTo(
      BAND_CONFIGS['1490'].atenuacionTipica * 10 +
        4 * 0.1 +
        2 * 0.5 +
        MARGEN_SEGURIDAD,
      4
    );
  });

  it('no depende de la potencia TX', () => {
    const params = {
      distanciaEnlace: 5,
      numeroEmpalmes: 3,
      numeroConectores: 1,
    };

    const sinTx = calculateILMax(formWith({ ...params, potenciaSiteNodo: '' }));
    const conTx = calculateILMax(formWith({ ...params, potenciaSiteNodo: -6.5 }));

    expect(sinTx).toBe(conTx);
  });
});

describe('calculateILReal', () => {
  it('calcula |TX − RX| con el ejemplo del Excel (-6.50 / -13.20 → 6.70)', () => {
    expect(calculateILReal(-6.5, -13.2)).toBeCloseTo(6.7, 2);
  });

  it('acepta strings numéricos', () => {
    expect(calculateILReal('-6.50', '-13.20')).toBeCloseTo(6.7, 2);
  });

  it('retorna null si falta TX o RX', () => {
    expect(calculateILReal('', -13.2)).toBeNull();
    expect(calculateILReal(-6.5, '')).toBeNull();
  });

  it('retorna 0 cuando TX y RX son iguales', () => {
    expect(calculateILReal(-10, -10)).toBe(0);
  });

  it('siempre devuelve valor positivo (orden invertido)', () => {
    expect(calculateILReal(-13.2, -6.5)).toBeCloseTo(6.7, 2);
  });
});

describe('evaluateStatus', () => {
  const ilMax = 4;

  it('Excelente cuando IL_REAL ≤ 0.75 × IL_MAX', () => {
    expect(evaluateStatus(3, ilMax).estado).toBe('Excelente');
    expect(evaluateStatus(3.0, ilMax).estado).toBe('Excelente');
  });

  it('Bueno cuando IL_REAL ≤ 0.90 × IL_MAX', () => {
    expect(evaluateStatus(3.5, ilMax).estado).toBe('Bueno');
  });

  it('Regular cuando IL_REAL ≤ IL_MAX', () => {
    expect(evaluateStatus(3.9, ilMax).estado).toBe('Regular');
  });

  it('No Conforme cuando IL_REAL > IL_MAX', () => {
    expect(evaluateStatus(4.1, ilMax).estado).toBe('No Conforme');
  });

  it('ejemplo conversación: IL_REAL=6.70, IL_MAX≈3.75 → No Conforme', () => {
    const ilMaxCalc = calculateILMax(
      formWith({
        distanciaEnlace: 3.29,
        numeroEmpalmes: 6,
        numeroConectores: 2,
        tipoBanda: '1310',
      })
    )!;
    const ilReal = calculateILReal(-6.5, -13.2)!;

    expect(ilReal).toBeCloseTo(6.7, 1);
    expect(ilMaxCalc).toBeCloseTo(3.75, 1);
    expect(evaluateStatus(ilReal, ilMaxCalc).estado).toBe('No Conforme');
  });
});

describe('semáforos de color', () => {
  it('potencia TX: verde ≥ -7, amarillo ≥ -9.5, rojo < -9.5', () => {
    expect(getPowerColors(-6).borderColor).toBe('#10b981');
    expect(getPowerColors(-8).borderColor).toBe('#eab308');
    expect(getPowerColors(-10).borderColor).toBe('#ef4444');
  });

  it('peor empalme: verde < 0.8, amarillo < 1, rojo ≥ 1', () => {
    expect(getEmpalmeColors(0.5).borderColor).toBe('#10b981');
    expect(getEmpalmeColors(0.9).borderColor).toBe('#eab308');
    expect(getEmpalmeColors(1.2).borderColor).toBe('#ef4444');
  });

  it('peor conector: verde < 1, amarillo < 1.3, rojo ≥ 1.3', () => {
    expect(getConectorColors(0.8).borderColor).toBe('#10b981');
    expect(getConectorColors(1.1).borderColor).toBe('#eab308');
    expect(getConectorColors(1.5).borderColor).toBe('#ef4444');
  });

  it('reflectancia: verde ≤ -40, amarillo ≤ -35, rojo > -35', () => {
    expect(getReflectanciaColors(-45).borderColor).toBe('#10b981');
    expect(getReflectanciaColors(-38).borderColor).toBe('#eab308');
    expect(getReflectanciaColors(-30).borderColor).toBe('#ef4444');
  });
});

describe('flujo completo de medición', () => {
  it('calcula IL_MAX, IL_REAL y estado en cadena', () => {
    const form = formWith({
      tipoBanda: '1310',
      potenciaSiteNodo: -6.5,
      potenciaRecibidaRoseta: -13.2,
      distanciaEnlace: 3.29,
      numeroEmpalmes: 6,
      numeroConectores: 2,
    });

    const ilMax = calculateILMax(form);
    const ilReal = calculateILReal(form.potenciaSiteNodo, form.potenciaRecibidaRoseta);
    const status = ilMax !== null && ilReal !== null ? evaluateStatus(ilReal, ilMax) : null;

    expect(ilMax).not.toBeNull();
    expect(ilReal).not.toBeNull();
    expect(status?.estado).toBe('No Conforme');
  });

  it('enlace conforme cuando IL_REAL está dentro del presupuesto', () => {
    const form = formWith({
      tipoBanda: '1550',
      potenciaSiteNodo: -5,
      potenciaRecibidaRoseta: -6,
      distanciaEnlace: 1,
      numeroEmpalmes: 2,
      numeroConectores: 2,
    });

    const ilMax = calculateILMax(form)!;
    const ilReal = calculateILReal(form.potenciaSiteNodo, form.potenciaRecibidaRoseta)!;

    expect(ilReal).toBe(1);
    expect(ilMax).toBeGreaterThan(ilReal);
    expect(evaluateStatus(ilReal, ilMax).estado).toBe('Excelente');
  });
});
