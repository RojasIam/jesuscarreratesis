/** Mensajes visibles al usuario — español (Perú) */

const AUTH_ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': 'Correo o contraseña incorrectos',
  'Email not confirmed': 'Confirma tu correo antes de ingresar',
  'User not found': 'Usuario no encontrado',
  'Invalid email or password': 'Correo o contraseña incorrectos',
  'Too many requests': 'Demasiados intentos. Espera un momento e inténtalo de nuevo',
  'Network request failed': 'Error de conexión. Revisa tu internet',
  'JWT expired': 'Tu sesión expiró. Vuelve a iniciar sesión',
  'New password should be different from the old password':
    'La nueva contraseña debe ser distinta a la anterior',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
};

export function translateUserMessage(message: string, fallback?: string): string {
  const trimmed = message.trim();
  if (!trimmed) return fallback ?? 'Ocurrió un error';

  if (AUTH_ERROR_MAP[trimmed]) return AUTH_ERROR_MAP[trimmed];

  const lower = trimmed.toLowerCase();
  for (const [key, value] of Object.entries(AUTH_ERROR_MAP)) {
    if (lower.includes(key.toLowerCase())) return value;
  }

  return trimmed;
}

export const UI = {
  chooseFile: 'Elegir',
  noFile: 'Sin archivo',
  openMenu: 'Abrir o cerrar menú',
  backHome: 'Volver al inicio',
  viewOnMap: 'Ver en mapa',
  photoTimestamp: 'Foto hora',
  photoOtdr: 'Foto OTDR',
  photoPower: 'Foto potencia',
  evidenceTime: 'Hora',
  evidenceOtdr: 'OTDR',
  evidencePower: 'Potencia',
  evidenceGps: 'Mapa',
  evidenceLegacy: 'Adjunto',
  navHome: 'Inicio',
} as const;
