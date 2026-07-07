import { describe, expect, it } from 'vitest';
import type { MedicionRow } from '@/lib/database';
import { filtrarMediciones, filtrosVacios } from '@/lib/mediciones-filters';

const baseRow: MedicionRow = {
  id: '1',
  user_id: 'u1',
  departamento: 'Lima',
  distrito: 'Miraflores',
  sede: 'Sede A',
  tecnico_responsable: 'Juan Pérez',
  codigo_circuito: '424773',
  cliente_empresa: 'MINISTERIO DE RELACIONES EXTERIORES',
  tipo_banda: '1310',
  potencia_site_nodo: 1,
  numero_empalmes: 1,
  numero_conectores: 1,
  distancia_enlace: 1,
  potencia_recibida_roseta: 1,
  peor_empalme: 0.1,
  peor_conector: 0.1,
  reflectancia: -50,
  il_max: 7.21,
  il_real: 4.04,
  estado: 'Excelente',
  adjunto_url: null,
  adjunto_public_id: null,
  latitud: null,
  longitud: null,
  foto_timestamp_url: null,
  foto_timestamp_public_id: null,
    foto_otdr_url: null,
    foto_otdr_public_id: null,
    fotos_otdr_urls: null,
    fotos_otdr_public_ids: null,
    foto_potencia_url: null,
  foto_potencia_public_id: null,
  created_at: '2026-07-04T20:41:00.000Z',
  profiles: { email: 'admin@test.com', full_name: 'Admin Test', role: 'admin' },
};

describe('filtrarMediciones', () => {
  it('busca por circuito, cliente o técnico', () => {
    expect(filtrarMediciones([baseRow], { ...filtrosVacios(), busqueda: '424773' }, true)).toHaveLength(1);
    expect(filtrarMediciones([baseRow], { ...filtrosVacios(), busqueda: 'ministerio' }, true)).toHaveLength(1);
    expect(filtrarMediciones([baseRow], { ...filtrosVacios(), busqueda: 'juan' }, true)).toHaveLength(1);
    expect(filtrarMediciones([baseRow], { ...filtrosVacios(), busqueda: 'otro' }, true)).toHaveLength(0);
  });

  it('filtra por estado y ubicación', () => {
    const filtros = { ...filtrosVacios(), estado: 'Excelente', distrito: 'Miraflores' };
    expect(filtrarMediciones([baseRow], filtros, true)).toHaveLength(1);
    expect(filtrarMediciones([baseRow], { ...filtros, estado: 'Bueno' }, true)).toHaveLength(0);
  });
});
