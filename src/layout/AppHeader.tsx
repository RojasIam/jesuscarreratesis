'use client';

import Link from 'next/link';
import BrandLogo from '@/components/common/BrandLogo';
import NotificationDropdown from '@/components/header/NotificationDropdown';
import UserDropdown from '@/components/header/UserDropdown';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-99999 w-full border-gray-200 bg-white xl:border-b">
      {/* Móvil: logo centrado, notificaciones a la derecha */}
      <div className="grid grid-cols-3 items-center border-b border-gray-200 px-4 py-3 xl:hidden">
        <div aria-hidden />
        <div className="flex justify-center">
          <Link href="/" aria-label="Inicio">
            <BrandLogo variant="header" />
          </Link>
        </div>
        <div className="flex justify-end">
          <NotificationDropdown />
        </div>
      </div>

      {/* Desktop: notificaciones y usuario a la derecha */}
      <div className="hidden w-full items-center justify-end gap-3 px-6 py-4 xl:flex">
        <NotificationDropdown />
        <UserDropdown />
      </div>
    </header>
  );
}
