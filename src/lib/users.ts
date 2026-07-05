import type { UserRole } from '@/lib/roles';

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  nombres: string | null;
  apellidos: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface CreateUserPayload {
  nombres: string;
  apellidos: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  nombres: string;
  apellidos: string;
  phone: string;
  email: string;
  role: UserRole;
  password?: string;
}

export function buildFullName(nombres: string, apellidos: string): string {
  return `${nombres.trim()} ${apellidos.trim()}`.trim();
}

export function displayNombres(profile: Pick<ProfileRow, 'nombres' | 'full_name'>): string {
  if (profile.nombres?.trim()) return profile.nombres.trim();
  const first = profile.full_name?.trim().split(/\s+/)[0];
  return first ?? '—';
}

export function displayApellidos(profile: Pick<ProfileRow, 'apellidos' | 'full_name'>): string {
  if (profile.apellidos?.trim()) return profile.apellidos.trim();
  const parts = profile.full_name?.trim().split(/\s+/).slice(1) ?? [];
  return parts.length > 0 ? parts.join(' ') : '—';
}

export function validateCreateUserPayload(body: Partial<CreateUserPayload>): string | null {
  if (!body.nombres?.trim()) return 'Ingrese los nombres';
  if (!body.apellidos?.trim()) return 'Ingrese los apellidos';
  if (!body.phone?.trim()) return 'Ingrese el número de celular';
  if (!body.email?.trim()) return 'Ingrese el correo electrónico';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
    return 'Correo electrónico inválido';
  }
  if (!body.password || body.password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }
  if (!body.role || !['tecnico', 'admin', 'ti'].includes(body.role)) {
    return 'Seleccione un rol válido';
  }
  return null;
}

export function validateUpdateUserPayload(body: Partial<UpdateUserPayload>): string | null {
  if (!body.nombres?.trim()) return 'Ingrese los nombres';
  if (!body.apellidos?.trim()) return 'Ingrese los apellidos';
  if (!body.phone?.trim()) return 'Ingrese el número de celular';
  if (!body.email?.trim()) return 'Ingrese el correo electrónico';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
    return 'Correo electrónico inválido';
  }
  if (body.password !== undefined && body.password !== '' && body.password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }
  if (!body.role || !['tecnico', 'admin', 'ti'].includes(body.role)) {
    return 'Seleccione un rol válido';
  }
  return null;
}
