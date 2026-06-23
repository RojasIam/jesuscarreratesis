'use client';

import Link from 'next/link';
import BrandLogo from '@/components/common/BrandLogo';
import NotificationDropdown from '@/components/header/NotificationDropdown';
import UserDropdown from '@/components/header/UserDropdown';
import { useSidebar } from '@/context/SidebarContext';

export default function AppHeader() {
  const { isExpanded, isHovered, toggleSidebar } = useSidebar();

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

      {/* Desktop */}
      <div className="hidden w-full items-center justify-between px-6 py-4 xl:flex">
        <button
          type="button"
          className={`flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-gray-500 ${
            isExpanded || isHovered ? 'bg-gray-100' : ''
          }`}
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
