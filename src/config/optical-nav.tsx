import React from 'react';
import { GridIcon, TableIcon, DocsIcon } from '@/icons';
import type { UserRole } from '@/lib/roles';

export type OpticalNavItem = {
  name: string;
  shortName?: string;
  path: string;
  icon: React.ReactNode;
  exact?: boolean;
  roles?: 'all' | 'canCreate';
};

export const opticalNavItems: OpticalNavItem[] = [
  { name: 'Inicio', path: '/', icon: <GridIcon />, exact: true, roles: 'all' },
  {
    name: 'Mediciones',
    shortName: 'Mediciones',
    path: '/medicion',
    icon: <TableIcon />,
    roles: 'canCreate',
  },
  { name: 'Fórmulas', shortName: 'Fórmulas', path: '/formulas', icon: <DocsIcon />, roles: 'all' },
];

export function getNavForRole(role: UserRole | null, canCreate: boolean): OpticalNavItem[] {
  return opticalNavItems.filter((item) => {
    if (item.roles === 'all') return true;
    return canCreate;
  });
}

export function isNavPathActive(pathname: string, path: string, exact?: boolean): boolean {
  if (exact) return pathname === path;
  return pathname === path || pathname.startsWith(`${path}/`);
}
