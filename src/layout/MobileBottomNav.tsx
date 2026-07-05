'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserCircleIcon } from '@/icons';
import { getNavForRole, isNavPathActive } from '@/config/optical-nav';
import { useAuth } from '@/context/AuthContext';
import { canCreateMedicion } from '@/lib/roles';

const profileNavItem = {
  name: 'Mi perfil',
  shortName: 'Perfil',
  path: '/perfil',
  icon: <UserCircleIcon />,
  exact: false,
};

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { role } = useAuth();
  const navItems = [...getNavForRole(role, canCreateMedicion(role)), profileNavItem];

  const isActive = (path: string, exact?: boolean) => isNavPathActive(pathname, path, exact);

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-theme-md xl:hidden"
      aria-label="Navegación principal"
    >
      <ul className="flex items-stretch justify-around px-1 pt-2 pb-2">
        {navItems.map((item) => {
          const active = isActive(item.path, item.exact);

          return (
            <li key={item.path} className="min-w-0 flex-1">
              <Link
                href={item.path}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-center transition ${
                  active ? 'text-brand-500' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    active ? 'bg-brand-50 text-brand-500' : 'text-gray-500'
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`truncate text-[11px] leading-tight font-medium ${active ? 'text-brand-500' : ''}`}
                >
                  {item.shortName ?? item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
