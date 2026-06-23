export type UserRole = 'tecnico' | 'admin' | 'ti';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url?: string | null;
  avatar_public_id?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  tecnico: 'Técnico',
  admin: 'Administrador',
  ti: 'TI',
};

export function canCreateMedicion(role: UserRole | null | undefined): boolean {
  return role === 'tecnico' || role === 'admin';
}

export function canViewAllMediciones(role: UserRole | null | undefined): boolean {
  return role === 'admin' || role === 'ti';
}

export function canManageUsers(role: UserRole | null | undefined): boolean {
  return role === 'admin';
}
