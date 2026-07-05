/** Paleta viva azul / violeta / cian — sin verdes */
export const CHART_VIVID = {
  indigo: '#4f46e5',
  violet: '#7c3aed',
  blue: '#2563eb',
  sky: '#38bdf8',
  periwinkle: '#818cf8',
  cyan: '#06b6d4',
  orange: '#f97316',
  amber: '#f59e0b',
  rose: '#f43f5e',
  red: '#ef4444',
  pink: '#ec4899',
  slate: '#64748b',
} as const;

export const ESTADO_CHART_COLORS: Record<string, string> = {
  Excelente: CHART_VIVID.blue,
  Bueno: CHART_VIVID.violet,
  Regular: CHART_VIVID.amber,
  'No Conforme': CHART_VIVID.red,
  'Sin estado': CHART_VIVID.slate,
};

export const BANDA_CHART_COLORS: Record<string, string> = {
  '1310': CHART_VIVID.indigo,
  '1490': CHART_VIVID.blue,
  '1550': CHART_VIVID.periwinkle,
};

export const PIE_VIVID_PALETTE = [
  CHART_VIVID.indigo,
  CHART_VIVID.blue,
  CHART_VIVID.violet,
  CHART_VIVID.cyan,
  CHART_VIVID.periwinkle,
  CHART_VIVID.orange,
  CHART_VIVID.pink,
  CHART_VIVID.amber,
];
