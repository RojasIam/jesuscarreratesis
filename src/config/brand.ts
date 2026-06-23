/**
 * Paleta extraída de public/images/optical_quality_logo.svg
 */
export const LOGO_COLORS = {
  /** Acento principal — texto OPTICAL, trazos, núcleo del icono */
  primary: '#0ea5e9',
  /** Acento claro — elipses, fibras, gradientes */
  primaryLight: '#38bdf8',
  /** Highlight suave — puntos de luz, gradiente final */
  primaryLighter: '#7dd3fc',
  /** Acento oscuro — anillos, gradientes profundos */
  primaryDark: '#0284c7',
  /** Cian secundario — fibras ópticas (fiberGrad3) */
  cyan: '#06b6d4',
  cyanLight: '#22d3ee',
  cyanLighter: '#67e8f9',
  /** Texto QUALITY */
  textDark: '#0f172a',
  /** Subtítulo TELECOMMUNICATIONS */
  textMuted: '#64748b',
  textMutedLight: '#94a3b8',
} as const;

export const BRAND_NAME = 'Optical Quality';

/** Logo de la app (icono) — sidebar, header, login y favicon */
export const BRAND_LOGO = '/images/logo-favicon.png';

/** Alias usado en metadata / PWA */
export const BRAND_FAVICON = BRAND_LOGO;

/** Ancho sidebar expandido / colapsado (px) — debe coincidir con AdminLayout */
export const SIDEBAR_WIDTH_EXPANDED = 240;
export const SIDEBAR_WIDTH_COLLAPSED = 72;

/** Color principal UI / theme-color (extraído del logo corporativo) */
export const BRAND_THEME_COLOR = LOGO_COLORS.primary;
