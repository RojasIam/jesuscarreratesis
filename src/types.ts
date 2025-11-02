export interface FormData {
  // Datos generales
  departamento: string;
  distrito: string;
  sede: string;
  tecnicoResponsable: string;
  codigoCircuito: string;
  clienteEmpresa: string;
  
  // Parámetros de medición
  tipoBanda: '1310' | '1490' | '1550';
  potenciaSiteNodo: number | string | '';
  numeroEmpalmes: number | '';
  numeroConectores: number | '';
  distanciaEnlace: number | string | '';
  potenciaRecibidaRoseta: number | string | '';
  
  // Indicadores de calidad
  peorEmpalme: number | string | '';
  peorConector: number | string | '';
  reflectancia: number | string | '';
}

export interface BandConfig {
  atenuacionTipica: number;
  perdidaEmpalme: number;
  perdidaConector: number;
}

export const BAND_CONFIGS: Record<string, BandConfig> = {
  '1310': {
    atenuacionTipica: 0.35,
    perdidaEmpalme: 0.1,
    perdidaConector: 0.5,
  },
  '1490': {
    atenuacionTipica: 0.30,
    perdidaEmpalme: 0.1,
    perdidaConector: 0.5,
  },
  '1550': {
    atenuacionTipica: 0.22,
    perdidaEmpalme: 0.1,
    perdidaConector: 0.5,
  },
};

export const DEPARTAMENTOS_PERU = [
  'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
  'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad',
  'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco',
  'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
];

