import React from 'react';
import { GridIcon, TableIcon, DocsIcon } from '@/icons';
import type { UserRole } from '@/lib/roles';

export type OpticalNavItem = {
  name: string;
  shortName?: string;
  path: string;
  icon: React.ReactNode;
  exact?: boolean;
  roles?: 'all' | 'tecnico';
};

export const opticalNavItems: OpticalNavItem[] = [
  { name: 'Dashboard', shortName: 'Inicio', path: '/', icon: <GridIcon />, exact: true, roles: 'all' },
  { name: 'Nueva medición', shortName: 'Medición', path: '/medicion', icon: <TableIcon />, roles: 'tecnico' },
  { name: 'Fórmulas', shortName: 'Fórmulas', path: '/formulas', icon: <DocsIcon />, roles: 'all' },
];

export function getNavForRole(role: UserRole | null, canCreate: boolean): OpticalNavItem[] {
  return opticalNavItems.filter((item) => {
    if (item.roles === 'all') return true;
    return canCreate;
  });
}
