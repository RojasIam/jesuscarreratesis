'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HorizontaLDots } from '@/icons';
import BrandLogo from '@/components/common/BrandLogo';
import { useSidebar } from '@/context/SidebarContext';
import { getNavForRole, isNavPathActive } from '@/config/optical-nav';
import { useAuth } from '@/context/AuthContext';
import { canCreateMedicion } from '@/lib/roles';
import SidebarWidget from '@/layout/SidebarWidget';

export default function AppSidebar() {
  const { isExpanded, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { role } = useAuth();
  const navItems = getNavForRole(role, canCreateMedicion(role));

  const isActive = (path: string, exact?: boolean) => isNavPathActive(pathname, path, exact);

  const showLabels = isExpanded || isHovered;

  return (
    <aside
      className={`fixed top-0 left-0 z-50 hidden h-full flex-col border-r border-gray-200 bg-white text-gray-900 transition-all duration-300 ease-in-out xl:flex ${
        isExpanded || isHovered ? 'w-[240px] px-4' : 'w-[72px] px-2'
      }`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-center py-6">
        <Link href="/" className="flex items-center justify-center">
          <BrandLogo variant={showLabels ? 'sidebar' : 'sidebar-collapsed'} priority />
        </Link>
      </div>

      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 flex text-xs uppercase leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? 'xl:justify-center' : 'justify-start'
                }`}
              >
                {showLabels ? 'Menú' : <HorizontaLDots />}
              </h2>
              <ul className="flex flex-col gap-1">
                {navItems.map((nav) => (
                  <li key={nav.path}>
                    <Link
                      href={nav.path}
                      className={`menu-item group ${
                        isActive(nav.path, nav.exact) ? 'menu-item-active' : 'menu-item-inactive'
                      } ${!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'}`}
                    >
                      <span
                        className={
                          isActive(nav.path, nav.exact)
                            ? 'menu-item-icon-active'
                            : 'menu-item-icon-inactive'
                        }
                      >
                        {nav.icon}
                      </span>
                      {showLabels && <span className="menu-item-text">{nav.name}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
        {showLabels ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
}
