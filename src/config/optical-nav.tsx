import React from 'react';
import { GridIcon, TableIcon, DocsIcon } from '@/icons';
import type { UserRole } from '@/lib/roles';

export type OpticalNavItem = {
  name: string;
  shortName?: string;
  path: string;
  icon: React.ReactNode;
  exact?: boolean;
  roles?: 'all' | 'tecnico' | 'admin';
};

export const opticalNavItems: OpticalNavItem[] = [
  { name: 'Inicio', path: '/', icon: <GridIcon />, exact: true, roles: 'all' },
  { name: 'Mediciones', shortName: 'Mediciones', path: '/mediciones', icon: <TableIcon />, roles: 'admin' },
  { name: 'Nueva medición', shortName: 'Medición', path: '/medicion', icon: <TableIcon />, roles: 'tecnico' },
  { name: 'Fórmulas', shortName: 'Fórmulas', path: '/formulas', icon: <DocsIcon />, roles: 'all' },
];

export function getNavForRole(role: UserRole | null, canCreate: boolean): OpticalNavItem[] {
  return opticalNavItems.filter((item) => {
    if (item.roles === 'all') return true;
    if (item.roles === 'admin') return role === 'admin';
    return canCreate;
  });
}
